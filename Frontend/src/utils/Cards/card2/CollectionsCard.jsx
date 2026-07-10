// import { useNavigate } from "react-router-dom";
// import css from "./CollectionsCard.module.css";
// import rightArrow from "/icons/right-arrow.png";

// const CollectionsCard = ({ imgSrc, title, places }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     // Map collection titles to route slugs
//     const titleToSlug = {
//       "Catch the Match": "/CatchTheMatch",
//       "New In Town": "/new-in-town",
//       "Trending This Week": "/trending-this-week",
//       "Calling all Bars": "/calling-bar-hoppers",
//       "Top Trending Spots": "/collection/top-trending-spots",
//       "Candle Lit Dining": "/collection/candle-lit-dining",
//       "Newly Opened Places": "/collection/newly-opened-places",
//       "Best Rooftop Places": "/collection/best-rooftop-places",
//       "Best Insta-Worth": "/collection/best-insta-worth",
//       "Regional Flavours": "/collection/regional-flavours",
//       "Best Buffet In Town": "/collection/best-buffet-in-town",
//       "Asain Restaurants": "/collection/asian-restaurants",
//       "Best Pubs & Bars": "/collection/best-pubs-and-bars",
//       "Hyderabad Biryani": "/collection/hyderabad-biryani",
//       "Lit Party Places": "/collection/lit-party-places",
//       "Unique Dining Places": "/collection/unique-dining-places",
//       "Terrific Thalis": "/collection/terrific-thalis",
//       "Pure Veg Places": "/collection/pure-veg-places",
//       "Bingeworthy Dessert": "/collection/bingeworthy-dessert",
//       "Must Visit Cafes": "/collection/must-visit-cafes",
//     };

//     // Navigate to the appropriate route
//     const route = titleToSlug[title] || "/collections";
//     navigate(route);
//   };

//   return (
//     <div
//       className={`${css.card} mb-8 max-md:max-w-[220px] max-md:min-w-[230px] max-lg:max-w-[240px] max-lg:max-h-[300px] max-lg:min-w-[250px] max-lg:min-h-[300px]
//       max-md:min-h-[250px] max-xl:max-w-[400px] max-xl:min-w-[400px] max-xl:max-h-[250px]
//       max-xl:min-h-[250px] max-sm:min-w-[350px]  max-sm:max-w-[350px] max-sm:max-h-[200px] max-sm:min-h-[200px]`}
//       onClick={handleClick}
//     >
//       <img className={css.cardImg} src={imgSrc} alt="collection card" />
//       <div className={css.details}>
//         <div className={css.title}>{title}</div>
//         <div className={css.placesTxt}>
//           <span className={css.count}>{places} places</span>
//           <span className={css.rightArrowBox}>
//             <img
//               className={css.rightArrow}
//               src={rightArrow}
//               alt="right arrow"
//             />
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollectionsCard;

// import { useNavigate } from "react-router-dom";
// import rightArrow from "/icons/right-arrow.png";
// import { Heart } from "lucide-react";

// const CollectionsCard = ({
//   imgSrc,
//   title,
//   places,
//   id,
//   collectionName,
//   collectionImage,
//   handleLike,
//   liked,
// }) => {
//   const navigate = useNavigate();

//   // Use collectionName if provided, otherwise fall back to title
//   const displayTitle = collectionName || title;
//   // Use collectionImage if provided, otherwise fall back to imgSrc
//   const displayImage = collectionImage || imgSrc;
//   const handleLiked = (id) => {

    
    
//     handleLike(id, liked);
//   };
//   const handleClick = () => {
//     // Convert title to slug format for URL
//     const titleToSlug = (title) => {
//       return title
//         .toLowerCase()
//         .replace(/[^\w\s-]/g, "") // Remove special characters
//         .replace(/\s+/g, "-") // Replace spaces with hyphens
//         .replace(/--+/g, "-"); // Replace multiple hyphens with single hyphen
//     };

//     // Map collection titles to route slugs
//     const predefinedSlugs = {
//       "Catch the Match": "catch-the-match",
//       "New In Town": "new-in-town",
//       "Trending This Week": "trending-this-week",
//       "Calling all Bars": "calling-bar-hoppers",
//       "Top Trending Spots": "top-trending-spots",
//       "Candle Lit Dining": "candle-lit-dining",
//       "Newly Opened Places": "newly-opened-places",
//       "Best Rooftop Places": "best-rooftop-places",
//       "Best Insta-Worth": "best-insta-worth",
//       "Regional Flavours": "regional-flavours",
//       "Best Buffet In Town": "best-buffet-in-town",
//       "Asain Restaurants": "asian-restaurants",
//       "Best Pubs & Bars": "best-pubs-and-bars",
//       "Hyderabad Biryani": "hyderabad-biryani",
//       "Lit Party Places": "lit-party-places",
//       "Unique Dining Places": "unique-dining-places",
//       "Terrific Thalis": "terrific-thalis",
//       "Pure Veg Places": "pure-veg-places",
//       "Bingeworthy Dessert": "bingeworthy-dessert",
//       "Must Visit Cafes": "must-visit-cafes",
//     };

