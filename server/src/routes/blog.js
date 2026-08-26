const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      include: { author: { select: { id: true, name: true, avatarColor: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (err) { next(err); }
});

router.get("/all", auth, async (req, res, next) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { author: { select: { id: true, name: true, avatarColor: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (err) { next(err); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { id: true, name: true, avatarColor: true } } },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) { next(err); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, coverImage, published } = req.body;
    const post = await prisma.blogPost.create({
      data: { title, slug, excerpt, content, coverImage, authorId: req.user.id, published: published || false },
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, published } = req.body;
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
      },
    });
    res.json(post);
  } catch (err) { next(err); }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
