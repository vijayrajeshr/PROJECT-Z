import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FiSave } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import PartitionLine from "./PartitionLine";
import PushInList from "./PushInList";
import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";

const Cuisines = ({
  cuisines = null,
  title,
  isEditable = false,
  setCurrResInfo,
}) => {
  const [editableIndex, setEditableIndex] = useState(-1); // Tracks the currently editable item index
  const [tempValue, setTempValue] = useState(""); // Holds the temporary value during editing
  const [updatedCuisines, setUpdatedCuisines] = useState(cuisines); // Stores the updated cuisines list
  const [isVisible, setIsVisible] = useState(-1);
  const [str, setStr] = useState(""); // Changed null to empty string
  const [error, setError] = useState(null);

  const handleEdit = (index, currentValue) => {
    if (editableIndex === index) {
      // Save the value
      const updatedItems = [...updatedCuisines];
      updatedItems[index] = tempValue;
      setUpdatedCuisines(updatedItems);
      setEditableIndex(-1); // Exit edit mode
      setTempValue("");
    } else {
      // Enter edit mode
      setEditableIndex(index);
      setTempValue(currentValue);
    }
  };

  const addItem = () => {
    setIsVisible(1);
  };

  const removeListItem = (text) => {
    setCurrResInfo((prev) => ({
      ...prev,
      restaurantInfo: {
        ...prev.restaurantInfo,
        cuisines: prev.restaurantInfo.cuisines.filter(
          (el) => el !== text.trim()
        ),
      },
    }));
  };

  const addInList = () => {
    setCurrResInfo((prev) => {
      if (!str) {
        // Simplified empty check
        setError("Field is required"); // Fixed typo
        return prev;
      }

      if (prev.restaurantInfo.cuisines.includes(str.trim())) {
        setError("Error: Item already exists!");
        return prev;
      }

      return {
        ...prev,
        restaurantInfo: {
          ...prev.restaurantInfo,
          cuisines: [...prev.restaurantInfo.cuisines, str.trim()],
        },
      };
    });
    setStr(""); // Reset to empty string instead of null
  };

  return (
    <>
      {cuisines && (
        <div className="my-2">
          <h1 className="overview-heading ">{title}</h1>
          <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

          {isVisible == 1 && (
            <PushInList
              setIsVisible={setIsVisible}
              setStr={setStr}
              addInList={addInList}
            />
          )}

          <div className="grid grid-cols-4 gap-2">
            {updatedCuisines.map((el, idx) => (
              <DelBtn
                key={idx}
                isEditable={isEditable}
                onBtnClick={() => removeListItem(el)}
              >
                <div className="text-gray-700 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2 flex items-center hover:shadow-md hover:bg-gray-100 transition-all duration-200">
                  <button
                    className="bg-transparent border-0 me-1 focus:outline-none"
                    onClick={() => handleEdit(idx, el)}
                  >
                    {editableIndex === idx ? (
                      <FiSave title="save" />
                    ) : (
                      <FiEdit title="edit" />
                    )}
                  </button>

                  {editableIndex === idx ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border border-gray-300 rounded p-1 flex-1"
                      autoFocus
                    />
                  ) : (
                    <span>{el}</span>
                  )}
                </div>
              </DelBtn>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Cuisines;
