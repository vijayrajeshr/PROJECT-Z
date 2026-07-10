// import HomePageBanner from "../../components/HomeComponents/HomePageBanner/HomePageBanner";
// import SmallCard from "../../utils/Cards/card1/SmallCard";
// import Collections from "../../components/HomeComponents/Collections/Collections";
// import PopularPlaces from "../../components/HomeComponents/PopularPlaces/PopularPlaces";
// import GetTheApp from "../../components/HomeComponents/GetTheApp/GetTheApp";
// import ExploreOptionsNearMe from "../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe";
// import Footer from "../../components/Footer/Footer";
// import orderOnlineImg from "/images/orderonline.jpg";
// import diningoutImg from "/images/diningout.jpg";
// import proandproplusImg from "/images/proandproplus.jpg";
// import nightlifeandclubsImg from "/images/nightlifeandclubs.jpg";

// import css from "./Homepage.module.css";

// import {
//   orderOnlinePage,
//   diningOutPage,
//   proAndProPlusPage,
//   nightLifePage,
// } from "../../helpers/constants";

// const text = "update text";

// function Homepage() {
//   return (
//     <>
//       <HomePageBanner />
//       <div className={`${css.bodySize}  max-sm:p-10`}>
//         <div className={`${css.chooseTypeCards}  `}>
//           <SmallCard
//             className=""
//             imgSrc={orderOnlineImg}
//             text="Order Online"
//             link={`/show-case?page=` + orderOnlinePage}
//           />
//           <SmallCard
//             imgSrc={diningoutImg}
//             text="Dining"
//             link={"/show-case?page=" + diningOutPage}
//           />
//           <SmallCard
//             imgSrc={proandproplusImg}
//             text="Tiffin Services"
//             link={"/show-case?page=" + proAndProPlusPage}
//           />
//           <SmallCard
//             imgSrc={nightlifeandclubsImg}
//             text="Live Events"
//             link={"https://hilarious-vacherin-4dbe73.netlify.app/"}
//           />
//         </div>

//         <Collections />
//         <PopularPlaces />
//       </div>
//       <GetTheApp />
//       <ExploreOptionsNearMe />
//       <Footer />
//     </>
//   );
// }

// export default Homepage;

import HomePageBanner from "../../components/HomeComponents/HomePageBanner/HomePageBanner";
import SmallCard from "../../utils/Cards/card1/SmallCard";
import Collections from "../../components/HomeComponents/Collections/Collections";
import PopularPlaces from "../../components/HomeComponents/PopularPlaces/PopularPlaces";
import GetTheApp from "../../components/HomeComponents/GetTheApp/GetTheApp";
import ExploreOptionsNearMe from "../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe";
import Footer from "../../components/Footer/Footer";
import GoTopArrow from "../../utils/GoTopArrow/GoTopArrow";
import orderOnlineImg from "/images/orderonline.jpg";
import diningoutImg from "/images/diningout.jpg";
import proandproplusImg from "/images/proandproplus.jpg";
import nightlifeandclubsImg from "/images/nightlifeandclubs.jpg";
import {
  orderOnlinePage,
  diningOutPage,
  proAndProPlusPage,
  nightLifePage,
} from "../../helpers/constants";

import TopRestaurants from "../../components/HomeComponents/TopRestaurants/TopRestaurants";

function Homepage() {
  const City = localStorage.getItem("city"); // "Ahmedabad"
  return (
    <>
      <HomePageBanner />
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8 bg-[#ffffff]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <SmallCard
            imgSrc={orderOnlineImg}
            text="Order Online"
            link={`/show-case?page=` + orderOnlinePage}
          />
          <SmallCard
            imgSrc={diningoutImg}
            text="Dining"
            link={"/show-case?page=" + diningOutPage}
          />
          <SmallCard
            imgSrc={proandproplusImg}
            text="Tiffin Services"
            link={"/show-case?page=" + proAndProPlusPage}
          />
          <SmallCard
            imgSrc={nightlifeandclubsImg}
            text="Live Events"
            // --- CHANGE MADE HERE ---
            link={"/events"}
          // ------------------------
          />
        </div>

        <Collections />
        <PopularPlaces />
        <TopRestaurants />
      </div>


      <div id="get-app">
        <GetTheApp />
      </div>
      <ExploreOptionsNearMe />
      <Footer />
      <GoTopArrow />
    </>
  );
}

export default Homepage;
