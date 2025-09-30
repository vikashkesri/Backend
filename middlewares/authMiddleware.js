import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Middleware to check JWT token
export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT middleware error:", error.message);
    return res.status(500).json({ success: false, message: "Server error in authentication" });
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Role check: 1 = admin
    if (user.role !== 1) {
      return res.status(403).json({ success: false, message: "Unauthorized access - Admin only" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    return res.status(500).json({ success: false, message: "Server error in admin check" });
  }
};
