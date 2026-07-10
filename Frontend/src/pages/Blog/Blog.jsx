// import React, { useEffect, useState } from "react";
// import styles from "./Blog.module.css";
// import { Link, useLocation } from "react-router-dom";
// import BlogImageComponent from "./BlogImageComponent";
// import css from "./BlogImageComponent.module.css";
// import Footer from "../../components/Footer/Footer";

// const Blog = () => {
//   const location = useLocation();
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location]);

//   const allCategories = [
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/02/Mysore-Raman-Blog-1.jpg",
//       dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
//       title:
//         "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
//       desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
//       dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
//       title: "Q3FY25 shareholders’ letter and results",
//       desc: "A quick capture of headline results from this quarter",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
//       dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
//       desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
//       dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
//       desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
//       dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
//       title:
//         "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
//       desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
//       dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
//       title:
//         "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
//       desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
//     },
//   ];

//   const community = [
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/10/Blog-Cover.jpg",
//       dateAndTime: "Anjalli Kumar | October 21, 2024 | 2 min read",
//       title:
//         "Delivery Partner Well-being – Introducing a framework to guide our efforts",
//       desc: "Read more about our recently launched Delivery Partner Well-being framework",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/06/image4.png",
//       dateAndTime: "Anjalli Kumar | June 14, 2024 | 6 min read",
//       title:
//         "Diversity Dialogue II – Building an Inclusive Fleet: Insights from Zomato’s Equitable Action for Livelihood",
//       desc: "Read more about our journey of onboarding Persons with Disabilities onto Zomato’s platform as delivery partners",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2023/11/FINAL-COVER.png",
//       dateAndTime: "Anjalli Kumar | November 20, 2023 | 5 min read",
//       title:
//         "The business benefits of having more women working in warehouses and dark stores",
//       desc: "Discover how we’re extending our gender diversity commitment to our warehouses and dark stores by onboarding more women, and review the business benefits we’re witnessing from doing so.",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2023/09/blog-header.png",
//       dateAndTime: "Jahnvi Goyal | September 21, 2023 | 3 min read",
//       title:
//         "Introducing Tips For The Kitchen Staff: An Initiative that Celebrates Restaurants",
//       desc: "Share your love and gratitude with the kitchen staff of your favorite restaurants you order from with ‘Tips for the kitchen staff’.",
//     },
//   ];

//   const company = [
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
//       dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
//       title:
//         "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
//       desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
//       dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
//       title: "Q3FY25 shareholders’ letter and results",
//       desc: "A quick capture of headline results from this quarter",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
//       dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
//       desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
//       dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
//       desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
//       dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
//       title:
//         "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
//       desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
//       dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
//       title:
//         "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
//       desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
//     },
//   ];

//   const culture = [
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2023/05/Blog-Header.png",
//       dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
//       title:
//         "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
//       desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
//       dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
//       title: "Q3FY25 shareholders’ letter and results",
//       desc: "A quick capture of headline results from this quarter",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
//       dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
//       desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
//       dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
//       desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
//       dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
//       title:
//         "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
//       desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
//       dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
//       title:
//         "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
//       desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
//     },
//   ];

//   const technology = [
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/02/Mysore-Raman-Blog-1.jpg",
//       dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
//       title:
//         "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
//       desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
//       dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
//       title: "Q3FY25 shareholders’ letter and results",
//       desc: "A quick capture of headline results from this quarter",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
//       dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
//       desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
//       dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
//       title:
//         "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
//       desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
//     },
//     {
//       image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
//       dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
//       title:
//         "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
//       desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
//     },
//     {
//       image:
//         "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
//       dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
//       title:
//         "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
//       desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
//     },
//   ];

//   const [activeState, setActiveState] = useState("none");

//   useEffect(() => {
//     if (location.pathname.includes("/blog/allcategories")) {
//       setActiveState("allCategory");
//     } else if (location.pathname.includes("/blog/community")) {
//       setActiveState("community");
//     } else if (location.pathname.includes("/blog/company")) {
//       setActiveState("company");
//     } else if (location.pathname.includes("/blog/culture")) {
//       setActiveState("culture");
//     } else if (location.pathname.includes("/blog/technology")) {
//       setActiveState("technology");
//     }
//   }, [location.pathname]);

//   return (
//     <>
//       {activeState == "none" ? (
//         <div className="">
//           <div className={styles.blogMainBody}>
//             <div className={styles.blogMainContainer}>
//               <div className={styles.blogMainImage}>
//                 <img
//                   src="https://b.zmtcdn.com/data/file_assets/621862abf874a7c2be8fdd6d062ca67a1678705718.webp"
//                   alt="Blog Banner"
//                 />
//               </div>

//               {/* Category Navigation */}

//               <div className={styles.blogsmallbox}>
//                 <Link to="/blog/allcategories" state={{ allCategories }}>
//                   <button
//                     className={
//                       activeState === "allCategory"
//                         ? styles.active
//                         : styles.inactive
//                     }
//                     onClick={() => setActiveState("allCategory")}
//                   >
//                     All Categories
//                   </button>
//                 </Link>

