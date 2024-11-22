import React from "react";
import Men from "../assets/Collection_Men.png";
import Women from "../assets/Collection_Women.png";
import Kids from "../assets/Collection_Kids.png";
function ShopByCollection() {
  return (
    <div>
      <h1 className="font-Anton text-5xl py-20">SHOP BY COLLECTION</h1>
      <div className="flex items-center justify-between h-[600px]  overflow-hidden ">
        <div className="relative">
          <img src={Men} alt="" className="object-contain  h-full " />
          <h1 className="absolute bottom-8 left-[50%] translate-x-[-50%] bg-white p-4 py-2 rounded-sm text-lg shadow-lg">
            Men
          </h1>
        </div>
        <div className="relative">
          <img src={Women} alt="" className="object-contain  h-full " />
          <h1 className="absolute bottom-8 left-[50%] translate-x-[-50%] bg-white p-4 py-2 rounded-sm text-lg shadow-lg">
            Women
          </h1>
        </div>
        <div className="relative">
          <img src={Kids} alt="" className="object-contain  h-full " />
          <h1 className="absolute bottom-8 left-[50%] translate-x-[-50%] bg-white p-4 py-2 rounded-sm text-lg shadow-lg">
            Kids
          </h1>
        </div>
      </div>
    </div>
  );
}
export default ShopByCollection;
