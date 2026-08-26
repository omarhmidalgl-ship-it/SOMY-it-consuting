const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

const parsePlatforms = (p) => {
  if (Array.isArray(p)) return JSON.stringify(p);
  if (typeof p === "string") return p;
  return "[]";
};

router.get("/", auth, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: { owner: { select: { id: true, name: true, avatarColor: true } }, _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    });
    const result = projects.map((p) => ({ ...p, platforms: JSON.parse(p.platforms || "[]") }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, avatarColor: true } },
        tasks: { include: { assignee: { select: { id: true, name: true, avatarColor: true } } } },
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({ ...project, platforms: JSON.parse(project.platforms || "[]") });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  auth,
  [
    body("name").trim().notEmpty().withMessage("Project name is required"),
    body("platforms").isArray({ min: 1 }).withMessage("At least one platform is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, clientName, status, platforms } = req.body;
      const project = await prisma.project.create({
        data: {
          name,
          clientName,
          status: status || "lead",
          platforms: parsePlatforms(platforms),
          ownerId: req.user.id,
        },
        include: { owner: { select: { id: true, name: true, avatarColor: true } } },
      });
      res.status(201).json({ ...project, platforms: JSON.parse(project.platforms || "[]") });
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { name, clientName, status, platforms, ownerId } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(clientName !== undefined && { clientName }),
        ...(status !== undefined && { status }),
        ...(platforms !== undefined && { platforms: parsePlatforms(platforms) }),
        ...(ownerId !== undefined && { ownerId }),
      },
      include: { owner: { select: { id: true, name: true, avatarColor: true } } },
    });
    res.json({ ...project, platforms: JSON.parse(project.platforms || "[]") });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
