import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    }
}, {timestamps: true});

// Password Hashing before saving the user
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    console.log("Before Hashing:", this.password);  // Log plain password
    this.password = await bcrypt.hash(this.password, 12);
    console.log("After Hashing:", this.password);   // Log hashed password

    next();
});

// Method to compare password during login
userSchema.methods.isPasswordCorrect = async function(password) {
    console.log("Input Password:", password); // Log input password
    console.log("Stored Hashed Password:", this.password); // Log stored hash

    return await bcrypt.compare(password, this.password); // Check if password matches the hash
};

export const User = mongoose.model("User", userSchema);
