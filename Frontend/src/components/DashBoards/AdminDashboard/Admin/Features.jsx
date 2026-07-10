







// import React, { useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import { IoIosAddCircleOutline } from "react-icons/io";
// import PartitionLine from "./PartitionLine";
// import AddOption from "./AddOption";
// import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";
// import PushInList from "./PushInList";

// const Features = (prop) => {
//   const {
//     features = null,
//     title = "",
//     options = null,
//     isEditable = false,
//     setCurrResInfo,
//   } = prop;
//   // const [] = useState(null);
//   const [collection, setCollection] = useState(features);
//   const [group, setGroup] = useState(options);
//   const [isVisible, setIsVisible] = useState(-1);

//   const [info, setInfo] = useState({ name: "", value: "" });
//   const [str, setStr] = useState(null);
//   const [error, setError] = useState(null);

//   const addItem = () => {
//     //If features is not null
//     if (features) {
//       setIsVisible(0);
//     } else {
//       setIsVisible(1);
//     }
//     //for the options
//   };

//   // const closeTab = () => {
//   //   ;
//   // };

//   const removeItem = (key, value) => {
//     setCurrResInfo((prev) => ({
//       ...prev,
//       restaurantInfo: {
//         ...prev.restaurantInfo,
//         additionalInfo: Object.fromEntries(
//           Object.entries(prev.restaurantInfo.additionalInfo).filter(
//             ([k, v]) => k !== key
//           )
//         ),
//       },
//     }));
//   };

//   const removeListItem = (text) => {
//     setCurrResInfo((prev) => ({
//       ...prev,
//       features: prev.features.filter((el) => el !== text),
//     }));
//   };

//   const addItemInList = () => {
//     setCurrResInfo((prev) => {
//       // if name and value both are empty
//       if (info.name.length === 0 && info.value.length === 0) {
//         setError("Field are required");
//         return prev;
//       }

//       // Check if the key already exists
//       if (info.name in prev.restaurantInfo.additionalInfo) {
//         alert("Error: Item with the same key already exists!");
//         return prev; // Keep previous state unchanged
//       }

//       //add key value pair at the nested object
//       return {
//         ...prev,
//         restaurantInfo: {
//           ...prev.restaurantInfo,
//           ratings: {
//             ...prev.restaurantInfo.additionalInfo,
//             [info.name]: info.value,
//           },
//         },
//       }; // Add new item if key is unique
//     });
//     setInfo({ name: "", value: "" });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setInfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const addInList = () => {
//     setCurrResInfo((prev) => {
//       //If field is empty
//       if (str.length === 0) {
//         setError("Field are required");
//         return prev;
//       }

//       // Check if the key already exists
//       if (prev.features.includes(str.trim())) {
//         alert("Error: Item with the same key already exists!");
//         return prev; // Keep previous state unchanged
//       }

//       //add key value pair at the nested object
//       return {
//         ...prev,
//         features: [...prev.features, str],
//       }; // Add new item if key is unique
//     });
//     setStr(null);
//   };

//   return (
//     <div className="my-2">
//       <h1 className="overview-heading ">{title}</h1>
//       <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

//       {isVisible === 0 && (
//         <PushInList
//           setIsVisible={setIsVisible}
//           setStr={setStr}
//           addInList={addInList}
//         />
//       )}

//       {isVisible === 1 && (
//         <AddOption
//           handleChange={handleChange}
//           info={info}
//           addItemInList={addItemInList}
//           setIsVisible={setIsVisible}
//           setError={setError}
//           label={"Additional Info"}
//         />
//       )}

//       <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 mx-2">
//         {features &&
//           features.map((el, idx) => (
//             <DelBtn
//               key={idx}
//               isEditable={isEditable}
//               onBtnClick={() => removeListItem(el)}
//             >
//               <div className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:shadow-md hover:bg-gray-200 transition duration-200 ease-in-out flex items-center justify-between">
//                 <span>{el}</span>
//               </div>
//             </DelBtn>
//           ))}

