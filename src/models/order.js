import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
  paypalOrderId: { type: String },
  paymentStatus: { type: String, default: "PENDING" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
