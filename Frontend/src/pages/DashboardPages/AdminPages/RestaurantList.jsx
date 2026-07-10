import React, { useEffect, useMemo, useRef, useState } from "react";

import Filter from "../../../components/DashBoards/AdminDashboard/Admin/Filter.jsx";
import { GrView } from "react-icons/gr";
import { LiaCommentSolid } from "react-icons/lia";
import { GiCash } from "react-icons/gi";
import { MdEdit, MdSave } from "react-icons/md";
import TopBar from "../../../utils/TopBar.jsx";
// import Listing from "../../../components/DashBoards/AdminDashboard/Admin/Listing.js";
import Listing from "../../../components/DashBoards/AdminDashboard/Admin/Listing.jsx";
import MenuListing from "../../../components/DashBoards/AdminDashboard/Admin/MenuListing.jsx";
import StatisticCard from "../../../components/DashBoards/AdminDashboard/Admin/StatisticCard.jsx";
import OptionContainer from "../../../components/DashBoards/AdminDashboard/Admin/OptionContainer.jsx";
import DeliveryAreas from "../../../components/DashBoards/AdminDashboard/Admin/DeliveryAreas.jsx";
import Features from "../../../components/DashBoards/AdminDashboard/Admin/Features.jsx";
import Cuisines from "../../../components/DashBoards/AdminDashboard/Admin/Cuisines.jsx";
import FoodCategory from "../../../components/DashBoards/AdminDashboard/Admin/FoodCategory.jsx";
import CommentList from "../../../components/DashBoards/AdminDashboard/Admin/CommentList.jsx";
import Hero from "../../../components/DashBoards/AdminDashboard/Admin/Hero.jsx";
import { Restaurants, listedTabs, resList } from "../../../data/info.js";
import { restaurantReviews } from "../../../data/dummy.js";
import { initialOffers } from "../../../data/offersData.js"; //for the offers
import OffersList from "../../../components/DashBoards/AdminDashboard/OffersList.jsx"; //from the offerlist
import axios from "axios";
import dummy from "../../../data/dummy.js"; //dummy data
import FAQ from "../../../components/DashBoards/AdminDashboard/Admin/FAQ.jsx";
import Insight from "../../../components/DashBoards/AdminDashboard/Admin/Insight.jsx";
import { useContextData } from "../../../context/OutletContext.jsx";

