// FilterBox.jsx
import css from "./FilterBox.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";
import { useState } from "react";

const dietary = [
  { id: "vegan", label: "Vegan", value: "true" },
  { id: "halal", label: "Halal", value: "true" },
  { id: "glutenFree", label: "Gluten-Free", value: "true" },
  { id: "vegetarian", label: "Vegetarian", value: "true" },
  { id: "dairyFree", label: "Dairy-Free", value: "true" },
  { id: "nutFree", label: "Nut-Free", value: "true" },
];

const sorts = [
  { id: "popularity", label: "Popularity", value: "default" },
  { id: "rating", label: "Rating: High to Low", value: "HighToLow" },
  { id: "lowToHigh", label: "Cost: Low to High", value: "lowToHigh" },
  { id: "highToLow", label: "Cost: High to Low", value: "highToLow" },
  { id: "distance", label: "Distance", value: "distance" },
];

const cuisines = [
  { id: "american", label: "American Classics", value: "American" },
  { id: "mexican", label: "Mexican", value: "Mexican" },
  { id: "italian", label: "Italian", value: "Italian" },
  { id: "chinese", label: "Chinese", value: "Chinese" },
  { id: "indian", label: "Indian", value: "Indian" },
];

const FilterBox = (props) => {
  const {
    leftIcon,
    rightIcon,
    text,
    filterGroup,
    handleFilter,
    setIsOpen,
    name,
    value,
    type = "checkbox",
  } = props;
  const [isDropdown, setIsDropdown] = useState(false);

  const dropdownFilter = ["Cuisines", "Dietary", "Sort"];

  const isInclude =
    type === "checkbox"
      ? filterGroup[name] === true ||
      (name === "feature" &&
        filterGroup.feature.split(",").includes(value)) ||
      (name === "minRating" && filterGroup.minRating === value)
      : name === "sortBy"
        ? filterGroup.sortBy === value
        : name === "cuisines"
          ? filterGroup[name]?.split(",").includes(value)
          : filterGroup[name] === value;

  const isFilterText = text === "Filter";
  const isDropdownFilter = dropdownFilter.includes(text);

  const toggleDropdown = () => {
    setIsDropdown(!isDropdown);
  };

  const filterCount = Object.entries(filterGroup).reduce(
    (count, [key, val]) => {
      // Skip fields that shouldn't be counted as active "filters"
      // maxRating is paired with minRating, dish is the search query
      if (key === "maxRating" || key === "dish") return count;

      if (key === "minRating") {
        if (val !== "" || (filterGroup.maxRating && filterGroup.maxRating !== "")) {
          return count + 1;
        }
        return count;
      }

      // Skip default sort or empty sort
      if (key === "sortBy" && (val === "default" || val === "popularity" || val === "")) {
        return count;
      }

      if (val === true || (typeof val === "string" && val !== "")) {
        return (
          count +
          (key === "feature" || key === "cuisines" || key === "others"
            ? val.split(",").filter((v) => v.trim() !== "").length
            : 1)
        );
      }
      return count;
    },
    0
  );

  const handleClick = () => {
    if (isFilterText) {
      setIsOpen((prev) => !prev);
    } else if (isDropdownFilter) {
      toggleDropdown();
    } else {
      handleFilter({ target: { name, value, type, checked: !isInclude } });
    }
  };

  return (
    <div className={css.dropdown}>
      <div
        className={`${css.outerDiv} ${isInclude ? css.filterEffect : ""}`}
        onClick={handleClick}
      >
        {filterCount > 0 && isFilterText ? (
          <span className={css.filterCount}>{filterCount}</span>
        ) : leftIcon ? (
          <div className={css.leftIconBox}>
            <img className={css.leftIcon} src={leftIcon} alt="icon" />
          </div>
        ) : null}
        <div className={css.text}>{text}</div>
        {rightIcon ? (
          <div className={css.rightIconBox}>
            {isInclude ? (
              <IoIosArrowUp />
            ) : (
              <img className={css.rightIcon} src={rightIcon} alt="icon" />
            )}
          </div>
        ) : null}
        {isInclude && !isDropdownFilter && (
          <IoClose className={css.closeIcon} />
        )}
      </div>
      {isDropdown && text === "Cuisines" && (
        <DropdownMenu
          options={cuisines}
          text={text}
          name="cuisines"
          onChange={handleFilter}
          filterGroup={filterGroup}
        />
      )}
      {isDropdown && text === "Dietary" && (
        <DropdownMenu
          options={dietary}
          text={text}
          name="Dietary"
          onChange={handleFilter}
          filterGroup={filterGroup}
        />
      )}
      {isDropdown && text === "Sort" && (
        <DropdownMenu
          options={sorts}
          text={text}
          name="sortBy"
          onChange={handleFilter}
          filterGroup={filterGroup}
        />
      )}
    </div>
  );
};

const DropdownMenu = ({ text, options, name, onChange, filterGroup }) => {
  return (
    <div className={css.optionsContainer}>
      {options.map((el) => (
        <label key={el.id} className={css.option}>
          <input
            type={text === "Sort" ? "radio" : "checkbox"}
            value={el.value}
            name={name}
            checked={
              text === "Sort"
                ? filterGroup[name] === el.value
                : name === "Dietary"
                  ? filterGroup[name]
                  : filterGroup[name]?.split(",").includes(el.value) || false
            }
            onChange={(evt) => {
              if (text === "Sort") {
                onChange({
                  target: { name, value: evt.target.value, type: "radio" },
                });
              } else if (name === "Dietary") {
                onChange({
                  target: { name, value: evt.target.checked, type: "checkbox" },
                });
              } else {
                const currentValues = filterGroup[name]
                  ? filterGroup[name].split(",")
                  : [];
                const newValues = evt.target.checked
                  ? [...currentValues, el.value]
                  : currentValues.filter((v) => v !== el.value);
                onChange({
                  target: { name, value: newValues.join(","), type: "text" },
                });
              }
            }}
          />
          {el.label}
        </label>
      ))}
    </div>
  );
};

export default FilterBox;
