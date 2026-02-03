import fetch from "node-fetch";
import Order from "../models/order.js";
import { getPayPalAccessToken } from "../middleware/order.js";

/** CREATE PAYPAL ORDER */
export const createPayPalOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // 1️⃣ Save order in DB
    const order = await Order.create({ items, totalAmount });

    // 2️⃣ Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // 3️⃣ Create order in PayPal
    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",               // MUST match sandbox accounts
              value: totalAmount.toFixed(2).toString()  // Convert to string
            },
          },
        ],
        application_context: {
          brand_name: "My Restaurant",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: "http://localhost:5000/api/order/capture",
          cancel_url: "http://localhost:5000/api/order/cancel"
        }
      })
    });

    const paypalData = await response.json();
    console.log("PAYPAL CREATE RESPONSE:", JSON.stringify(paypalData, null, 2));

    // 4️⃣ Check for links to avoid undefined error
    if (!paypalData.links || paypalData.links.length === 0) {
      return res.status(400).json({ success: false, message: "PayPal order creation failed", paypalData });
    }

    const approveLink = paypalData.links.find(l => l.rel === "approve")?.href;

    order.paypalOrderId = paypalData.id;
    await order.save();

    res.json({
      orderId: order._id,
      paypalOrderId: paypalData.id,
      approveLink
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/** CAPTURE PAYPAL ORDER */
export const capturePayPalOrder = async (req, res) => {
  try {
    const { paypalOrderId } = req.body;

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("PAYPAL CAPTURE RESPONSE:", JSON.stringify(data, null, 2));

    const isCompleted =
      data.status === "COMPLETED" ||
      data.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";

    if (isCompleted) {
      await Order.findOneAndUpdate({ paypalOrderId }, { paymentStatus: "PAID" });
      return res.json({ success: true, message: "Payment successful" });
    }

    res.status(400).json({ success: false, paypalStatus: data.status, paypalResponse: data });

  } catch (err) {
    console.error("CAPTURE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
