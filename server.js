import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutrs.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnv = ["PORT", "DEV_MODE", "MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(`Missing environment variables: ${missingEnv.join(", ")}`.bgRed.white);
  process.exit(1); // Stop server if env vars are missing
}

console.log("Loaded environment variables:".bgGreen.white);
console.log(`PORT: ${process.env.PORT}`);
console.log(`DEV_MODE: ${process.env.DEV_MODE}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? "Loaded" : "Not Loaded"}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? "Loaded" : "Not Loaded"}`);

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// Middleware
app.use(cors({
  origin: "https://ecommerce-app-ovpk.onrender.com",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Ecommerce App Backend</h1>");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
