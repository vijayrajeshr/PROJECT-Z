import React, { useState, useEffect, useCallback } from "react";
import LeftPanel from "../../components/RestaurantDasComponents/LeftPanel";
import RightPanel from "../../components/RestaurantDasComponents/RightPanel";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function DineInMenu() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuTabs, setMenuTabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const transformMenuTabs = useCallback((menuSections) => {
    return (menuSections || []).reduce((tabs, tab) => {
      const sections = (tab.sections || []).reduce((validSections, section) => {
        const items = (section.items || []).map((item) => ({
          _id: item.id || item._id || null,
          dishDetails: item.dishDetails || {
            servingInfo: "1",
            calorieCount: "250",
            portionSize: "Small",
            allergyDetails: "N/A",
          },
          category: tab.tabName || "Default Category",
          subcategory: section.sectionName || "Default Section",
          categoryId: tab.categoryId || null,
          subcategoryId: section.subcategoryId || null,
          images: item.images || [null, null, null],
          name: item.name || "Untitled",
          pricing: item.price !== "N/A" ? item.price.toString() : "N/A",
          type: item.type || "Veg",
          description: item.description || "",
          variations: item.variations || [],
          serviceType: item.serviceType || [],
          items: item.items || [], // Include nested items for combos
        }));

        if (items.length) {
          validSections.push({
            id: section.id || null,
            name: section.sectionName || "Default Section",
            description: section.description || "",
            items,
            itemCount: items.length,
          });
        }
        return validSections;
      }, []);

      if (sections.length) {
        tabs.push({
          name: tab.tabName || "Default Category",
          id: tab.id || null,
          sections,
        });
      }
      return tabs;
    }, []);
  }, []);
  const fetchMenuTabs = useCallback(async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/firm/restaurants/menu-sections-items/${id}`,
        { withCredentials: true }
      );
      const transformedTabs = transformMenuTabs(response.data.menuSections);
      setMenuTabs(transformedTabs);
    } catch (error) {
      console.error("Error fetching menu tabs:", error);
      setMenuTabs([]);
    }
  }, [id, serverUrl, transformMenuTabs]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMenuTabs();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchMenuTabs]);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct({ ...product });
  }, []);

  const handleDelete = (itemId) => {
    setMenuTabs((prevTabs) =>
      prevTabs
        .map((tab) => ({
          ...tab,
          sections: tab.sections
            .map((section) => ({
              ...section,
              items: section.items.filter((item) => item._id !== itemId),
              itemCount: section.items.filter((item) => item._id !== itemId)
                .length,
            }))
            .filter((section) => section.items.length > 0),
        }))
        .filter((tab) => tab.sections.length > 0)
    );
    setSelectedProduct(null);
    fetchMenuTabs();
  };

  const handleDuplicate = useCallback(() => {
    fetchMenuTabs();
  }, [fetchMenuTabs]);

  // const handleSave = useCallback(
  //   (updatedItem) => {
  //     setMenuTabs((prevTabs) =>
  //       prevTabs.map((tab) =>
  //         tab.name !== updatedItem.category
  //           ? tab
  //           : {
  //               ...tab,
  //               sections: tab.sections.map((section) =>
  //                 section.name !== updatedItem.subcategory
  //                   ? section
  //                   : {
  //                       ...section,
  //                       items: section.items.map((item) =>
  //                         item._id === updatedItem._id
  //                           ? { ...updatedItem }
  //                           : item
  //                       ),
  //                       itemCount: section.items.length,
  //                     }
  //               ),
  //             }
  //       )
  //     );
  //     fetchMenuTabs();
  //   },
  //   [fetchMenuTabs]
  // );
  const handleSave = useCallback(
    (updatedItem) => {
      setMenuTabs((prevTabs) => {
        // Check if the item already exists in the menuTabs
        const itemExists = prevTabs.some((tab) =>
          tab.sections.some((section) =>
            section.items.some((item) => item._id === updatedItem._id)
          )
        );

        if (itemExists) {
          // Update existing item
          return prevTabs.map((tab) =>
            tab.name !== updatedItem.category
              ? tab
              : {
                  ...tab,
                  sections: tab.sections.map((section) =>
                    section.name !== updatedItem.subcategory
                      ? section
                      : {
                          ...section,
                          items: section.items.map((item) =>
                            item._id === updatedItem._id
                              ? { ...updatedItem }
                              : item
                          ),
                          itemCount: section.items.length,
                        }
                  ),
                }
          );
        } else {
          // Add new item (e.g., a new combo)
          return prevTabs.map((tab) =>
            tab.name !== updatedItem.category
              ? tab
              : {
                  ...tab,
                  sections: tab.sections.map((section) =>
                    section.name !== updatedItem.subcategory
                      ? section
                      : {
                          ...section,
                          items: [...section.items, updatedItem],
                          itemCount: section.items.length + 1,
                        }
                  ),
                }
          );
        }
      });
      fetchMenuTabs(); // Refresh data from server
    },
    [fetchMenuTabs]
  );
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          onProductSelect={handleProductSelect}
          restaurantId={id}
          menuTabs={menuTabs}
          setMenuTabs={setMenuTabs}
          fetchMenuTabs={fetchMenuTabs}
          onSave={handleSave}
        />
        {selectedProduct && (
          <RightPanel
            selectedProduct={selectedProduct}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
