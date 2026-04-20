// ============================================================
// TradeScout Info — Home Page (Forum Feed)
// Design: TradeScout brand — dark #0b0f14 bg, #f97316 orange accent
// Layout: sticky header + left sidebar + main feed + right stats panel
// ============================================================

import { useState, useMemo } from "react";
import {
  STATS,
  getFilteredPosts,
  type Post,
  type Product,
  type PostType,
  type UpdateCategory,
} from "@/lib/data";

const TS_LOGO = "/manus-storage/tradescout-logo_35cad8f9.png";
const MS_LOGO = "/manus-storage/mealscout-logo_3758be6c.png";

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

  return (
    <article
      className={`post-card bracket-corner p-5 ${!isTS ? "mealscout-card" : ""}`}
      style={{ borderColor: isLatest ? (isTS ? "rgba(249,115,22,0.3)" : "rgba(255,77,46,0.3)") : undefined }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
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
          className="text-xs font-mono shrink-0"
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
      <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        {post.summary}
      </p>

      {/* Commit count */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-xs font-mono"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {post.commitCount} commit{post.commitCount !== 1 ? "s" : ""}
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span
          className="text-xs font-mono"
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
        <div className="flex flex-wrap gap-1.5 mb-4">
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
        </div>
      </div>
    </aside>
  );
}

// ── Stats panel ───────────────────────────────────────────
function StatsPanel() {
  const stats = [
    { label: "TS Commits (7d)", value: STATS.tradescoutCommits, color: "#f97316" },
    { label: "MS Commits (7d)", value: STATS.mealscoutCommits, color: "#ff4d2e" },
    { label: "Features Shipped", value: STATS.featuresShipped, color: "#4ade80" },
    { label: "Fixes Shipped", value: STATS.fixesShipped, color: "#fbbf24" },
  ];

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
      </div>
    </aside>
  );
}

// ── Mobile filter bar ─────────────────────────────────────
function MobileFilters({
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
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function Home() {
  const [activeProduct, setActiveProduct] = useState<Product | "all">("all");
  const [activeType, setActiveType] = useState<PostType | "all">("all");

  const posts = useMemo(
    () => getFilteredPosts({ product: activeProduct, type: activeType }),
    [activeProduct, activeType]
  );

  const latestId = getFilteredPosts({ product: "all", type: "all" })[0]?.id;

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
                className="text-xs ml-2 font-mono"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                tradescoutinfo.us
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="pulse-dot" />
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              Auto-updating
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
            What we shipped
          </h1>
          <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            24-hour and weekly snapshots of every feature, fix, and improvement across TradeScout and MealScout. Auto-generated from our git history.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container py-6">
        {/* Mobile filters */}
        <MobileFilters
          activeProduct={activeProduct}
          activeType={activeType}
          onProduct={setActiveProduct}
          onType={setActiveType}
        />

        <div className="flex gap-6 mt-4 lg:mt-0">
          {/* Sidebar */}
          <Sidebar
            activeProduct={activeProduct}
            activeType={activeType}
            onProduct={setActiveProduct}
            onType={setActiveType}
          />

          {/* Feed */}
          <main className="flex-1 min-w-0 space-y-4">
            {posts.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: "var(--ts-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No posts match the current filters.
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} isLatest={post.id === latestId} />
              ))
            )}
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
          </div>
        </div>
      </footer>
    </div>
  );
}
