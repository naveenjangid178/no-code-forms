import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new ApiError(500, "JWT secret is not defined");
    }

    const { email, fullName, password } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({email});

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password // Store hashed password
    });

    const userId = user._id;

    const token = jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '1d' }  // Optional: Set token expiration
    );

    return res.status(201).json(
        new ApiResponse(200, token, "✅ User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET
    );

    return res.status(200).json(
        new ApiResponse(200, token, "User logged in successfully")
    );
});

export { registerUser, loginUser };
