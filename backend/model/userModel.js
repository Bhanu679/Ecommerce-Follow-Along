const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the cart item schema
const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String }
});

// Define the address schema
const addressSchema = new mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    zipCode: { type: String, required: true },
    addressType: { type: String, enum: ["Home", "Work", "Other"], default: "Home" }
});

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    addresses: { type: [addressSchema], default: [] },
    avatar: { type: String, default: "" },  // ✅ Removed `public_id`, now only stores URL
    createdAt: { type: Date, default: Date.now }
  });
  
  

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // Only hash if password is new/modified
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES });
};

// Create the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;