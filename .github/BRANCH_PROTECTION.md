# Repository Branch Protection & Governance Specification

## 1. Branch Strategy Overview
BugBountyTrack utilizes a strict trunk-based git workflow with dual long-lived branches (`main` and `develop`) and short-lived feature/hotfix branches:

- **`main`**: Production-ready, verified releases only. Directly deployed to production environments.
- **`develop`**: Integration branch for candidate milestone releases. Nightly staging deployments.
- **`feat/*`**: Feature development branches created off `develop`.
- **`fix/*`**: Bug fix branches created off `develop`.
- **`hotfix/*`**: Critical security patches branched off `main` and back-ported to `develop`.

---

## 2. GitHub Branch Protection Rulesets

### 2.1 Rules for `main` Branch
1. **Require Pull Request Before Merging**:
   - Minimum 1 approved code review from a designated code owner (`CODEOWNERS`).
   - Dismiss stale pull request approvals when new commits are pushed.
   - Require review from Code Owners.
2. **Require Status Checks to Pass Before Merging**:
   - Require branches to be up to date before merging (Strict CI).
   - Mandatory passing checks:
     - `Code Hygiene & AST Linting`
     - `API Unit & Integration Test Suite` (94/94 passing tests)
     - `Prisma Schema & Migration Verification`
3. **Require Signed Commits**:
   - All commits merged into `main` must be GPG/SSH signed by verified contributors.
4. **Require Linear History**:
   - Prevent merge commits on `main`. Enforce `Squash and merge` or `Rebase and merge`.
5. **Prevent Force Pushes & Deletions**:
   - Direct `git push --force` is blocked for all users including administrators.
   - Branch deletion is blocked.

### 2.2 Rules for `develop` Branch
1. **Require Pull Request Before Merging**:
   - Minimum 1 peer review or automated pass gate.
2. **Require Status Checks**:
   - All CI automated tests and build checks must pass.
3. **Prevent Force Pushes**:
   - Unrestricted force pushing is blocked.

---

## 3. Local Git Hook Enforcement
A client-side `pre-push` hook is configured in `.git/hooks/pre-push` to reject accidental direct pushes to protected branches:

```bash
#!/bin/sh
# Prevent accidental direct push to main or develop
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
if [ "$current_branch" = "main" ] || [ "$current_branch" = "develop" ]; then
    echo "[SECURITY ERROR] Direct push to protected branch '$current_branch' is prohibited."
    echo "Please create a feature branch ('feat/your-feature') and open a Pull Request."
    exit 1
fi
exit 0
```
