import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerAdmin = asyncHandler(async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new ApiError(500, "JWT secret is not defined");
    }

    const { email, fullName, password } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedAdmin = await Admin.findOne({email});

    if (existedAdmin) {
        throw new ApiError(409, "Admin with email already exists");
    }

    const admin = await Admin.create({
        fullName,
        email,
        password // Store hashed password
    });

    const adminId = admin._id;

    const token = jwt.sign(
        { adminId },
        JWT_SECRET,
        { expiresIn: '1d' }  // Optional: Set token expiration
    );

    return res.status(201).json(
        new ApiResponse(200, token, "✅ Admin registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET
    );

    return res.status(200).json(
        new ApiResponse(200, token, "Admin logged in successfully")
    );
});

export { registerAdmin, loginAdmin };
