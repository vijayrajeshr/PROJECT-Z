// import React from "react";
// import { IoMdClose } from "react-icons/io";

// const Modal = ({ isOpen, onClose, order }) => {
//   if (!isOpen || !order) return null;

//   // Destructure order properties safely
//   const item = order.items?.[0]; // Assuming order always has an 'items' array and we care about the first item

//   const customerName = order.userId?.username || "N/A";
//   const customerEmail = order.userId?.email || "N/A";
//   const customerPhone = order.userId?.phone?.fullNumber || order.userId?.mobileNumber || "N/A";
//   const deliveryAddress = order.deliveryAddress?.fullAddress || "Not provided";

//   const tiffinName = item?.name || "N/A";
//   const mealType = item?.mealType || "N/A";
//   const selectedPlan = item?.selectedPlan ? `${item.selectedPlan} Day(s)` : "N/A";
//   const startDate = item?.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A";
//   const endDate = item?.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A";

//   const orderTime = order.orderTime ? new Date(order.orderTime).toLocaleString() : "N/A";

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-96 p-6 overflow-y-auto max-h-[90vh]">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-800 transition"
//           >
//             <IoMdClose className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="space-y-2 text-sm text-gray-700">
//           <h2><span className="font-semibold">Order ID:</span> {order._id}</h2>
//           <h2><span className="font-semibold">Customer:</span> {customerName}</h2>
//           <h2><span className="font-semibold">Email:</span> {customerEmail}</h2>
//           <h2><span className="font-semibold">Phone:</span> {customerPhone}</h2>
//           <h2><span className="font-semibold">Address:</span> {deliveryAddress}</h2>
//           <h2><span className="font-semibold">Tiffin Name:</span> {tiffinName}</h2>
//           {/* Tiffin URL from item.img if it is actually a direct link to the tiffin page */}
//           {item?.img && ( // Assuming img is the tiffin URL you want to link
//             <h2>
//               <span className="font-semibold">Tiffin Image:</span>
//               <a href={item.img} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
//                 View Image
//               </a>
//             </h2>
//           )}
//           <h2><span className="font-semibold">Meal Type:</span> {mealType}</h2>
//           <h2><span className="font-semibold">Plan:</span> {selectedPlan}</h2>
//           <h2><span className="font-semibold">Quantity:</span> {item?.quantity || "N/A"}</h2>
//           <h2><span className="font-semibold">Price Per Item:</span> ₹{(item?.price || 0).toFixed(2)}</h2>
//           <h2><span className="font-semibold">Subtotal:</span> ₹{(order.subtotal || 0).toFixed(2)}</h2>
//           <h2><span className="font-semibold">Delivery Fee:</span> ₹{(order.deliveryFee || 0).toFixed(2)}</h2>
//           <h2><span className="font-semibold">Platform Fee:</span> ₹{(order.platformFee || 0).toFixed(2)}</h2>
//           <h2><span className="font-semibold">Applied Discount:</span> ₹{(order.discount || 0).toFixed(2)}</h2>
//           <h2><span className="font-semibold">Total:</span> ₹{(order.totalPrice || 0).toFixed(2)}</h2>
//           <h2>
//             <span className="font-semibold">Status:</span>
//             <span className={`font-bold ml-1 ${
//               order.status?.toLowerCase() === "pending" ? "text-yellow-500" :
//               order.status?.toLowerCase() === "accept" ? "text-green-600" :
//               order.status?.toLowerCase() === "rejected" ? "text-red-500" :
//               "text-gray-600" // Default for other statuses like 'notaccept', 'preparing', 'ready'
//             }`}>
//               {order.status || "N/A"}
//             </span>
//           </h2>
//           <h2><span className="font-semibold">Order Placed At:</span> {orderTime}</h2>
//           <h2><span className="font-semibold">Subscription Start Date:</span> {startDate}</h2>
//           <h2><span className="font-semibold">Subscription End Date:</span> {endDate}</h2>

//           {/* Special Instructions is not in your provided order data, assuming it might be */}
//           {/* <h2><span className="font-semibold">Special Instructions:</span> {order.specialInstructions || "None"}</h2> */}

//           {/* Substatus (like delivery tracking) - not present in the provided order structure */}
//           {/* You had subStatus as an array in your original modal code. */}
//           {/* If your order data structure for 'subStatus' looks like the one below, this part will work:
//           {order.subStatus?.length > 0 && (
//             <div>
//               <h2 className="font-semibold mt-4">Delivery Statuses:</h2>
//               <ul className="list-disc pl-5 text-gray-600">
//                 {order.subStatus.map((s, idx) => (
//                   <li key={idx}>
//                     {new Date(s.date).toLocaleDateString()} - {s.status || "Pending"}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
import React from "react";
import  { useCallback } from "react";


