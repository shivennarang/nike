import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import Filter from "./Filter";
import Sidebar from "./Sidebar";
import axios from "axios";

function WomenProducts() {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/products/women")
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("There was an error fetching the women's products!", error);
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
    <div className="p-8">
      {/* <h1 className="font-Anton text-6xl font-semibold mb-6">Women's Products</h1> */}
      {/* <Filter />{" "} */}
      <div className="flex mt-6">
        <Sidebar />
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-16 p-8">
          {products.map((product) => (
            <div className="flex flex-col gap-y-3 items-center justify-around">
              <Link to={`/product/${product._id}`} key={product._id} className="bg-white max-w-xs h-[350px] flex flex-col justify-between items-start relative p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-full h-[250px] flex justify-center items-center bg-zinc-200 rounded-lg overflow-hidden">
                  <img
                    src={`http://localhost:5001/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-[#151414] font-Inter text-base font-semibold mt-3">
                  {product.name}
                </h1>
                <p className="text-sm text-[#838383]">{product.categoryId.name}</p>
                <p className="text-[#151414] font-Inter text-base font-medium mt-2">
                  {`$${product.price}`}
                </p>
              </Link>
              <div className="flex justify-center items-center mt-2 cursor-pointer transition-transform duration-300 hover:scale-125" onClick={(e) => { e.stopPropagation(); handleLikeClick(product._id); }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={likedProducts.includes(product._id) ? "red" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WomenProducts;
