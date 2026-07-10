import React, { useState } from "react";
import TaxesManager from "./TaxesManager";
import ChargesManager from "./ChargesManager";
import DeliveryChargesManager from "./DeliveryCharges";

function TaxesAndCharges() {
  const [activeTab, setActiveTab] = useState("taxes");

  return (
    <div className="container mx-auto p-2">
      <div className="grid grid-cols-3 gap-2 mb-2">
        <button
          className={`p-3 rounded-md ${
            activeTab === "taxes" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("taxes")}
        >
          Taxes
        </button>
        <button
          className={`p-3 rounded-md ${
            activeTab === "deliveryCharges"
              ? "bg-red-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("deliveryCharges")}
        >
          Delivery Charges
        </button>
        <button
          className={`p-3 rounded-md ${
            activeTab === "charges" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("charges")}
        >
          Other Charges
        </button>
      </div>

      {activeTab === "taxes" && <TaxesManager />}
      {activeTab === "charges" && <ChargesManager />}
      {activeTab === "deliveryCharges" && <DeliveryChargesManager />}
    </div>
  );
}

export default TaxesAndCharges;
