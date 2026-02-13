import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({
            email: process.env.ADMIN_EMAIL,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const password = process.env.ADMIN_PASSWORD;

        if (!password) {
            throw new Error("ADMIN_PASSWORD missing");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Admin.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");
        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
