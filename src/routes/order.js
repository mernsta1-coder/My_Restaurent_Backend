import express from "express";
import { createPayPalOrder, capturePayPalOrder } from "../controller/order.js";

const router = express.Router();

router.post("/create", createPayPalOrder);
router.post("/capture", capturePayPalOrder);

export default router;
