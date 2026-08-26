const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, passwordHash, role: "member" },
        select: { id: true, name: true, email: true, role: true, avatarColor: true },
      });

      const token = signToken(user.id);
      res.status(201).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = signToken(user.id);
      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarColor: user.avatarColor },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
