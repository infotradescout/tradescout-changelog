#!/usr/bin/env node
/**
 * TradeScout Info — Backfill Post Generator
 * ==========================================
 * Reads commit data from /tmp/ts-commits.txt and /tmp/ms-commits.txt
 * (format: SHA|YYYY-MM-DD|commit message)
 * and generates daily + weekly posts for every day/week since Jan 1 2026.
 *
 * Usage:
 *   node scripts/backfill-posts.mjs
 *
 * Output:
 *   client/src/lib/generated-posts.json
 */

import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_PATH = join(ROOT, "client/src/lib/generated-posts.json");

// ── Category detection ────────────────────────────────────
function detectCategory(message) {
  const lower = message.toLowerCase();
  if (/\bfeat\b|feature|add\b|new\b|launch|ship|implement|creat|build/.test(lower)) return "feature";
  if (/\bfix\b|bug|patch|resolve|repair|hotfix|correct|revert/.test(lower)) return "fix";
  if (/\bseo\b|sitemap|crawl|robots|schema|meta|canonical|og:|keyword/.test(lower)) return "seo";
  return "improvement";
}

// ── Commit message → human title ─────────────────────────
function humanizeTitle(message) {
  const cleaned = message
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert)(\([^)]+\))?:\s*/i, "")
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert):\s*/i, "")
    .split("\n")[0]
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// ── Parse commit file ─────────────────────────────────────
function parseCommitFile(filePath) {
  const lines = readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return lines.map((line) => {
    const [sha, date, ...msgParts] = line.split("|");
    return { sha: sha?.trim(), date: date?.trim(), message: msgParts.join("|").trim() };
  }).filter((c) => c.sha && c.date && c.message);
}

// ── Group commits by date range ───────────────────────────
function commitsInRange(commits, startDate, endDate) {
  return commits.filter((c) => c.date >= startDate && c.date <= endDate);
}

// ── Build a post ──────────────────────────────────────────
function buildPost({ product, type, commits, dateStr, periodLabel, id }) {
  const updates = commits.map((c, i) => ({
    id: `gen-${i}-${c.sha.slice(0, 6)}`,
    category: detectCategory(c.message),
    title: humanizeTitle(c.message),
    description: "",
  }));

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

  return {
    id,
    product,
    type,
    title: `${productLabel} ${type === "daily" ? "Daily" : "Weekly Digest"} — ${periodLabel}`,
    summary:
      commits.length === 0
        ? "No commits in this period."
        : `${commits.length} commit${commits.length > 1 ? "s" : ""} shipped: ${summaryParts.join(", ")}.`,
    date: dateStr,
    commitCount: commits.length,
    updates,
  };
}

// ── Date utilities ────────────────────────────────────────
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function getMondayOf(dateStr) {
  const d = new Date(dateStr + "T12:00:00Z");
  const day = d.getUTCDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().split("T")[0];
}

// ── Main ──────────────────────────────────────────────────
function main() {
  console.log("[backfill] Parsing commit files...");
  const tsCommits = parseCommitFile("/tmp/ts-commits.txt");
  const msCommits = parseCommitFile("/tmp/ms-commits.txt");
  console.log(`[backfill] TradeScout: ${tsCommits.length} commits`);
  console.log(`[backfill] MealScout: ${msCommits.length} commits`);

  const START = "2026-01-01";
  const END = "2026-04-20";
  const posts = [];

  // ── Daily posts ──────────────────────────────────────────
  let current = START;
  while (current <= END) {
    for (const [product, commits] of [["tradescout", tsCommits], ["mealscout", msCommits]]) {
      const dayCommits = commitsInRange(commits, current, current);
      if (dayCommits.length === 0) {
        current = addDays(current, 1);
        continue; // skip empty days
      }
      const id = `${product}-daily-${current}`;
      const periodLabel = formatDate(current);
      posts.push(buildPost({ product, type: "daily", commits: dayCommits, dateStr: current, periodLabel, id }));
    }
    current = addDays(current, 1);
  }

  // ── Weekly posts (Monday-based weeks) ────────────────────
  const weekStarts = new Set();
  let wCurrent = START;
  while (wCurrent <= END) {
    weekStarts.add(getMondayOf(wCurrent));
    wCurrent = addDays(wCurrent, 1);
  }

  for (const weekStart of [...weekStarts].sort()) {
    const weekEnd = addDays(weekStart, 6) > END ? END : addDays(weekStart, 6);
    for (const [product, commits] of [["tradescout", tsCommits], ["mealscout", msCommits]]) {
      const weekCommits = commitsInRange(commits, weekStart, weekEnd);
      if (weekCommits.length === 0) continue;
      const id = `${product}-weekly-${weekStart}`;
      const periodLabel = `${formatDate(weekStart)}–${formatDate(weekEnd)}`;
      posts.push(buildPost({ product, type: "weekly", commits: weekCommits, dateStr: weekEnd, periodLabel, id }));
    }
  }

  // Sort newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`[backfill] Generated ${posts.length} posts total`);
  console.log(`[backfill]   Daily: ${posts.filter((p) => p.type === "daily").length}`);
  console.log(`[backfill]   Weekly: ${posts.filter((p) => p.type === "weekly").length}`);
  console.log(`[backfill]   TradeScout: ${posts.filter((p) => p.product === "tradescout").length}`);
  console.log(`[backfill]   MealScout: ${posts.filter((p) => p.product === "mealscout").length}`);

  writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2));
  console.log(`[backfill] Written to ${OUTPUT_PATH}`);
}

main();
