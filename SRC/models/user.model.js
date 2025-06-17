import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            default: 0, 
        },
        password: {
            type: String,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

// Password Hashing Middleware
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare Passwords
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            userId: this._id, 
            username: this.username,
        },
        process.env.ACCESS_SECRET_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            userId: this._id, 
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};


export const User = mongoose.model("User", UserSchema);
