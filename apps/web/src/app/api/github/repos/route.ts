import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token?.trim() || process.env.GITHUB_TOKEN;
    const org = body.org?.trim();

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BugBountyTrack-Verifier/1.0",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let reposUrl = "https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator,organization_member&sort=updated";

    // If no token is provided but an org or user handle is given, fetch public repos for that target
    if (!token && org) {
      reposUrl = `https://api.github.com/users/${encodeURIComponent(org)}/repos?per_page=100&sort=updated`;
    } else if (!token && !org) {
      return NextResponse.json(
        { ok: false, error: "A GitHub token or organization handle is required to discover repositories." },
        { status: 400 }
      );
    }

    const reposRes = await fetch(reposUrl, { headers });

    if (!reposRes.ok) {
      if (reposRes.status === 401) {
        return NextResponse.json(
          { ok: false, error: "Authentication failed. Token is invalid or expired." },
          { status: 401 }
        );
      }
      if (reposRes.status === 404) {
        return NextResponse.json(
          { ok: false, error: `GitHub entity '${org}' was not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { ok: false, error: `GitHub API error: HTTP ${reposRes.status}` },
        { status: reposRes.status }
      );
    }

    const reposData = await reposRes.json();

    if (!Array.isArray(reposData)) {
      return NextResponse.json({ ok: true, repos: [] });
    }

    interface RawRepoItem {
      full_name: string;
      name: string;
      owner?: { login?: string; avatar_url?: string };
      private: boolean;
      default_branch?: string;
      updated_at?: string;
      description?: string | null;
      html_url?: string;
    }

    const repos = reposData.map((r: RawRepoItem) => ({
      fullName: r.full_name,
      name: r.name,
      owner: r.owner?.login || r.full_name.split("/")[0],
      ownerAvatar: r.owner?.avatar_url || null,
      isPrivate: Boolean(r.private),
      defaultBranch: r.default_branch || "main",
      updatedAt: r.updated_at || new Date().toISOString(),
      description: r.description || null,
      htmlUrl: r.html_url || `https://github.com/${r.full_name}`,
    }));

    return NextResponse.json({ ok: true, repos });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error fetching GitHub repositories.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
