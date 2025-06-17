import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apirespone.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";



const register = asyncHandler(async (req, res) => {
    const { name, username, email, phoneNumber, password, country } = req.body;

    if(!name || !username || !email || !phoneNumber || !password || !country) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const findUser = await User.findOne({ $or : [{username} , {email}] });
    if (findUser) throw new ApiError(408, "User already registered");

    // Create new user
    const user = await User.create({
        name,
        username,
        email,
        phoneNumber,
        password,
        country
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) throw new ApiError(401, "Something went wrong");

    

    return res.status(200).json(new ApiResponse(200, createdUser, "Registered successfully."));
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "all the field are required");
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(401, "Invalid username or password");
    }

    // Check password
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid username or password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();


    // Response
    return res.status(200).json(
        new ApiResponse(200, {
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                country: user.country,
                phoneNumber: user.phoneNumber
            },
            accessToken,
            refreshToken
        }, "Login successful.")
    );
});



export { register, login };
