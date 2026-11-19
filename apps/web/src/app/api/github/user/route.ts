import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = body.token?.trim() || process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "A GitHub Personal Access Token is required to authenticate." },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "BugBountyTrack-Verifier/1.0",
    };

    // 1. Fetch authenticated user profile
    const userRes = await fetch("https://api.github.com/user", { headers });

    if (!userRes.ok) {
      if (userRes.status === 401) {
        return NextResponse.json(
          { ok: false, error: "Invalid GitHub Personal Access Token or credentials expired." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { ok: false, error: `GitHub API error: HTTP ${userRes.status}` },
        { status: userRes.status }
      );
    }

    const userData = await userRes.json();

    // 2. Fetch authenticated user's organizations
    let orgs: Array<{ login: string; avatarUrl: string }> = [];
    try {
      const orgsRes = await fetch("https://api.github.com/user/orgs?per_page=50", { headers });
      if (orgsRes.ok) {
        const orgsData = await orgsRes.json();
        if (Array.isArray(orgsData)) {
          orgs = orgsData.map((o: { login: string; avatar_url: string }) => ({
            login: o.login,
            avatarUrl: o.avatar_url,
          }));
        }
      }
    } catch {
      // Orgs fetch is supplementary
    }

    return NextResponse.json({
      ok: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        htmlUrl: userData.html_url,
        publicRepos: userData.public_repos ?? 0,
        totalPrivateRepos: userData.total_private_repos ?? userData.owned_private_repos ?? 0,
        orgs,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error validating GitHub user.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
