require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");

const authRoutes = require("./routes/auth");
const authGoogleRoutes = require("./routes/authGoogle");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");
const contactRoutes = require("./routes/contact");
const leadRoutes = require("./routes/leads");
const teamRoutes = require("./routes/team");
const portfolioRoutes = require("./routes/portfolio");
const testimonialRoutes = require("./routes/testimonials");
const blogRoutes = require("./routes/blog");

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth", authGoogleRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/blog", blogRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SOMY API running on http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