//     // Use predefined slug if available, otherwise generate from title
//     const slug = predefinedSlugs[displayTitle] || titleToSlug(displayTitle);

//     // Navigate to the collection page with the correct route format
//     navigate(`/collection/${slug}`);
//   };




//this is cmmented prevoiusly

  // return (
  //   <div
  //     className="relative w-full max-w-[350px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group"
  //     onClick={handleClick}
  //   >
  //     <img
  //       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  //       src={imgSrc}
  //       alt={${title} collection}
  //     />
  //     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
  //       <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
  //         {title}
  //       </h3>
  //       <div className="flex justify-between items-center mt-1">
  //         <span className="text-white text-sm sm:text-base">{places}</span>
  //         <img
  //           className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300"
  //           src={rightArrow}
  //           alt="right arrow"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );


  //upto this is the end of that coomented part plz note




//   return (
//     <div className="relative w-full max-w-[350px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group">
//       <img
//         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//         src={imgSrc}
//         alt={`${title} collection`}
//       />
//       <HeartIcon isLiked={liked} onClick={() => handleLiked(id)} />
//       <div
//         className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
//         onClick={handleClick}
//       >
//         <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
//           {title}
//         </h3>
//         <div className="flex justify-between items-center mt-1">
//           <span className="text-white text-sm sm:text-base">{places}</span>
//           <img
//             className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300"
//             src="https://via.placeholder.com/20x20.png?text=%3E" // Placeholder for right arrow
//             alt="right arrow"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const HeartIcon = ({ isLiked, onClick }) => (
//   <button
//     className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none z-10"
//     onClick={onClick}
//   >
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       className={`h-5 w-5 ${isLiked ? "text-orange-500" : "text-gray-400"}`}
//       viewBox="0 0 24 24"
//       fill="currentColor"
//     >
//       <path
//         fillRule="evenodd"
//         d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.4 5.4 0 017.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 21.04 3 24 6.94 24 11.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
//         clipRule="evenodd"
//       />
//     </svg>

  
//   </button>
// );
// export default CollectionsCard;





import { useNavigate } from "react-router-dom";
import rightArrow from "/icons/right-arrow.png";
import { Heart } from "lucide-react";

const CollectionsCard = ({
  imgSrc,
  title,
  places,
  id,
  collectionName,
  collectionImage,
  handleLike,
  liked,
}) => {
  const navigate = useNavigate();

  const displayTitle = collectionName || title;
  const displayImage = collectionImage || imgSrc;

  const handleLiked = (id) => {
    handleLike(id, liked);
  };

  const handleClick = () => {
    const titleToSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
    };
    const predefinedSlugs = {
      "Catch the Match": "catch-the-match",
      "New In Town": "new-in-town",
      "Trending This Week": "trending-this-week",
      "Calling all Bars": "calling-bar-hoppers",
      "Top Trending Spots": "top-trending-spots",
      "Candle Lit Dining": "candle-lit-dining",
      "Newly Opened Places": "newly-opened-places",
      "Best Rooftop Places": "best-rooftop-places",
      "Best Insta-Worth": "best-insta-worth",
      "Regional Flavours": "regional-flavours",
      "Best Buffet In Town": "best-buffet-in-town",
      "Asain Restaurants": "asian-restaurants",
      "Best Pubs & Bars": "best-pubs-and-bars",
      "Hyderabad Biryani": "hyderabad-biryani",
      "Lit Party Places": "lit-party-places",
      "Unique Dining Places": "unique-dining-places",
      "Terrific Thalis": "terrific-thalis",
      "Pure Veg Places": "pure-veg-places",
      "Bingeworthy Dessert": "bingeworthy-dessert",
      "Must Visit Cafes": "must-visit-cafes",
    };

    const slug = predefinedSlugs[displayTitle] || titleToSlug(displayTitle);
    navigate(`/collection/${slug}`);
  };

  return (
    <div className="relative w-full max-w-[350px] sm:max-w-[280px] md:max-w-[260px] lg:max-w-[280px] xl:max-w-[300px] h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[280px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group">
      <img
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        src={imgSrc}
        alt={`${title} collection`}
      />

      <HeartIcon isLiked={liked} onClick={() => handleLiked(id)} />

      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
        onClick={handleClick}
      >
        <h3 className="text-white text-lg sm:text-xl font-semibold truncate">
          {title}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-white text-sm sm:text-base">{places}</span>
          <img
            className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            src="https://via.placeholder.com/20x20.png?text=%3E"
            alt="right arrow"
          />
        </div>
      </div>
    </div>
  );
};

const HeartIcon = ({ isLiked, onClick }) => (
  <button
    className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none z-10"
    onClick={onClick}
  >
    <svg
      width="20"
      height="20"
      fill={isLiked ? "red" : "none"}
      stroke={isLiked ? "red" : "currentColor"}
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </button>
);

export default CollectionsCard;
