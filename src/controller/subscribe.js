import nodemailer from "nodemailer";

export const subscribeUser = async (req, res) => {
  try {
    const { email } = req.body;
console.log(req.body,"====")
    // validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // send email
    await transporter.sendMail({
      from: `"Newsletter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Newsletter Subscription 🎉",
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>You’ll now receive the latest updates.</p>
      `,
    });

    // response to frontend
    res.status(200).json({
      success: true,
      message: "Subscribed successfully. Check your email!",
    });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Email sending failed" });
  }
};
