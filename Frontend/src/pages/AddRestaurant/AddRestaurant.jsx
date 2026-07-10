import AddRestaurantHeader from "../../components/AddRestaurantComponents/AddRestaurantHeader/AddRestaurantHeader";
import AddRestaurantSec from "../../components/AddRestaurantComponents/AddRestaurantSec/AddRestaurantSec";
import HowItWorks from "../../components/AddRestaurantComponents/HowItWorks/HowItWorks";
import SearchListedRestaurant from "../../components/AddRestaurantComponents/SearchListedRestaurant/SearchListedRestaurant";
import WhyShouldYouPWZ from "../../components/AddRestaurantComponents/WhyShouldYouPWZ/WhyShouldYouPWZ";
import Footer from "../../components/Footer/Footer";
import FrequentlyAskedQues from "../../components/HomeComponents/FrequentlyAskedQues/FrequentlyAskedQues";
import SmallBannerCard from "../../utils/Cards/SmallBannerCard/SmallBannerCard";
import GuideCard from "../../components/AddRestaurantComponents/GuideCard/GuideCard";

import { useState } from "react";
import RestaurantRegistration from "../../components/AddRestaurantComponents/AddRestaurantHeader/RestaurantRegistration";

let AddRestaurant = () => {
  const [showRegistration, setShowRegistration] = useState(false);

  const handleOpenRegistration = () => {
    setShowRegistration(true);
  };

  return (
    <div bg="white">
      <AddRestaurantHeader onOpenRegistration={handleOpenRegistration} />

      <GuideCard />
      <WhyShouldYouPWZ />
      <HowItWorks />
      <SearchListedRestaurant />
      <SmallBannerCard />
      <FrequentlyAskedQues />
      <AddRestaurantSec onOpenRegistration={handleOpenRegistration} />
      <Footer />

      {showRegistration && (
        <RestaurantRegistration onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
};

export default AddRestaurant;
