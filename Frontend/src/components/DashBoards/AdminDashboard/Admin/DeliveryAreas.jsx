import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import PartitionLine from "./PartitionLine";

const DeliveryAreas = ({ deliveryAreas, title, isEditable = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  const addItem = () => {
    setIsVisible(true);
  };

  return (
    <div className="my-2">
      <h1 className="overview-heading ">{title}</h1>
      {/* <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

      {isVisible && (
        <div className="flex gap-2 my-1 ">
          <div className="flex">
            <label htmlFor="question" className="font-medium mx-2">
              Question :{" "}
            </label>
            <input
              type="text"
              name="question"
              className="rounded-md py-1 flex-grow"
            />
          </div>
          <div className="flex">
            <label htmlFor="answer" className="font-medium mx-2">
              Answer :{" "}
            </label>
            <input
              type="text"
              name="answer"
              className="rounded-md py-1 flex-grow"
            />
          </div>
          <div className="flex justify-start gap-4">
            <button className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500">
              Save
            </button>
            <button
              className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
              onClick={() => {
                setIsVisible(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

      <div className="flex gap-x-2">
        {deliveryAreas.map((el, idx) => (
          <div key={idx}>
            {el} <span className="font-medium"> | </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryAreas;
