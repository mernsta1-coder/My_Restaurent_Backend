import Booking from "../models/bookTable.js";

// CREATE BOOKING
export const createBooking = async (req, res) => {
  try {
    const { fullName, email, date, time, guests, specialRequest } = req.body;

    const booking = await Booking.create({
      fullName,
      email,
      date,
      time,
      guests,
      specialRequest,
    });

    res.status(201).json({
      success: true,
      message: "Table booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BOOKINGS (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
