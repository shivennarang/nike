const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User", // References the User model
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
      required: true,
      ref: "Product", // References the Product model
    },
    price: {
      type: Number,
      required: true, // Price of the product at the time it's added to the cart
    },
    quantity: {
      type: Number,
      default: 1, // Default quantity is 1
    },
  },
  { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields
);

// Ensure there is no unique index on userId and productId
cartSchema.index({ userId: 1, productId: 1 }, { unique: false });

module.exports = mongoose.model("Cart", cartSchema);
