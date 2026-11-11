#!/usr/bin/env bash
# Build the site and publish dist/client to the `deploy` branch.
# Hostinger's Git connection watches `deploy` and copies it straight into public_html.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "!! Commit or stash your changes first — the deploy must match a commit on main." >&2
  exit 1
fi

SRC_SHA="$(git rev-parse --short HEAD)"
bun run build
test -f dist/client/index.html

WORK="$(mktemp -d)"
trap 'git worktree remove --force "$WORK" >/dev/null 2>&1 || true; rm -rf "$WORK"' EXIT

git fetch origin deploy >/dev/null 2>&1 || true
if git show-ref --verify --quiet refs/remotes/origin/deploy; then
  git worktree add -B deploy "$WORK" origin/deploy >/dev/null
else
  git worktree add --detach "$WORK" >/dev/null
  git -C "$WORK" checkout --orphan deploy >/dev/null
fi

find "$WORK" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/client/. "$WORK/"

git -C "$WORK" add -A
if git -C "$WORK" diff --cached --quiet; then
  echo "Nothing changed since the last deploy."
  exit 0
fi
git -C "$WORK" commit -q -m "deploy: build of main@${SRC_SHA}"
git -C "$WORK" push -u origin deploy
echo "Published main@${SRC_SHA} to the deploy branch."
