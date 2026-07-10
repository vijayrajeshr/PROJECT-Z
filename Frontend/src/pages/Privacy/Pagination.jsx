import React, { useEffect, useState } from "react";

const PaginationComponent = ({ sideTabs, setSelectedContent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);

  const currentTab = sideTabs[currentIndex];

  const handleNext = () => {
    if (currentTab.items) {
      const currentSubItems = currentTab.items[subIndex]?.subItems || [];
      if (itemIndex < currentSubItems.length - 1) {
        setItemIndex((prev) => prev + 1);
      } else if (subIndex < currentTab.items.length - 1) {
        setSubIndex((prev) => prev + 1);
        setItemIndex(0);
      } else if (currentIndex < sideTabs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSubIndex(0);
        setItemIndex(0);
      }
    } else if (currentIndex < sideTabs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSubIndex(0);
      setItemIndex(0);
    }
  };

  const handlePrevious = () => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
    } else if (subIndex > 0) {
      setSubIndex((prev) => prev - 1);
      const previousSubItems = currentTab.items[subIndex - 1]?.subItems || [];
      setItemIndex(previousSubItems.length - 1);
    } else if (currentIndex > 0) {
      const previousTab = sideTabs[currentIndex - 1];
      setCurrentIndex((prev) => prev - 1);
      const lastSubIndex = previousTab.items ? previousTab.items.length - 1 : 0;
      const lastSubItems = previousTab.items
        ? previousTab.items[lastSubIndex]?.subItems || []
        : [];
      setSubIndex(lastSubIndex);
      setItemIndex(lastSubItems.length - 1);
    }
  };

  useEffect(() => {
    if (currentTab.items?.[subIndex]?.subItems?.[itemIndex]) {
      setSelectedContent(currentTab.items[subIndex].subItems[itemIndex]);
    } else if (currentTab.items?.[subIndex]) {
      setSelectedContent(currentTab.items[subIndex]);
    } else {
      setSelectedContent(currentTab.title);
    }
  }, [currentIndex, subIndex, itemIndex, currentTab, setSelectedContent]);

  const isPreviousDisabled =
    currentIndex === 0 && subIndex === 0 && itemIndex === 0;
  const isNextDisabled =
    currentIndex === sideTabs.length - 1 &&
    (!currentTab.items ||
      (subIndex === currentTab.items.length - 1 &&
        itemIndex === (currentTab.items[subIndex]?.subItems?.length || 0) - 1));

  return (
    <div className="flex justify-between w-full max-w-3xl mx-auto my-4 sm:my-6 px-4 sm:px-6">
      {/* Previous Button */}
      <button
        className={`flex flex-col items-center justify-center w-5/12 sm:w-2/5 md:w-1/3 border rounded-lg p-3 sm:p-4 shadow-md transition-all text-sm sm:text-base font-medium ${
          isPreviousDisabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-red-500 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        }`}
        onClick={isPreviousDisabled ? undefined : handlePrevious}
        disabled={isPreviousDisabled}
        aria-label="Previous section"
      >
        Previous
      </button>

      {/* Next Button */}
      <button
        className={`flex flex-col items-center justify-center w-5/12 sm:w-2/5 md:w-1/3 border rounded-lg p-3 sm:p-4 shadow-md transition-all text-sm sm:text-base font-medium ${
          isNextDisabled
            ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            : "text-red-500 border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
        }`}
        onClick={isNextDisabled ? undefined : handleNext}
        disabled={isNextDisabled}
        aria-label="Next section"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;
