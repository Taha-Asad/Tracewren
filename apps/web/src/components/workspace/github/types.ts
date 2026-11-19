export interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  totalPrivateRepos: number;
  orgs: Array<{ login: string; avatarUrl: string }>;
}

export interface GitHubRepo {
  fullName: string;
  name: string;
  owner: string;
  ownerAvatar: string | null;
  isPrivate: boolean;
  defaultBranch: string;
  updatedAt: string;
  description: string | null;
  htmlUrl: string;
}

export interface GitHubCommitSummary {
  sha: string;
  shortSha: string;
  message: string;
  fullMessage: string;
  authorName: string;
  authorEmail: string;
  authorLogin: string | null;
  authorAvatar: string | null;
  committedAt: string;
  gpgVerified: boolean;
  gpgReason: string;
  htmlUrl: string;
}

export interface GithubConnectionState {
  connected: boolean;
  token: string;
  user: GitHubUser | null;
  selectedRepo: string | null;
  selectedBranch: string | null;
}
