import express from "express";
import {
  sendMessage,
  getAllMessages,
  deleteMessage,
} from "../controller/contact.js";

import { validateContact } from "../middleware/contact.js";

const router = express.Router();

router.post("/contact", validateContact, sendMessage);
router.get("/get/contact", getAllMessages);
router.delete("/contact/:id", deleteMessage);

export default router;
