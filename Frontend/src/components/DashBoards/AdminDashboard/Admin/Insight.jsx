// // // import { motion } from "framer-motion";
// // // import React, { useState } from "react";
// // // import { IoIosAddCircleOutline } from "react-icons/io";
// // // import PartitionLine from "./PartitionLine";

// // // const Insight = ({ insights = null, isEditable }) => {
// // //   let [isExpand, setIsExpand] = useState(false);

// // //   const handleExpand = () => {
// // //     setIsExpand(!isExpand);
// // //   };

// // //   return (
// // //     <>
// // //       <h1>Insights</h1>
// // //       <PartitionLine isEditable={isEditable} onBtnClick={() => {}} />
// // //       <motion.div
// // //         layout
// // //         transition={{ duration: 0.8 }}
// // //         className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 overflow-hidden ${
// // //           isExpand ? "h-auto" : "h-36"
// // //         }`}
// // //       >
// // //         {insights &&
// // //           insights.map((el, idx) => (
// // //             <div className="bg-blue-200 m-2 rounded-sm p-2" key={el._id}>
// // //               {el.name && <div>name : {el.name}</div>}
// // //               {el.class && <div>class : {el.class}</div>}
// // //               {el.category && <div>category : {el.category}</div>}
// // //             </div>
// // //           ))}
// // //       </motion.div>
// // //       <div className="text-center p-4 rounded border-none">
// // //         {" "}
// // //         <button
// // //           onClick={handleExpand}
// // //           className="bg-black text-white p-2 rounded"
// // //         >
// // //           {isExpand ? "Show Less" : "Show More"}
// // //         </button>
// // //       </div>
// // //     </>
// // //   );
// // // };

// // // export default Insight;

// // import { motion } from "framer-motion";
// // import React, { useState } from "react";
// // import PartitionLine from "./PartitionLine";

// // const Insight = ({ insights = null, isEditable, setCurrResInfo }) => {
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [isVisible, setIsVisible] = useState(false);
// //   const itemsPerPage = 6; // Number of items per page (adjustable)
// //   const [newInsight, setNewInsight] = useState({
// //     name: "",
// //     class: "",
// //     category: "",
// //   });
// //   const [error, setError] = useState(null);

// //   // Calculate total pages
// //   const totalPages = insights ? Math.ceil(insights.length / itemsPerPage) : 0;

// //   // Get items for the current page
// //   const paginatedInsights = insights
// //     ? insights.slice(
// //         (currentPage - 1) * itemsPerPage,
// //         currentPage * itemsPerPage
// //       )
// //     : [];

// //   // Handle page navigation
// //   const handleNextPage = () => {
// //     if (currentPage < totalPages) {
// //       setCurrentPage(currentPage + 1);
// //     }
// //   };

// //   const handlePrevPage = () => {
// //     if (currentPage > 1) {
// //       setCurrentPage(currentPage - 1);
// //     }
// //   };

// //   const addItem = () => {
// //     setIsVisible(true);
// //   };

// //   const onInput = (e) => {
// //     let { name, value } = e.target;
// //     setNewInsight((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const addNewInsight = () => {
// //     setCurrResInfo((prev) => {
// //       if (newInsight.name.length === 0 || newInsight.class.length === 0) {
// //         setError("Field are required");
// //         return prev;
// //       }

// //       // Check if the key already exists
// //       if (newInsight.name in prev.insights) {
// //         alert("Error: Item with the same key already exists!");
// //         return prev; // Keep previous state unchanged
// //       }

// //       return {
// //         ...prev,
// //         insights: [
// //           ...prev.insights,
// //           {
// //             name: newInsight.name,
// //             class: newInsight.class,
// //             category: newInsight.category || null,
// //           },
// //         ],
// //       };
// //     });
// //   };

// //   return (
// //     <>
// //       <h1>Insights</h1>
// //       <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

