import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token?.trim() || process.env.GITHUB_TOKEN;
    const { repo, branch = "main" } = body;

    if (!repo || typeof repo !== "string" || !repo.includes("/")) {
      return NextResponse.json(
        { ok: false, error: "Repository in 'owner/repo' format is required." },
        { status: 400 }
      );
    }

    const cleanRepo = repo.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "");
    const cleanBranch = branch.trim() || "main";

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BugBountyTrack-Verifier/1.0",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const commitsUrl = `https://api.github.com/repos/${cleanRepo}/commits?sha=${encodeURIComponent(cleanBranch)}&per_page=15`;
    const commitsRes = await fetch(commitsUrl, { headers });

    if (!commitsRes.ok) {
      if (commitsRes.status === 404) {
        return NextResponse.json(
          { ok: false, error: `Repository '${cleanRepo}' or branch '${cleanBranch}' not found (404).` },
          { status: 404 }
        );
      }
      if (commitsRes.status === 401) {
        return NextResponse.json(
          { ok: false, error: "Access denied. A valid GitHub token with 'repo' scope is required for private repositories." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { ok: false, error: `GitHub API error (HTTP ${commitsRes.status}).` },
        { status: commitsRes.status }
      );
    }

    const commitsData = await commitsRes.json();

    if (!Array.isArray(commitsData)) {
      return NextResponse.json({ ok: true, commits: [] });
    }

    interface RawCommitItem {
      sha: string;
      commit?: {
        message?: string;
        author?: { name?: string; email?: string; date?: string };
        verification?: { verified?: boolean; reason?: string };
      };
      author?: { login?: string; avatar_url?: string };
      html_url?: string;
    }

    const commits = commitsData.map((c: RawCommitItem) => ({
      sha: c.sha,
      shortSha: c.sha.slice(0, 7),
      message: c.commit?.message?.split("\n")[0] || "No commit message",
      fullMessage: c.commit?.message || "",
      authorName: c.commit?.author?.name || c.author?.login || "Unknown Author",
      authorEmail: c.commit?.author?.email || "",
      authorLogin: c.author?.login || null,
      authorAvatar: c.author?.avatar_url || null,
      committedAt: c.commit?.author?.date || new Date().toISOString(),
      gpgVerified: Boolean(c.commit?.verification?.verified),
      gpgReason: c.commit?.verification?.reason || "unsigned",
      htmlUrl: c.html_url || `https://github.com/${cleanRepo}/commit/${c.sha}`,
    }));

    return NextResponse.json({ ok: true, commits });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error fetching GitHub commits.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
