# Auto-Post Scheduler

## How it works

`generate-posts.mjs` pulls commits from both GitHub repos via the GitHub REST API, categorizes each commit by type (feature / fix / improvement / seo), and writes a formatted post to `client/src/lib/generated-posts.json`.

The React app imports that JSON file at build time. When the site is live, the scheduler runs on a cron, regenerates the JSON, and triggers a redeploy (or hot-reload if running in server mode).

## Setup

### 1. Create a GitHub Personal Access Token

Go to https://github.com/settings/tokens → Generate new token (classic) → check `repo` (read-only is fine) → copy the token.

### 2. Set the environment variable

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

Or add it to your `.env` file:
```
GITHUB_TOKEN=ghp_your_token_here
```

### 3. Run manually

```bash
# 24-hour snapshot
node scripts/generate-posts.mjs --mode daily

# Weekly digest
node scripts/generate-posts.mjs --mode weekly
```

## Automated scheduling

### Option A — GitHub Actions (recommended)

Add `.github/workflows/auto-post.yml` to this repo:

```yaml
name: Auto-Post Generator

on:
  schedule:
    # Daily at 11:59 PM UTC
    - cron: '59 23 * * *'
    # Weekly digest every Sunday at 11:00 PM UTC
    - cron: '0 23 * * 0'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Run daily post generator
        if: github.event.schedule == '59 23 * * *' || github.event_name == 'workflow_dispatch'
        run: node scripts/generate-posts.mjs --mode daily
        env:
          GITHUB_TOKEN: ${{ secrets.GH_READ_TOKEN }}
      - name: Run weekly post generator
        if: github.event.schedule == '0 23 * * 0'
        run: node scripts/generate-posts.mjs --mode weekly
        env:
          GITHUB_TOKEN: ${{ secrets.GH_READ_TOKEN }}
      - name: Commit and push generated posts
        run: |
          git config user.name "TradeScout Bot"
          git config user.email "bot@thetradescout.com"
          git add client/src/lib/generated-posts.json
          git diff --staged --quiet || git commit -m "chore: auto-generate posts [skip ci]"
          git push
```

Add `GH_READ_TOKEN` as a repository secret in Settings → Secrets.

### Option B — Manus scheduled task

Ask Manus to schedule `node scripts/generate-posts.mjs --mode daily` to run every 24 hours and `--mode weekly` every Sunday.

## Output format

Each post in `generated-posts.json` follows this shape:

```json
{
  "id": "tradescout-daily-2026-04-20",
  "product": "tradescout",
  "type": "daily",
  "title": "TradeScout Daily — Apr 20, 2026",
  "summary": "4 commits shipped: 2 new features, 1 fix, 1 SEO update.",
  "date": "2026-04-20",
  "commitCount": 4,
  "updates": [
    {
      "id": "gen-0-a7fd2a",
      "category": "feature",
      "title": "Exchange Seller Dashboard",
      "description": ""
    }
  ]
}
```
