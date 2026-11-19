import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { repoName, commitSha, targetBranch = "main", githubToken } = body;

    if (!repoName || typeof repoName !== "string" || !repoName.includes("/")) {
      return NextResponse.json(
        { verified: false, error: "Invalid repository format. Expected format: 'owner/repo' (e.g. acme-cyber/core-api or your-org/repo)." },
        { status: 400 }
      );
    }

    if (!commitSha || typeof commitSha !== "string" || commitSha.trim().length < 6) {
      return NextResponse.json(
        { verified: false, error: "Invalid commit SHA. Please provide a valid 7 to 40-character commit hex identifier." },
        { status: 400 }
      );
    }

    const cleanRepo = repoName.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
    const cleanSha = commitSha.trim();
    const cleanBranch = targetBranch.trim() || "main";

    // Request commit data from GitHub REST API v3
    const commitUrl = `https://api.github.com/repos/${cleanRepo}/commits/${cleanSha}`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BugBountyTrack-Verifier/1.0 (Academic Verification; Roll 24-ST-013)",
    };

    const token = githubToken?.trim() || process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = `token ${token}`;
    }

    const commitRes = await fetch(commitUrl, { headers });

    if (!commitRes.ok) {
      if (commitRes.status === 404) {
        return NextResponse.json(
          {
            verified: false,
            error: `GitHub REST API v3: Repository '${cleanRepo}' or commit '${cleanSha.slice(0, 10)}' was not found (404 Not Found).`,
          },
          { status: 404 }
        );
      }
      if (commitRes.status === 403) {
        return NextResponse.json(
          {
            verified: false,
            error: "GitHub API rate limit exceeded. Please retry in a few moments.",
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { verified: false, error: `GitHub API error (HTTP ${commitRes.status}).` },
        { status: commitRes.status }
      );
    }

    const commitData = await commitRes.json();

    // Optionally attempt branch comparison if available
    let comparisonStatus = "verified_commit";
    let behindBy = 0;
    let aheadBy = 0;

    try {
      const compareUrl = `https://api.github.com/repos/${cleanRepo}/compare/${cleanBranch}...${commitData.sha}`;
      const compareRes = await fetch(compareUrl, { headers });
      if (compareRes.ok) {
        const compareData = await compareRes.json();
        comparisonStatus = compareData.status || "identical";
        aheadBy = compareData.ahead_by || 0;
        behindBy = compareData.behind_by || 0;
      }
    } catch {
      // Comparison is optional; commit existence is primary proof
    }

    const result = {
      verified: true,
      data: {
        sha: commitData.sha,
        shortSha: commitData.sha.slice(0, 7),
        authorName: commitData.commit?.author?.name || commitData.author?.login || "Unknown Author",
        authorEmail: commitData.commit?.author?.email || "unknown@github.com",
        authorLogin: commitData.author?.login || null,
        authorAvatar: commitData.author?.avatar_url || null,
        message: commitData.commit?.message || "No commit message provided.",
        committedAt: commitData.commit?.author?.date || new Date().toISOString(),
        gpgVerified: Boolean(commitData.commit?.verification?.verified),
        gpgReason: commitData.commit?.verification?.reason || "unsigned",
        gpgSignature: commitData.commit?.verification?.signature || null,
        htmlUrl: commitData.html_url || `https://github.com/${cleanRepo}/commit/${commitData.sha}`,
        repoUrl: `https://github.com/${cleanRepo}`,
        comparisonStatus,
        aheadBy,
        behindBy,
        targetBranch: cleanBranch,
        verifiedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error verifying GitHub commit.";
    return NextResponse.json({ verified: false, error: message }, { status: 500 });
  }
}
