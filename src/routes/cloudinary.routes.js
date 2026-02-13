import express from "express";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ---------- Cloudinary Config ---------- */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------- Signed Upload Route ---------- */
router.post("/signature", (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request(
            { timestamp },
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error) {
        res.status(500).json({ message: "Signature generation failed" });
    }
});

export default router;