// Icons
const TagIcon = ({ size = 16, className = "" }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M17.778 8.222a.75.75 0 01-1.06 1.06L14.47 6.64l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06zM9.525 15.011a.75.75 0 01-1.06 1.06l-3-3a.75.75 0 011.06-1.06l3 3z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.915 2.5a.75.75 0 00-.708.205L.892 14.01a.75.75 0 00.708 1.295L13.018 3.795a.75.75 0 00-.077-1.082l-2-2A.75.75 0 009.525 2.5z" clipRule="evenodd" />
  </svg>
);

const CloseCircleOutlineIcon = ({ size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 12.707a1 1 0 01-1.414 1.414L12 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 12 7.293 8.707a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414L13.414 12l3.293 3.293z" clipRule="evenodd" />
  </svg>
);

const InfoCircleIcon = ({ size = 24, className = "" }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.75 15h-1.5v-6h1.5v6zm0-8h-1.5V7h1.5v2z" clipRule="evenodd" />
  </svg>
);

const TruckIcon = ({ size = 20, className = "" }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 3h13v13H3V3zm15 4h3l3 5v4h-2a3 3 0 01-6 0H9a3 3 0 01-6 0H1v-2h2V7h15v0zM5 18a1 1 0 100-2 1 1 0 000 2zm14 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

const ClockIcon = ({ size = 20, className = "" }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1.75a10.25 10.25 0 1 1 0 20.5 10.25 10.25 0 0 1 0-20.5Zm0 1.5a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5Zm.75 4a.75.75 0 0 1 .75.75v4.47l3.22 1.86a.75.75 0 1 1-.74 1.3l-3.47-2a.75.75 0 0 1-.38-.65V8a.75.75 0 0 1 .75-.75Z" />
  </svg>
);
const CalendarIcon = ({ size = 20, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M7 2a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V4h4v1a1 1 0 1 0 2 0V4h1a1 1 0 1 0 0-2H7Zm13 5H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1ZM5 10h14v9H5v-9Z" />
  </svg>
);

// Helpers
const formatDate = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

const formatTime = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return "N/A";
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};
const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center animate-fade-in-overlay">
            <div className="bg-white rounded-xl shadow-2xl p-0 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto animate-fade-in-content relative">
                {children}
            </div>
        </div>
    );
};

