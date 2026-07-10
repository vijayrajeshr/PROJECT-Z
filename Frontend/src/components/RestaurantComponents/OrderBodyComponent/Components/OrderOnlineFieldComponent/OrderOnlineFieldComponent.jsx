import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import CheckBoxUtil from "../../../../../utils/FormUtils/CheckBoxUtil/CheckBoxUtil";
import SmallSearchBarUtil from "../../../../../utils/RestaurantUtils/SmallSearchBarUtil/SmallSearchBarUtil";
import OfferTrackUtil from "../../../../../utils/RestaurantUtils/OfferTrackUtil/OfferTrackUtil";
import FoodItemProduct from "../../../../../utils/RestaurantUtils/FoodItemProduct/FoodItemProduct";
import vegIcon from "/icons/veg.png";
import nonvegIcon from "/icons/nonveg.png";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderOnlineFieldComponent = () => {
  const [isActive, setIsActive] = useState({});
  const [foodType, setFoodType] = useState({ veg: false, egg: false });
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const initialValues = { veg: false, egg: false };

  // fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/offers/takeaway/offer/${id}`
        );
        const data = await response.json();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
  }, []);

  // fetch menu
  useEffect(() => {
    if (!id) return;
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/restaurants/menu-sections-items/${id}`
        );
        const response1 = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/restaurants/user-menu-text/menu-sections-items/${id}`
        );

        const allSectionsByMenu = response.data.menuSections
          .filter((e) => Array.isArray(e.sections) && e.sections.length > 0)
          .flatMap((e) => e.sections);

        const allSectionByUser = response1.data.menuSections
          .filter((e) => Array.isArray(e.sections) && e.sections.length > 0)
          .flatMap((e) => e.sections);

        const mergedSections = [...allSectionsByMenu, ...allSectionByUser];
        setCategories(mergedSections);
        setFilteredCategories(mergedSections);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [id]);

  // search filter
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = categories
      ?.map((category) => {
        const filteredItems = category.items?.filter(
          (item) =>
            item.name.toLowerCase().includes(lowerCaseSearch) ||
            (item.description &&
              item.description.toLowerCase().includes(lowerCaseSearch))
        );
        if (
          filteredItems.length > 0 ||
          category.sectionName.toLowerCase().includes(lowerCaseSearch)
        ) {
          return { ...category, items: filteredItems };
        }
        return null;
      })
      .filter((category) => category !== null);

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const sideNavHandler = (category) => {
    setIsActive({ [category]: true });
    document.getElementById(`${category}`).scrollIntoView({
      behavior: "smooth",
    });
  };

  const renderMenuItems = (items) => {
    return foodType.egg
      ? items.filter((item) => item.foodType === "egg")
      : foodType.veg
      ? items.filter((item) => item.veg === foodType.veg)
      : items;
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden md:block w-1/4 h-screen mr-2 p-4 overflow-y-scroll">
          {filteredCategories?.length > 0 ? (
            filteredCategories.map((category, id) => (
              <div
                key={id}
                onClick={() => sideNavHandler(category.sectionName)}
                className={`capitalize p-2 cursor-pointer text-base ${
                  isActive[category.sectionName]
                    ? "font-semibold text-[#006C6A] border-r-2 border-[#006C6A] bg-red-50"
                    : "text-gray-700"
                }`}
              >
                {category.sectionName}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No Takeaway data found</p>
          )}
        </div>

        {/* Top Scrollable Tabs (Mobile Only) */}
        <div className="md:hidden w-full overflow-x-auto flex space-x-4 px-3 py-2 border-b border-gray-200 no-scrollbar">
          {filteredCategories?.map((category, id) => (
            <button
              key={id}
              onClick={() => sideNavHandler(category.sectionName)}
              className={`whitespace-nowrap px-3 py-1 rounded-lg text-sm ${
                isActive[category.sectionName]
                  ? "bg-[#006C6A] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {category.sectionName}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="w-full md:w-3/4 h-screen overflow-y-scroll px-3 sm:px-6">
          <div className="flex justify-between items-center py-3">
            <div className="text-lg sm:text-xl font-semibold text-gray-800">
              Takeaway
            </div>
            <SmallSearchBarUtil
              placeholder="Search within menu"
              onChange={(val) => setSearchTerm(val)}
              value={searchTerm}
            />
          </div>

          {/* Offers */}
          <div className="w-full my-3 flex overflow-x-scroll space-x-3 no-scrollbar">
            {offers?.map((offer) => {
              const discountText =
                offer.offerType === "percentage"
                  ? `${offer.discountValue}% OFF`
                  : `Flat $${offer.discountValue} OFF`;
              return (
                <OfferTrackUtil
                  key={offer._id}
                  txt1={`${offer.name} - ${discountText}`}
                  txt2={`Use code ${offer.code}`}
                  link={`/orderpage?${offer?._id}`}
                />
              );
            })}
          </div>

          {/* Veg Filter */}
          <div className="my-3">
            <Formik initialValues={initialValues}>
              <Form className="flex gap-4">
                <CheckBoxUtil
                  label="Veg Only"
                  name="veg"
                  onChange={() =>
                    setFoodType((val) =>
                      val?.veg
                        ? { veg: false, egg: false }
                        : { veg: true, egg: false }
                    )
                  }
                  checked={foodType?.veg || foodType?.egg}
                />
              </Form>
            </Formik>
          </div>

          {/* Items Section */}
          <div className="w-full">
            {filteredCategories?.length > 0 ? (
              filteredCategories.map((category, categoryIndex) => (
                <div key={category.sectionName} className="my-4">
                  <div className="bg-white rounded-xl shadow p-4">
                    <div
                      className="text-lg sm:text-xl font-semibold text-gray-800 capitalize border-b border-gray-200 pb-2 mb-3"
                      id={category.sectionName}
                    >
                      {category.sectionName === "All items"
                        ? "User Recommendations"
                        : category.sectionName}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 ">
                      {renderMenuItems(category.items)?.map(
                        (item, itemIndex) => (
                          <FoodItemProduct
                            key={item.name + itemIndex}
                            data={{
                              mustTry: true,
                              item,
                              subcategoryId: category.subcategoryId,
                              categoryId: item.categoryId,
                              imgSrc:
                                item?.images?.[0]
                                  ? `${import.meta.env.VITE_BACKEND_URL}/${item?.images[0].replace(
                                      /\\/g,
                                      "/"
                                    )}`
                                  : item.veg
                                  ? vegIcon
                                  : nonvegIcon,
                              ttl: item.name,
                              desc: item.description,
                              itemType: item.veg ? vegIcon : nonvegIcon,
                              calories: item?.calories,
                              preparationTime: item?.preparationTime,
                              foodType: item.foodType || "veg",
                              id1: item.id,
                              price: item?.price || "$5",
                              displayPrice: item?.price || "5$",
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {categoryIndex < filteredCategories.length - 1 && (
                    <hr className="my-4 border-gray-300" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOnlineFieldComponent;
