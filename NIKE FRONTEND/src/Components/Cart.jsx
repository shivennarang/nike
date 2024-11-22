import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import shoe1 from "../assets/NewArrival_shoe1.png"; // Example image

const Cart = () => {
  const [cart, setCart] = useState(null); // State to hold cart data
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch cart data from the backend on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token"); // Ensure the JWT token is stored in localStorage

        if (!token) {
          alert("User not authenticated. Please log in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/cart",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
            },
          }
        );
        setCart(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  if (!cart) {
    return <div>Loading...</div>; // Show loading if cart is not yet fetched
  }

  const { products = [], totalPrice = 0 } = cart; // Ensure products and totalPrice are defined

  // Calculate the total for each product and overall cart
  const deliveryFee = 750;
  const total = totalPrice + deliveryFee - discount;

  const handleQuantityChange = (index, change) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = Math.max(
      1,
      updatedProducts[index].quantity + change
    );
    setCart({ ...cart, products: updatedProducts });
  };

  const handleApplyCoupon = () => {
    if (coupon === "DISCOUNT10") {
      setDiscount(259); // Example: 10% discount
    } else {
      alert("Invalid Coupon");
    }
  };

  const handleAction = (action) => {
    if (action === "favourite") {
      alert("Item added to favourites!");
    } else if (action === "remove") {
      alert("Item removed from bag!");
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure the JWT token is stored in localStorage

      if (!token) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/transaction",
        {
          products: products.map((product) => ({
            productId: product.productId._id,
            quantity: product.quantity,
            price: product.price,
          })),
          totalPrice: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );
      console.log("Transaction saved:", response.data);
      alert("Checkout successful!");

      // Remove items from cart after successful checkout
      await axios.post(
        "http://localhost:5001/cart/clear",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach the token to the Authorization header
          },
        }
      );

      navigate("/transaction-history"); // Redirect to transaction history page
    } catch (error) {
      console.error("Failed to complete checkout:", error.response?.data || error.message);
      alert("Failed to complete checkout.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6 md:p-12 bg-gray-50 rounded-lg shadow-lg">
      {/* Bag Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">Bag</h2>
        {products.map((product, index) => (
          <div key={index} className="flex gap-6 border-b pb-6">
            <img
              src={`http://localhost:5001/${product.productId?.image}`} // Ensure the correct path to the image
              alt={product.productId?.name || "Product Image"}
              className="w-48 h-48 object-contain rounded-lg shadow-lg"
            />
            <div className="flex flex-col justify-between py-4 gap-2">
              <h3 className="text-lg font-medium">{product.productId?.name}</h3>{" "}
              {/* Dynamic product name */}
              <p className="text-gray-600">
                {product.productId?.description}
              </p>{" "}
              {/* Dynamic product description */}
              <p className="font-semibold text-xl">₹{product.price}</p>{" "}
              {/* Dynamic price */}
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleQuantityChange(index, -1)}
                  className="border rounded-full px-4 py-2 hover:bg-gray-200 transition pt-1"
                >
                  -
                </button>
                <span className="font-semibold text-lg">
                  {product.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(index, 1)}
                  className="border rounded-full px-4 py-2 hover:bg-gray-200 transition pt-1"
                >
                  +
                </button>
              </div>
              <div className="flex space-x-4 text-gray-600 underline font-medium text-sm mt-2">
                <button
                  onClick={() => handleAction("favourite")}
                  className="hover:underline transition"
                >
                  Favourites
                </button>
                <button
                  onClick={() => handleAction("remove")}
                  className="hover:underline transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span> {/* Dynamic subtotal */}
          </div>
          <div className="flex justify-between">
            <span>Quantity</span>
            <span>
              {products.reduce((acc, product) => acc + product.quantity, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery (3-5 days)</span>
            <span>₹{deliveryFee * products.length}</span>
          </div>
          <div className="flex justify-between ">
            <span>Discount</span>
            <span className="text-green-500">₹{discount}</span>
          </div>
          <div className="flex justify-between font-semibold mt-4 text-xl">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />
          <button
            onClick={handleApplyCoupon}
            className="w-full bg-gray-200 text-black py-2 rounded mb-4 hover:bg-gray-300 transition"
          >
            Apply Coupon
          </button>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Member Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
