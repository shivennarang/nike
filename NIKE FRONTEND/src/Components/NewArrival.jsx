import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { Link } from "react-router-dom";

function NewArrival() {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/products/new-arrivals")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("There was an error fetching the new arrivals!", error);
      });
  }, []);

  const handleLikeClick = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (userId && token) {
      try {
        const headers = { Authorization: `Bearer ${token}` }; // Set the Authorization header
        await axios.post(`http://localhost:5001/likes/add`, { userId, productId }, { headers });
        setLikedProducts((prevLikedProducts) =>
          prevLikedProducts.includes(productId)
            ? prevLikedProducts.filter((id) => id !== productId)
            : [...prevLikedProducts, productId]
        );
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === "Product already liked") {
          alert("Product already liked");
        } else {
          console.error("Error adding product to likes:", error);
        }
      }
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-around items-center py-6 gap-8">
        <h1 className="font-Anton text-5xl">New Arrivals</h1>
        <div className="flex-grow flex items-center justify-start gap-2">
          <IoIosArrowBack className="rounded-full text-3xl p-1 border-2 border-[#e3dada] text-[#e3dada]" />
          <IoIosArrowForward className="rounded-full text-3xl p-1 border-2 border-[#e3dada] text-[#e3dada]" />
        </div>
        <Link to="/all-products" className="underline font-Inter font-medium text-sm">
          See all items
        </Link>
      </div>
      <div className="flex items-center justify-around p-5">
        {products.map((product) => (
          <Link to={`/product/${product._id}`} key={product._id} className="bg-zinc-00 w-[16%] h-[320px] flex flex-col justify-between items-start relative">
            <div className="w-full h-[250px] flex justify-center items-center bg-zinc-200">
              <img src={`http://localhost:5001/${product.image}`} alt={product.name} />
            </div>
            <h1 className="text-[#151414] font-Inter text-sm font-semibold">
              {product.name}
            </h1>
            <p className="text-sm text-[#838383]">{product.categoryId}</p>
            <p className="text-[#151414] font-Inter text-sm font-medium">
              {`$${product.price}`}
            </p>
            <div className="flex justify-center items-center mt-2 cursor-pointer transition-transform duration-300 hover:scale-125" onClick={(e) => { e.stopPropagation(); handleLikeClick(product._id); }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill={likedProducts.includes(product._id) ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NewArrival;
