import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import PartitionLine from "./PartitionLine";
import DelBtn from "../../../../utils/Buttons/DeleteBtn/DelBtn";
import AddOption from "./AddOption";

const FAQ = ({ faqs = null, isEditable = false, setCurrResInfo }) => {
  const [isVisible, setIsVisible] = useState(-1);

  const [info, setInfo] = useState({ name: "", value: "" });
  const [error, setError] = useState(null);

  const addItem = () => {
    setIsVisible(1);
  };

  const removeItem = (key, value) => {
    setCurrResInfo((prev) => ({
      ...prev,
      faqs: prev.faqs.filter(({ question, answer }) => key !== question),
    }));
  };

  const addItemInList = () => {
    setCurrResInfo((prev) => {
      // if name and value both are empty
      if (info.name.length === 0 && info.value.length === 0) {
        setError("Field are required");
        return prev;
      }

      // // Check if the key already exists
      // if (info.name in prev.restaurantInfo.ratings) {
      //   alert("Error: Item with the same key already exists!");
      //   return prev; // Keep previous state unchanged
      // }

      //add key value pair at the nested object
      return {
        ...prev,
        faqs: [...prev.faqs, { question: info.name, answer: info.value }],
      };
      // Add new item if key is unique
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
      <h1>FAQs</h1>
      <PartitionLine isEditable={isEditable} onBtnClick={addItem} />

      {isVisible == 1 && (
        <AddOption
          handleChange={handleChange}
          info={info}
          addItemInList={addItemInList}
          setIsVisible={setIsVisible}
          setError={setError}
          label={"Ratings"}
          flexColumn={true}
        />
      )}

      {faqs &&
        faqs.map((faq, idx) => (
          <DelBtn
            key={idx}
            isEditable={isEditable}
            onBtnClick={() => removeItem(faq.question, faq.answer)}
          >
            <div className="bg-blue-100 rounded-md my-2 p-2">
              <div>
                <b>{faq.question}</b>
              </div>
              <div>{faq.answer}</div>
            </div>
          </DelBtn>
        ))}
    </>
  );
};

export default FAQ;
