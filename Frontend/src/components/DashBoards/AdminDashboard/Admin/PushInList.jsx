import React from "react";

const PushInList = (prop) => {
  const { setStr, addInList, setIsVisible } = prop;
  return (
    <div className="flex gap-2 my-1">
      <label htmlFor="name">Add Feature</label>
      <input
        type="text"
        name="name"
        onChange={(e) => setStr(e.target.value)}
        placeholder="i.e. Cake"
        className="rounded-md py-1"
      />
      <button
        onClick={addInList}
        className="border-2 text-green-500 border-green-500 rounded-md hover:border-green-500"
      >
        Add
      </button>
      <button
        className="border-2 text-red-500 border-red-500 rounded-md hover:border-red-500"
        onClick={() => {
          setIsVisible(-1);
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default PushInList;
