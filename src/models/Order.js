import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerName: String,
        customerEmail: String,
        phone: String,
        address: String,

        items: [
            {
                productId: String,
                name: String,
                price: Number,
                quantity: Number,
            },
        ],

        totalAmount: Number,

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            default: "pending",
        },

    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
