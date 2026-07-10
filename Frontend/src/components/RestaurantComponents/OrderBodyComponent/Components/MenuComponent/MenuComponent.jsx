import React, { useState, useEffect, useRef } from "react";
import css from "./MenuComponent.module.css";
import MenuCaraousel from "./MenuCaraousel";
import axios from "axios";
import { useParams } from "react-router-dom";

const MenuComponent = () => {
  const menuItems = {
    1: [
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
    ],
    2: [
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
    ],
    3: [
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
      {
        name: "Avocado Toast Bites",
        price: "$15.00",
        description:
          "Bite-sized toasted artisan bread, fresh avocado spread topped with cherry tomatoes & balsamic glaze",
        allergens: {
          wheat: "toast",
          peanuts: "may contain traces",
        },
        type: "veg",
      },
    ],
  };

  const menuCards = [
    { id: 1, title: "Starters" },
    { id: 2, title: "Snacks" },
    { id: 3, title: "Light Meals" },
  ];

  const [activeCategory, setActiveCategory] = useState(1);
  const [showAllergensModal, setShowAllergensModal] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState(null);
  const sectionRefs = useRef([]);

  const handleCardClick = (id) => {
    setActiveCategory(id);
    sectionRefs.current[id - 1]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    sectionRefs.current.forEach((ref, index) => {
      if (
        ref &&
        ref.getBoundingClientRect().top < window.innerHeight / 2 &&
        ref.getBoundingClientRect().bottom > 0
      ) {
        setActiveCategory(index + 1);
      }
    });
  };

  const openAllergensModal = (allergens) => {
    setSelectedAllergens(allergens);
    setShowAllergensModal(true);
  };

  const closeAllergensModal = () => {
    setShowAllergensModal(false);
    setSelectedAllergens(null);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const { id } = useParams();
  const [menuItem, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/firm/restaurants/menu-images/${id}`
        );
        setMenu(response);
        console.log(menuItem);
      } catch (err) {
        console.error("Something went wrong:", err);
        throw new Error("Custom message");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div className={css.outerDiv}>
      <div className={css.ttl}>Menu Categories</div>

      {/* Menu Card Image */}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
        <MenuCaraousel data={menuItem} />
      </div>

      {/* Menu Sections */}
      <div className={css.sections}>
        {menuCards.map((card) => (
          <div
            key={card.id}
            ref={(el) => (sectionRefs.current[card.id - 1] = el)}
            className={css.section}
          >
            <div className={css.stickyHeading}>{card.title}</div>
            <div className={css.itemsGrid}>
              {menuItems[card.id]?.map((item, index) => (
                <div key={index} className={css.itemCard}>
                  <div className={css.nameAndPrice}>
                    <div className={css.nameContainer}>
                      {item.type === "veg" ? (
                        <img
                          src="/public/icons/veg.png"
                          alt="Veg Symbol"
                          className={css.vegIcon}
                        />
                      ) : (
                        <img
                          src="/public/icons/nonveg.png"
                          alt="Non-Veg Symbol"
                          className={css.nonVegIcon}
                        />
                      )}
                      <strong>{item.name}</strong>
                    </div>
                    <p className={css.price}>{item.price}</p>
                  </div>
                  <p className={css.description}>{item.description}</p>
                  <div className={css.iconWrapper}>
                    <img
                      src="/public/icons/info.png"
                      alt="Info Icon"
                      className={css.infoIcon}
                      onClick={() => openAllergensModal(item.allergens)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Veg and Non-Veg Legend */}

      {/* Allergen Modal */}
      {showAllergensModal && selectedAllergens && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeAllergensModal}
        >
          <div
            style={{
              background: "#fff",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Allergen Information</h2>
            {Object.entries(selectedAllergens).map(([key, value], idx) => (
              <p key={idx}>
                <strong>{key.toUpperCase()}:</strong> {value}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuComponent;
