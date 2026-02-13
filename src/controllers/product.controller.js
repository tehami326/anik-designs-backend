import Product from "../models/product.model.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 8
        } = req.query;

        const query = {};

        // 🔎 Search by name
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // 📂 Filter by category
        if (category) {
            query.category = category;
        }

        // 💰 Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 📊 Sorting
        let sortOption = {};
        if (sort === "price-asc") sortOption.price = 1;
        if (sort === "price-desc") sortOption.price = -1;
        if (sort === "newest") sortOption.createdAt = -1;

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET BY CATEGORY
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await Product.find({
            category: category.toLowerCase(),
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch category products" });
    }
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({ slug });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};


// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: "Product creation failed" });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "Update failed" });
    }
};



// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(400).json({ message: "Delete failed" });
    }
};

// 🔍 SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ message: "Search query required" });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

