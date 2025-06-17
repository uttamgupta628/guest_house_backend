import {Room} from "../models/room.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apirespone.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";  

const createRoom = asyncHandler(async (req, res) => {
  const { roomNumber, roomType, pricePerNight, amenities } = req.body;

  if (!roomNumber || !roomType || !pricePerNight) {
    throw new ApiError(400, "Room number, type, and price per night are required.");
  }

  let photoUrl = null;
  if (req.file) {
    try {
      photoUrl = await uploadToCloudinary(req.file.buffer);
    } catch (error) {
        console.log(error)
      throw new ApiError(500, "Failed to upload room photo.");
    }
  }

  // Create new room
  const newRoom = new Room({
    roomNumber,
    roomType,
    pricePerNight,
    amenities: amenities ? amenities.split(',') : [],
    photo: photoUrl
  });

  await newRoom.save();

  res.status(201).json(new ApiResponse(201, newRoom, "Room created successfully"));
});

const getallRoom=asyncHandler(async(req,res)=>{
    const allroom=await Room.find();
    return res.status(200).json(new ApiResponse(200,allroom,"all the room are retrive"))
})

export { createRoom , getallRoom};
