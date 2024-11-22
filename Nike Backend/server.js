const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cors = require("cors");
const userRoutes = require("./routes/user"); // Adjust the path if necessary
const categoryRoutes = require("./routes/categoryRoutes"); // Adjust the path if necessary
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cookieParser = require("cookie-parser");
const authr = require("./routes/authRoutes");
const Category = require("./models/Category"); // Import the Category model
const Product = require("./models/Product"); // Import the Product model
const multer = require("multer"); // Import multer for handling file uploads
const fs = require("fs"); // Import fs for file system operations
const Cart = require("./models/Cart"); // Import the Cart model
const jwt = require("jsonwebtoken"); // Import jwt
const Like = require("./models/Like"); // Ensure the Like model is correctly imported
const Transaction = require("./models/Transaction"); // Import the Transaction model correctly

// Load environment variables
dotenv.config();

// Initialize app and database
const app = express();
connectDatabase();
// Enable CORS for all origins and methods
const corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
// Use the product routes
app.use("/admin", productRoutes);

app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
// Routes
app.use("/api/auth", authr); // Use auth routes

app.use(cookieParser());
// Use the category routes
app.use("/admin", categoryRoutes); // Use the category routes under /admin

// Ensure the uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Route to get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have men set to true
app.get("/products/men", async (req, res) => {
  try {
    const categories = await Category.find({ men: true });
    const categoryIds = categories.map(category => category._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } }).populate("categoryId");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching men's products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have women set to true
app.get("/products/women", async (req, res) => {
  try {
    const categories = await Category.find({ women: true });
    const categoryIds = categories.map(category => category._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } }).populate("categoryId");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching women's products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get products with categories that have kid set to true
app.get("/products/kids", async (req, res) => {
  try {
    const categories = await Category.find({ kid: true });
    const categoryIds = categories.map(category => category._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } }).populate("categoryId");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching kids' products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get the first 5 products
app.get("/products/new-arrivals", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get a single product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get a single product by ID
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoryId");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to add a new product
app.post("/admin/create/product", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body
    console.log("File:", req.file); // Log the uploaded file
    const newProduct = new Product({
      ...req.body,
      image: req.file.path.replace(/\\/g, "/"), // Save the file path in the database
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ product: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error); // Log the error
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to update a product
app.put("/admin/update/product/:id", upload.single("image"), async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Product ID:", productId); // Log the product ID
    console.log("Request body:", req.body); // Log the request body
    console.log("File:", req.file); // Log the uploaded file

    const updatedData = {
      ...req.body,
      image: req.file ? req.file.path.replace(/\\/g, "/") : req.body.image, // Update the image if a new file is uploaded
    };

    console.log("Updated data:", updatedData); // Log the updated data

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error); // Log the error
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to add a product to the cart
app.post("/cart/add/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id; // Ensure the user ID is correctly extracted from the token

  console.log("User ID:", userId); // Debugging: Log user ID
  console.log("Product ID:", productId); // Debugging: Log product ID

  if (!userId || !productId) {
    return res.status(400).json({ message: "Product ID and user ID are required." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new cart entry without checking for existing entries
    const newCart = new Cart({
      userId,
      productId,
      price: product.price, // Store the product price from the fetched product details
    });
    await newCart.save();
    console.log("New cart entry created:", newCart); // Log the new cart entry
    return res.status(201).json(newCart);
  } catch (error) {
    console.error("Error adding product to cart:", error); // Log the error
    return res.status(500).json({
      message: "Failed to add product to cart.",
      error: error.message,
    });
  }
});

// Route to remove a product from the cart
app.post("/cart/remove", verifyToken, async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Product ID and user ID are required." });
  }

  try {
    const cart = await Cart.findOneAndDelete({ userId, productId });

    if (!cart) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

// Route to get all items in the cart
app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.id; // Ensure the user ID is correctly extracted from the token

  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    res.status(200).json({ products: cartItems, totalPrice });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Failed to fetch cart items.",
      error: error.message,
    });
  }
});

// Route to clear the cart after a successful transaction
app.post("/cart/clear", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
});

// Route to add a product to likes
app.post("/likes/add", verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Product ID and user ID are required." });
  }

  try {
    const likedProduct = await Like.findOne({ userId, productId });

    if (likedProduct) {
      return res.status(400).json({ message: "Product already liked" });
    } else {
      const newLike = await Like.create({ userId, productId });
      return res.status(201).json(newLike);
    }
  } catch (error) {
    console.error("Error adding product to likes:", error);
    return res.status(500).json({
      message: "Failed to add product to likes.",
      error: error.message,
    });
  }
});

// Route to remove a product from likes
app.post("/likes/remove", verifyToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Product ID and user ID are required." });
  }

  try {
    const likedProduct = await Like.findOneAndDelete({ userId, productId });

    if (!likedProduct) {
      return res.status(404).json({ message: "Product not found in likes" });
    }

    return res.status(200).json({ message: "Product removed from likes" });
  } catch (error) {
    console.error("Error removing product from likes:", error);
    return res.status(500).json({
      message: "Failed to remove product from likes.",
      error: error.message,
    });
  }
});

// Route to get all liked products for a user
app.get("/likes/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const likedProducts = await Like.find({ userId }).populate("productId");
    res.status(200).json({ likedProducts });
  } catch (error) {
    console.error("Error fetching liked products:", error);
    res.status(500).json({
      message: "Failed to fetch liked products.",
      error: error.message,
    });
  }
});

// Route to get all liked products for a user
app.get("/likes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const likedProducts = await Like.find({ userId }).populate("productId");
    res.status(200).json({ likedProducts });
  } catch (error) {
    console.error("Error fetching liked products:", error);
    res.status(500).json({
      message: "Failed to fetch liked products.",
      error: error.message,
    });
  }
});

// Route to handle transaction history
app.post("/transaction", verifyToken, async (req, res) => {
  const { products, totalPrice } = req.body;
  const userId = req.user.id;

  try {
    const newTransaction = new Transaction({
      userId,
      products,
      totalPrice,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({
      message: "Failed to save transaction.",
      error: error.message,
    });
  }
});

// Route to get transaction history for a user
app.get("/transaction/history", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await Transaction.find({ userId }).populate("products.productId");
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({
      message: "Failed to fetch transaction history.",
      error: error.message,
    });
  }
});

app.get("/someRoute", (req, res) => {
  console.log(req); // This should log the cookies object
  res.send("Cookies logged");
});

// Error handling and server setup
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
