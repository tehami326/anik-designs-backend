import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    images: [String],
    description: String,
    sizes: [String],
    colors: [String],
    inStock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
