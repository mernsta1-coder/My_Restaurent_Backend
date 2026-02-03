import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Load JWT secret from env
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // set a strong secret in .env

////////////// User Registration //////////////
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token for the new user
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" } // token expires in 7 days
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (err) {
        console.log("Error in registration API:", err);
        return res.status(500).json({ success: false, message: "Error in registration" });
    }
}

//////////////// Login User ///////////////////
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingUser._id, email: existingUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        console.log("Error in login API:", err);
        return res.status(500).json({ success: false, message: "Error in login" });
    }
}




////////////////// GET /profile - protected route ///////////////////
export const getProfile = async (req, res) => {
    try {
        // req.user is set by authenticateToken middleware
        const user = await User.findById(req.user.id).select('-password'); // exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        console.log("Error in getProfile API:", err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

