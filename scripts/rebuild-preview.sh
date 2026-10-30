#!/usr/bin/env bash
# Rebuild the local preview branch: origin/main + every open content/* branch, merged one at a time.
# tests/pages.ts conflicts (each branch adds test pages) are resolved by keeping both sides.
set -euo pipefail
cd "$(dirname "$0")/../../stackvenn-preview"
git merge --abort 2>/dev/null || true
git fetch -q origin --prune
git reset -q --hard origin/main
for b in $(git branch -r --format='%(refname:short)' | grep '^origin/content/'); do
  if ! git merge -q --no-edit "$b" >/dev/null 2>&1; then
    conflicted=$(git diff --name-only --diff-filter=U)
    if [ "$conflicted" = "tests/pages.ts" ]; then
      node -e "
        const fs = require('fs');
        let s = fs.readFileSync('tests/pages.ts', 'utf8');
        s = s.replace(/<<<<<<< [^\n]*\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]*\n/g,
          (m, a, b) => [...new Set([...a.split('\n'), ...b.split('\n')].filter(Boolean))].join('\n') + '\n');
        fs.writeFileSync('tests/pages.ts', s);"
      git add tests/pages.ts
      git -c user.name=preview commit -q --no-edit
    else
      echo "Unresolved conflict merging $b: $conflicted" >&2
      git merge --abort
    fi
  fi
  echo "merged $b"
done
git log --oneline -1
