import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import PartitionLine from "./PartitionLine";
import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";
import AddOption from "./AddOption";

const OptionContainer = ({
  types = null,
  title,
  options = null,
  isEditable = false,
  setCurrResInfo = () => {},
}) => {
  const [count, setCount] = useState(types);
  const [myOptions, setMyOptions] = useState(options);
  const [isVisible, setIsVisible] = useState(-1);

  const [info, setInfo] = useState({ name: "", value: "" });
  const [error, setError] = useState(null);
  const [paymentOption, setPaymentOption] = useState(null);

  const addItemBtn = () => {
    //If features is not null
    if (types) {
      setIsVisible(0);
    } else {
      setIsVisible(1);
    }
    //for the options
  };

  const removeItem = (key, value) => {
    setCurrResInfo((prev) => ({
      ...prev,
      restaurantInfo: {
        ...prev.restaurantInfo,
        ratings: Object.fromEntries(
          Object.entries(prev.restaurantInfo.ratings).filter(
            ([k, v]) => k !== key
          )
        ),
      },
    }));
  };

  const removePayOption = (text) => {
    console.log(text);
  };

  const addPaymentOption = () => {};

  const addItemInList = () => {
    setCurrResInfo((prev) => {
      // if name and value both are empty
      if (info.name.length === 0 && info.value.length === 0) {
        setError("Field are required");
        return prev;
      }

      // Check if the key already exists
      if (info.name in prev.restaurantInfo.ratings) {
        alert("Error: Item with the same key already exists!");
        return prev; // Keep previous state unchanged
      }

      //add key value pair at the nested object
      return {
        ...prev,
        restaurantInfo: {
          ...prev.restaurantInfo,
          ratings: {
            ...prev.restaurantInfo.ratings,
            [info.name]: info.value,
          },
        },
      }; // Add new item if key is unique
    });
    setInfo({ name: "", value: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* {types && (
        <div className="my-2">
          <h1 className="overview-heading ">{title}</h1>
          <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

          {isVisible === 0 && (
            <div className="flex gap-2 my-1 ">
              <label htmlFor="feature">Payment Methods</label>
              <input
                type="text"
                name="paymentOption"
                onChange={(e) => setPaymentOption(e.target.value)}
                placeholder="i.e. Credit card"
                className="rounded-md py-1"
              />
              <div className="flex justify-start gap-4">
                <button
                  className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
                  onClick={addPaymentOption}
                >
                  Add
                </button>
                <button
                  className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
                  onClick={() => {
                    setIsVisible(-1);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {types.map((el, idx) => (
              <DelBtn
                key={idx}
                isEditable={isEditable}
                onBtnClick={() => removePayOption(el)}
              >
                <span className="rounded-xl  bg-white px-4 py-2 border  ">
                  {el}
                </span>
              </DelBtn>
            ))}
          </div>
        </div>
      )} */}

      {options && (
        <div className="my-2">
          <h1 className="overview-heading mb-2">{title}</h1>
          <PartitionLine isEditable={isEditable} onBtnClick={addItemBtn} />
          {/* adding rating on particular item */}
          {isVisible === 1 && (
            <AddOption
              handleChange={handleChange}
              info={info}
              addItemInList={addItemInList}
              setIsVisible={setIsVisible}
              setError={setError}
              label={"Ratings"}
            />
          )}
          {error && <div className="text-red-500 py-2">{error}</div>}

          <div className="flex gap-x-2 flex-wrap gap-y-6">
            {Object.entries(options).map(([key, value], idx) => (
              <DelBtn
                key={idx}
                isEditable={isEditable}
                onBtnClick={() => removeItem(key, value)}
              >
                <span className="rounded-xl  bg-white px-4 py-2 border  ">
                  <b>{key}: &nbsp;</b>
                  <i>{value}</i>
                </span>
              </DelBtn>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OptionContainer;

// const doubleInput = ()=>