const ProgressBar = ({ startDate, selectedPlan, subStatus }) => {
    if (!selectedPlan || !startDate) return null;

    const calculateProgress = useCallback(() => {
        const totalDaysInPlan = parseInt(selectedPlan?.name, 10);
        if (isNaN(totalDaysInPlan) || totalDaysInPlan <= 0) {
            return { progress: 0, deliveredDays: 0, totalDays: 0, daysRemaining: 0 };
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deliveredCount = subStatus?.filter(s => {
            const deliveryDate = new Date(s.date);
            deliveryDate.setHours(0, 0, 0, 0);
            return s.statue === "delivered" && deliveryDate >= start && deliveryDate <= today;
        }).length || 0;

        let progress = (deliveredCount / totalDaysInPlan) * 100;
        progress = Math.min(100, Math.max(0, progress));

        const daysRemaining = totalDaysInPlan - deliveredCount;

        return {
            progress: progress,
            deliveredDays: deliveredCount,
            totalDays: totalDaysInPlan,
            daysRemaining: Math.max(0, daysRemaining)
        };
    }, [startDate, selectedPlan, subStatus]);

    const { progress, deliveredDays, totalDays, daysRemaining } = calculateProgress();

    return (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg shadow-inner mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <CalendarIcon className="mr-2 text-teal-600" size={18} /> Subscription Progress
            </h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 relative overflow-hidden">
                <div
                    className="bg-gradient-to-r from-teal-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{width: `${progress}% `}}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
                <span>{deliveredDays} / {totalDays} days completed</span>
                <span className="font-medium text-teal-700">{progress.toFixed(0)}% Done</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Days remaining: <span className="font-bold text-gray-600">{daysRemaining}</span>
            </p>
        </div>
    );
};


const TiffinModel = ({ isOpen, onClose, selectedOrder }) => {
  if (!isOpen || !selectedOrder) return null;

  const completed = selectedOrder.completedDays || 0;
  const total = selectedOrder.totalDays || 1;
  const percent = Math.floor((completed / total) * 100);
  console.log("Timeline:", selectedOrder.subStatus);


  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-white rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          <CloseCircleOutlineIcon size={28} />
        </button>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3 flex items-center">
          <InfoCircleIcon className="mr-2 text-teal-600" size={24} />
          Tiffin Order Details <span className="text-teal-600 ml-2">#{selectedOrder._id?.slice(-6)}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
          <div>
            <p className="font-semibold flex items-center text-gray-600">
              <TruckIcon className="mr-2 text-blue-500" size={18} /> Provider:
            </p>
            <p className="ml-5"><b>Name:</b> {selectedOrder.items?.[0]?.sourceEntityId?.kitchenName || "N/A"}</p>
            <p className="ml-5"><b>Address:</b> {selectedOrder.address || "N/A"}</p>
          </div>

          <div>
            <p className="font-semibold flex items-center text-gray-600">
              <TagIcon className="mr-2 text-purple-500" size={18} /> Contact Number:
            </p>
            <p className="ml-5">{selectedOrder.phone?.countryCode}{selectedOrder.phone?.number}</p>
          </div>

          <div>
            <p className="font-semibold flex items-center text-gray-600">
              <ClockIcon className="mr-2 text-yellow-500" size={18} /> Order Placed:
            </p>
            <p className="ml-5">{formatDate(selectedOrder.orderTime)} at {formatTime(selectedOrder.orderTime)}</p>
          </div>

          <div>
            <p className="font-semibold flex items-center text-gray-600">
              <ClockIcon className="mr-2 text-green-500" size={18} /> Scheduled Delivery:
            </p>
            <p className="ml-5">{selectedOrder.deliverTime || "N/A"}</p>
          </div>

          {selectedOrder.specialInstructions && (
            <div className="col-span-full bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-semibold text-gray-600 flex items-center">
                <InfoCircleIcon className="mr-2 text-gray-500" size={18} /> Special Instructions:
              </p>
              <p className="italic ml-5">{selectedOrder.specialInstructions}</p>
            </div>
          )}
        </div>

       
        {selectedOrder.items[0]?.startDate && selectedOrder.items[0]?.selectedPlan && (
  <div className="mt-6 border-t pt-4">
    <h4 className="font-bold text-gray-800 mb-3 text-lg">Subscription Progress</h4>
    <ProgressBar
      startDate={selectedOrder.items[0].startDate}
      selectedPlan={selectedOrder.items[0].selectedPlan}
      subStatus={selectedOrder.subStatus}
    />
  </div>
)}

        {/* Order Items */}
        <div className="mb-6 border-t pt-4">
          <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Items:</h4>
          <div className="space-y-2">
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-gray-50 p-3 rounded-md shadow-sm items-start">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-xs text-gray-500">Food Type: {item.foodType}</p>
                  <p className="text-xs text-gray-500">Meal Type: {item.mealType?.name || "N/A"}</p>
                  <p className="text-xs text-gray-500">Plan: {item.selectedPlan?.name || "N/A"}</p>
                </div>
                <span className="font-semibold text-teal-700">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t pt-4">
          <h4 className="font-bold text-gray-800 mb-3 text-lg">Payment Summary:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedOrder.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery Fee:</span><span>+ ₹{selectedOrder.deliveryFee?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>GST Charges:</span><span>+ ₹{selectedOrder.gstCharges?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Local Service Tax:</span><span>+ ₹{selectedOrder.localServiceTax?.toFixed(2) || "0.00"}</span></div>
            <div className="flex justify-between"><span>Service Charge:</span><span>+ ₹{selectedOrder.serviceCharge?.toFixed(2) || "0.00"}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total Paid:</span>
              <span className="text-teal-600">₹{selectedOrder.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
        {selectedOrder.subStatus && selectedOrder.subStatus.length > 0 && (
          
  <div className="mt-6 border-t pt-4">
    <h4 className="font-bold text-gray-800 mb-3 text-lg">Order Timeline:</h4>
    <ol className="relative border-l border-gray-300 ml-3">
      
      
      {selectedOrder.subStatus
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((statusEntry, idx) => (
          <li key={idx} className="mb-6 ml-6 relative">
            <span className="absolute -left-9 top-1 flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full ring-2 ring-white">
              <ClockIcon size={16} className="text-teal-600" />
            </span>
            <div className="text-sm">
              <p className="font-semibold capitalize text-gray-800">
                {statusEntry.statue}
                {idx === selectedOrder.subStatus.length - 1 && (
                  <span className="bg-teal-100 text-teal-700 text-xs ml-2 px-2 py-0.5 rounded-full">Latest</span>
                )}
              </p>
              <p className="text-gray-500 text-xs">
                {formatDate(statusEntry.date)} at {formatTime(statusEntry.date)}
              </p>
              {selectedOrder.status === "user_cancel" && selectedOrder.cancellationReason && (
                <div className="text-red-500 text-xs mt-1 italic">
                  Reason: {selectedOrder.cancellationReason}
                </div>
              )}
            </div>
          </li>
        ))}
    </ol>
  </div>
)}

      </div>
    </CustomModal>
  );
};

export default TiffinModel;