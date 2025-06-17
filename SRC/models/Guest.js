import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  FirstName: { type: String, required: true },
  LastName:  { type: String, required: true },
  Email:     { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Id_proof:  { type: String }
});

export const Guest=mongoose.model('Guest',GuestSchema)