const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    res.json(leads);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { status } = req.body;
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
