const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");

const prisma = new PrismaClient();
const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, message } = req.body;
      const lead = await prisma.lead.create({
        data: { name, email, message },
      });

      res.status(201).json({ message: "Thank you! We'll be in touch soon.", lead });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
