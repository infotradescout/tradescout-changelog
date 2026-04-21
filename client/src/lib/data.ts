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
    title: "TradeScout — Week of Apr 13–20, 2026",
    summary:
      "A big week for TradeScout. We launched a full marketplace for buying and selling trade equipment, made it easier to connect with any type of local provider, and improved how the platform shows up in Google searches.",
    date: "2026-04-20",
    commitCount: 62,
    updates: [
      {
        id: "ts-w1",
        category: "feature",
        title: "Sellers Now Have Their Own Dashboard",
        description:
          "If you sell equipment or supplies on TradeScout, you now have a dedicated space to manage your listings, see who's interested, and mark items as sold — all in one place.",
      },
      {
        id: "ts-w2",
        category: "feature",
        title: "Buyer Questions Go Straight to a Chat",
        description:
          "When a buyer asks about your listing, a conversation thread opens automatically and you get a notification right away — no more missing messages.",
      },
      {
        id: "ts-w3",
        category: "feature",
        title: "Instant Vehicle Details from a VIN",
        description:
          "Paste a vehicle's VIN number into a listing and TradeScout will automatically fill in the year, make, model, engine, and trim — no manual entry needed.",
      },
      {
        id: "ts-w4",
        category: "feature",
        title: "Dedicated Pages for Every Listing Category",
        description:
          "Each of the 13 marketplace categories now has its own page with relevant filters and search-friendly content, making it easier to find exactly what you're looking for.",
      },
      {
        id: "ts-w5",
        category: "feature",
        title: "Direct Connect Works for All Provider Types",
        description:
          "When you submit a job request, TradeScout can now match you with contractors, local businesses, and individual workers — not just one type of provider.",
      },
      {
        id: "ts-w6",
        category: "feature",
        title: "Workers and Helpers Can Now Receive Jobs",
        description:
          "Individual workers and helpers now have their own profile pages and can receive job requests through Direct Connect, just like contractors and businesses.",
      },
      {
        id: "ts-w7",
        category: "feature",
        title: "Clearer Job Request Progress Tracking",
        description:
          "Every Direct Connect job request now moves through six clear stages — from the moment you submit it to when it's fully resolved — so you always know where things stand.",
      },
      {
        id: "ts-w8",
        category: "feature",
        title: "Scout Can Start a Job Request for You",
        description:
          "After chatting with Scout about a job, you can now send it straight into a Direct Connect request with all the details already filled in.",
      },
      {
        id: "ts-w9",
        category: "feature",
        title: "Smoother Sign-Up Experience",
        description:
          "The sign-up process is now faster and more guided, with real-time address lookup, clearer steps, and your progress saved along the way.",
      },
      {
        id: "ts-w10",
        category: "seo",
        title: "Homepage Updated to Welcome All Local Businesses",
        description:
          "The homepage and About page now clearly communicate that TradeScout works for any local business — not just contractors — making it easier for new visitors to understand what we do.",
      },
      {
        id: "ts-w11",
        category: "seo",
        title: "Marketplace Listings Now Discoverable on Google",
        description:
          "We submitted our marketplace sitemap to Google Search Console, so your listings can now start appearing in search results.",
      },
      {
        id: "ts-w12",
        category: "seo",
        title: "Pensacola Now Has Its Own Local Hub",
        description:
          "We launched dedicated pages for the Pensacola market, making it easier for local businesses and customers in that area to find and use TradeScout.",
      },
      {
        id: "ts-w13",
        category: "fix",
        title: "Reliability Improvements Across the Platform",
        description:
          "We resolved a large batch of issues that were causing inconsistent behavior behind the scenes, resulting in a more stable and predictable experience throughout the app.",
      },
      {
        id: "ts-w14",
        category: "improvement",
        title: "Scout Now Recommends Businesses on the Map",
        description:
          "Scout can now point you to specific businesses on the map and explain why it's recommending them, giving you more context before you reach out.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 20 ────────────────────────────
  {
    id: "ts-daily-apr-20",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Updates — Apr 20, 2026",
    summary:
      "Sellers got a new dashboard, buyer messages now open a conversation automatically, vehicle VIN lookup went live, and the homepage was updated to speak to all types of local businesses.",
    date: "2026-04-20",
    commitCount: 3,
    updates: [
      {
        id: "ts-d1",
        category: "feature",
        title: "Seller Dashboard Is Live",
        description:
          "Sellers can now view all their listings, manage incoming inquiries, and track conversations from a single dashboard page.",
      },
      {
        id: "ts-d2",
        category: "feature",
        title: "Buyer Questions Now Open a Chat Thread",
        description:
          "When a buyer sends a question about a listing, a conversation is created automatically and the seller is notified in the app.",
      },
      {
        id: "ts-d3",
        category: "feature",
        title: "Vehicle VIN Lookup Is Live",
        description:
          "Sellers listing a vehicle can now enter the VIN and get the year, make, model, and trim details filled in automatically.",
      },
      {
        id: "ts-d4",
        category: "seo",
        title: "Homepage Now Speaks to All Local Businesses",
        description:
          "We updated the homepage headline and About page to make it clear that TradeScout serves restaurants, retailers, home service providers, and more — not just contractors.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 19 ────────────────────────────
  {
    id: "ts-daily-apr-19",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Updates — Apr 19, 2026",
    summary:
      "Several reliability improvements to the Direct Connect job flow, Scout's memory now saves properly between sessions, and reporting data is more accurate.",
    date: "2026-04-19",
    commitCount: 6,
    updates: [
      {
        id: "ts-d5",
        category: "fix",
        title: "Direct Connect Job Flow — 5 Reliability Fixes",
        description:
          "Fixed issues with how jobs are assigned, how completion notifications are sent, how pending jobs appear in your inbox, and how providers respond to requests.",
      },
      {
        id: "ts-d6",
        category: "fix",
        title: "Scout Remembers Your Conversations",
        description:
          "Scout's memory now correctly saves and recalls past conversations, so it can give you more relevant help over time.",
      },
      {
        id: "ts-d7",
        category: "improvement",
        title: "More Accurate Activity Reports",
        description:
          "Your project history and activity data now reflect the correct information, giving you a clearer picture of past work.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 18 ────────────────────────────
  {
    id: "ts-daily-apr-18",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Updates — Apr 18, 2026",
    summary:
      "Scout can now recommend businesses on the map with explanations, solar service providers got early access tools, and the homepage was simplified.",
    date: "2026-04-18",
    commitCount: 10,
    updates: [
      {
        id: "ts-d8",
        category: "feature",
        title: "Scout Explains Its Map Recommendations",
        description:
          "When Scout suggests a business on the map, it now tells you why — rating, proximity, availability, and other relevant factors.",
      },
      {
        id: "ts-d9",
        category: "feature",
        title: "Early Tools for Solar Providers",
        description:
          "Solar service providers now have access to a dedicated workspace with tools tailored to the solar industry.",
      },
      {
        id: "ts-d10",
        category: "improvement",
        title: "Homepage Simplified",
        description:
          "We streamlined the homepage layout — cleaner headline, removed a cluttered section, and made the 'How It Works' section easier to follow.",
      },
    ],
  },
  // ── TradeScout Daily — Apr 20 (Scout + Flows) ─────────────
  {
    id: "ts-daily-apr-20b",
    product: "tradescout",
    type: "daily",
    title: "TradeScout Updates — Apr 20, 2026 (Scout & Account Fixes)",
    summary:
      "Scout AI got a major reliability upgrade, and we fixed three issues affecting business account creation, job routing, and the email verification sign-in flow.",
    date: "2026-04-20",
    commitCount: 2,
    updates: [
      {
        id: "ts-d20b-1",
        category: "improvement",
        title: "Scout AI Is More Consistent and Faster",
        description:
          "We overhauled Scout's internal logic to make responses more reliable, removed outdated code that was never being used, and switched on the improved AI pipeline that was previously off by default.",
      },
      {
        id: "ts-d20b-2",
        category: "fix",
        title: "Business Account Type Fixed at Sign-Up",
        description:
          "When a business owner claimed a new profile, it was being set up as a contractor account by mistake. This is now fixed — business owner accounts are created correctly from the start.",
      },
      {
        id: "ts-d20b-3",
        category: "fix",
        title: "Job Routing No Longer Sends Duplicate Assignments",
        description:
          "In some cases, the same worker could be assigned to a job more than once when the system expanded its search. This has been corrected.",
      },
      {
        id: "ts-d20b-4",
        category: "improvement",
        title: "Email Verification Now Signs You In Automatically",
        description:
          "After clicking the verification link in your welcome email, you're now taken straight into the app — no need to sign in again.",
      },
    ],
  },
  // ── MealScout Weekly Digest ──────────────────────────────
  {
    id: "ms-weekly-apr-20",
    product: "mealscout",
    type: "weekly",
    title: "MealScout — Week of Apr 13–20, 2026",
    summary:
      "A steady week of reliability improvements for hosts and food truck operators. Payments, booking notifications, and subscription status all got more dependable.",
    date: "2026-04-20",
    commitCount: 18,
    updates: [
      {
        id: "ms-w1",
        category: "fix",
        title: "Smoother Payment Setup for Hosts",
        description:
          "The process for hosts to set up their payment account is now clearer, with better guidance and more helpful error messages if something goes wrong.",
      },
      {
        id: "ms-w2",
        category: "fix",
        title: "Subscription Status Stays Up to Date",
        description:
          "Your subscription status now updates correctly after any payment — no more cases where it showed the wrong plan after a renewal or upgrade.",
      },
      {
        id: "ms-w3",
        category: "feature",
        title: "Manage Multiple Locations from One Account",
        description:
          "Hosts with more than one location can now manage all of them from a single account, with separate menus and booking settings for each spot.",
      },
      {
        id: "ms-w4",
        category: "improvement",
        title: "Free Plan Limits Are Now Clearly Shown",
        description:
          "If you're on the free plan, you'll now see clear labels throughout your dashboard explaining what's included and what requires an upgrade.",
      },
      {
        id: "ms-w5",
        category: "feature",
        title: "Host Compliance Monitoring for Admins",
        description:
          "The admin panel now includes a monitoring view to track which hosts have completed their account verification and which still have steps pending.",
      },
      {
        id: "ms-w6",
        category: "fix",
        title: "Account Setup Is Now All-or-Nothing",
        description:
          "If something goes wrong during manual account setup, the system now rolls back completely instead of leaving the account in a broken half-set-up state.",
      },
      {
        id: "ms-w7",
        category: "seo",
        title: "Better Local Search Visibility",
        description:
          "We connected MealScout to additional local search signals, helping food trucks and hosts show up more prominently when people search nearby.",
      },
    ],
  },
  // ── MealScout Daily — Apr 20 ─────────────────────────────
  {
    id: "ms-daily-apr-20",
    product: "mealscout",
    type: "daily",
    title: "MealScout Updates — Apr 20, 2026",
    summary:
      "Hosts now get a confirmation email when a booking comes in, and the payment setup banner now shows correctly for hosts who haven't finished setting up payments.",
    date: "2026-04-20",
    commitCount: 2,
    updates: [
      {
        id: "ms-d1",
        category: "fix",
        title: "Hosts Get Notified When a Booking Is Made",
        description:
          "Hosts now receive a confirmation email whenever a customer books at their location, so you never miss a new reservation.",
      },
      {
        id: "ms-d2",
        category: "fix",
        title: "Payment Setup Reminder Now Shows Correctly",
        description:
          "If you haven't finished setting up your payment account, the reminder banner now appears as expected so you can complete the process.",
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

function getCategoryCount(posts: Post[], category: UpdateCategory): number {
  return posts.reduce(
    (sum, post) => sum + post.updates.filter((u) => u.category === category).length,
    0
  );
}

export interface DailyComparisonStats {
  latestDate: string;
  latest: {
    commits: number;
    features: number;
    fixes: number;
  };
  averageDaily: {
    commits: number;
    features: number;
    fixes: number;
  };
  dayCount: number;
}

export function getDailyComparisonStats(): DailyComparisonStats {
  const dailyPosts = ALL_POSTS.filter((p) => p.type === "daily");

  if (dailyPosts.length === 0) {
    return {
      latestDate: "",
      latest: { commits: 0, features: 0, fixes: 0 },
      averageDaily: { commits: 0, features: 0, fixes: 0 },
      dayCount: 0,
    };
  }

  const byDate = new Map<string, Post[]>();
  for (const post of dailyPosts) {
    const list = byDate.get(post.date) ?? [];
    list.push(post);
    byDate.set(post.date, list);
  }

  const sortedDates = Array.from(byDate.keys()).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const latestDate = sortedDates[0];

  const latestPosts = byDate.get(latestDate) ?? [];
  const latestCommits = latestPosts.reduce((sum, post) => sum + post.commitCount, 0);
  const latestFeatures = getCategoryCount(latestPosts, "feature");
  const latestFixes = getCategoryCount(latestPosts, "fix");

  const totals = sortedDates.reduce(
    (acc, date) => {
      const posts = byDate.get(date) ?? [];
      acc.commits += posts.reduce((sum, post) => sum + post.commitCount, 0);
      acc.features += getCategoryCount(posts, "feature");
      acc.fixes += getCategoryCount(posts, "fix");
      return acc;
    },
    { commits: 0, features: 0, fixes: 0 }
  );

  const dayCount = sortedDates.length;

  return {
    latestDate,
    latest: {
      commits: latestCommits,
      features: latestFeatures,
      fixes: latestFixes,
    },
    averageDaily: {
      commits: totals.commits / dayCount,
      features: totals.features / dayCount,
      fixes: totals.fixes / dayCount,
    },
    dayCount,
  };
}

export const STATS = {
  tradescoutCommits: 64,
  mealscoutCommits: 18,
  featuresShipped: 16,
  fixesShipped: 11,
  lastUpdated: "Apr 20, 2026",
};
