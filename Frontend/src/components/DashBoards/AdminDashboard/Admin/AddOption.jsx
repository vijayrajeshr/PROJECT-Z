import React from "react";

const AddOption = (prop) => {
  const {
    handleChange,
    info,
    addItemInList,
    setIsVisible,
    setError,
    label,
    flexColumn = false,
  } = prop;
  return (
    <div className={`flex gap-2 my-2 ${flexColumn && "flex-col"}`}>
      <label htmlFor="feature">{label}</label>
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        name="name"
        value={info.name}
        placeholder="Name"
        className="rounded-md py-1 flex-grow"
      />
      <input
        type="text"
        name="value"
        value={info.value}
        onChange={(e) => handleChange(e)}
        placeholder="Value"
        className="rounded-md py-1 flex-grow"
      />
      <div className="flex justify-start gap-4 ">
        <button
          className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
          onClick={addItemInList}
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
  );
};

export default AddOption;
