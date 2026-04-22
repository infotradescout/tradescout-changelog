// ============================================================
// TradeScout Info — Home Page (Forum Feed)
// Design: TradeScout brand — dark #0b0f14 bg, #f97316 orange accent
// Layout: sticky header + left sidebar + main feed + right stats panel
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import {
  POSTS,
  STATS,
  getDailyComparisonStats,
  getFilteredPosts,
  type Post,
  type Product,
  type PostType,
  type UpdateCategory,
} from "@/lib/data";

const TS_LOGO = "/brand/tradescout-logo-circle.png";
const MS_LOGO = "/brand/mealscout-logo.png";
const CONTACT_EMAIL = "contact@thetradescout.com";
const ALL_TIME_BLURBS = {
  tradescout:
    "TradeScout helps people discover and compare trusted local service professionals faster, with real-world signals that make it easier to choose who to call and why.",
  mealscout:
    "MealScout is built for food business owners to drive repeat customers, fill slow hours, and manage visibility in one place. Diners benefit too by quickly finding trusted nearby options and better local deals without endless searching.",
};

// ── Category tag ──────────────────────────────────────────
function CategoryTag({ category }: { category: UpdateCategory }) {
  const map: Record<UpdateCategory, { label: string; cls: string }> = {
    feature: { label: "Feature", cls: "tag-feature" },
    fix: { label: "Fix", cls: "tag-fix" },
    improvement: { label: "Improvement", cls: "tag-improvement" },
    seo: { label: "SEO", cls: "tag-seo" },
  };
  const { label, cls } = map[category];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${cls}`}
    >
      {label}
    </span>
  );
}

// ── Product badge ─────────────────────────────────────────
function ProductBadge({ product }: { product: Product }) {
  const isTS = product === "tradescout";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: isTS ? "rgba(249,115,22,0.12)" : "rgba(255,77,46,0.12)",
        color: isTS ? "#f97316" : "#ff4d2e",
        border: `1px solid ${isTS ? "rgba(249,115,22,0.25)" : "rgba(255,77,46,0.25)"}`,
      }}
    >
      <img
        src={isTS ? TS_LOGO : MS_LOGO}
        alt={isTS ? "TradeScout" : "MealScout"}
        className="w-3.5 h-3.5 rounded-full object-cover"
      />
      {isTS ? "TradeScout" : "MealScout"}
    </span>
  );
}

// ── Type badge ────────────────────────────────────────────
function TypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono"
      style={{
        background: type === "weekly" ? "rgba(167,139,250,0.12)" : "rgba(56,189,248,0.12)",
        color: type === "weekly" ? "#a78bfa" : "#38bdf8",
        border: `1px solid ${type === "weekly" ? "rgba(167,139,250,0.2)" : "rgba(56,189,248,0.2)"}`,
      }}
    >
      {type === "weekly" ? "Weekly Digest" : "24h Snapshot"}
    </span>
  );
}

// ── Post card ─────────────────────────────────────────────
function PostCard({ post, isLatest }: { post: Post; isLatest: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isTS = post.product === "tradescout";
  const previewUpdates = post.updates.slice(0, 2);

  return (
    <article
      className={`post-card bracket-corner p-4 sm:p-5 ${!isTS ? "mealscout-card" : ""}`}
      style={{ borderColor: isLatest ? (isTS ? "rgba(249,115,22,0.3)" : "rgba(255,77,46,0.3)") : undefined }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {isLatest && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              LATEST
            </span>
          )}
          <ProductBadge product={post.product} />
          <TypeBadge type={post.type} />
        </div>
        <span
          className="text-[11px] sm:text-xs font-mono shrink-0"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Title */}
      <h2
        className="text-base font-semibold mb-2 leading-snug"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}
      >
        {post.title}
      </h2>

      {/* Summary */}
      <p className="text-[13px] sm:text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        {post.summary}
      </p>

      {/* Commit count */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[11px] sm:text-xs font-mono"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {post.commitCount} commit{post.commitCount !== 1 ? "s" : ""}
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span
          className="text-[11px] sm:text-xs font-mono"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {post.updates.length} update{post.updates.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Updates list */}
      {expanded ? (
        <div className="space-y-3 mb-4">
          {post.updates.map((u) => (
            <div
              key={u.id}
              className="flex gap-3 p-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="pt-0.5">
                <CategoryTag category={u.category} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.88)" }}>
                  {u.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {u.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <div className="md:hidden space-y-2.5">
            {previewUpdates.map((u) => (
              <div
                key={u.id}
                className="rounded-lg p-2.5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="mb-1.5">
                  <CategoryTag category={u.category} />
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                  {u.title}
                </p>
              </div>
            ))}
            {post.updates.length > previewUpdates.length && (
              <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                +{post.updates.length - previewUpdates.length} more update{post.updates.length - previewUpdates.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="hidden md:flex flex-wrap gap-1.5">
            {post.updates.slice(0, 4).map((u) => (
              <CategoryTag key={u.id} category={u.category} />
            ))}
            {post.updates.length > 4 && (
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
              >
                +{post.updates.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs font-medium transition-colors"
        style={{ color: isTS ? "#f97316" : "#ff4d2e" }}
      >
        {expanded ? "↑ Collapse" : "↓ View all updates"}
      </button>
    </article>
  );
}

function AllTimeUpdate() {
  return (
    <section
      id="all-time-update"
      className="rounded-2xl p-3 sm:p-4"
      style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <article
          className="rounded-xl p-2.5 sm:p-3"
          style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <img src={TS_LOGO} alt="TradeScout" className="w-4 h-4 rounded-full object-cover" />
            <h3 className="text-xs sm:text-sm font-semibold" style={{ color: "#f97316" }}>
              TradeScout
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            {ALL_TIME_BLURBS.tradescout}
          </p>
        </article>

        <article
          className="rounded-xl p-2.5 sm:p-3"
          style={{ background: "rgba(255,77,46,0.08)", border: "1px solid rgba(255,77,46,0.2)" }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <img src={MS_LOGO} alt="MealScout" className="w-4 h-4 rounded-full object-cover" />
            <h3 className="text-xs sm:text-sm font-semibold" style={{ color: "#ff4d2e" }}>
              MealScout
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
            {ALL_TIME_BLURBS.mealscout}
          </p>
        </article>
      </div>
    </section>
  );
}

type DeepDiveListType =
  | "all"
  | "feature"
  | "fix"
  | "improvement"
  | "seo"
  | "commits";

type LiveCommitRow = {
  id: string;
  product: Product;
  postType: PostType;
  postDate: string;
  postTitle: string;
  category: UpdateCategory;
  title: string;
  description: string;
};

type RepoCommitSource = {
  owner: string;
  repo: string;
  product: Product;
};

type LiveCommitEvent = {
  id: string;
  sha: string;
  product: Product;
  repo: string;
  title: string;
  description: string;
  category: UpdateCategory;
  date: string;
  url: string;
};

const SNAPSHOT_SYNC_MS = 5 * 60 * 1000;
const LIVE_COMMIT_SYNC_MS = 3 * 60 * 1000;

const LIVE_REPOS: RepoCommitSource[] = [
  { owner: "infotradescout", repo: "tradescoutAI", product: "tradescout" },
  { owner: "infotradescout", repo: "MealScout", product: "mealscout" },
];

const GENERATED_POSTS_URLS = [
  "https://raw.githubusercontent.com/infotradescout/tradescout-changelog/main/client/src/lib/generated-posts.json",
  "https://cdn.jsdelivr.net/gh/infotradescout/tradescout-changelog@main/client/src/lib/generated-posts.json",
];

function normalizeCommitTitle(message: string) {
  const firstLine = message.split("\n")[0]?.trim() ?? "";
  const cleaned = firstLine
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert)(\([^)]+\))?:\s*/i, "")
    .replace(/^(feat|fix|chore|docs|refactor|perf|test|style|ci|build|revert):\s*/i, "")
    .trim();

  if (!cleaned) return "Commit update";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function detectCategoryFromMessage(message: string): UpdateCategory {
  const lower = message.toLowerCase();
  if (/\bfeat\b|feature|add\b|new\b|launch|ship|implement/.test(lower)) return "feature";
  if (/\bfix\b|bug|patch|resolve|repair|hotfix/.test(lower)) return "fix";
  if (/\bseo\b|sitemap|crawl|robots|schema|meta|canonical|og:/.test(lower)) return "seo";
  return "improvement";
}

function mergePostsWithFallback(generatedPosts: Post[]): Post[] {
  const merged = [
    ...generatedPosts,
    ...POSTS.filter((p) => !generatedPosts.some((g) => g.id === p.id)),
  ];

  return merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function isPost(value: unknown): value is Post {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<Post>;
  return (
    typeof post.id === "string" &&
    (post.product === "tradescout" || post.product === "mealscout") &&
    (post.type === "daily" || post.type === "weekly") &&
    typeof post.title === "string" &&
    typeof post.summary === "string" &&
    typeof post.date === "string" &&
    typeof post.commitCount === "number" &&
    Array.isArray(post.updates)
  );
}

async function fetchRemoteGeneratedPosts(): Promise<Post[] | null> {
  for (const url of GENERATED_POSTS_URLS) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) continue;
      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) continue;
      const validPosts = payload.filter(isPost);
      return mergePostsWithFallback(validPosts);
    } catch {
      // Try the next mirror URL.
    }
  }

  return null;
}

async function fetchRepoCommits(source: RepoCommitSource): Promise<LiveCommitEvent[]> {
  const url = `https://api.github.com/repos/${source.owner}/${source.repo}/commits?per_page=30`;
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Unable to fetch ${source.owner}/${source.repo}: ${response.status}`);
  }

  const payload = (await response.json()) as Array<{
    sha: string;
    html_url: string;
    commit: { message: string; author?: { date?: string } };
  }>;

  return payload.map((item) => {
    const message = item.commit?.message ?? "Commit update";
    const lines = message.split("\n");

    return {
      id: item.sha,
      sha: item.sha,
      product: source.product,
      repo: source.repo,
      title: normalizeCommitTitle(message),
      description: lines.slice(1).join(" ").trim(),
      category: detectCategoryFromMessage(message),
      date: item.commit?.author?.date ?? new Date().toISOString(),
      url: item.html_url,
    };
  });
}

function DeepDiveLists({ posts }: { posts: Post[] }) {
  const [activeList, setActiveList] = useState<DeepDiveListType>("all");
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const updateRows = useMemo(
    () =>
      posts
        .flatMap((post) =>
          post.updates.map((u) => ({
            ...u,
            postId: post.id,
            postTitle: post.title,
            postDate: post.date,
            product: post.product,
            postType: post.type,
          }))
        )
        .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime()),
    [posts]
  );

  const commitRows = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  const counts = useMemo(
    () => ({
      all: updateRows.length,
      feature: updateRows.filter((r) => r.category === "feature").length,
      fix: updateRows.filter((r) => r.category === "fix").length,
      improvement: updateRows.filter((r) => r.category === "improvement").length,
      seo: updateRows.filter((r) => r.category === "seo").length,
      commits: commitRows.length,
    }),
    [commitRows.length, updateRows]
  );

  const filteredUpdates = useMemo(() => {
    const byType =
      activeList === "all"
        ? updateRows
        : updateRows.filter((row) => row.category === activeList);

    if (!normalizedQuery) return byType;

    return byType.filter((row) => {
      const haystack = `${row.title} ${row.description} ${row.postTitle} ${row.product}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeList, normalizedQuery, updateRows]);

  const filteredCommits = useMemo(() => {
    if (activeList !== "commits") return [];
    if (!normalizedQuery) return commitRows;
    return commitRows.filter((row) => {
      const haystack = `${row.title} ${row.summary} ${row.product}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeList, commitRows, normalizedQuery]);

  const listTabs: { value: DeepDiveListType; label: string }[] = [
    { value: "all", label: "All Updates" },
    { value: "feature", label: "Features" },
    { value: "fix", label: "Bug Fixes" },
    { value: "improvement", label: "Improvements" },
    { value: "seo", label: "SEO" },
    { value: "commits", label: "Commits" },
  ];

  const visibleCount =
    activeList === "commits" ? filteredCommits.length : filteredUpdates.length;

  return (
    <section
      id="deep-dive"
      className="rounded-2xl p-4 sm:p-5"
      style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="mb-4">
        <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Deep Dive Lists
        </p>
        <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}>
          Explore every feature, fix, and commit snapshot
        </h2>
        <p className="text-xs sm:text-sm mt-1.5 max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
          This view follows your current product and cadence filters so people can inspect the full work behind each release.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {listTabs.map((tab) => {
          const active = activeList === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveList(tab.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: active ? "rgba(249,115,22,0.14)" : "rgba(255,255,255,0.04)",
                color: active ? "#f97316" : "rgba(255,255,255,0.55)",
                border: `1px solid ${active ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {tab.label} ({counts[tab.value]})
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, summary, description, or product..."
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.85)",
          }}
        />
      </div>

      <p className="text-[11px] font-mono mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
        Showing {visibleCount} item{visibleCount !== 1 ? "s" : ""}
      </p>

      {activeList === "commits" ? (
        <div className="space-y-2.5 max-h-[500px] overflow-auto pr-1">
          {filteredCommits.map((row) => (
            <article
              key={row.id}
              className="rounded-lg p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <ProductBadge product={row.product} />
                  <TypeBadge type={row.type} />
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
                    {row.commitCount} commit{row.commitCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>
                {row.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {row.summary}
              </p>
            </article>
          ))}
          {filteredCommits.length === 0 && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              No commits matched this view.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[500px] overflow-auto pr-1">
          {filteredUpdates.map((row) => (
            <article
              key={`${row.postId}-${row.id}`}
              className="rounded-lg p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <ProductBadge product={row.product} />
                  <CategoryTag category={row.category} />
                </div>
                <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {new Date(row.postDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>
                {row.title}
              </p>
              {row.description && (
                <p className="text-xs leading-relaxed mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {row.description}
                </p>
              )}
              <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                From: {row.postTitle}
              </p>
            </article>
          ))}
          {filteredUpdates.length === 0 && (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              No updates matched this view.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ── Suggestion / Error Report form ────────────────────────
type ReportType = "suggestion" | "bug" | "other";

function SuggestionForm() {
  const [type, setType] = useState<ReportType>("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typeLabels: Record<ReportType, { label: string; subject: string; color: string }> = {
    suggestion: { label: "Suggestion", subject: "TradeScout Suggestion", color: "#4ade80" },
    bug: { label: "Bug / Error", subject: "TradeScout Bug Report", color: "#f87171" },
    other: { label: "Other", subject: "TradeScout Feedback", color: "#a78bfa" },
  };

  const handleSend = () => {
    if (!message.trim()) {
      textareaRef.current?.focus();
      return;
    }
    const { subject } = typeLabels[type];
    const replyLine = email.trim() ? `\nReply to: ${email.trim()}\n` : "";
    const body = `${replyLine}\n${message.trim()}\n\n---\nSent from tradescoutinfo.us`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage("");
      setEmail("");
    }, 4000);
  };

  return (
    <section
      id="suggestions"
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(90deg, rgba(249,115,22,0.07) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 32, height: 32, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 5.5H13L9.5 8L11 12.5L7 10L3 12.5L4.5 8L1 5.5H5.5L7 1Z" fill="#f97316" />
          </svg>
        </div>
        <div>
          <h3
            className="text-sm font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.9)" }}
          >
            Suggestions & Error Reports
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Help us improve — your message goes directly to the team.
          </p>
        </div>
      </div>

      {/* Form body */}
      <div className="px-6 py-5 space-y-4">
        {/* Type selector */}
        <div className="flex gap-2">
          {(Object.keys(typeLabels) as ReportType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: type === t ? `${typeLabels[t].color}18` : "rgba(255,255,255,0.04)",
                color: type === t ? typeLabels[t].color : "rgba(255,255,255,0.45)",
                border: `1px solid ${type === t ? `${typeLabels[t].color}35` : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {typeLabels[t].label}
            </button>
          ))}
        </div>

        {/* Message textarea */}
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {type === "bug" ? "Describe the bug or error" : type === "suggestion" ? "Your suggestion" : "Your message"}
          </label>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={
              type === "bug"
                ? "What happened? What were you trying to do? Include any error messages..."
                : type === "suggestion"
                ? "What feature or improvement would you like to see?"
                : "Anything else on your mind..."
            }
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          />
        </div>

        {/* Optional email */}
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Your email{" "}
            <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(optional — for follow-up)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)";
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          />
        </div>

        {/* Send button + note */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Opens your email client pre-filled and addressed to{" "}
            <span style={{ color: "rgba(255,255,255,0.4)" }}>{CONTACT_EMAIL}</span>
          </p>
          <button
            onClick={handleSend}
            disabled={sent}
            className="shrink-0 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: sent ? "rgba(74,222,128,0.15)" : "#f97316",
              color: sent ? "#4ade80" : "#fff",
              border: sent ? "1px solid rgba(74,222,128,0.3)" : "none",
              cursor: sent ? "default" : "pointer",
              minWidth: 100,
            }}
          >
            {sent ? "✓ Opening…" : "Send →"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Sidebar nav ───────────────────────────────────────────
function Sidebar({
  activeProduct,
  activeType,
  onProduct,
  onType,
}: {
  activeProduct: Product | "all";
  activeType: PostType | "all";
  onProduct: (p: Product | "all") => void;
  onType: (t: PostType | "all") => void;
}) {
  const productFilters: { value: Product | "all"; label: string; logo?: string; color: string }[] = [
    { value: "all", label: "All Products", color: "rgba(255,255,255,0.6)" },
    { value: "tradescout", label: "TradeScout", logo: TS_LOGO, color: "#f97316" },
    { value: "mealscout", label: "MealScout", logo: MS_LOGO, color: "#ff4d2e" },
  ];

  const typeFilters: { value: PostType | "all"; label: string }[] = [
    { value: "all", label: "All Posts" },
    { value: "daily", label: "24h Snapshots" },
    { value: "weekly", label: "Weekly Digests" },
  ];

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Product filter */}
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Product
          </p>
          <div className="space-y-0.5">
            {productFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => onProduct(f.value)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left"
                style={{
                  background: activeProduct === f.value ? "rgba(255,255,255,0.06)" : "transparent",
                  color: activeProduct === f.value ? f.color : "rgba(255,255,255,0.5)",
                  fontWeight: activeProduct === f.value ? 600 : 400,
                }}
              >
                {f.logo && (
                  <img src={f.logo} alt="" className="w-4 h-4 rounded-full object-cover" />
                )}
                {!f.logo && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </span>
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type filter */}
        <div>
          <p
            className="text-[10px] font-mono uppercase tracking-widest mb-2"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Cadence
          </p>
          <div className="space-y-0.5">
            {typeFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => onType(f.value)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left"
                style={{
                  background: activeType === f.value ? "rgba(255,255,255,0.06)" : "transparent",
                  color: activeType === f.value ? "#f97316" : "rgba(255,255,255,0.5)",
                  fontWeight: activeType === f.value ? 600 : 400,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Links */}
        <div className="space-y-1">
          <a
            href="https://www.thetradescout.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span>↗</span> TradeScout
          </a>
          <a
            href="https://www.mealscout.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span>↗</span> MealScout
          </a>
          {/* Scroll to suggestions form */}
          <button
            onClick={() => document.getElementById("deep-dive")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <span>☰</span> Deep Dive Lists
          </button>
          <button
            onClick={() => document.getElementById("suggestions")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left"
            style={{ color: "rgba(249,115,22,0.7)" }}
          >
            <span>✦</span> Suggest / Report
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Stats panel ───────────────────────────────────────────
function StatsPanel() {
  const dailyComparison = getDailyComparisonStats();
  const stats = [
    { label: "TS Commits (7d)", value: STATS.tradescoutCommits, color: "#f97316" },
    { label: "MS Commits (7d)", value: STATS.mealscoutCommits, color: "#ff4d2e" },
    { label: "Features Shipped", value: STATS.featuresShipped, color: "#4ade80" },
    { label: "Fixes Shipped", value: STATS.fixesShipped, color: "#fbbf24" },
  ];
  const comparisonRows = [
    {
      label: "Commits",
      latest: dailyComparison.latest.commits,
      avg: dailyComparison.averageDaily.commits,
      color: "#f97316",
    },
    {
      label: "Features",
      latest: dailyComparison.latest.features,
      avg: dailyComparison.averageDaily.features,
      color: "#4ade80",
    },
    {
      label: "Bug Fixes",
      latest: dailyComparison.latest.fixes,
      avg: dailyComparison.averageDaily.fixes,
      color: "#fbbf24",
    },
  ];

  const formatAvg = (value: number) => value.toFixed(1);

  return (
    <aside className="w-56 shrink-0 hidden xl:block">
      <div className="sticky top-20 space-y-4">
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            This Week
          </p>
          <div className="space-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {s.label}
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: s.color }}
                  >
                    {s.value}
                  </span>
                </div>
                <div
                  className="h-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-0.5 rounded-full transition-all"
                    style={{ width: `${Math.min((s.value / 80) * 100, 100)}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p
            className="text-[10px] font-mono mt-4"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Last updated: {STATS.lastUpdated}
          </p>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-[10px] font-mono uppercase tracking-widest mb-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Latest Daily vs Avg/Day
          </p>
          <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
            Based on {dailyComparison.dayCount} daily snapshots
          </p>
          <div className="space-y-2.5">
            {comparisonRows.map((row) => {
              const delta = row.latest - row.avg;
              const deltaLabel = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`;
              const deltaColor = delta >= 0 ? "rgba(74,222,128,0.9)" : "rgba(248,113,113,0.9)";

              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {row.label}
                    </span>
                    <span className="text-xs font-mono" style={{ color: deltaColor }}>
                      {deltaLabel}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {row.latest} latest · {formatAvg(row.avg)} avg/day
                  </p>
                  <div
                    className="h-0.5 rounded-full mt-1.5"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-0.5 rounded-full"
                      style={{
                        width: `${Math.min((row.latest / Math.max(row.avg || 1, 1)) * 50, 100)}%`,
                        background: row.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto-post notice */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="pulse-dot" />
            <span className="text-xs font-semibold" style={{ color: "#f97316" }}>
              Auto-updating
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Posts are generated automatically every 24 hours and every Sunday from both repos.
          </p>
        </div>

        {/* Quick suggest link */}
        <button
          onClick={() => document.getElementById("suggestions")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full rounded-xl p-3.5 text-left transition-all group"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-xs font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
            Have feedback?
          </p>
          <p className="text-[11px]" style={{ color: "rgba(249,115,22,0.7)" }}>
            Submit a suggestion or report a bug →
          </p>
        </button>
      </div>
    </aside>
  );
}

// ── Mobile filter bar ─────────────────────────────────────
function MobileFilters({
  activeProduct,
  activeType,
  isLiveFeed,
  onProduct,
  onType,
}: {
  activeProduct: Product | "all";
  activeType: PostType | "all";
  isLiveFeed: boolean;
  onProduct: (p: Product | "all") => void;
  onType: (t: PostType | "all") => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
      {(["all", "tradescout", "mealscout"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onProduct(p)}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: activeProduct === p ? (p === "mealscout" ? "rgba(255,77,46,0.15)" : "rgba(249,115,22,0.15)") : "rgba(255,255,255,0.06)",
            color: activeProduct === p ? (p === "mealscout" ? "#ff4d2e" : "#f97316") : "rgba(255,255,255,0.5)",
            border: `1px solid ${activeProduct === p ? (p === "mealscout" ? "rgba(255,77,46,0.3)" : "rgba(249,115,22,0.3)") : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {p === "all" ? "All" : p === "tradescout" ? "TradeScout" : "MealScout"}
        </button>
      ))}
      {!isLiveFeed && (
        <>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} className="shrink-0" />
          {(["all", "daily", "weekly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onType(t)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeType === t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                color: activeType === t ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                border: `1px solid ${activeType === t ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {t === "all" ? "All Posts" : t === "daily" ? "24h" : "Weekly"}
            </button>
          ))}
        </>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function Home() {
  const [activeProduct, setActiveProduct] = useState<Product | "all">("all");
  const [activeType, setActiveType] = useState<PostType | "all">("all");
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [remotePosts, setRemotePosts] = useState<Post[] | null>(null);
  const [liveCommits, setLiveCommits] = useState<LiveCommitEvent[]>([]);

  useEffect(() => {
    let mounted = true;

    const syncSnapshots = async () => {
      const nextPosts = await fetchRemoteGeneratedPosts();
      if (mounted && nextPosts) {
        setRemotePosts(nextPosts);
      }
    };

    void syncSnapshots();
    const interval = window.setInterval(syncSnapshots, SNAPSHOT_SYNC_MS);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        void syncSnapshots();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!isLiveFeed) return;

    let mounted = true;

    const syncLiveCommits = async () => {
      try {
        const all = await Promise.all(LIVE_REPOS.map(fetchRepoCommits));
        const deduped = Array.from(new Map(all.flat().map((commit) => [commit.sha, commit])).values());
        deduped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (mounted) {
          setLiveCommits(deduped);
        }
      } catch {
        // Keep the previous successful commit feed when polling fails.
      }
    };

    void syncLiveCommits();
    const interval = window.setInterval(syncLiveCommits, LIVE_COMMIT_SYNC_MS);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        void syncLiveCommits();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isLiveFeed]);

  const allPosts = useMemo(
    () => remotePosts ?? getFilteredPosts({ product: "all", type: "all" }),
    [remotePosts]
  );

  const snapshotPosts = useMemo(
    () =>
      allPosts
        .filter((p) => (activeProduct === "all" ? true : p.product === activeProduct))
        .filter((p) => (activeType === "all" ? true : p.type === activeType)),
    [activeProduct, activeType, allPosts]
  );

  const liveSourcePosts = useMemo(
    () => allPosts.filter((p) => (activeProduct === "all" ? true : p.product === activeProduct)),
    [activeProduct, allPosts]
  );

  const posts = isLiveFeed ? liveSourcePosts : snapshotPosts;

  const liveCommitRows = useMemo<LiveCommitRow[]>(
    () =>
      liveSourcePosts.flatMap((post) =>
        post.updates.map((u, index) => ({
          id: `${post.id}-${u.id}-${index}`,
          product: post.product,
          postType: post.type,
          postDate: post.date,
          postTitle: post.title,
          category: u.category,
          title: u.title,
          description: u.description,
        }))
      ),
    [liveSourcePosts]
  );

  const filteredLiveCommits = useMemo(
    () => liveCommits.filter((commit) => (activeProduct === "all" ? true : commit.product === activeProduct)),
    [activeProduct, liveCommits]
  );

  const dailySnapshotPosts = useMemo(
    () => snapshotPosts.filter((p) => p.type === "daily"),
    [snapshotPosts]
  );

  const weeklySnapshotPosts = useMemo(
    () => snapshotPosts.filter((p) => p.type === "weekly"),
    [snapshotPosts]
  );

  const latestId = allPosts[0]?.id;

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--ts-bg)" }}>
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(11,15,20,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src={TS_LOGO} alt="TradeScout" className="w-7 h-7 rounded-full object-cover" />
            <div>
              <span
                className="text-sm font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}
              >
                TradeScout Info
              </span>
              <span
                className="hidden sm:inline text-xs ml-2 font-mono"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                tradescoutinfo.us
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Feedback shortcut in header */}
            <button
              onClick={() => document.getElementById("suggestions")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: "rgba(249,115,22,0.08)",
                color: "rgba(249,115,22,0.8)",
                border: "1px solid rgba(249,115,22,0.15)",
              }}
            >
              ✦ Feedback
            </button>
            <span className="pulse-dot" />
            <span className="text-[11px] sm:text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span className="sm:hidden">Live</span>
              <span className="hidden sm:inline">Auto-updating</span>
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero strip ── */}
      <div
        className="border-b"
        style={{
          background: "linear-gradient(180deg, rgba(249,115,22,0.05) 0%, transparent 100%)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <img src={TS_LOGO} alt="" className="w-5 h-5 rounded-full" />
            <img src={MS_LOGO} alt="" className="w-5 h-5 rounded-full -ml-2" />
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Platform Updates
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}
          >
            Ship Log
          </h1>
          <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Toggle between true live commit flow and the daily/weekly snapshots. Snapshot mode is optimized for high-level visibility.
          </p>
          <div className="mt-4 max-w-2xl rounded-xl p-3 sm:p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Feed Mode
                </p>
                <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {isLiveFeed ? "Live Commit Feed" : "Daily + Weekly Snapshots"}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {isLiveFeed
                    ? `Showing ${filteredLiveCommits.length || liveCommitRows.length} recent commits. Refreshes every 3 minutes.`
                    : `Showing ${dailySnapshotPosts.length} daily and ${weeklySnapshotPosts.length} weekly snapshots. Refreshes every 5 minutes.`}
                </p>
              </div>
              <button
                onClick={() => {
                  const next = !isLiveFeed;
                  setIsLiveFeed(next);
                  if (next) setActiveType("all");
                }}
                className="shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                style={{
                  background: isLiveFeed ? "rgba(34,197,94,0.16)" : "rgba(56,189,248,0.14)",
                  color: isLiveFeed ? "#4ade80" : "#38bdf8",
                  border: `1px solid ${isLiveFeed ? "rgba(74,222,128,0.32)" : "rgba(56,189,248,0.28)"}`,
                }}
              >
                {isLiveFeed ? "Live Feed: ON" : "Live Feed: OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container py-6">
        {/* Mobile filters */}
        <MobileFilters
          activeProduct={activeProduct}
          activeType={activeType}
          isLiveFeed={isLiveFeed}
          onProduct={setActiveProduct}
          onType={setActiveType}
        />

        <div className="mt-4">
          <AllTimeUpdate />
        </div>

        <div className="mt-4">
          <DeepDiveLists posts={posts} />
        </div>

        <div className="flex gap-6 mt-4 lg:mt-5">
          {/* Sidebar */}
          <Sidebar
            activeProduct={activeProduct}
            activeType={activeType}
            onProduct={setActiveProduct}
            onType={setActiveType}
          />

          {/* Feed + Suggestion form */}
          <main className="flex-1 min-w-0 space-y-4">
            {!isLiveFeed && posts.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No posts match the current filters.
                </p>
              </div>
            ) : isLiveFeed ? (
              <section
                className="rounded-xl p-4 sm:p-5"
                style={{ background: "var(--ts-surface)", border: "1px solid rgba(74,222,128,0.2)" }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(74,222,128,0.8)" }}>
                      True Live Feed
                    </p>
                    <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}>
                      Every Commit As It Lands
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                    {filteredLiveCommits.length || liveCommitRows.length} total
                  </span>
                </div>

                {(filteredLiveCommits.length === 0 && liveCommitRows.length === 0) ? (
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    No commit events matched this filter.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {(filteredLiveCommits.length > 0
                      ? filteredLiveCommits.map((commit) => (
                          <article
                            key={commit.id}
                            className="rounded-lg p-3"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <ProductBadge product={commit.product} />
                                <CategoryTag category={commit.category} />
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)" }}>
                                  {commit.repo}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                                {new Date(commit.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>
                              {commit.title}
                            </p>
                            {commit.description && (
                              <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                                {commit.description}
                              </p>
                            )}
                            <a
                              href={commit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono transition-colors"
                              style={{ color: "rgba(74,222,128,0.9)" }}
                            >
                              View commit {commit.sha.slice(0, 7)} ↗
                            </a>
                          </article>
                        ))
                      : liveCommitRows.map((row) => (
                          <article
                            key={row.id}
                            className="rounded-lg p-3"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <ProductBadge product={row.product} />
                                <TypeBadge type={row.postType} />
                                <CategoryTag category={row.category} />
                              </div>
                              <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                                {new Date(row.postDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.88)" }}>
                              {row.title}
                            </p>
                            {row.description && (
                              <p className="text-xs leading-relaxed mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                                {row.description}
                              </p>
                            )}
                            <p className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                              Source: {row.postTitle}
                            </p>
                          </article>
                        )))
                    }
                  </div>
                )}
              </section>
            ) : (
              <>
                <section
                  className="rounded-xl p-4 sm:p-5"
                  style={{ background: "var(--ts-surface)", border: "1px solid rgba(56,189,248,0.22)" }}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(56,189,248,0.8)" }}>
                        Daily Snapshots
                      </p>
                      <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}>
                        24h View
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded" style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8" }}>
                      {dailySnapshotPosts.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {dailySnapshotPosts.length === 0 ? (
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                        No daily snapshots match the current filters.
                      </p>
                    ) : (
                      dailySnapshotPosts.map((post) => (
                        <PostCard key={post.id} post={post} isLatest={post.id === latestId} />
                      ))
                    )}
                  </div>
                </section>

                <section
                  className="rounded-xl p-4 sm:p-5"
                  style={{ background: "var(--ts-surface)", border: "1px solid rgba(167,139,250,0.22)" }}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(167,139,250,0.8)" }}>
                        Weekly Digests
                      </p>
                      <h2 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.95)" }}>
                        Week In Review
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                      {weeklySnapshotPosts.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {weeklySnapshotPosts.length === 0 ? (
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                        No weekly digests match the current filters.
                      </p>
                    ) : (
                      weeklySnapshotPosts.map((post) => (
                        <PostCard key={post.id} post={post} isLatest={post.id === latestId} />
                      ))
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Suggestion / Error report form — always visible below feed */}
            <div className="pt-4">
              <SuggestionForm />
            </div>
          </main>

          {/* Stats panel */}
          <StatsPanel />
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="border-t mt-12"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={TS_LOGO} alt="" className="w-5 h-5 rounded-full" />
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
              tradescoutinfo.us — Auto-generated changelog
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.thetradescout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              thetradescout.com ↗
            </a>
            <a
              href="https://www.mealscout.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              mealscout.app ↗
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-xs font-mono transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
