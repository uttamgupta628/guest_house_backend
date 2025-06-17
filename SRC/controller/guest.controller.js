import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apirespone.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Guest } from "../models/Guest.js";

// Add guest(s)
const addGuest = asyncHandler(async (req, res) => {
  const { FirstName, LastName, Email, PhoneNumber, Id_proof } = req.body;

  if (!FirstName || !LastName || !Email || !PhoneNumber) {
    throw new ApiError(400, "All fields are required.");
  }
  console.log(req.body)

  const guest = await Guest.create({
    user: req.user.userId,   
    FirstName,
    LastName,
    Email,
    PhoneNumber,
    Id_proof
  });

  return res.status(201).json(new ApiResponse(201, guest, "Guest added successfully"));
});

// Get all guests for the currently logged-in user
const getGuestsForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const guests = await Guest.find({ user: userId });

  if (!guests || guests.length === 0) {
    throw new ApiError(404, "No guests found for this user.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, guests, "Guests retrieved successfully"));
});

export { addGuest, getGuestsForUser };
