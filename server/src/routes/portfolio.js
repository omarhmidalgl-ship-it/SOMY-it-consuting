const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items.map((i) => ({ ...i, techStack: JSON.parse(i.techStack || "[]") })));
  } catch (err) { next(err); }
});

router.get("/featured", async (req, res, next) => {
  try {
    const items = await prisma.portfolioItem.findMany({ where: { featured: true }, orderBy: { createdAt: "desc" } });
    res.json(items.map((i) => ({ ...i, techStack: JSON.parse(i.techStack || "[]") })));
  } catch (err) { next(err); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { slug: req.params.slug } });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ...item, techStack: JSON.parse(item.techStack || "[]") });
  } catch (err) { next(err); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, slug, description, client, techStack, imageUrl, liveUrl, featured } = req.body;
    const item = await prisma.portfolioItem.create({
      data: { title, slug, description, client, techStack: JSON.stringify(techStack || []), imageUrl, liveUrl, featured: featured || false },
    });
    res.status(201).json({ ...item, techStack: JSON.parse(item.techStack) });
  } catch (err) { next(err); }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { title, description, client, techStack, imageUrl, liveUrl, featured } = req.body;
    const item = await prisma.portfolioItem.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(client !== undefined && { client }),
        ...(techStack !== undefined && { techStack: JSON.stringify(techStack) }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(featured !== undefined && { featured }),
      },
    });
    res.json({ ...item, techStack: JSON.parse(item.techStack) });
  } catch (err) { next(err); }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.portfolioItem.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
