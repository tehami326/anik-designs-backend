import express from "express";
import {
    getProducts,
    getProductsByCategory,
    getProductBySlug,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);



// ADMIN ROUTES (PROTECTED)
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