const RestaurantList = () => {
  const { axiosApi } = useContextData();
  const [isEditable, setIsEditable] = useState(false);
  const [toggleIdx, setToggleIdx] = useState(1);
  const [dropdownIdx, setDropdownIdx] = useState(-1);
  const [activeTab, setActiveTab] = useState("overview");

  const [offers, setOffers] = useState(initialOffers);
  const [viewComments, setViewComments] = useState("user");
  const { deliveryCategories, dineInCategories } = dummy;

  const [currResId, setCurrResId] = useState(null);
  const [currResInfo, setCurrResInfo] = useState(null);
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch restaurant by ID
  useEffect(() => {
    const getFirmData = async () => {
      if (!currResId) return;

      setIsLoading(true);
      try {
        let res = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/getOne/${currResId}`,
          {
            withCredentials: true,
          }
        );
        setCurrResInfo(res.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getFirmData();
  }, [currResId]);

  // Fetch first restaurant on initial load
  useEffect(() => {
    const getFirstFirm = async () => {
      setIsLoading(true);
      try {
        let res = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/api/latest-firm`,
          { withCredentials: true }
        );
        let data = res.data.firm[0];
        setCurrResInfo(data);
      } catch (error) {
        console.error("Error fetching initial restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getFirstFirm();
  }, []);
  //to get the menu item
  // useEffect(() => {
  //   const getMenu = async () => {
  //     const res = await axios(`${import.meta.env.VITE_SERVER_URL}`);
  //   };
  //   getMenu();
  // }, []);

  // console.log(currResInfo);

  // Flatten items to build itemMap (for item-level offers)
  const allDeliveryItems = deliveryCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allDineInItems = dineInCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allItems = [...allDeliveryItems, ...allDineInItems];

  // itemMap: { itemId -> itemName }
  const itemMap = {};
  allItems.forEach((itm) => {
    itemMap[itm.id] = itm.name;
  });

  //different tabs fo the section
  const listedTabs = [
    { id: "tab1", tab: "tab1", label: "Overview" },
    { id: "tab2", tab: "tab2", label: "Features" },
    { id: "tab3", tab: "tab3", label: "Offers" },
    { id: "tab4", tab: "tab4", label: "Comments" },
  ];

  const sectionRefs = useRef({});

  //for auto switch tab son scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.8, // Adjust this for better accuracy
      }
    );

    listedTabs.forEach((section) => {
      if (sectionRefs.current[section.id]) {
        observer.observe(sectionRefs.current[section.id]);
      }
    });

    return () => observer.disconnect();
  }, []);

  const moreComments = () => {};

  //to cusinies dropdown
  const handleDropdown = (idx) => {
    console.log(idx);
    setDropdownIdx((prev) => (prev === -1 ? idx : -1));
  };

  const handleSwitch = (id) => {
    setToggleIdx((prev) => {
      if (prev !== id) {
        return id;
      } else {
        return prev;
      }
    });
  };

  const toggleEdit = async () => {
    if (isEditable === true) {
      try {
        const res = await axiosApi.put(
          `${import.meta.env.VITE_SERVER_URL}/api/Edit/${currResInfo._id}`,
          currResInfo,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.response) {
          alert("Data Updated");
          setCurrResInfo(res.data.firm);
        }
        setIsEditable(false);
      } catch (error) {
        console.error("Error updating restaurant:", error);
        alert(
          "Failed to update data: " +
            (error.response?.data?.error || "Unknown error")
        );
      }
    } else {
      alert("You can edit detail now");
      setIsEditable(true);
    }
  };

  // const filter = ["Menu", "Offers", "Flag", "Comments", "Others"];
  const filter = [
    "isFlaged",
    "isBookMarked",
    "isBanned",
    "menuLatestChange",
    "offerLatestChange",
    "reviewLatestChange",
    "firmInfoChange",
    "mostOffers",
  ];

  // console.log(currResInfo);

  const OverViewSection = ({ currResInfo }) => {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
        <div className="flex gap-4 flex-wrap">
          <StatisticCard
            label="Views"
            lastMonth={"3,780"}
            total={"671,120"}
            icon={<GrView />}
          />
          <StatisticCard
            label="Comments"
            lastMonth={"180"}
            total={"6,120"}
            icon={<LiaCommentSolid />}
          />
          <StatisticCard
            label="Cash Flow"
            lastMonth={"23,780"}
            total={"671,120"}
            icon={<GiCash />}
          />
        </div>
        <OptionContainer
          title={"Ratings"}
          options={currResInfo.restaurantInfo.ratings}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <Cuisines
          cuisines={currResInfo.restaurantInfo.cuisines}
          title={"Cuisines"}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <Insight
          insights={currResInfo.insights}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
      </div>
    );
  };

  const FeaturesSection = ({ currResInfo }) => {
    return (
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
        <Features
          title={"Features"}
          features={currResInfo.features}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <Features
          title={"Additional Information"}
          options={currResInfo.restaurantInfo.additionalInfo}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <FAQ
          faqs={currResInfo.faqs}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <OptionContainer
          title={"Payment Methods"}
          types={resList[toggleIdx].paymentOptions}
          isEditable={isEditable}
          setCurrResInfo={setCurrResInfo}
        />
        <DeliveryAreas
          deliveryAreas={resList[toggleIdx].deliveryAreas}
          title={"Delivery Areas"}
          isEditable={isEditable}
        />
      </div>
    );
  };

  const MenuSection = ({ currResInfo }) => {
    // useEffect(() => {
    //  axiosApi.get(`${import.meta.env.VITE_SERVER_URL}/api/menu-item/${currResInfo._id}`)
    // })

    return (
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>
        <MenuListing
          menu={resList[toggleIdx].menu}
          dropdownIdx={dropdownIdx}
          handleDropdown={handleDropdown}
          title={"Menu"}
        />
      </div>
    );
  };

  const CommentSection = () => {
    useEffect(() => {});
    return (
      <div className="p-4 bg-white shadow-md rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
        <CommentList
          setViewComments={setViewComments}
          viewComments={viewComments}
          restaurantReviews={restaurantReviews}
          // firmId={currResInfo._id}
        />
      </div>
    );
  };

  const handleRemoveOffer = (offerId) => {
    setOffers((prev) => prev.filter((off) => off.id !== offerId));
  };

  const handleEditOffer = (offerId, updatedFields) => {
    setOffers((prev) =>
      prev.map((off) =>
        off.id === offerId ? { ...off, ...updatedFields } : off
      )
    );
  };

  const OfferCard = ({ offer }) => {
    return (
      <div className="shadow-sm border w-1/3 p-2">
        <div className="flex items-center justify-between mb-1 ">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 text-base">
              {offer.name}
            </p>
            {/* {expired && ( */}
            <span className="text-xs text-red-500 font-medium">(Expired)</span>
            {/* )} */}
          </div>

          {/* Icons */}
          <div className="flex gap-2">
            {/* <PencilIcon
              className="h-5 w-5 text-blue-600 cursor-pointer
                       hover:text-blue-800"
              // onClick={() => handleEditClick(offer)}
            />
            <TrashIcon
              className="h-5 w-5 text-red-500 cursor-pointer
                       hover:text-red-700"
              // onClick={() => onRemoveOffer(offer.id)}
            /> */}
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            Code: <strong>{offer.code}</strong>
          </p>
          <p>
            Discount: <strong>{offer.discount}</strong>
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-semibold rounded `}>
              {offer.scope}
            </span>
            <span className="text-xs text-gray-500">{}</span>
            {offer.validUntil && (
              <span className="text-xs text-gray-400">
                Expires on {offer.validUntil}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tab = `rounded-sm no-underline p-2 border-b-2 box-border width-[90%]`;

  // Render tab content based on active tab
  const renderTabContent = () => {
    if (!currResInfo) return null;

    switch (activeTab) {
      case "overview":
        return <OverViewSection currResInfo={currResInfo} />;
      case "features":
        return <FeaturesSection currResInfo={currResInfo} />;
      case "offers":
        return <MenuSection currResInfo={currResInfo} />;
      case "comments":
        return <CommentSection />;
      default:
        return <OverViewSection currResInfo={currResInfo} />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* Sidebar for restaurant list */}
      <Listing
        categories={Restaurants}
        filter={filter}
        handleSwitch={handleSwitch}
        setResID={setCurrResId}
      />

      {/* Main content area */}
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currResInfo ? (
        <div className="flex-grow overflow-auto bg-white shadow-sm">
          {/* Header with edit button */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {currResInfo.restaurantInfo?.name || "Restaurant Details"}
            </h1>
            <button
              onClick={toggleEdit}
              className={`flex items-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isEditable
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {isEditable ? (
                <>
                  <MdSave className="text-lg" /> Save
                </>
              ) : (
                <>
                  <MdEdit className="text-lg" /> Edit
                </>
              )}
            </button>
          </div>

          {/* Restaurant hero section */}
          <div className="px-6 pt-4 pb-2">
            <Hero
              resData={currResInfo}
              isEditable={isEditable}
              setCurrResInfo={setCurrResInfo}
            />
          </div>

          {/* Tab navigation */}
          <div className="px-6 pt-2">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "features"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "offers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("offers")}
              >
                Offers
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === "comments"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setActiveTab("comments")}
              >
                Comments
              </button>
            </div>
          </div>

          {/* Tab content area */}
          <div className="px-6 py-4">{renderTabContent()}</div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          No restaurant selected
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
