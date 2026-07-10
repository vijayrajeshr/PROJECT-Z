import React, { useState } from "react";
import Tooltip from "../../../../utils/Tooltip";

const Filter = ({ options, setFilterWord = () => {} }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (filterKey) => {
    // If clicking the same filter again, or clicking 'clear', reset the filter
    const newFilter =
      filterKey === activeFilter || filterKey === "clear" ? null : filterKey;
    setActiveFilter(newFilter);
    setFilterWord(newFilter);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {options.map((el) => {
        const isActive = activeFilter === el.key;
        const isClearButton = el.key === "clear";

        // Base classes
        let classes = `
          flex items-center gap-1.5 px-2.5 py-1.5 
          border rounded-md 
          text-xs font-medium 
          cursor-pointer transition-colors duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-1
        `;

        // Styling based on state (active, clear, default)
        if (isClearButton) {
          classes += `
            ${
              isActive
                ? "bg-red-500 text-white border-red-600 focus:ring-red-500"
                : "bg-white text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500"
            }
          `;
        } else if (isActive) {
          classes += `
            bg-blue-600 text-white border-blue-700 focus:ring-blue-500
          `;
        } else {
          classes += `
            bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-500
          `;
        }

        return (
          <Tooltip
            key={el.key}
            text={el.title}
            position="bottom"
            disabled={!!el.icon}
          >
            {" "}
            {/* Disable tooltip if icon exists? Or always show? */}
            <button
              className={classes.trim().replace(/\s+/g, " ")}
              onClick={() => handleFilterClick(el.key)}
              aria-pressed={isActive}
              aria-label={`Filter by ${el.title}`}
            >
              {el.icon && (
                <span
                  className={`text-sm ${
                    isActive && !isClearButton
                      ? "text-blue-100"
                      : isClearButton && !isActive
                      ? "text-red-500"
                      : isClearButton && isActive
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {el.icon}
                </span>
              )}
              {!isClearButton && <span className="truncate">{el.title}</span>}{" "}
              {/* Show title only if not Clear */}
              {isClearButton && <span>{el.title}</span>}{" "}
              {/* Always show title for Clear */}
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default Filter;
