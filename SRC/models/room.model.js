import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    status:{
        type: String,
        enum: ['available', 'Occupied'],
        default: 'available',
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    photo:{
        type: String,
    }
  },{timestamps: true}
)

export const Room = mongoose.model("Room", RoomSchema);