//                 <Link to="/blog/community" state={{ community }}>
//                   <button
//                     className={
//                       activeState === "community"
//                         ? styles.active
//                         : styles.inactive
//                     }
//                     onClick={() => setActiveState("community")}
//                   >
//                     Community
//                   </button>
//                 </Link>

//                 <Link to="/blog/company" state={{ company }}>
//                   <button
//                     className={
//                       activeState === "company"
//                         ? styles.active
//                         : styles.inactive
//                     }
//                     onClick={() => setActiveState("company")}
//                   >
//                     Company
//                   </button>
//                 </Link>

//                 <Link to="/blog/culture" state={{ culture }}>
//                   <button
//                     className={
//                       activeState === "culture"
//                         ? styles.active
//                         : styles.inactive
//                     }
//                     onClick={() => setActiveState("culture")}
//                   >
//                     Culture
//                   </button>
//                 </Link>

//                 <Link to="/blog/technology" state={{ technology }}>
//                   <button
//                     className={
//                       activeState === "technology"
//                         ? styles.active
//                         : styles.inactive
//                     }
//                     onClick={() => setActiveState("technology")}
//                   >
//                     Technology
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {allCategories ? (
//             <div className="">
//               <div className={css.allCategoriesContainer}>
//                 {allCategories.map((data, idx) => (
//                   <div key={idx} className={css.eachBox}>
//                     <BlogImageComponent data={data} />
//                   </div>
//                 ))}
//               </div>
//               <Footer />
//             </div>
//           ) : (
//             <h1>Data ot present</h1>
//           )}
//         </div>
//       ) : (
//         <div className={styles.blogMainBody}>
//           <div className={styles.blogMainContainer}>
//             <div className={styles.blogMainImage}>
//               <img
//                 src="https://b.zmtcdn.com/data/file_assets/621862abf874a7c2be8fdd6d062ca67a1678705718.webp"
//                 alt="Blog Banner"
//               />
//             </div>

//             {/* Category Navigation */}

//             <div className={styles.blogsmallbox}>
//               <Link to="/blog/allcategories" state={{ allCategories }}>
//                 <button
//                   className={
//                     activeState === "allCategory"
//                       ? styles.active
//                       : styles.inactive
//                   }
//                   onClick={() => setActiveState("allCategory")}
//                 >
//                   All Categories
//                 </button>
//               </Link>

//               <Link to="/blog/community" state={{ community }}>
//                 <button
//                   className={
//                     activeState === "community"
//                       ? styles.active
//                       : styles.inactive
//                   }
//                   onClick={() => setActiveState("community")}
//                 >
//                   Community
//                 </button>
//               </Link>

//               <Link to="/blog/company" state={{ company }}>
//                 <button
//                   className={
//                     activeState === "company" ? styles.active : styles.inactive
//                   }
//                   onClick={() => setActiveState("company")}
//                 >
//                   Company
//                 </button>
//               </Link>

//               <Link to="/blog/culture" state={{ culture }}>
//                 <button
//                   className={
//                     activeState === "culture" ? styles.active : styles.inactive
//                   }
//                   onClick={() => setActiveState("culture")}
//                 >
//                   Culture
//                 </button>
//               </Link>

//               <Link to="/blog/technology" state={{ technology }}>
//                 <button
//                   className={
//                     activeState === "technology"
//                       ? styles.active
//                       : styles.inactive
//                   }
//                   onClick={() => setActiveState("technology")}
//                 >
//                   Technology
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Blog;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";
import Footer from "../../components/Footer/Footer";

const Blog = () => {
  const location = useLocation();
  const [activeState, setActiveState] = useState("none");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (location.pathname.includes("/blog/allcategories")) {
      setActiveState("allCategory");
    } else if (location.pathname.includes("/blog/community")) {
      setActiveState("community");
    } else if (location.pathname.includes("/blog/company")) {
      setActiveState("company");
    } else if (location.pathname.includes("/blog/culture")) {
      setActiveState("culture");
    } else if (location.pathname.includes("/blog/technology")) {
      setActiveState("technology");
    }
  }, [location.pathname]);

  const allCategories = [
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/02/Mysore-Raman-Blog-1.jpg",
      dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
      title:
        "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
      desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
      dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
      title: "Q3FY25 shareholders’ letter and results",
      desc: "A quick capture of headline results from this quarter",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
      dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
      title:
        "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
      desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
      dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
      title:
        "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
      desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
      dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
      title:
        "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
      desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
      dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
      title:
        "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
      desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
    },
  ];

  const community = [
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/10/Blog-Cover.jpg",
      dateAndTime: "Anjalli Kumar | October 21, 2024 | 2 min read",
      title:
        "Delivery Partner Well-being – Introducing a framework to guide our efforts",
      desc: "Read more about our recently launched Delivery Partner Well-being framework",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/06/image4.png",
      dateAndTime: "Anjalli Kumar | June 14, 2024 | 6 min read",
      title:
        "Diversity Dialogue II – Building an Inclusive Fleet: Insights from Zomato’s Equitable Action for Livelihood",
      desc: "Read more about our journey of onboarding Persons with Disabilities onto Zomato’s platform as delivery partners",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2023/11/FINAL-COVER.png",
      dateAndTime: "Anjalli Kumar | November 20, 2023 | 5 min read",
      title:
        "The business benefits of having more women working in warehouses and dark stores",
      desc: "Discover how we’re extending our gender diversity commitment to our warehouses and dark stores by onboarding more women, and review the business benefits we’re witnessing from doing so.",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2023/09/blog-header.png",
      dateAndTime: "Jahnvi Goyal | September 21, 2023 | 3 min read",
      title:
        "Introducing Tips For The Kitchen Staff: An Initiative that Celebrates Restaurants",
      desc: "Share your love and gratitude with the kitchen staff of your favorite restaurants you order from with ‘Tips for the kitchen staff’.",
    },
  ];

  const company = [
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
      dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
      title: "Q3FY25 shareholders’ letter and results",
      desc: "A quick capture of headline results from this quarter",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
      dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
      title:
        "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
      desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
      dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
      title:
        "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
      desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
      dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
      title:
        "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
      desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
      dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
      title:
        "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
      desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
    },
  ];

  const culture = [
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2023/05/Blog-Header.png",
      dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
      title:
        "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
      desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
      dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
      title: "Q3FY25 shareholders’ letter and results",
      desc: "A quick capture of headline results from this quarter",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
      dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
      title:
        "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
      desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
      dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
      title:
        "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
      desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
      dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
      title:
        "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
      desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
      dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
      title:
        "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
      desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
    },
  ];

  const technology = [
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/02/Mysore-Raman-Blog-1.jpg",
      dateAndTime: "Shuvra Saha | February 4, 2025 | 4 min read",
      title:
        "Idli, spice, and everything nice–Mysore Raman Idli’s journey to success!",
      desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
      dateAndTime: "Deepinder Goyal | January 20, 2025 | 1 min read",
      title: "Q3FY25 shareholders’ letter and results",
      desc: "A quick capture of headline results from this quarter",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
      dateAndTime: "Shuvra Saha | December 27, 2024 | 5 min read",
      title:
        "The Big Brand Theory | Carving a spice trail from Tamil Nadu to 5+ countries",
      desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand.",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Banner.jpg",
      dateAndTime: "Shuvra Saha | December 16, 2024 | 5 min read",
      title:
        "The Big Brand Theory | From trekking Himalayan slopes to raising Rs. 0.75 crores at Shark Tank: The story of Amore Gelato ",
      desc: "Discover how the founders of Amore Gelato are bringing the true taste of Italian gelato to India!",
    },
    {
      image: "https://zomatoblog.com/wp-content/uploads/2024/12/Blog-Cover.jpg",
      dateAndTime: "Anjalli Kumar | December 13, 2024 | 3 min read",
      title:
        "Introducing Zomato’s Plastic-Free Future Program for Restaurant Partners",
      desc: "Recognizing restaurant partners for embracing plastic-free food delivery packaging options",
    },
    {
      image:
        "https://zomatoblog.com/wp-content/uploads/2024/12/Chowman-draft.png",
      dateAndTime: "Shuvra Saha | December 2, 2024 | 4 min read",
      title:
        "The Big Brand Theory | From piano melodies to Chinese recipes: The Chowman Story",
      desc: "Read more about the story of Chowman, a brand which is enchanting tastebuds with a flavorful and authentic take on Chinese cuisine",
    },
  ];

  const getCategoryData = () => {
    switch (activeState) {
      case "allCategory":
        return allCategories;
      case "community":
        return community;
      case "company":
        return company;
      case "culture":
        return culture;
      case "technology":
        return technology;
      default:
        return allCategories;
    }
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-[75%] mx-auto py-6">
        {/* Banner Image */}
        <div className="w-full mb-6">
          <img
            src="https://b.zmtcdn.com/data/file_assets/621862abf874a7c2be8fdd6d062ca67a1678705718.webp"
            alt="Blog Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Category Navigation */}
        {/* Category Navigation */}
        <div className="flex flex-wrap justify-around items-center  bg-white p-4 rounded-lg gap-2 sm:gap-4">
          <Link to="/blog/allcategories">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${
                activeState === "allCategory"
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveState("allCategory")}
            >
              All Categories
            </button>
          </Link>
          <Link to="/blog/community">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${
                activeState === "community"
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveState("community")}
            >
              Community
            </button>
          </Link>
          <Link to="/blog/company">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${
                activeState === "company"
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveState("company")}
            >
              Company
            </button>
          </Link>
          <Link to="/blog/culture">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${
                activeState === "culture"
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveState("culture")}
            >
              Culture
            </button>
          </Link>
          <Link to="/blog/technology">
            <button
              className={`px-4 py-2 text-sm sm:text-base font-medium ${
                activeState === "technology"
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
              onClick={() => setActiveState("technology")}
            >
              Technology
            </button>
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 mb-40">
          {getCategoryData().length > 0 ? (
            getCategoryData().map((data, idx) => (
              <div key={idx} className="w-full">
                <BlogImageComponent data={data} />
              </div>
            ))
          ) : (
            <h1 className="text-center text-lg text-gray-600 col-span-full">
              Data not present
            </h1>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
