import React from "react";
function Footer() {
  return (
    <div className="bg-[#151414] h-[500px] text-white flex flex-col items-center justify-around">
      <div className="flex  justify-evenly items-center w-full h-2/3 py-[70px] ">
        <div className="text-xl font-Anton h-full flex flex-col items-start justify-start   gap-4">
          <h2>FIND A STORE</h2>
          <h2>NIKE JOURNAL</h2>
          <h2>BECOME A MEMBER</h2>
          <h2>FEEDBACK</h2>
          <h2>PROMO CODES</h2>
        </div>
        <div className="font-Inter text-sm text-[#cac2c2] h-full flex flex-col items-start justify-start   gap-2">
          <h2 className="text-xl font-Anton text-white mb-2">GET HELP</h2>
          <p>Order Status</p>
          <p>Shipping and Delivery</p>
          <p>Returns</p>
          <p>Payment Options</p>
          <p>Contact Us</p>
        </div>
        <div className="font-Inter text-sm text-[#cac2c2] h-full flex flex-col items-start justify-start   gap-2 ">
          <h2 className="text-xl font-Anton text-white mb-2">ABOUT NIKE</h2>
          <p>News</p>
          <p>Careers</p>
          <p>Investors</p>
          <p>Sustainability</p>
        </div>
        <div className="font-Inter text-sm text-[#cac2c2] h-full flex flex-col items-start justify-start   gap-2">
          <h2 className="text-xl font-Anton text-white mb-2">JOIN US</h2>
          <p>Nike App</p>
          <p>Nike Run Club</p>
          <p>Nike Training Club</p>
        </div>
        <div className="h-full flex flex-col items-start justify-start   gap-2">
          <h2 className="text-xl font-Anton text-white mb-2">SOCIAL</h2>
        </div>
      </div>
      <div className="flex justify-center items-center gap-14  font-Inter  text-[#cac2c2] text-sm pb-2 border-b  border-[#c4c2c2] ">
        <p>Guides</p>
        <p>Terms of Use</p>
        <p>Terms of Sale</p>
        <p>Company Details</p>
        <p>Modern Slavery Act</p>
        <p>Privacy and Cookie Policy</p>
        <p>Cookie Settings</p>
      </div>
      <div className="flex justify-center items-center gap-14  font-Inter  text-[#cac2c2] text-sm">
        <p>&#169; 2024 Nike, Inc. All rights reserved</p>
      </div>
    </div>
  );
}
export default Footer;
