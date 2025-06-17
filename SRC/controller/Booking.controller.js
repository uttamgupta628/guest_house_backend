import { asyncHandler } from "../utils/asynchandler.js";
import { Room } from "../models/room.model.js";
import { Booking } from "../models/Booking.model.js";
import { Guest } from "../models/Guest.js";
import { ApiResponse } from "../utils/apirespone.js";
import { ApiError } from "../utils/apierror.js";

//  Create booking with guest creation
export const createBooking = asyncHandler(async (req, res) => {
  const { guests, room, checkIn, checkOut, amount } = req.body;

  if (!guests || !Array.isArray(guests) || guests.length === 0) {
    throw new ApiError(400, "At least one guest is required.");
  }

  if (!room || !checkIn || !checkOut || !amount) {
    throw new ApiError(400, "Room, dates, and amount are required.");
  }

  // Check room availability
  const selectedRoom = await Room.findById(room);
  if (!selectedRoom) {
    throw new ApiError(404, "Room not found.");
  }

  if (!selectedRoom.status==="Occupied") {
    throw new ApiError(400, "Room is not available.");
  }

  // Save each guest linked to user
  const savedGuests = await Promise.all(
    guests.map(async (guest) => {
      const { FirstName, LastName, Email, PhoneNumber, Id_proof } = guest;
      if (!FirstName || !LastName || !Email || !PhoneNumber) {
        throw new ApiError(400, "All guest fields are required.");
      }
      const createdGuest = await Guest.create({
        user: req.user.userId,
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Id_proof,
      });
      return createdGuest._id;
    })
  );

  // Create booking with user ID and guests
  const booking = await Booking.create({
    user: req.user.userId,
    guests: savedGuests,
    room,
    checkIn,
    checkOut,
    numberOfGuests: guests.length,
    amount,
  });

  // Mark room as unavailable
  selectedRoom.isAvailable = false;
  await selectedRoom.save();

  res.status(201).json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getBookingsForUser = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.userId })
    .populate("guests") 
    .populate("room")
    .populate("user", "name email phoneNumber")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});
