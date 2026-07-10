// import React,{useEffect} from 'react'
// import styles from "./WhatMakeUs.module.css"
// import { IoIosArrowDown } from "react-icons/io";

// const WhatMakeUs = ( {item} ) => {
//     useEffect(() => {
//       window.scrollTo(0, 0);
//     }, []);
//   return (
//     <div>
//         <div className={styles.container}>
//             <div className={styles.subContenet}>
//                 <img src={item.img} />
//                 <h1>{item.title}</h1>
//                 <div className={styles.arrow}>
//                     <IoIosArrowDown  />
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default WhatMakeUs

import React, { useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";

const WhatMakeUs = ({ item }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full pb-5 pl-[5vw] md:pl-[15rem] mt-10">
      <div className="flex items-center gap-4">
        <img
          src={item.img}
          alt={item.title}
          className="w-8 md:w-[2vw] object-contain"
        />
        <h1 className="text-sm md:text-[1vw] font-semibold w-1/2">
          {item.title}
        </h1>
        <div className="w-[10vw] flex justify-end">
          <IoIosArrowDown size={24} />
        </div>
      </div>
    </div>
  );
};

export default WhatMakeUs;