// //       {isVisible && (
// //         <div className="flex gap-2 my-1 ">
// //           <div className="flex-grow">
// //             <input
// //               type="text"
// //               placeholder="name"
// //               name="name"
// //               value={newInsight.name}
// //               onChange={(e) => onInput(e)}
// //               className="rounded-md py-1 flex-grow w-full"
// //             />
// //           </div>
// //           <div className="flex-grow">
// //             <input
// //               type="text"
// //               placeholder="class"
// //               name="class"
// //               value={newInsight.class}
// //               onChange={(e) => onInput(e)}
// //               className="rounded-md py-1 flex-grow w-full"
// //             />
// //           </div>
// //           <div className="flex-grow">
// //             <input
// //               type="text"
// //               placeholder="category"
// //               name="category"
// //               value={newInsight.category}
// //               onChange={(e) => onInput(e)}
// //               className="rounded-md py-1 flex-grow w-full"
// //             />
// //           </div>
// //           <div className="flex justify-start gap-4">
// //             <button
// //               className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
// //               onClick={addNewInsight}
// //             >
// //               Add
// //             </button>
// //             <button
// //               className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
// //               onClick={() => {
// //                 setIsVisible(false);
// //               }}
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <motion.div
// //         className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
// //         layout // Minimal animation for layout transitions
// //         transition={{ duration: 0.3 }} // Subtle duration for layout shift
// //       >
// //         {paginatedInsights.map((el) => (
// //           <div className="bg-blue-200 m-2 rounded-sm p-2" key={el._id}>
// //             {el.name && <div>name: {el.name}</div>}
// //             {el.class && <div>class: {el.class}</div>}
// //             {el.category && <div>category: {el.category}</div>}
// //           </div>
// //         ))}
// //       </motion.div>

// //       {/* Pagination Controls */}
// //       {insights && insights.length > itemsPerPage && (
// //         <div className="flex justify-center items-center gap-4 p-4">
// //           <button
// //             onClick={handlePrevPage}
// //             disabled={currentPage === 1}
// //             className={`p-2 rounded text-white ${
// //               currentPage === 1
// //                 ? "bg-gray-400 cursor-not-allowed"
// //                 : "bg-black hover:bg-gray-800"
// //             }`}
// //           >
// //             Previous
// //           </button>
// //           <span className="text-sm">
// //             Page {currentPage} of {totalPages}
// //           </span>
// //           <button
// //             onClick={handleNextPage}
// //             disabled={currentPage === totalPages}
// //             className={`p-2 rounded text-white ${
// //               currentPage === totalPages
// //                 ? "bg-gray-400 cursor-not-allowed"
// //                 : "bg-black hover:bg-gray-800"
// //             }`}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default Insight;

// import { motion } from "framer-motion";
// import React, { useState } from "react";
// import PartitionLine from "./PartitionLine";
// import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";

// const Insight = ({ insights = null, isEditable, setCurrResInfo }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isVisible, setIsVisible] = useState(false);
//   const itemsPerPage = 6; // Number of items per page (adjustable)
//   const [newInsight, setNewInsight] = useState({
//     name: "",
//     class: "",
//     category: "",
//   });
//   const [error, setError] = useState(null);

//   // Calculate total pages
//   const totalPages = insights ? Math.ceil(insights.length / itemsPerPage) : 0;

//   // Reverse the insights array and get items for the current page
//   const paginatedInsights = insights
//     ? [...insights] // Create a copy to avoid mutating the original array
//         .reverse() // Reverse the order
//         .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
//     : [];

//   // Handle page navigation
//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const addItem = () => {
//     setIsVisible(true);
//   };

//   const onInput = (e) => {
//     let { name, value } = e.target;
//     setNewInsight((prev) => ({ ...prev, [name]: value }));
//   };

//   const addNewInsight = () => {
//     setCurrResInfo((prev) => {
//       if (newInsight.name.length === 0 || newInsight.class.length === 0) {
//         setError("Fields are required");
//         return prev;
//       }

//       // Check if the key already exists
//       if (newInsight.name in prev.insights) {
//         alert("Error: Item with the same key already exists!");
//         return prev; // Keep previous state unchanged
//       }

//       return {
//         ...prev,
//         insights: [
//           ...prev.insights,
//           {
//             name: newInsight.name,
//             class: newInsight.class,
//             category: newInsight.category || null,
//           },
//         ],
//       };
//     });
//     // Reset form and hide input after adding
//     setNewInsight({ name: "", class: "", category: "" });
//     setIsVisible(false);
//     setCurrentPage(1); // Jump to the first page to show the newly added item
//   };

//   const removeItem = (text) => {
//     setCurrResInfo((prev) => ({
//       ...prev,
//       insights: prev.insights.filter(({ name }) => name !== text),
//     }));
//   };

//   return (
//     <>
//       <h1>Insights</h1>
//       <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

