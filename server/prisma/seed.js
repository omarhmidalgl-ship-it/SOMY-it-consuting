const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const bcrypt = require("bcryptjs");

  // --- Users ---
  const partners = [
    { name: "Partner 1", email: "partner1@somy.dev", password: "somy2024", avatarColor: "#6366f1" },
    { name: "Partner 2", email: "partner2@somy.dev", password: "somy2024", avatarColor: "#f59e0b" },
    { name: "Partner 3", email: "partner3@somy.dev", password: "somy2024", avatarColor: "#10b981" },
    { name: "Partner 4", email: "partner4@somy.dev", password: "somy2024", avatarColor: "#ef4444" },
  ];

  for (const p of partners) {
    const hash = await bcrypt.hash(p.password, 12);
    await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { name: p.name, email: p.email, passwordHash: hash, role: "admin", avatarColor: p.avatarColor },
    });
  }

  // --- Portfolio ---
  const portfolioData = [
    {
      title: "NexaShop",
      slug: "nexashop",
      description: "A full-stack e-commerce platform with real-time inventory management, multi-vendor support, and a custom checkout flow. Built for a retail client scaling from 500 to 50k daily orders.",
      client: "Nexa Retail Ltd.",
      techStack: JSON.stringify(["React", "Node.js", "PostgreSQL", "Redis", "Stripe"]),
      imageUrl: null,
      liveUrl: "https://nexashop.example.com",
      featured: true,
    },
    {
      title: "MediTrack",
      slug: "meditrack",
      description: "Cross-platform mobile app for patient appointment scheduling, prescription tracking, and doctor-patient messaging. Reduced no-show rates by 40% within 3 months.",
      client: "MediCare Clinic",
      techStack: JSON.stringify(["React Native", "Express", "MongoDB", "Firebase"]),
      imageUrl: null,
      liveUrl: null,
      featured: true,
    },
    {
      title: " FleetPulse",
      slug: "fleetpulse",
      description: "Desktop application for fleet management — real-time GPS tracking, fuel analytics, and driver scorecards. Handles 2,000+ vehicles across 3 countries.",
      client: "TransLogistics GmbH",
      techStack: JSON.stringify(["Electron", "TypeScript", "PostgreSQL", "MapboxGL"]),
      imageUrl: null,
      liveUrl: null,
      featured: true,
    },
    {
      title: "EduVerse",
      slug: "eduverse",
      description: "Learning management system with live video classes, quizzes, progress tracking, and certificate generation. Serves 10k+ active students.",
      client: "EduVerse Academy",
      techStack: JSON.stringify(["Next.js", "Prisma", "PostgreSQL", "WebRTC", "Tailwind"]),
      imageUrl: null,
      liveUrl: "https://eduverse.example.com",
      featured: false,
    },
    {
      title: "FoodieBox",
      slug: "foodiebox",
      description: "Meal-kit subscription app with weekly menu selection, delivery scheduling, and nutritional tracking. Achieved 25% month-over-month growth in first quarter.",
      client: "FoodieBox Inc.",
      techStack: JSON.stringify(["Flutter", "Django", "PostgreSQL", "AWS"]),
      imageUrl: null,
      liveUrl: null,
      featured: false,
    },
  ];

  for (const item of portfolioData) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  // --- Testimonials ---
  const testimonialData = [
    { name: "Sarah Chen", company: "Nexa Retail Ltd.", message: "SOMY delivered our e-commerce platform 2 weeks ahead of schedule. Their team understood our vision from day one and the result exceeded expectations. Direct communication with the builders made all the difference.", rating: 5 },
    { name: "Dr. Marco Rossi", company: "MediCare Clinic", message: "We needed a mobile app that doctors would actually enjoy using. SOMY nailed the UX and the technical execution. Our no-show rate dropped 40% in the first quarter after launch.", rating: 5 },
    { name: "Klaus Weber", company: "TransLogistics GmbH", message: "Managing 2,000 vehicles across 3 countries requires serious engineering. SOMY built a desktop app that our dispatchers love. Fast, reliable, and exactly what we asked for.", rating: 5 },
    { name: "Amina Belkadi", company: "EduVerse Academy", message: "SOMY helped us go from a spreadsheet-based system to a full LMS in 4 months. The live video classes and progress tracking features are used by 10,000+ students daily.", rating: 5 },
    { name: "James O'Brien", company: "FoodieBox Inc.", message: "What impressed me most was SOMY's range — they handled mobile, backend, and infrastructure without needing outside help. Our meal-kit app launched on time and scaled to thousands of subscribers.", rating: 4 },
  ];

  for (const t of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // --- Blog Posts ---
  const partner1 = await prisma.user.findUnique({ where: { email: "partner1@somy.dev" } });
  const blogData = [
    {
      title: "Why We Chose SQLite for Local Development",
      slug: "sqlite-for-local-dev",
      excerpt: "PostgreSQL in production, SQLite in dev — here's why this pattern saves us hours every week.",
      content: `When building SOMY's internal tools, we made a deliberate choice: use PostgreSQL in production but SQLite for local development.\n\n## Why SQLite?\n\nSQLite requires zero setup. No Docker, no server, no connection strings. A new team member can clone the repo, run \`prisma db push\`, and have a working database in seconds.\n\n## How It Works With Prisma\n\nPrisma makes this trivial. You swap one line in your \`.env\` file:\n\n\`\`\`\n# Production\nDATABASE_URL="postgresql://..."\n\n# Local\nDATABASE_URL="file:./dev.db"\n\`\`\`\n\nYour schema, queries, and migrations stay identical. SQLite handles UUIDs, JSON strings, and all the patterns we need.\n\n## The Trade-offs\n\nSQLite doesn't support arrays or enums natively. We work around this by storing JSON strings and using plain string columns with convention-based values. It's a small price for zero-config local development.\n\n## The Result\n\nOur team ships faster because nobody wastes time debugging database connection issues. When it's time to deploy, we switch to PostgreSQL — and it just works.`,
      authorId: partner1?.id,
      published: true,
    },
    {
      title: "3 Platforms, 1 Team: Our Cross-Platform Philosophy",
      slug: "cross-platform-philosophy",
      excerpt: "Web, mobile, desktop — most studios pick one. Here's why we build across all three.",
      content: `Most software studios specialize: a web shop, a mobile agency, a desktop team. SOMY does all three. Here's why.\n\n## The Problem With Silos\n\nClients rarely think in platforms. They think in problems: "I need my team to access this data on their phones, their laptops, and in the warehouse." When you split that across three vendors, you get three codebases, three maintenance cycles, and three bills.\n\n## Our Approach\n\nA team of four full-stack engineers means everyone can work across the stack. Need a React web app? Done. Need a React Native mobile companion? Same developer, same patterns. Need an Electron desktop tool? Same TypeScript, same API.\n\n## Real Example\n\nFor a logistics client, we built:\n- A **React** dashboard for dispatchers (web)\n- A **React Native** app for drivers (mobile)\n- An **Electron** kiosk app for warehouses (desktop)\n\nAll three talk to the same Express API. One backend, one database, one team maintaining it.\n\n## The Takeaway\n\nCross-platform isn't about using one framework for everything. It's about having a team that can pick the right tool and execute across all of them — without the overhead of coordinating between separate vendors.`,
      authorId: partner1?.id,
      published: true,
    },
    {
      title: "Building a Kanban Board That Actually Gets Used",
      slug: "kanban-board-that-gets-used",
      excerpt: "Most Kanban tools are over-engineered. Here's how we built a simple one that our team actually loves.",
      content: `We tried Jira, Trello, Linear, and Notion before building our own Kanban board. The problem wasn't features — it was friction.\n\n## What We Built\n\nA drag-and-drop board with four columns: Backlog, In Progress, Review, Done. Each task has a title, description, project link, assignee, and due date. That's it.\n\n## Key Design Decisions\n\n**No mandatory fields.** You can create a task with just a title. Everything else is optional. This means tasks get created instead of sitting in someone's head.\n\n**Drag and drop.** Moving a task from "In Progress" to "Review" is one gesture. No modal, no save button, no page reload.\n\n**Project context.** Every task is linked to a project. You can filter the board by project to focus on what matters.\n\n## The Tech\n\nReact with native HTML5 drag-and-drop API. No heavy library. The backend is Express + Prisma. Status changes are PATCH requests — optimistic updates make it feel instant.\n\n## Results\n\nOur team uses it daily because it's fast. Not because we forced ourselves to — because it's easier than not using it.`,
      authorId: partner1?.id,
      published: true,
    },
  ];

  for (const post of blogData) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seed complete: users, portfolio, testimonials, blog posts.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