//         {options &&
//           Object.entries(options).map(([key, value], idx) => (
//             <DelBtn
//               key={idx}
//               isEditable={isEditable}
//               onBtnClick={() => removeItem(key, value)}
//             >
//               <div className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:shadow-md hover:bg-gray-200 transition duration-200 ease-in-out flex items-center justify-between">
//                 <span>
//                   <b>{key}: &nbsp;</b>
//                   <i>{value}</i>
//                 </span>
//                 {/* <input
//                 type="checkbox"
//                 className="text-lg scale-110"
//                 name=""
//                 id=""
//               /> */}
//               </div>
//             </DelBtn>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default Features;

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io"; // Note: Same icon imported twice
import PartitionLine from "./PartitionLine";
import AddOption from "./AddOption";
import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";
import PushInList from "./PushInList";

const Features = (props) => {
  // Changed 'prop' to 'props' (convention)
  const {
    features = [],
    title = "",
    options = {},
    isEditable = false,
    setCurrResInfo,
  } = props;

  const [collection, setCollection] = useState(features);
  const [group, setGroup] = useState(options);
  const [isVisible, setIsVisible] = useState(-1);
  const [info, setInfo] = useState({ name: "", value: "" });
  const [str, setStr] = useState(""); // Changed null to empty string
  const [error, setError] = useState(null);

  const addItem = () => {
    if (features.length > 0) {
      // Changed condition to check array length
      setIsVisible(0);
    } else {
      setIsVisible(1);
    }
  };

  const removeItem = (key) => {
    // Removed unused 'value' parameter
    setCurrResInfo((prev) => ({
      ...prev,
      restaurantInfo: {
        ...prev.restaurantInfo,
        additionalInfo: Object.fromEntries(
          Object.entries(prev.restaurantInfo.additionalInfo).filter(
            ([k]) => k !== key // Simplified filter
          )
        ),
      },
    }));
  };

  const removeListItem = (text) => {
    setCurrResInfo((prev) => ({
      ...prev,
      features: prev.features.filter((el) => el !== text),
    }));
  };

  const addItemInList = () => {
    setCurrResInfo((prev) => {
      if (!info.name || !info.value) {
        // Simplified empty check
        setError("Fields are required"); // Fixed typo
        return prev;
      }

      if (prev.restaurantInfo.additionalInfo[info.name]) {
        // Simplified exists check
        setError("Error: Item with the same key already exists!");
        return prev;
      }

      return {
        ...prev,
        restaurantInfo: {
          ...prev.restaurantInfo,
          additionalInfo: {
            // Fixed property name from 'ratings' to 'additionalInfo'
            ...prev.restaurantInfo.additionalInfo,
            [info.name]: info.value,
          },
        },
      };
    });
    setInfo({ name: "", value: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addInList = () => {
    setCurrResInfo((prev) => {
      if (!str) {
        // Simplified empty check
        setError("Field is required"); // Fixed typo
        return prev;
      }

      if (prev.features.includes(str.trim())) {
        setError("Error: Item already exists!");
        return prev;
      }

      return {
        ...prev,
        features: [...prev.features, str.trim()], // Added trim() for cleanliness
      };
    });
    setStr(""); // Reset to empty string instead of null
  };

  return (
    <div className="my-2">
      <h1 className="overview-heading">{title}</h1>
      <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

      {isVisible === 0 && (
        <PushInList
          setIsVisible={setIsVisible}
          setStr={setStr}
          addInList={addInList}
        />
      )}

      {isVisible === 1 && (
        <AddOption
          handleChange={handleChange}
          info={info}
          addItemInList={addItemInList}
          setIsVisible={setIsVisible}
          setError={setError}
          label="Additional Info"
        />
      )}

      <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 mx-2">
        {features?.map((el, idx) => (
          <DelBtn
            key={idx}
            isEditable={isEditable}
            onBtnClick={() => removeListItem(el)}
          >
            <div className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:shadow-md hover:bg-gray-200 transition duration-200 ease-in-out flex items-center justify-between">
              <span>{el}</span>
            </div>
          </DelBtn>
        ))}

        {options &&
          Object.entries(options).map(([key, value], idx) => (
            <DelBtn
              key={idx}
              isEditable={isEditable}
              onBtnClick={() => removeItem(key)}
            >
              <div className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:shadow-md hover:bg-gray-200 transition duration-200 ease-in-out flex items-center justify-between">
                <span>
                  <b>{key}: </b>
                  <i>{value}</i>
                </span>
              </div>
            </DelBtn>
          ))}
      </div>
    </div>
  );
};

export default Features;
