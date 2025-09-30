import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  createOrderController,
  getOrdersController,
  updateOrderController,
} from "../controllers/authController.js";

import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

// Test route for admins only
router.get("/test", requireSignIn, isAdmin, testController);

// Protected user route: any authenticated user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).json({ success: true, ok: true });
});

// Protected admin route: only authenticated admin users
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ success: true, ok: true });
});

// Update profile
router.put("/profile", requireSignIn, updateProfileController);

// Orders
router.post("/orders", requireSignIn, createOrderController);
router.get("/all-orders", requireSignIn, isAdmin, getOrdersController);
router.put("/order-status/:orderId", requireSignIn, isAdmin, updateOrderController);

export default router;
