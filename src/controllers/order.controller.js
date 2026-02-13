import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";

// ======================================
// 🔹 CREATE ORDER (Public)
// ======================================
export const createOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            phone,
            address,
            items,
            totalAmount,
        } = req.body;

        // 🔒 Basic validation
        if (
            !customerName ||
            !customerEmail ||
            !phone ||
            !address ||
            !items ||
            !totalAmount
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // ✅ 1️⃣ SAVE ORDER FIRST (Most Important)
        const order = await Order.create({
            customerName,
            customerEmail,
            phone,
            address,
            items,
            totalAmount,
            status: "pending",
        });

        // =========================================
        // 📧 SEND EMAILS (SAFE — won't break order)
        // =========================================
        try {
            // Admin Email
            await sendEmail({
                to: "anikdesigns342@gmail.com",
                subject: "New Order – Anik Design",
                html: `
                <h2>🧵 New Order Received</h2>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
                <p><strong>Total:</strong> ₹${order.totalAmount}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                `,
            });

            // Customer Email
            await sendEmail({
                to: order.customerEmail,
                subject: "Order Confirmation – Anik Design",
                html: `
                <h2>Thank you for your order 🌸</h2>
                <p>Hi <strong>${order.customerName}</strong>,</p>
                <p>Your order has been placed successfully.</p>
                <p><strong>Total:</strong> ₹${order.totalAmount}</p>
                <p>Status: ${order.status}</p>
                `,
            });

        } catch (emailError) {
            console.error("Email failed:", emailError.message);
        }

        // =========================================
        // 📲 WHATSAPP MESSAGE (ALWAYS GENERATED)
        // =========================================
        const whatsappMessage = `
🧵 New Order – Anik Design

Name: ${order.customerName}
Phone: ${order.phone}
Email: ${order.customerEmail}

Address:
${order.address}

Total: ₹${order.totalAmount}
Status: ${order.status}
`;

        const encodedMessage = encodeURIComponent(whatsappMessage);

        const whatsappLinks = [
            `https://wa.me/918800621770?text=${encodedMessage}`,
            `https://wa.me/919350005010?text=${encodedMessage}`,
        ];

        // ✅ Final Success Response
        res.status(201).json({
            message: "Order placed successfully",
            order,
            whatsappLinks,
        });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({
            message: "Failed to place order",
            error: error.message,
        });
    }
};

// ======================================
// 🔐 GET ALL ORDERS (Admin)
// ======================================
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ======================================
// 🔐 GET ORDER BY ID
// ======================================
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ======================================
// 🔐 UPDATE ORDER STATUS (Admin)
// ======================================
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
