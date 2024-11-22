import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Slogan from "./Components/Slogan";
import Footer from "./Components/Footer";
import NewArrival from "./Components/NewArrival";
import ShopByCollection from "./Components/ShopByCollection";
import AllProducts from "./Components/AllProducts";
import MenProducts from "./Components/MenProducts";
import WomenProducts from "./Components/WomenProducts";
import KidsProducts from "./Components/KidsProducts";
import ProductPage from "./Components/ProductPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Cart from "./Components/Cart";
import Admin from "./Components/Admin";
import AdminLogin from "./Components/AdminLogin";
import TransactionHistory from "./Components/TransactionHistory"; // Import TransactionHistory component
import Like from "./Components/Like";

function App() {
  return (
    <>
      <div className="px-12 ">
        <Navbar />
      </div>
      {/* <Slogan /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-arrival" element={<NewArrival />} />
        <Route path="/shop-by-collection" element={<ShopByCollection />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/men-products" element={<MenProducts />} />
        <Route path="/women-products" element={<WomenProducts />} />
        <Route path="/kids-products" element={<KidsProducts />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/transaction-history" element={<TransactionHistory />} /> // Add route for transaction history
        <Route path="/like" element={<Like />} /> // Add route for transaction history
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
