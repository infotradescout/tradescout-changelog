// ============================================================
// TradeScout Info — Changelog Data Layer
// Design: TradeScout brand — dark bg, orange accent
// Seed data + auto-generated posts from scripts/generate-posts.mjs
// ============================================================

// Auto-generated posts (populated by the scheduler)
import generatedPostsRaw from "./generated-posts.json";

export type Product = "tradescout" | "mealscout";
export type PostType = "daily" | "weekly";
export type UpdateCategory = "feature" | "fix" | "improvement" | "seo";

export interface UpdateItem {
  id: string;
  category: UpdateCategory;
  title: string;
  description: string;
}

export interface Post {
  id: string;
  product: Product;
  type: PostType;
  title: string;
  summary: string;
  date: string; // ISO date string
  updates: UpdateItem[];
  commitCount: number;
}

export const POSTS: Post[] = [
  // ── TradeScout Weekly Digest ─────────────────────────────
  {
    id: "ts-weekly-apr-20",
    product: "tradescout",
    type: "weekly",
    title: "TradeScout Weekly Digest — Apr 13–20, 2026",
    summary:
      "A massive week across the entire platform. The Exchange launched with a full seller dashboard, Direct Connect gained universal provider routing, and SEO was overhauled to target all local businesses — not just contractors.",
    date: "2026-04-20",
    commitCount: 62,
    updates: [
      {
        id: "ts-w1",
        category: "feature",
        title: "Exchange Seller Dashboard",
        description:
          "Sellers now have a dedicated dashboard to manage active listings, view buyer inquiries, and mark items as sold.",
      },
      {
        id: "ts-w2",
        category: "feature",
        title: "Inquiry → Conversation Thread",
        description:
          "Buyer inquiries on Exchange listings automatically create a conversation thread and fire an in-app notification to the seller.",
      },
      {
        id: "ts-w3",
        category: "feature",
        title: "NHTSA VIN Decoding",
        description:
          "Vehicle listings now feature real-time VIN decoding via the NHTSA API — year, make, model, engine, and trim details pulled instantly.",
      },
      {
        id: "ts-w4",
        category: "feature",
        title: "Exchange Category Pages",
        description:
          "Tailored listing experiences, spec filters, and dedicated SEO-optimized pages for all 13 Exchange categories.",
      },
      {
        id: "ts-w5",
        category: "feature",
        title: "Direct Connect Universal Provider Routing",
        description:
          "Direct Connect now routes jobs to all provider types — Contractors, Businesses, and Workers/Helpers.",
      },
      {
        id: "ts-w6",
        category: "feature",
        title: "Workers as First-Class DC Responders",
        description:
          "Helpers and workers now have a dedicated dashboard, public digital resumes, and the ability to receive Direct Connect jobs.",
      },
      {
        id: "ts-w7",
        category: "feature",
        title: "DC 6-Stage Lifecycle Rail",
        description:
          "Introduced a 6-stage lifecycle for Direct Connect requests: Submitted → Routed → Awaiting → Active → Pending Outcome → Resolved.",
      },
      {
        id: "ts-w8",
        category: "feature",
        title: "Scout → DC Handoff",
        description:
          "Scout can now seamlessly hand off a conversation into a pre-filled Direct Connect request, carrying over title, description, and urgency.",
      },
      {
        id: "ts-w9",
        category: "feature",
        title: "Smart Onboarding Flow",
        description:
          "New onboarding with provisional draft promotion, live verification status, Google Places integration, and DB-backed sessions.",
      },
      {
        id: "ts-w10",
        category: "seo",
        title: "Homepage & About Page Rewrite",
        description:
          "Overhauled core messaging to target 'Find Any Local Business Near You', broadening appeal beyond contractors.",
      },
      {
        id: "ts-w11",
        category: "seo",
        title: "Exchange Sitemap Submitted to Google",
        description:
          "sitemap-exchange-listings.xml submitted to Google Search Console. Status: Success. 2 pages discovered on first read.",
      },
      {
        id: "ts-w12",
        category: "seo",
        title: "Pensacola Launch Hub",
        description:
          "Dedicated service cluster pages, routing, and acquisition flows for the Pensacola market.",
      },
      {
        id: "ts-w13",
        category: "fix",
        title: "49 Contract Tests Resolved",
        description:
          "Resolved 49 failing contract/integration tests and stabilized the TypeScript build across the platform.",
      },
      {
        id: "ts-w14",
        category: "improvement",
        title: "Map Intelligence",
        description:
          "Added Scout-guided map recommendation actions, rationale, and a Google Maps admin geo-console.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 20 ────────────────────────────
  {
    id: "ts-daily-apr-20",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Daily — Apr 20, 2026",
    summary:
      "Seller dashboard shipped, exchange inquiry flow wired to messaging, NHTSA VIN decode live, and SEO homepage/about rewrites deployed.",
    date: "2026-04-20",
    commitCount: 3,
    updates: [
      {
        id: "ts-d1",
        category: "feature",
        title: "Exchange Seller Dashboard",
        description:
          "New /exchange/seller-dashboard page with My Listings, Inquiries Inbox, and Conversations tabs.",
      },
      {
        id: "ts-d2",
        category: "feature",
        title: "Inquiry → Conversation Wiring",
        description:
          "POST /api/marketplace/inquiries now creates a conversation thread and notifies the seller in-app.",
      },
      {
        id: "ts-d3",
        category: "feature",
        title: "NHTSA VIN Decode API",
        description:
          "CarSalesConnector.vinLookup() now calls the real NHTSA vPIC API. Tested: 1HGCM82633A004352 → 2003 Honda Accord ✓",
      },
      {
        id: "ts-d4",
        category: "seo",
        title: "Homepage & About Rewrites",
        description:
          "Title changed to 'Find Any Local Business Near You'. About page broadened to mention restaurants, retail, home services.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 19 ────────────────────────────
  {
    id: "ts-daily-apr-19",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Daily — Apr 19, 2026",
    summary:
      "Direct Connect end-to-end flow hardened with 5 gap fixes, ScoutMemory switched to real DB queries, and analytics sources stabilized.",
    date: "2026-04-19",
    commitCount: 6,
    updates: [
      {
        id: "ts-d5",
        category: "fix",
        title: "DC Core Loop — 5 Gap Fixes",
        description:
          "Self-select routing, completion notifications, pending outcome visibility, inbox threads, and provider response card all fixed.",
      },
      {
        id: "ts-d6",
        category: "fix",
        title: "ScoutMemory Real DB Queries",
        description:
          "ScoutMemory now reads from and writes to the real database instead of in-memory stubs.",
      },
      {
        id: "ts-d7",
        category: "improvement",
        title: "Analytics Sources & Bid History",
        description:
          "Analytics sources and project bid history now return accurate data from the database.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 18 ────────────────────────────
  {
    id: "ts-daily-apr-18",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Daily — Apr 18, 2026",
    summary:
      "Map intelligence upgraded with Scout-guided recommendations, Solar v1 provider workbench scaffolded, and landing page copy refined.",
    date: "2026-04-18",
    commitCount: 10,
    updates: [
      {
        id: "ts-d8",
        category: "feature",
        title: "Scout Map Recommendations",
        description:
          "Scout now surfaces map-based business recommendations with rationale and a Google Maps admin geo-console.",
      },
      {
        id: "ts-d9",
        category: "feature",
        title: "Solar v1 Provider Workbench",
        description:
          "Scaffolded the Solar provider workbench with feature gates for the solar vertical.",
      },
      {
        id: "ts-d10",
        category: "improvement",
        title: "Landing Page Copy Refinements",
        description:
          "Headline reduced in size, trust placement section removed, How TradeScout Works refocused into 3 clear sections.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 20 (Scout + Flows) ─────────────
  {
    id: "ts-daily-apr-20b",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Daily — Apr 20, 2026 (Scout AI & Flow Fixes)",
    summary:
      "Scout AI consistency overhaul shipped in 5 parts, plus 3 bugs and 1 gap fixed across the business signup, user signup, and Direct Connect routing flows.",
    date: "2026-04-20",
    commitCount: 2,
    updates: [
      {
        id: "ts-d20b-1",
        category: "fix",
        title: "Scout AI 5-Part Consistency Overhaul",
        description:
          "Dead routing files archived, JSON contract hardened with auto-fill for missing fields, system prompt canonicalized (574 → 190 lines), ScoutOS decomposed into useScoutLocalHandlers hook, and Scout v4 enhanced pipeline enabled by default.",
      },
      {
        id: "ts-d20b-2",
        category: "fix",
        title: "Business Claim — Wrong Role on Shell Creation",
        description:
          "createAndClaim() was creating new business shells with type='contractor' / roleContext='contractor'. Fixed to type='other' / roleContext='business_owner'.",
      },
      {
        id: "ts-d20b-3",
        category: "fix",
        title: "DC Routing — Worker Dedup Used Wrong Key",
        description:
          "Worker candidates were deduped against existingByContractor (keyed on contractorId), but workers use workerId. Added existingByWorker Set to prevent duplicate worker assignments on expand-reach calls.",
      },
      {
        id: "ts-d20b-4",
        category: "improvement",
        title: "Email Verification Auto-Login",
        description:
          "After verifying email, the server now establishes a session automatically via req.login() so users land directly in the app without a second sign-in step.",
      },
    ],
  },
  // ── MealScout Weekly Digest ──────────────────────────────
  {
    id: "ms-weekly-apr-20",
    product: "mealscout",
    type: "weekly",
    title: "MealScout Weekly Digest — Apr 13–20, 2026",
    summary:
      "Host and food truck flows hardened with Stripe Connect UX improvements, verification banners, and subscription webhook sync. Multi-location support expanded.",
    date: "2026-04-20",
    commitCount: 18,
    updates: [
      {
        id: "ms-w1",
        category: "fix",
        title: "Stripe Connect UX Hardening",
        description:
          "Host Stripe Connect onboarding flow improved with clearer UX, better error states, and verification banners.",
      },
      {
        id: "ms-w2",
        category: "fix",
        title: "Subscription Webhook Sync",
        description:
          "Subscription status now stays in sync with Stripe webhooks — no more stale subscription states after payment events.",
      },
      {
        id: "ms-w3",
        category: "feature",
        title: "Host Multi-Location Support",
        description:
          "Hosts can now manage multiple locations from a single account with per-location menus and booking settings.",
      },
      {
        id: "ms-w4",
        category: "improvement",
        title: "Free Menu & Booking Clarity",
        description:
          "Free tier menu and booking limitations are now clearly communicated throughout the host dashboard.",
      },
      {
        id: "ms-w5",
        category: "feature",
        title: "VAC Admin Monitoring",
        description:
          "Admin panel now includes VAC (Vendor Account Compliance) monitoring for host verification status.",
      },
      {
        id: "ms-w6",
        category: "fix",
        title: "Admin Provisioning Transactional",
        description:
          "Admin manual provisioning is now fully transactional — no partial states on failure.",
      },
      {
        id: "ms-w7",
        category: "seo",
        title: "SEO + LLMO + LISA Signal Wiring",
        description:
          "Ordered source integration and LISA signal endpoint wired for local search optimization.",
      },
    ],
  },
  // ── MealScout Daily — Apr 20 ─────────────────────────────
  {
    id: "ms-daily-apr-20",
    product: "mealscout",
    type: "daily",
    title: "MealScout Daily — Apr 20, 2026",
    summary:
      "Host and food truck flow hardening shipped — Stripe Connect UX, verification banners, host booking email, and subscription webhook sync.",
    date: "2026-04-20",
    commitCount: 2,
    updates: [
      {
        id: "ms-d1",
        category: "fix",
        title: "Host Booking Email",
        description:
          "Hosts now receive a confirmation email when a booking is made at their location.",
      },
      {
        id: "ms-d2",
        category: "fix",
        title: "Stripe Connect Verification Banners",
        description:
          "Verification banners now appear correctly for hosts with incomplete Stripe Connect onboarding.",
      },
    ],
  },
];

// Merge: generated posts first (newest), then seed posts as fallback
const generatedPosts = generatedPostsRaw as Post[];
const ALL_POSTS: Post[] = [
  ...generatedPosts,
  ...POSTS.filter((p) => !generatedPosts.some((g) => g.id === p.id)),
];

export function getFilteredPosts(opts: {
  product?: Product | "all";
  type?: PostType | "all";
}): Post[] {
  return ALL_POSTS.filter((p) => {
    if (opts.product && opts.product !== "all" && p.product !== opts.product) return false;
    if (opts.type && opts.type !== "all" && p.type !== opts.type) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLatestPost(): Post {
  return [...ALL_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
}

export const STATS = {
  tradescoutCommits: 64,
  mealscoutCommits: 18,
  featuresShipped: 16,
  fixesShipped: 11,
  lastUpdated: "Apr 20, 2026",
};
