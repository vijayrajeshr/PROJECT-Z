"use client"; // Keep if your environment requires it

import React from 'react';

// Receiving the props by their exact names
export default function ChildComponent({ messageFromParent, numberProp, arrayProp, updateParentState }) {

  // --- CRITICAL DEBUGGING LOGS ---
  console.log("--- ChildComponent.jsx is rendering ---");
  console.log("ChildComponent.jsx - messageFromParent:", messageFromParent);
  console.log("ChildComponent.jsx - numberProp:", numberProp);
  console.log("ChildComponent.jsx - arrayProp:", arrayProp);
  console.log("ChildComponent.jsx - updateParentState (should be a function):", updateParentState);
  // --- END CRITICAL DEBUGGING LOGS ---

  return (
    <div className="p-6 mt-8 bg-white rounded-lg shadow-lg border border-gray-200 w-96 text-center">
      <h2 className="text-2xl font-semibold mb-4">Child Component</h2>
      
      {/* Visual display of received props */}
      <div className="mb-4 text-left">
        <p className="font-bold">Message from Parent:</p>
        <p className="font-mono text-green-700">
          {messageFromParent === undefined ? 'UNDEFINED' : `"${messageFromParent}"`}
        </p>
        <p className="font-bold mt-2">Number Prop:</p>
        <p className="font-mono text-purple-700">
          {numberProp === undefined ? 'UNDEFINED' : numberProp}
        </p>
        <p className="font-bold mt-2">Array Prop:</p>
        <p className="font-mono text-orange-700">
          {arrayProp === undefined ? 'UNDEFINED' : arrayProp.join(', ')}
        </p>
        <p className="font-bold mt-2">updateParentState is Function:</p>
        <p className="font-mono text-red-700">
          {typeof updateParentState === 'function' ? 'YES' : 'NO'}
        </p>
      </div>

      {/* Button to test updating parent state */}
      <button
        onClick={() => {
          if (typeof updateParentState === 'function') {
            updateParentState("Updated by Child!");
            console.log("ChildComponent.jsx - Button clicked, attempting to update parent state.");
          } else {
            console.warn("ChildComponent.jsx - updateParentState is not a function, cannot update parent state.");
          }
        }}
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
      >
        Update Parent State
      </button>
    </div>
  );
}
