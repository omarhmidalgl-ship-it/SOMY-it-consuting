const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatarColor: true },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
