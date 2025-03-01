require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const connectDatabase = require("./db/database");
const ErrorHandler = require("./middleware/error");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Serve static files from 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRoutes = require("./User/userRouter");
const productRoutes = require("./Products/productRouter");
app.use("/user", userRoutes);
app.use("/products", productRoutes);

// Error Handling Middleware
app.use(ErrorHandler);

// Connect to MongoDB
connectDatabase();

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
