#!/bin/bash
# Deploy standalone.html to Vercel production
# Usage: ./scripts/deploy.sh

set -e
export PATH="/opt/homebrew/Cellar/node@22/22.22.0/bin:$PATH"

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMPDIR=$(mktemp -d)

cp "$REPO_DIR/standalone.html" "$TMPDIR/index.html"
cp "$REPO_DIR/vercel.json" "$TMPDIR/vercel.json"

cd "$TMPDIR"
git init -q
git config user.email "clay@peoplesleaguegolf.com"
git config user.name "Clay"
git add .
git commit -q -m "Deploy $(date +%Y-%m-%d_%H:%M)"

vercel link --yes --token Qw586afrgORvdjErYmVMfZD2 --project peoples-league-calendar > /dev/null 2>&1
vercel --prod --yes --token Qw586afrgORvdjErYmVMfZD2

rm -rf "$TMPDIR"
echo "✅ Deployed to peoples-league-calendar.vercel.app"
