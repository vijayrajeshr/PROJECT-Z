// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import css from "./CategorySelectionComp.module.css";

// import {
//   orderOnlinePage,
//   diningOutPage,
//   proAndProPlusPage,
//   nightLifePage,
// } from "../../../helpers/constants";

// let CategorySelectionComp = ({
//   imgSrc,
//   imgSrc2,
//   title,
//   color,
//   isActive,
//   setIsActive,
//   comp,
// }) => {
//   let navigate = useNavigate();

//   let outerClass = isActive[comp] ? css.outerDivActive : css.outerDiv;
//   let titleClass = isActive[comp] ? css.titleActive : css.title;
//   let backgroundColor = isActive[comp] ? color : "#eee";

//   let changeState = () => {
//     setIsActive((val) => {
//       return {
//         dinning: false,
//         delivery: false,
//         nightlife: false,
//         [comp]: !val[comp],
//       };
//     });

//     let param =
//       comp === "delivery"
//         ? orderOnlinePage
//         : comp === "dinning"
//         ? diningOutPage
//         : comp === "kitchen"
//         ? proAndProPlusPage
//         : nightLifePage;
//     navigate("/show-case/?page=" + param);
//   };

//   return (
//     <div className={`${outerClass} max-sm:max-w-[150px]`} onClick={changeState}>
//       <div className={css.innerDiv}>
//         <div
//           className={css.imgBox}
//           style={{ backgroundColor: backgroundColor }}
//         >
//           <img
//             className={css.img}
//             src={isActive[comp] ? imgSrc2 : imgSrc}
//             alt="image"
//           />
//         </div>
//         <div className={css.txtBox}>
//           <div className={titleClass}>{title}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CategorySelectionComp;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import css from "./CategorySelectionComp.module.css";

import {
  orderOnlinePage,
  diningOutPage,
  proAndProPlusPage,
  nightLifePage,
} from "../../../helpers/constants";

let CategorySelectionComp = ({
  imgSrc,
  imgSrc2,
  title,
  color,
  isActive,
  setIsActive,
  comp,
}) => {
  let navigate = useNavigate();

  const isThisTabActive = isActive[comp];

  const tabClasses = `${css.tabItem} ${
    isThisTabActive ? css.tabItemActive : ""
  }`;
  const imgClasses = `${css.tabIcon} ${
    isThisTabActive ? css.tabIconActive : ""
  }`; // For icon styling
  const titleClasses = `${css.tabTitle} ${
    isThisTabActive ? css.tabTitleActive : ""
  }`; // For title styling

  const changeTab = () => {
    // Only update if this tab is not already active, prevents unnecessary re-renders
    if (!isThisTabActive) {
      setIsActive((prevActiveStates) => {
        // Create a new object with all categories set to false
        const newActiveStates = {
          dinning: false,
          delivery: false,
          nightlife: false,
          kitchen: false, // Ensure all possible categories are covered and reset
        };
        // Then, activate the clicked component
        newActiveStates[comp] = true;
        return newActiveStates;
      });

      // Determine the navigation parameter based on the 'comp' prop
      let param;
      switch (comp) {
        case "delivery":
          param = orderOnlinePage;
          break;
        case "dinning":
          param = diningOutPage;
          break;
        case "kitchen":
          param = proAndProPlusPage;
          break;
        case "nightlife":
          param = nightLifePage;
          break;
        default:
          console.warn("Unknown category component:", comp);
          param = diningOutPage;
      }
      navigate("/show-case/?page=" + param);
    }
  };

  return (
    <div
      className={tabClasses}
      onClick={changeTab}
      // Accessibility attributes for a tab role
      role="tab"
      aria-selected={isThisTabActive ? "true" : "false"}
      tabIndex={isThisTabActive ? "0" : "-1"} // Active tab is tab-focusable, others less so (managed by a tablist if multiple tabs)
      aria-controls={`panel-${comp}`} // Link to the content panel it controls
      aria-label={`${title} tab`}
    >
      {/* If you want an icon in the tab, keep this div */}
      <div className={css.tabIconContainer}>
        <img
          className={imgClasses}
          src={isThisTabActive ? imgSrc2 : imgSrc} // Use active icon when selected
          alt={`${title} icon`}
        />
      </div>
      <div className={css.tabTitleContainer}>
        <div className={titleClasses}>{title}</div>
      </div>
    </div>
  );
};

export default CategorySelectionComp;
