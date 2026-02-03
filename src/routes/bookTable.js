import express from "express";
import {
  createBooking,
  getAllBookings,
  deleteBooking,
} from "../controller/bookTable.js";

import { validateBooking } from "../middleware/bookingTable.js";

const router = express.Router();

router.post("/book", validateBooking, createBooking);
router.get("/all", getAllBookings);
router.delete("/:id", deleteBooking);

export default router;
