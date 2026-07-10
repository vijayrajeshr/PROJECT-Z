// import React, { useState, useEffect, useContext } from "react";
// import css from "./ReviewsComponent.module.css";
// import RateYourExperienceCard from "../../../../../utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";
// import RestUserReviewedCard from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/RestUserReviewedCard";
// import DropdownUtil from "../../../../../utils/RestaurantUtils/DropdownUtil/DropdownUtil";
// import { useAuth } from "../../../../../context/AuthContext";
// import { useParams, Link } from "react-router-dom";
// import { Info } from "lucide-react";
// // import MianReviewedComponent from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/MainComponent";
// import profilepic from "/images/profilepic.jpg";
// import dropdownIcon from "/icons/down-arrow1.png";
// import menu from "/icons/menu.png";
// import Axios from "axios";

// const ReviewsComponent = () => {
//   const [data, setData] = useState([]);
//   const { id: firmId, reviewId } = useParams();
//   const { user, profileData } = useAuth();

//   const currentUserData = profileData?.email
//     ? profileData
//     : user
//     ? { username: user }
//     : null;

//   const [selectedFilter, setSelectedFilter] = useState("All Reviews");
//   const [sortOrder, setSortOrder] = useState("Newest First");

//   const filterReviews = (filter) => {
//     setSelectedFilter(filter);
//   };

//   const sortReviews = (order) => {
//     setSortOrder(order);
//     const sortedData = [...data].sort((a, b) => {
//       const dateA = new Date(a.createdAt || 0);
//       const dateB = new Date(b.createdAt || 0);
//       if (order === "Newest First") return dateB - dateA;
//       if (order === "Oldest First") return dateA - dateB;
//       if (order === "Highest Rated") return (b.rating || 0) - (a.rating || 0);
//       if (order === "Lowest Rated") return (a.rating || 0) - (b.rating || 0);
//       return 0;
//     });
//     setData(sortedData);
//   };

//   const handleReviewSubmit = (newReview) => {
//     setData([newReview, ...data]);
//   };

