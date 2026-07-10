// // import React from "react";
// // import { Link } from "react-router-dom";
// // import css from "./RecentlyViewedCard.module.css";

// // const RecentlyViewedCard = ({ udata, id }) => {
// //   // Fallback values to avoid undefined errors
// //   const {
// //     _id,
// //     restaurantInfo: {
// //       name = "Unknown Restaurant",
// //       address = "No address available",
// //       cuisines = [],
// //       ratings = { overall: 0 },
// //       image_urls = ["/images/default.jpg"], // Fallback image
// //     } = {},
// //   } = udata || {};

// //   return (
// //     <Link
// //       to={`/hyderabad/${id}/${name
// //         .toLowerCase()
// //         .replace(/\s+/g, "-")}/overview`}
// //       className={css.outerDiv}
// //     >
// //       <div className={css.innerDiv}>
// //         <div className={css.imgBox}>
// //           <img
// //             src={image_urls[0]}
// //             alt={`${name} picture`}
// //             className={css.img}
// //           />
// //         </div>
// //         <div className={css.txt}>
// //           <div className={css.name}>{name}</div>
// //           <div className={css.ratings}>
// //             <div className={css.ratingBox}>
// //               <span className={css.rating}>{ratings.overall || 0}</span>
// //               <span className={css.ratingTxt}>Dining</span>
// //             </div>

// //           </div>
// //           <div className={css.address}>{address}</div>
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // };

// // export default RecentlyViewedCard;

// import React from "react";
// import { Link } from "react-router-dom";

// const RecentlyViewedCard = ({ udata, id }) => {
//   const {
//     _id,
//     firmInfo: {
//       name = "Unknown Restaurant",
//       address = "No address available",
//       cuisines = [],
//       ratings = { overall: 0 },
//       image_urls = ["/images/default.jpg"],
//     } = {},
//   } = udata || {};

//   const restaurantUrlName = name.toLowerCase().replace(/\s+/g, "-");
//   const linkTo = `/hyderabad/${id || _id}/${restaurantUrlName}/overview`;

//   return (
//     <Link
//       to={linkTo}
//       className=" w-full max-w-60 mx-auto my-2 rounded-lg cursor-pointer no-underline text-inherit overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
//       // to={`/hyderabad/${id}/${name
//       //   .toLowerCase()
//       //   .replace(/\s+/g, "-")}/overview`}
//       // className={`${css.outerDiv}`}
//     >
//       <div className="w-full h-full flex flex-col">
//         <div className="w-full h-36 sm:h-40 md:h-44 rounded-t-lg overflow-hidden flex-shrink-0">
//           <img
//             src={image_urls[0]}
//             alt={`${name} picture`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="p-3 flex flex-col flex-grow">
//           <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
//             {name}
//           </h3>
//           <div className="flex items-center mb-2">
//             <div className="flex items-center">
//               <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
//                 {ratings.overall || 0}
//               </span>
//               <span className="text-sm text-gray-600 ml-2">Dining</span>
//             </div>
//           </div>
//           <p className="text-sm font-normal text-gray-500 truncate flex-shrink-0">
//             {address}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default RecentlyViewedCard;

import React from "react";
import { Link } from "react-router-dom";

const RecentlyViewedCard = ({ udata, id }) => {
  const isFirm = udata?.itemType === "Firm";
  const isTiffin = udata?.itemType === "Tiffin";

  const { _id, firmInfo, tiffinInfo } = udata || {};

  const info = isFirm ? firmInfo : isTiffin ? tiffinInfo : {};

  const {
    name = "Unknown",
    address = "No address available",
    cuisines = [],
    ratings = { overall: 0 },
    image_urls = ["/images/default.jpg"],
  } = info;

  const displayRating =
    typeof ratings === "number" ? ratings : ratings.overall || 0;

  const actualId = id || _id || udata?.itemId;

  const restaurantUrlName = name.toLowerCase().replace(/\s+/g, "-");
  const linkTo = isTiffin
    ? `/tiffin/${actualId}/${restaurantUrlName}/tiffins`
    : `/hyderabad/${actualId}/${restaurantUrlName}/overview`;

  return (
    <Link
      to={linkTo}
      className=" w-full max-w-60 mx-auto my-2 rounded-lg cursor-pointer no-underline text-inherit overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-36 sm:h-40 md:h-44 rounded-t-lg overflow-hidden flex-shrink-0">
          <img
            src={image_urls[0]}
            alt={`${name} picture`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
            {name}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {displayRating}
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {isFirm ? "Dining" : "Tiffin"}
              </span>
            </div>
          </div>
          <p className="text-sm font-normal text-gray-500 truncate flex-shrink-0">
            {address}
          </p>
          {cuisines.length > 0 && isFirm && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {cuisines.join(", ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecentlyViewedCard;
