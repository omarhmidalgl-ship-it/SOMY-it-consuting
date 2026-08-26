const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const where = projectId ? { projectId } : {};
    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, avatarColor: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  auth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("projectId").trim().notEmpty().withMessage("Project ID is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, projectId, assigneeId, status, dueDate } = req.body;
      const task = await prisma.task.create({
        data: {
          title,
          description,
          projectId,
          assigneeId: assigneeId || null,
          status: status || "backlog",
          dueDate: dueDate ? new Date(dueDate) : null,
        },
        include: {
          assignee: { select: { id: true, name: true, avatarColor: true } },
          project: { select: { id: true, name: true } },
        },
      });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { title, description, projectId, assigneeId, status, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(projectId !== undefined && { projectId }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: {
        assignee: { select: { id: true, name: true, avatarColor: true } },
        project: { select: { id: true, name: true } },
      },
    });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
