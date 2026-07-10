// import { useState } from "react";

// import css from "./UserPhotosCard.module.css";

// import happyHoursImg from "/images/happyhours.jpg";

// import SmallCardImg from "../../../../Cards/card6/SmallCardImg";

// import UserProfileNoData from "../../UserProfileNoData/UserProfileNoData";

// const UserPhotosCard = ({ hashId }) => {
//   let [data, setData] = useState([
//     {
//       id: 1,
//       imgSrc: happyHoursImg,
//     },
//     {
//       id: 2,
//       imgSrc: happyHoursImg,
//     },
//     {
//       id: 3,
//       imgSrc: happyHoursImg,
//     },
//     {
//       id: 4,
//       imgSrc: happyHoursImg,
//     },
//   ]);
//   let [isData, setIsData] = useState(true);

//   return (
//     <div className={css.outerDiv}>
//       {isData ? (
//         <div className={css.innerDiv}>
//           {data.map((item) => {
//             return <SmallCardImg imgSrc={item.imgSrc} key={item.id} />;
//           })}
//         </div>
//       ) : (
//         <UserProfileNoData hashId={hashId} />
//       )}
//     </div>
//   );
// };

// export default UserPhotosCard;


import { useState } from "react";

// Assuming happyHoursImg and SmallCardImg are correctly imported
import happyHoursImg from "/images/happyhours.jpg";
import SmallCardImg from "../../../../Cards/card6/SmallCardImg"; // Ensure path is correct

import UserProfileNoData from "../../UserProfileNoData/UserProfileNoData"; // Ensure path is correct

const UserPhotosCard = ({ hashId }) => {
  let [data, setData] = useState([
    {
      id: 1,
      imgSrc: happyHoursImg,
    },
    {
      id: 2,
      imgSrc: happyHoursImg,
    },
    {
      id: 3,
      imgSrc: happyHoursImg,
    },
    {
      id: 4,
      imgSrc: happyHoursImg,
    },
    {
      id: 5, // Added more items to demonstrate scrolling/grid
      imgSrc: happyHoursImg,
    },
    {
      id: 6,
      imgSrc: happyHoursImg,
    },
    {
      id: 7,
      imgSrc: happyHoursImg,
    },
    {
      id: 8,
      imgSrc: happyHoursImg,
    },
  ]);
  let [isData, setIsData] = useState(data.length > 0);



  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6"> {/* outerDiv: Card styling */}
      {isData ? (
        // innerDiv: Responsive Grid layout for photos
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.map((item) => (
            <SmallCardImg imgSrc={item.imgSrc} key={item.id} />
          ))}
        </div>
      ) : (
        <UserProfileNoData hashId={hashId} />
      )}
    </div>
  );
};

export default UserPhotosCard;