// import React from "react";

// const BillingDetails = ({ order }) => {

//     return (
//         <div className="border p-4 rounded-lg shadow-sm bg-white mb-2">
//             <h2 className="text-lg font-semibold mb-2">Billing Summary</h2>
//             <div className="space-y-2">
//                 <p>Item Total: ₹{Number(order.subTotal).toFixed(2)}</p>

//                 {order.appliedOffer ? (
//                     <p className="text-blue-600">Offer Applied: {order.appliedOffer[0].name}</p>
//                 ) : (
//                     <p className="text-gray-500">No Offer Applied</p>
//                 )}

//                 {order.appliedDiscount > 0 && (
//                     <p className="text-green-600">Offer Discount: -${Number(order.appliedDiscount).toFixed(2)}</p>
//                 )}

//                 <div>
//                     <h3 className="font-semibold">Applied Taxes:</h3>
//                     {order.appliedTaxes.length > 0 ? (
//                         <ul className="list-disc pl-5">
//                             {order.appliedTaxes.map((tax) => (
//                                 <li key={tax._id}>
//                                     {tax.name}: {tax.rate}%
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-500">No applicable taxes</p>
//                     )}
//                 </div>

//                 <div>
//                     <h3 className="font-semibold">Applied Charges:</h3>
//                     {order.appliedCharges.length > 0 ? (
//                         <ul className="list-disc pl-5">
//                             {order.appliedCharges.map((charge) => (
//                                 <li key={charge._id}>
//                                     {charge.name}: {charge.value}<span>{charge.type === "percentage" ? "%" : "$"}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <p className="text-gray-500">No applicable taxes</p>
//                     )}
//                 </div>


//                 <hr />
//                 <p className="font-bold text-lg">Final Amount: ${Number(order.total).toFixed(2)}</p>
//             </div>
//         </div>
//     );
// };

// export default BillingDetails;

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const BillingDetails = ({ order }) => {
    const [showTaxes, setShowTaxes] = useState(false);
    const [showCharges, setShowCharges] = useState(false);

    // Ensure order exists and has appliedTaxes/appliedCharges arrays
    const taxesArray = Array.isArray(order?.appliedTaxes) ? order.appliedTaxes : [];
    const chargesArray = Array.isArray(order?.appliedCharges) ? order.appliedCharges : [];

    const totalTaxes = taxesArray.reduce((acc, tax) => {
        const rate = Number(tax.rate) || 0;  // Ensure it's a number
        return acc + (tax.type === "percentage" ? (Number(order.subTotal) * rate) / 100 : rate);
    }, 0);

    const totalCharges = chargesArray.reduce((acc, charge) => {
        const value = Number(charge.value) || 0;  // Ensure it's a number
        return acc + (charge.type === "percentage" ? (Number(order.subTotal) * value) / 100 : value);
    }, 0);

    const totalTaxesAndCharges = totalTaxes + totalCharges;

    return (
        <div className="border p-4 rounded-lg shadow-sm bg-white mb-2">
            <h2 className="text-lg font-semibold mb-2">Billing Summary</h2>
            <div className="space-y-2">
                <p>Item Total: ₹{Number(order.subTotal || 0).toFixed(2)}</p>

                {order.appliedOffer?.length > 0 ? (
                    <p className="text-blue-600">Offer Applied: {order.appliedOffer[0]?.name}</p>
                ) : (
                    <p className="text-gray-500">No Offer Applied</p>
                )}

                {Number(order.appliedDiscount) > 0 && (
                    <p className="text-green-600">
                        Offer Discount: -₹{Number(order.appliedDiscount || 0).toFixed(2)}
                    </p>
                )}

                {/* Total Taxes & Charges */}
                <div className="flex items-center justify-between mt-3">
                    <h3 className="font-semibold">Taxes & Charges:</h3>
                    <p className="text-red-600 font-semibold">₹{Number(totalTaxesAndCharges).toFixed(2)}</p>
                </div>

                {/* Taxes Dropdown */}
                <div className="border rounded-md p-2 cursor-pointer bg-gray-100" onClick={() => setShowTaxes(!showTaxes)}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Taxes: ₹{Number(totalTaxes).toFixed(2)}</h3>
                        {showTaxes ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showTaxes && (
                        <ul className="mt-2 list-disc pl-5 text-gray-700">
                            {taxesArray.length > 0 ? (
                                taxesArray.map((tax) => (
                                    <li key={tax._id}>
                                        {tax.name}: {tax.rate}%
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No applicable taxes</p>
                            )}
                        </ul>
                    )}
                </div>

                {/* Charges Dropdown */}
                <div className="border rounded-md p-2 cursor-pointer bg-gray-100 mt-2" onClick={() => setShowCharges(!showCharges)}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Charges: ₹{Number(totalCharges).toFixed(2)}</h3>
                        {showCharges ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showCharges && (
                        <ul className="mt-2 list-disc pl-5 text-gray-700">
                            {chargesArray.length > 0 ? (
                                chargesArray.map((charge) => (
                                    <li key={charge._id}>
                                        {charge.name}: {charge.value}
                                        {charge.type === "percentage" ? "%" : "₹"}
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No applicable charges</p>
                            )}
                        </ul>
                    )}
                </div>

                <hr />
                <p className="font-bold text-lg">Final Amount: ₹{Number(order.total || 0).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default BillingDetails;
