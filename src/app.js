import express from "express";
import cors from "cors";

import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cloudinaryRoutes from "./routes/cloudinary.routes.js";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);



export default app;
