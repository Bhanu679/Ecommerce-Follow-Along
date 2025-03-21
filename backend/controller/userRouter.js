const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const authenticate = require('../middleware/auth');
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY || "fallback_secret"
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { userId: user._id, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add Address to User Profile
router.post('/add-address', authenticate, async (req, res) => {
  try {
    console.log("🔹 Address Request Received:", req.body);
    console.log("🔹 User ID:", req.user._id);

    const { country, city, address1, address2, zipCode, addressType } = req.body;

    if (!country || !city || !address1 || !zipCode) {
      return res.status(400).json({ message: "All required fields must be filled!" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ User Not Found!");
      return res.status(404).json({ message: "User not found!" });
    }

    if (!Array.isArray(user.addresses)) {
      user.addresses = [];
    }

    user.addresses.push({ country, city, address1, address2, zipCode, addressType });

    await user.save();
    console.log("✅ Address Added Successfully!", user.addresses);

    res.status(200).json({ message: "Address added successfully!", user });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// Update Profile
router.put('/update-profile', authenticate, async (req, res) => {
  try {
    const { name, phone, avatar, addresses } = req.body;

    const updateData = {
      name,
      phone,
      addresses,
      avatar: avatar || ""  // ✅ Store avatar as a simple URL string
    };

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});






// Endpoint for uploading avatar
router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;