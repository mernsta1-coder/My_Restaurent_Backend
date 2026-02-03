import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
} from "../controller/cart.js";

import { authenticateToken } from "../middleware/user.js";

const router = express.Router();

router.post("/add", authenticateToken, addToCart);
router.get("/get", authenticateToken, getCart);
router.delete("/:productId", authenticateToken, removeFromCart);
router.put("/update", authenticateToken, updateQuantity);

export default router;
