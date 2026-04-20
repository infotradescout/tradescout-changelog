#!/usr/bin/env node
/**
 * TradeScout Info — Auto-Post Generator
 * ======================================
 * Pulls commits from both GitHub repos via the GitHub API,
 * categorizes them, and writes formatted posts to data.json.
 *
 * Run modes:
 *   node scripts/generate-posts.mjs --mode daily
 *   node scripts/generate-posts.mjs --mode weekly
 *
 * Required env vars:
 *   GITHUB_TOKEN — a GitHub personal access token with repo read access
 *
 * Output:
 *   client/src/lib/generated-posts.json — imported by the React app
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_PATH = join(ROOT, "client/src/lib/generated-posts.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPOS = [
  { owner: "infotradescout", repo: "tradescoutAI", product: "tradescout" },
  { owner: "infotradescout", repo: "MealScout", product: "mealscout" },
];

const MODE = process.argv.includes("--mode")
  ? process.argv[process.argv.indexOf("--mode") + 1]
  : "daily";

if (!["daily", "weekly"].includes(MODE)) {
  console.error("Invalid mode. Use --mode daily or --mode weekly");
  process.exit(1);
}

// ── Category detection ────────────────────────────────────
function detectCategory(message) {
  const lower = message.toLowerCase();
  if (/\bfeat\b|feature|add\b|new\b|launch|ship|implement/.test(lower)) return "feature";
  if (/\bfix\b|bug|patch|resolve|repair|hotfix/.test(lower)) return "fix";
  if (/\bseo\b|sitemap|crawl|robots|schema|meta|canonical|og:/.test(lower)) return "seo";
  return "improvement";
}

// ── Commit message → human title ─────────────────────────
function humanizeTitle(message) {
  // Strip conventional commit prefix: "feat(scope): " → ""
  const cleaned = message
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert)(\([^)]+\))?:\s*/i, "")
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert):\s*/i, "")
    .split("\n")[0]
    .trim();

  // Capitalize first letter
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// ── Group commits into update items ──────────────────────
function groupCommits(commits) {
  return commits.map((c, i) => ({
    id: `gen-${i}-${c.sha.slice(0, 6)}`,
    category: detectCategory(c.commit.message),
    title: humanizeTitle(c.commit.message),
    description: c.commit.message.split("\n").slice(1).join(" ").trim() || "",
  }));
}

// ── Fetch commits from GitHub API ────────────────────────
async function fetchCommits(owner, repo, since) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "tradescout-changelog-bot",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${since.toISOString()}&per_page=100`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status} for ${owner}/${repo}: ${text}`);
  }

  return res.json();
}

// ── Build post object ─────────────────────────────────────
function buildPost({ product, type, commits, since, now }) {
  const updates = groupCommits(commits);
  const dateStr = now.toISOString().split("T")[0];
  const id = `${product}-${type}-${dateStr}`;

  const featureCount = updates.filter((u) => u.category === "feature").length;
  const fixCount = updates.filter((u) => u.category === "fix").length;
  const seoCount = updates.filter((u) => u.category === "seo").length;
  const improvCount = updates.filter((u) => u.category === "improvement").length;

  const summaryParts = [];
  if (featureCount > 0) summaryParts.push(`${featureCount} new feature${featureCount > 1 ? "s" : ""}`);
  if (fixCount > 0) summaryParts.push(`${fixCount} fix${fixCount > 1 ? "es" : ""}`);
  if (seoCount > 0) summaryParts.push(`${seoCount} SEO update${seoCount > 1 ? "s" : ""}`);
  if (improvCount > 0) summaryParts.push(`${improvCount} improvement${improvCount > 1 ? "s" : ""}`);

  const productLabel = product === "tradescout" ? "TradeScout" : "MealScout";
  const periodLabel =
    type === "daily"
      ? now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : `${since.toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return {
    id,
    product,
    type,
    title: `${productLabel} ${type === "daily" ? "Daily" : "Weekly Digest"} — ${periodLabel}`,
    summary:
      updates.length === 0
        ? "No commits in this period."
        : `${updates.length} commit${updates.length > 1 ? "s" : ""} shipped: ${summaryParts.join(", ")}.`,
    date: dateStr,
    commitCount: commits.length,
    updates,
  };
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  console.log(`[generate-posts] mode=${MODE}`);

  const now = new Date();
  const since =
    MODE === "daily"
      ? new Date(now.getTime() - 24 * 60 * 60 * 1000)
      : new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Load existing posts
  let existingPosts = [];
  if (existsSync(OUTPUT_PATH)) {
    try {
      existingPosts = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
    } catch {
      existingPosts = [];
    }
  }

  const newPosts = [];

  for (const { owner, repo, product } of REPOS) {
    console.log(`[generate-posts] Fetching ${owner}/${repo} since ${since.toISOString()}...`);
    let commits = [];
    try {
      commits = await fetchCommits(owner, repo, since);
      console.log(`[generate-posts] ${commits.length} commits found for ${product}`);
    } catch (err) {
      console.error(`[generate-posts] Failed to fetch ${product}: ${err.message}`);
      continue;
    }

    if (commits.length === 0) {
      console.log(`[generate-posts] No commits for ${product}, skipping post`);
      continue;
    }

    const post = buildPost({ product, type: MODE, commits, since, now });
    newPosts.push(post);
    console.log(`[generate-posts] Built post: ${post.id} (${post.updates.length} updates)`);
  }

  if (newPosts.length === 0) {
    console.log("[generate-posts] No new posts generated.");
    return;
  }

  // Merge: new posts go to the front, deduplicate by id
  const existingIds = new Set(existingPosts.map((p) => p.id));
  const merged = [
    ...newPosts,
    ...existingPosts.filter((p) => !existingIds.has(p.id) || newPosts.some((n) => n.id === p.id)),
  ];

  // Keep at most 90 posts (3 months of daily + weekly)
  const trimmed = merged.slice(0, 90);

  writeFileSync(OUTPUT_PATH, JSON.stringify(trimmed, null, 2));
  console.log(`[generate-posts] Wrote ${trimmed.length} posts to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("[generate-posts] Fatal:", err);
  process.exit(1);
});
