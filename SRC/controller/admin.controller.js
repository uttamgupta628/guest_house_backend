import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apirespone.js";
import { Room } from "../models/room.model.js";
import { Booking } from "../models/Booking.model.js";
import { Guest } from "../models/Guest.js";


// admin login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new ApiError(500, "Admin credentials not configured");
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json(
    new ApiResponse(200, { token }, "Admin logged in successfully")
  );
});


// update room
export const updateRoomDetails = asyncHandler(async (req, res) => {
  const roomId = req.params.id;

  const updateData = { ...req.body };

  if (req.file) {
    updateData.photo = req.file.path;
  }

  console.log("Update Data Received:", updateData);

  const room = await Room.findByIdAndUpdate(
    roomId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  console.log("Updated Room Details:", room);

  res.status(200).json(
    new ApiResponse(200, room, "Room details updated successfully")
  );
});


// delete room
export const deleteRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.id;

  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  await room.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Room deleted successfully")
  );
});


//update booking
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required.");
  }

  // Allowed status list (optional validation)
  const allowedStatuses = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
  }

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  // Update booking status
  booking.status = status;
  await booking.save();

  // Find the related room
  const room = await Room.findById(booking.room);
  if (!room) {
    throw new ApiError(404, "Room not found.");
  }

  // Update room status based on booking status
  if (status === "checked-out" || status === "cancelled") {
    room.status = "available";
  } else {
    room.status = "Occupied";
  }

  await room.save();

  res.status(200).json(
    new ApiResponse(200, { booking, room }, "Booking status and room status updated successfully.")
  );
});



// delete booking
export const deleteBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  // Find booking by ID
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  // Delete all guests associated with this booking
  await Guest.deleteMany({ _id: { $in: booking.guests } });

  // Also update the related room status to 'available'
  const room = await Room.findById(booking.room);
  if (room) {
    room.status = "available";
    await room.save();
  }

  // Delete the booking itself
  await booking.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, "Booking and associated guests deleted successfully.")
  );
});
