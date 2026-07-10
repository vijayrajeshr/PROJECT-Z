import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import Sorting from "./Sorting";
import { FaUndo } from "react-icons/fa";
import { IoMdSwitch } from "react-icons/io";
import Popup from "../../../../utils/Popup";
import Tooltip from "../../../../utils/Tooltip";
import axios from "axios";
import { useLocation } from "react-router-dom";

const CommentList = ({
  setViewComments,
  viewComments,
  restaurantReviews,
  // reviewList = null,
}) => {
  let [column, setColumn] = useState(1);
  let [reviews, setReviews] = useState(restaurantReviews);
  let [isReply, setIsReply] = useState(-1);
  let [replyText, setReplyText] = useState("");
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/restaurants/comments") setColumn(1);
  }, [location]);

  const [expandedComments, setExpandedComments] = useState({});

  const handleAccept = () => {};
  const handleReject = () => {};
  const list = ["Latest", "Oldest", "Worst", "Best"];
  const filters = ["Rating 3.0+", "Rating 4.0+", "Rating below 3.0"];

  const handleReply = (e, id) => {
    e.preventDefault();
    console.log(replyText);
    console.log(id);
    setIsReply(-1);
    setReplyText("");
  };

  const toggleExpandComment = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div className="w-full box-border">
      <h1 className="overview-heading  flex justify-between">
        Reviews{" "}
        <div className="flex justify-end gap-1 items-center">
          <Tooltip text={"switch view"} position="bottom">
            <button
              className="rounded-full border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
              onClick={() => setColumn((prev) => (prev === 1 ? 2 : 1))}
            >
              <IoMdSwitch />
            </button>
          </Tooltip>
          {/* <Tooltip text={"undo"} position="bottom">
            <button className="rounded-2xl border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100">
              <FaUndo />
            </button>
          </Tooltip> */}
          <div className="h-full flex pt-2 items-stretch">
            <Sorting list={filters} label="Filters" />
          </div>

          <div className="h-full flex pt-2 items-stretch">
            <Sorting list={list} />
          </div>

          <button
            className="rounded-md border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
            onClick={
              viewComments === null
                ? () => setViewComments("user")
                : () => setViewComments(null)
            }
          >
            {viewComments === null ? "Back" : "More"}
          </button>
        </div>
      </h1>

      <div
        className={`grid p-2 w-full justify-center box-border gap-2 ${
          column === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
        } grid-cols-1`}
      >
        {reviews.map((review) => (
          // comment card
          <div
            key={review.id}
            className="border border-gray-200 shadow-sm bg-white rounded-lg p-4 w-auto box-border"
          >
            <div className="flex gap-2 ">
              {/* image group */}
              <div className="flex flex-col items-center justify-center">
                <img
                  src={review.imgSrc}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full bg-gray-100"
                />
                <div className={`text-center ${"text-[10px]"}`}>
                  {review.reviewer}
                </div>
              </div>
              {/* rating */}
              <div className="flex flex-col">
                <div className="text-[12px] border flex w-[50px] rounded-lg items-center justify-center box-border">
                  <IoIosStar className="text-black" />
                  &nbsp; {review.rating}
                </div>
                <div className="text-[11px]">2 days before</div>
              </div>
              {/* {column === 1 && (
                <div>
                  <div className="mt-2 text-sm">
                    {expandedComments[review.id]
                      ? review.reviewContent
                      : `${review.reviewContent.slice(0, 150)}`}
                    {review.reviewContent.length > 150 && (
                      <button
                        onClick={() => toggleExpandComment(review.id)}
                        className="text-blue-500 text-xs ml-2"
                      >
                        {expandedComments[review.id]
                          ? "Show Less"
                          : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )} */}

              {/* action button */}
              <div className=" font-semibold flex gap-2 mt-2 flex-grow justify-end items-center h-full">
                <Tooltip text={"Accept"} position="left">
                  <button
                    title="accept"
                    className="border-0 bg-transparent items-start flex h-0 rounded"
                  >
                    <IoCheckmarkSharp className="text-[32px] text-green-500 bg-gray-50 rounded p-1" />
                  </button>
                </Tooltip>
                <Tooltip text={"Reject"} position="left">
                  <button
                    title="reject"
                    className="border-0 bg-transparent items-start flex h-0 rounded"
                  >
                    <IoCloseSharp
                      className=" text-[32px] text-red-500 bg-gray-50 rounded p-1"
                      title="reject"
                    />
                  </button>
                </Tooltip>
                <button
                  title="reply"
                  className="border-0 bg-transparent items-start flex h-0 rounded focus:outline-none"
                  onClick={() =>
                    setIsReply((prev) => (prev === review.id ? -1 : review.id))
                  }
                >
                  <div className=" bg-gray-50 rounded p-2">Reply</div>
                </button>
              </div>
            </div>
            {column && (
              <div>
                <div className="mt-2 text-sm">
                  {expandedComments[review.id]
                    ? review.reviewContent
                    : `${review.reviewContent.slice(0, 120)}...`}
                  {review.reviewContent.length > 120 && (
                    <button
                      onClick={() => toggleExpandComment(review.id)}
                      className="text-blue-500 text-xs ml-2"
                    >
                      {expandedComments[review.id] ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {isReply === review.id && (
              <div className="flex gap-2">
                <textarea
                  name="reply"
                  className="border border-black  focus:outline-none flex-grow"
                  value={replyText}
                  onChange={(evt) => setReplyText(evt.target.value)}
                />
                <button
                  onClick={(e) => handleReply(e, review.id)}
                  className="border-0  items-start flex focus:outline-none h-auto bg-blue-700 text-white rounded p-2"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;

// --------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { IoIosStar } from "react-icons/io";
// import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
// import { IoMdSwitch } from "react-icons/io";
// import Sorting from "./Sorting";
// import Tooltip from "../../../../utils/Tooltip";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const CommentList = ({
//   setViewComments,
//   viewComments,
//   restaurantReviews = [],
// }) => {
//   const [column, setColumn] = useState(1);
//   const [reviews, setReviews] = useState(restaurantReviews);
//   const [isReply, setIsReply] = useState(null); // Changed to null for clarity
//   const [replyText, setReplyText] = useState("");
//   const [expandedComments, setExpandedComments] = useState({});
//   const location = useLocation();

//   // Sync reviews with prop changes
//   useEffect(() => {
//     setReviews(restaurantReviews);
//   }, [restaurantReviews]);

//   // Update column layout based on route
//   useEffect(() => {
//     if (location.pathname === "/restaurants/comments") {
//       setColumn(1);
//     }
//   }, [location]);

//   const list = ["Latest", "Oldest", "Worst", "Best"];
//   const filters = ["Rating 3.0+", "Rating 4.0+", "Rating below 3.0"];

//   // const handleReply = async (e, reviewId) => {
//   //   e.preventDefault();
//   //   if (!replyText.trim()) {
//   //     alert("Reply cannot be empty!");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post(
//   //       "http://your-backend-api/replies", // Replace with your actual backend endpoint
//   //       {
//   //         reviewId: reviewId,
//   //         reply: replyText,
//   //       },
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           // Add any authentication headers if required, e.g.:
//   //           // "Authorization": `Bearer ${yourToken}`
//   //         },
//   //       }
//   //     );
//   //     console.log("Reply posted successfully:", response.data);

//   //     // Optionally update the local state to reflect the reply
//   //     setReviews((prevReviews) =>
//   //       prevReviews.map((review) =>
//   //         review.review_id === reviewId
//   //           ? {
//   //               ...review,
//   //               comments: [
//   //                 ...(review.comments || []),
//   //                 {
//   //                   text: replyText,
//   //                   author: "You",
//   //                   date: new Date().toISOString(),
//   //                 },
//   //               ],
//   //             }
//   //           : review
//   //       )
//   //     );
//   //     setIsReply(null);
//   //     setReplyText("");
//   //   } catch (error) {
//   //     console.error("Error posting reply:", error);
//   //     alert("Failed to post reply. Please try again.");
//   //   }
//   // };

//   const handleReply = () => {};
//   const toggleExpandComment = (reviewId) => {
//     setExpandedComments((prev) => ({
//       ...prev,
//       [reviewId]: !prev[reviewId],
//     }));
//   };

//   return (
//     <div className="w-full box-border">
//       <h1 className="overview-heading flex justify-between">
//         Reviews
//         <div className="flex justify-end gap-1 items-center">
//           <Tooltip text="Switch view" position="bottom">
//             <button
//               className="rounded-full border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
//               onClick={() => setColumn((prev) => (prev === 1 ? 2 : 1))}
//             >
//               <IoMdSwitch />
//             </button>
//           </Tooltip>
//           <div className="h-full flex pt-2 items-stretch">
//             <Sorting list={filters} label="Filters" />
//           </div>
//           <div className="h-full flex pt-2 items-stretch">
//             <Sorting list={list} />
//           </div>
//           <button
//             className="rounded-md border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
//             onClick={
//               viewComments === null
//                 ? () => setViewComments("user")
//                 : () => setViewComments(null)
//             }
//           >
//             {viewComments === null ? "Back" : "More"}
//           </button>
//         </div>
//       </h1>

//       <div
//         className={`grid p-2 w-full justify-center box-border gap-2 ${
//           column === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
//         } grid-cols-1`}
//       >
//         {reviews.map((review) => (
//           <div
//             key={review.review_id}
//             className="border border-gray-200 shadow-sm bg-white rounded-lg p-4 w-auto box-border"
//           >
//             <div className="flex gap-2">
//               {/* Reviewer Info */}
//               <div className="flex flex-col items-center justify-center">
//                 <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
//                   {/* Placeholder for image if available */}
//                   <span className="text-gray-500 text-xs">
//                     {review.author_name[0]}
//                   </span>
//                 </div>
//                 <div className="text-center text-[10px]">
//                   {review.author_name || "Anonymous"}
//                 </div>
//               </div>

//               {/* Rating and Date */}
//               <div className="flex flex-col">
//                 <div className="text-[12px] border flex w-[50px] rounded-lg items-center justify-center box-border">
//                   <IoIosStar className="text-black" /> {review.rating || "N/A"}
//                 </div>
//                 <div className="text-[11px]">
//                   {review.date || "Unknown date"}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="font-semibold flex gap-2 mt-2 flex-grow justify-end items-center h-full">
//                 <Tooltip text="Accept" position="left">
//                   <button className="border-0 bg-transparent items-start flex h-0 rounded">
//                     <IoCheckmarkSharp className="text-[32px] text-green-500 bg-gray-50 rounded p-1" />
//                   </button>
//                 </Tooltip>
//                 <Tooltip text="Reject" position="left">
//                   <button className="border-0 bg-transparent items-start flex h-0 rounded">
//                     <IoCloseSharp className="text-[32px] text-red-500 bg-gray-50 rounded p-1" />
//                   </button>
//                 </Tooltip>
//                 <button
//                   onClick={() => setIsReply(review.review_id)}
//                   className="border-0 bg-transparent items-start flex h-0 rounded focus:outline-none"
//                 >
//                   <div className="bg-gray-50 rounded p-2">Reply</div>
//                 </button>
//               </div>
//             </div>

//             {/* Aspects Section */}
//             <div className="mt-2 text-sm">
//               <div className="flex flex-wrap gap-2">
//                 {review.aspects.service && (
//                   <span>Service: {review.aspects.service}/5</span>
//                 )}
//                 {review.aspects.food && (
//                   <span>Food: {review.aspects.food}/5</span>
//                 )}
//                 {review.aspects.atmosphere && (
//                   <span>Atmosphere: {review.aspects.atmosphere}/5</span>
//                 )}
//                 {review.aspects["meal type"] && (
//                   <span>Meal Type: {review.aspects["meal type"]}</span>
//                 )}
//                 {review.aspects["price per person"] && (
//                   <span>Price: {review.aspects["price per person"]}</span>
//                 )}
//                 {review.aspects["recommended dishes"] && (
//                   <span>
//                     Recommended: {review.aspects["recommended dishes"]}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Comments Section */}
//             {review.comments && review.comments.length > 0 && (
//               <div className="mt-2 text-sm">
//                 {expandedComments[review.review_id] ? (
//                   review.comments.map((comment, index) => (
//                     <div key={index} className="border-t pt-2 mt-2">
//                       <strong>{comment.author || "Anonymous"}:</strong>{" "}
//                       {comment.text}
//                       <span className="text-xs text-gray-500">
//                         {" "}
//                         ({new Date(comment.date).toLocaleDateString()})
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="border-t pt-2 mt-2">
//                     <strong>{review.comments[0].author || "Anonymous"}:</strong>{" "}
//                     {review.comments[0].text.slice(0, 120)}...
//                   </div>
//                 )}
//                 {review.comments.length > 1 && (
//                   <button
//                     onClick={() => toggleExpandComment(review.review_id)}
//                     className="text-blue-500 text-xs ml-2"
//                   >
//                     {expandedComments[review.review_id]
//                       ? "Show Less"
//                       : "Show More"}
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Reply Input */}
//             {isReply === review.review_id && (
//               <div className="flex gap-2 mt-2">
//                 <textarea
//                   name="reply"
//                   className="border border-black focus:outline-none flex-grow p-2 rounded"
//                   value={replyText}
//                   onChange={(evt) => setReplyText(evt.target.value)}
//                   placeholder="Type your reply..."
//                 />
//                 <button
//                   onClick={(e) => handleReply(e, review.review_id)}
//                   className="border-0 bg-blue-700 text-white rounded p-2 focus:outline-none"
//                 >
//                   Send
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CommentList;
// ---------------------------------------------------------------------------------
// import React, { useEffect, useState } from "react";
// import { IoIosStar } from "react-icons/io";
// import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
// import { IoMdSwitch } from "react-icons/io";
// import Sorting from "./Sorting";
// import Tooltip from "../../../../utils/Tooltip";
// import axios from "axios";
// import { useLocation } from "react-router-dom";

// const CommentList = ({
//   setViewComments,
//   viewComments,
//   firmId, // Required prop to fetch reviews for a specific firm
// }) => {
//   const [column, setColumn] = useState(1);
//   const [reviews, setReviews] = useState([]);
//   const [isReply, setIsReply] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [expandedComments, setExpandedComments] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const location = useLocation();

//   // Fetch reviews from the API when firmId changes
//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (!firmId) {
//         setError("No firm ID provided");
//         setReviews([]);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_SERVER_URL}/api/get-reviews/${firmId}`
//         );
//         if (response.data.response) {
//           setReviews(response.data.data);
//         } else {
//           setError(response.data.message || "Failed to fetch reviews");
//           setReviews([]);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching reviews");
//         setReviews([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [firmId]);

//   // Update column layout based on route
//   useEffect(() => {
//     if (location.pathname === "/restaurants/comments") {
//       setColumn(1);
//     }
//   }, [location]);

//   const list = ["Latest", "Oldest", "Worst", "Best"];
//   const filters = ["Rating 3.0+", "Rating 4.0+", "Rating below 3.0"];

//   // const handleReply = async (e, reviewId) => {
//   //   e.preventDefault();
//   //   if (!replyText.trim()) {
//   //     alert("Reply cannot be empty!");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post("/api/replies", {
//   //       reviewId,
//   //       reply: replyText,
//   //     });
//   //     if (response.data.success) {
//   //       console.log("Reply posted successfully:", response.data.data);
//   //       setReviews((prevReviews) =>
//   //         prevReviews.map((review) =>
//   //           review.review_id === reviewId
//   //             ? {
//   //                 ...review,
//   //                 comments: [
//   //                   ...(review.comments || []),
//   //                   {
//   //                     text: replyText,
//   //                     author: "You",
//   //                     date: response.data.data.date,
//   //                   },
//   //                 ],
//   //               }
//   //             : review
//   //         )
//   //       );
//   //       setIsReply(null);
//   //       setReplyText("");
//   //     } else {
//   //       alert(response.data.message || "Failed to post reply");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error posting reply:", error);
//   //     alert(error.response?.data?.message || "Error posting reply");
//   //   }
//   // };

//   const handleReply = () => {};

//   const toggleExpandComment = (reviewId) => {
//     setExpandedComments((prev) => ({
//       ...prev,
//       [reviewId]: !prev[reviewId],
//     }));
//   };

//   if (loading) {
//     return <div className="text-center p-4">Loading reviews...</div>;
//   }

//   if (error) {
//     return <div className="text-center p-4 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="w-full box-border">
//       <h1 className="overview-heading flex justify-between">
//         Reviews
//         <div className="flex justify-end gap-1 items-center">
//           <Tooltip text="Switch view" position="bottom">
//             <button
//               className="rounded-full border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
//               onClick={() => setColumn((prev) => (prev === 1 ? 2 : 1))}
//             >
//               <IoMdSwitch />
//             </button>
//           </Tooltip>
//           <div className="h-full flex pt-2 items-stretch">
//             <Sorting list={filters} label="Filters" />
//           </div>
//           <div className="h-full flex pt-2 items-stretch">
//             <Sorting list={list} />
//           </div>
//           <button
//             className="rounded-md border-0 gap-1 text-[14px] mb-2 px-2 py-1 bg-gray-100"
//             onClick={
//               viewComments === null
//                 ? () => setViewComments("user")
//                 : () => setViewComments(null)
//             }
//           >
//             {viewComments === null ? "Back" : "More"}
//           </button>
//         </div>
//       </h1>

//       <div
//         className={`grid p-2 w-full justify-center box-border gap-2 ${
//           column === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2"
//         } grid-cols-1`}
//       >
//         {reviews.length === 0 && !loading && !error ? (
//           <div className="text-center p-4">No reviews available</div>
//         ) : (
//           reviews.map((review) => (
//             <div
//               key={review.review_id}
//               className="border border-gray-200 shadow-sm bg-white rounded-lg p-4 w-auto box-border"
//             >
//               <div className="flex gap-2">
//                 <div className="flex flex-col items-center justify-center">
//                   <div className="w-[40px] h-[40px] rounded-full bg-gray-100 flex items-center justify-center">
//                     <span className="text-gray-500 text-xs">
//                       {review.author_name ? review.author_name[0] : "A"}
//                     </span>
//                   </div>
//                   <div className="text-center text-[10px]">
//                     {review.author_name || "Anonymous"}
//                   </div>
//                 </div>
//                 <div className="flex flex-col">
//                   <div className="text-[12px] border flex w-[50px] rounded-lg items-center justify-center box-border">
//                     <IoIosStar className="text-black" />{" "}
//                     {review.rating || "N/A"}
//                   </div>
//                   <div className="text-[11px]">
//                     {review.date || "Unknown date"}
//                   </div>
//                 </div>
//                 <div className="font-semibold flex gap-2 mt-2 flex-grow justify-end items-center h-full">
//                   <Tooltip text="Accept" position="left">
//                     <button className="border-0 bg-transparent items-start flex h-0 rounded">
//                       <IoCheckmarkSharp className="text-[32px] text-green-500 bg-gray-50 rounded p-1" />
//                     </button>
//                   </Tooltip>
//                   <Tooltip text="Reject" position="left">
//                     <button className="border-0 bg-transparent items-start flex h-0 rounded">
//                       <IoCloseSharp className="text-[32px] text-red-500 bg-gray-50 rounded p-1" />
//                     </button>
//                   </Tooltip>
//                   <button
//                     onClick={() => setIsReply(review.review_id)}
//                     className="border-0 bg-transparent items-start flex h-0 rounded focus:outline-none"
//                   >
//                     <div className="bg-gray-50 rounded p-2">Reply</div>
//                   </button>
//                 </div>
//               </div>
//               <div className="mt-2 text-sm">
//                 <div className="flex flex-wrap gap-2">
//                   {review.aspects?.service && (
//                     <span>Service: {review.aspects.service}/5</span>
//                   )}
//                   {review.aspects?.food && (
//                     <span>Food: {review.aspects.food}/5</span>
//                   )}
//                   {review.aspects?.atmosphere && (
//                     <span>Atmosphere: {review.aspects.atmosphere}/5</span>
//                   )}
//                   {review.aspects?.["meal type"] && (
//                     <span>Meal Type: {review.aspects["meal type"]}</span>
//                   )}
//                   {review.aspects?.["price per person"] && (
//                     <span>Price: {review.aspects["price per person"]}</span>
//                   )}
//                   {review.aspects?.["recommended dishes"] && (
//                     <span>
//                       Recommended: {review.aspects["recommended dishes"]}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               {review.comments && review.comments.length > 0 && (
//                 <div className="mt-2 text-sm">
//                   {expandedComments[review.review_id] ? (
//                     review.comments.map((comment, index) => (
//                       <div key={index} className="border-t pt-2 mt-2">
//                         <strong>{comment.author || "Anonymous"}:</strong>{" "}
//                         {comment.text}
//                         <span className="text-xs text-gray-500">
//                           {" "}
//                           ({new Date(comment.date).toLocaleDateString()})
//                         </span>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="border-t pt-2 mt-2">
//                       <strong>
//                         {review.comments[0].author || "Anonymous"}:
//                       </strong>{" "}
//                       {review.comments[0].text.slice(0, 120)}...
//                     </div>
//                   )}
//                   {review.comments.length > 1 && (
//                     <button
//                       onClick={() => toggleExpandComment(review.review_id)}
//                       className="text-blue-500 text-xs ml-2"
//                     >
//                       {expandedComments[review.review_id]
//                         ? "Show Less"
//                         : "Show More"}
//                     </button>
//                   )}
//                 </div>
//               )}
//               {isReply === review.review_id && (
//                 <div className="flex gap-2 mt-2">
//                   <textarea
//                     name="reply"
//                     className="border border-black focus:outline-none flex-grow p-2 rounded"
//                     value={replyText}
//                     onChange={(evt) => setReplyText(evt.target.value)}
//                     placeholder="Type your reply..."
//                   />
//                   <button
//                     onClick={(e) => handleReply(e, review.review_id)}
//                     className="border-0 bg-blue-700 text-white rounded p-2 focus:outline-none"
//                   >
//                     Send
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentList;
