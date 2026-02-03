export const validateBooking = (req, res, next) => {
  const { fullName, email, date, time, guests } = req.body;

  if (!fullName || !email || !date || !time || !guests) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be filled",
    });
  }

  next();
};
