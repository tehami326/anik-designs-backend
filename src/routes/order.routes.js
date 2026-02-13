import express from "express";
import { createOrder, getOrders, updateOrderStatus, getOrderById } from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createOrder);              // public
router.get("/", authMiddleware, getOrders); // admin
router.get("/:id", getOrderById);
router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;
