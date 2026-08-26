const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const AVATAR_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

router.post("/google", async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: user.googleId || googleId,
          authProvider: user.authProvider === "local" ? "local" : "google",
          name: user.name || name,
          avatarColor: user.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          authProvider: "google",
          role: "member",
          avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        },
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: user.avatarColor,
      },
      token,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    next(err);
  }
});

module.exports = router;
