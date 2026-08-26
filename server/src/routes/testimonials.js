const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { name, company, message, avatarUrl, rating } = req.body;
    const item = await prisma.testimonial.create({
      data: { name, company, message, avatarUrl, rating: rating || 5 },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