//       {isVisible && (
//         <div className="flex gap-2 my-1 ">
//           <div className="flex-grow">
//             <input
//               type="text"
//               placeholder="name"
//               name="name"
//               value={newInsight.name}
//               onChange={(e) => onInput(e)}
//               className="rounded-md py-1 flex-grow w-full"
//             />
//           </div>
//           <div className="flex-grow">
//             <input
//               type="text"
//               placeholder="class"
//               name="class"
//               value={newInsight.class}
//               onChange={(e) => onInput(e)}
//               className="rounded-md py-1 flex-grow w-full"
//             />
//           </div>
//           <div className="flex-grow">
//             <input
//               type="text"
//               placeholder="category"
//               name="category"
//               value={newInsight.category}
//               onChange={(e) => onInput(e)}
//               className="rounded-md py-1 flex-grow w-full"
//             />
//           </div>
//           <div className="flex justify-start gap-4">
//             <button
//               className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
//               onClick={addNewInsight}
//             >
//               Add
//             </button>
//             <button
//               className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
//               onClick={() => {
//                 setIsVisible(false);
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
//         layout
//         transition={{ duration: 0.3 }}
//       >
//         {paginatedInsights.map((el) => (
//           <DelBtn
//             key={el._id}
//             isEditable={isEditable}
//             onBtnClick={() => removeItem(el.name)}
//           >
//             <div className="bg-blue-200  rounded-sm p-2">
//               {el.name && <div>name: {el.name}</div>}
//               {el.class && <div>class: {el.class}</div>}
//               {el.category && <div>category: {el.category}</div>}
//             </div>
//           </DelBtn>
//         ))}
//       </motion.div>

//       {/* Pagination Controls */}
//       {insights && insights.length > itemsPerPage && (
//         <div className="flex justify-center items-center gap-4 p-4">
//           <button
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//             className={`p-2 rounded text-white ${
//               currentPage === 1
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-black hover:bg-gray-800"
//             }`}
//           >
//             Previous
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//             className={`p-2 rounded text-white ${
//               currentPage === totalPages
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-black hover:bg-gray-800"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Insight;

import { motion } from "framer-motion";
import React, { useState } from "react";
import PartitionLine from "./PartitionLine";
import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";

const Insight = ({ insights = [], isEditable, setCurrResInfo }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const itemsPerPage = 6;
  const [newInsight, setNewInsight] = useState({
    name: "",
    class: "",
    category: "",
  });

  // Calculate total pages
  const totalPages = Math.ceil(insights.length / itemsPerPage);

  // Get paginated insights (reverse order)
  const paginatedInsights = [...insights]
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Page navigation handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const addItem = () => setIsVisible(true);

  const onInput = (e) => {
    setNewInsight((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addNewInsight = () => {
    if (!newInsight.name || !newInsight.class) {
      alert("Fields 'name' and 'class' are required.");
      return;
    }

    setCurrResInfo((prev) => {
      if (prev.insights.some((el) => el.name === newInsight.name)) {
        alert("Error: Item with the same name already exists!");
        return prev;
      }

      return {
        ...prev,
        insights: [
          ...prev.insights,
          { ...newInsight, category: newInsight.category || null },
        ],
      };
    });

    setNewInsight({ name: "", class: "", category: "" });
    setIsVisible(false);
    setCurrentPage(1);
  };

  const removeItem = (nameToRemove) => {
    setCurrResInfo((prev) => ({
      ...prev,
      insights: prev.insights.filter(({ name }) => name !== nameToRemove),
    }));
  };

  return (
    <>
      <h1>Insights</h1>
      <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

      {isVisible && (
        <div className="flex gap-2 my-1">
          {["name", "class", "category"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              name={field}
              value={newInsight[field]}
              onChange={onInput}
              className="rounded-md py-1 flex-grow w-full"
            />
          ))}
          <button
            className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
            onClick={addNewInsight}
          >
            Add
          </button>
          <button
            className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
            onClick={() => setIsVisible(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        layout
        transition={{ duration: 0.3 }}
      >
        {paginatedInsights.map((el) => (
          <DelBtn
            key={el._id || el.name}
            isEditable={isEditable}
            onBtnClick={() => removeItem(el.name)}
          >
            <div className="bg-blue-200 m-2 rounded-sm p-3 flex justify-between">
              <div>
                {el.name && <div>name: {el.name}</div>}
                {el.class && <div>class: {el.class}</div>}
                {el.category && <div>category: {el.category}</div>}
              </div>
            </div>
          </DelBtn>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 p-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded text-white ${
              currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded text-white ${
              currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Insight;