//   const handleAddComment = (reviewId, commentText) => {
//     if (commentText.trim() === "") return;
//     setData((prevData) =>
//       prevData.map((review) =>
//         review._id === reviewId
//           ? {
//               ...review,
//               comments: [
//                 ...(review.comments || []),
//                 { text: commentText, timestamp: new Date().toISOString() },
//               ],
//             }
//           : review
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchRestaurants = async () => {
//       try {
//         const response = await Axios.get(
//           `${
//             import.meta.env.VITE_SERVER_URL
//           }/firm/restaurants/get-reviews/${firmId}`
//         );
//         setData(response.data.reviews); // Fallback to response.data if .data is undefined
//       } catch (err) {
//         console.error("Error fetching overview:", err);
//       }
//     };
//     fetchRestaurants();
//   }, [firmId]);

//   return (
//     <div className={css.outerDiv}>
//       <div className={css.innerDiv}>
//         <div className={css.right}>
//           {currentUserData?.email ? (
//             <RateYourExperienceCard
//               userData={currentUserData}
//               firmId={firmId}
//               onReviewSubmit={handleReviewSubmit}
//             />
//           ) : (
//             <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-sm text-center w-full max-w-lg mx-auto my-8">
//               <Info className="inline-block w-5 h-5 mr-2 mb-1" />
//               Please{" "}
//               <Link
//                 to="/login"
//                 className="font-semibold underline hover:text-blue-600"
//               >
//                 log in
//               </Link>{" "}
//               or{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold underline hover:text-blue-600"
//               >
//                 sign up
//               </Link>{" "}
//               to leave a review.
//             </div>
//           )}
//         </div>
//         <div className={css.left}>
//           <div className={css.dropDowns}>
//             <DropdownUtil
//               options={["All Reviews", "Popular"]}
//               icon2={dropdownIcon}
//               filFunc={filterReviews}
//             />
//             <DropdownUtil
//               options={[
//                 "Newest First",
//                 "Oldest First",
//                 "Highest Rated",
//                 "Lowest Rated",
//               ]}
//               icon1={menu}
//               icon2={dropdownIcon}
//               filFunc={sortReviews}
//             />
//           </div>
//           <div className={css.reviewListContainer}>
//             {/* {data && data.length > 0 ? (
//               data
//                 .filter((item) => selectedFilter === "All Reviews")
//                 .map((item) => (
//                   <MianReviewedComponent
//                     key={item._id}
//                     data={item}
//                     onAddComment={handleAddComment}
//                     currentUser={currentUserData}
//                   />
//                 ))
//             ) : (
//               <div className={css.noReviews}>No reviews found.</div>
//             )} */}
//             {reviewId ? (
//               <RestUserReviewedCard
//                 data={data.filter((e) => e._id === reviewId)[0]}
//                 onAddComment={handleAddComment}
//                 currentUser={currentUserData}
//               />
//             ) : data && data.length > 0 ? (
//               // data
//               //   .filter(
//               //     (item) =>
//               //       selectedFilter === "All Reviews" ||
//               //       item.reviewType === selectedFilter
//               //   )
//               data.map((item) => (
//                 <RestUserReviewedCard
//                   key={item._id}
//                   data={item}
//                   onAddComment={handleAddComment}
//                   currentUser={currentUserData}
//                 />
//               ))
//             ) : (
//               <div className={css.noReviews}>No reviews found.</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsComponent;

import React, { useState, useEffect, useContext } from "react";
import css from "./ReviewsComponent.module.css";
import RateYourExperienceCard from "../../../../../utils/Cards/RestaurantBodyCards/RateYourExperienceCard/RateYourExperienceCard";
import RestUserReviewedCard from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/RestUserReviewedCard";
import DropdownUtil from "../../../../../utils/RestaurantUtils/DropdownUtil/DropdownUtil";
import { useAuth } from "../../../../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { Info } from "lucide-react";
// import MianReviewedComponent from "../../../../../utils/RestaurantUtils/RestUserReviewedCard/MainComponent";
import profilepic from "/images/profilepic.jpg";
import dropdownIcon from "/icons/down-arrow1.png";
import menu from "/icons/menu.png";
import Axios from "axios";

const ReviewsComponent = () => {
  const [data, setData] = useState([]);
  const { id: firmId, reviewId } = useParams();
  const { user, profileData } = useAuth();
  console.log(data);
  const currentUserData = profileData?.email
    ? profileData
    : user
    ? { username: user }
    : null;

  const [selectedFilter, setSelectedFilter] = useState("All Reviews");
  const [sortOrder, setSortOrder] = useState("Newest First");

  const filterReviews = (filter) => {
    setSelectedFilter(filter);
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      if (filter === "Popular") return (b.rating || 0) - (a.rating || 0);
      if (filter === "All Reviews") return dateB - dateA;
      return 0;
    });
    setData(sortedData);
  };

  const sortReviews = (order) => {
    setSortOrder(order);
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      if (order === "Newest First") return dateB - dateA;
      if (order === "Oldest First") return dateA - dateB;
      if (order === "Highest Rated") return (b.rating || 0) - (a.rating || 0);
      if (order === "Lowest Rated") return (a.rating || 0) - (b.rating || 0);
      return 0;
    });
    setData(sortedData);
  };

  const handleReviewSubmit = (newReview) => {
    setData([newReview, ...data]);
  };

  const handleAddComment = (reviewId, commentText) => {
    if (commentText.trim() === "") return;
    setData((prevData) =>
      prevData.map((review) =>
        review._id === reviewId
          ? {
              ...review,
              comments: [
                ...(review.comments || []),
                { text: commentText, timestamp: new Date().toISOString() },
              ],
            }
          : review
      )
    );
  };

  // useEffect(() => {
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await Axios.get(
  //         `${
  //           import.meta.env.VITE_SERVER_URL
  //         }/firm/restaurants/get-reviews/${firmId}`
  //       );
  //       const tiffinReviews=await Axios.get(`${import.meta.env.VITE_SERVER_URL}/api/tiffin-Reviews/${firmId}`);

  //       setData(response.data.reviews ||tiffinReviews.data.reviews) ;
  //     } catch (err) {
  //       console.error("Error fetching overview:", err);
  //     }
  //   };
  //   fetchRestaurants();
  // }, [firmId]);

  useEffect(() => {
    const fetchReviews = async () => {
      let restaurantReviews = [];
      let tiffinReviews = [];

      try {
        const response = await Axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/firm/restaurants/get-reviews/${firmId}`
        );
        if (response.data && Array.isArray(response.data.reviews)) {
          restaurantReviews = response.data.reviews;
        }
      } catch (err) {
        if (
          Axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 404
        ) {
          // Specific handling for 404 if needed, otherwise just let it be an empty array
        } else {
          console.error("Error fetching restaurant reviews:", err);
        }
      }

      try {
        const response = await Axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/tiffin-Reviews/${firmId}`
        );
        if (response.data && Array.isArray(response.data.reviews)) {
          tiffinReviews = response.data.reviews;
        }
      } catch (err) {
        if (
          Axios.isAxiosError(err) &&
          err.response &&
          err.response.status === 404
        ) {
          // aa
        } else {
          console.error("Error fetching tiffin reviews:", err);
        }
      }

      if (restaurantReviews.length > 0) {
        setData(restaurantReviews);
      } else {
        setData(tiffinReviews);
      }
    };

    fetchReviews();
  }, [firmId]);
  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <div className={css.right}>
          {currentUserData?.email ? (
            <RateYourExperienceCard
              userData={currentUserData}
              firmId={firmId}
              onReviewSubmit={handleReviewSubmit}
            />
          ) : (
            <div
              className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg shadow-sm text-center w-full max-w-lg mx-auto my-8"
              style={{
                marginTop: window.innerWidth <= 1020 ? "-20px" : undefined,
              }}
            >
              <Info className="inline-block w-5 h-5 mr-2 mb-1" />
              Please{" "}
              <Link
                to="/login"
                className="font-semibold underline hover:text-blue-600"
              >
                log in
              </Link>{" "}
              or{" "}
              <Link
                to="/signup"
                className="font-semibold underline hover:text-blue-600"
              >
                sign up
              </Link>{" "}
              to leave a review.
            </div>
          )}
        </div>
        <div className={css.left}>
          <div className={css.dropDowns}>
            <DropdownUtil
              options={["All Reviews", "Popular"]}
              icon2={dropdownIcon}
              filFunc={filterReviews}
            />
            <DropdownUtil
              options={[
                "Newest First",
                "Oldest First",
                "Highest Rated",
                "Lowest Rated",
              ]}
              icon1={menu}
              icon2={dropdownIcon}
              filFunc={sortReviews}
            />
          </div>
          <div className={css.reviewListContainer}>
            {/* {data && data.length > 0 ? (
              data
                .filter((item) => selectedFilter === "All Reviews")
                .map((item) => (
                  <MianReviewedComponent
                    key={item._id}
                    data={item}
                    onAddComment={handleAddComment}
                    currentUser={currentUserData}
                  />
                ))
            ) : (
              <div className={css.noReviews}>No reviews found.</div>
            )} */}
            {reviewId ? (
              <RestUserReviewedCard
                data={data.filter((e) => e._id === reviewId)[0]}
                onAddComment={handleAddComment}
                currentUser={currentUserData}
              />
            ) : data && data.length > 0 ? (
              // data
              //   .filter(
              //     (item) =>
              //       selectedFilter === "All Reviews" ||
              //       item.reviewType === selectedFilter
              //   )
              data.map((item) => (
                <RestUserReviewedCard
                  key={item._id}
                  data={item}
                  onAddComment={handleAddComment}
                  currentUser={currentUserData}
                />
              ))
            ) : (
              <div className={css.noReviews}>No reviews found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsComponent;
