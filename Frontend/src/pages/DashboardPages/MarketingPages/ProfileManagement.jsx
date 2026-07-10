import React, { useState } from "react";
import { outletData } from "../../../data/dummy";
import arrow from '/icons/down-arrow.png'

const data = [
  "Item1",
  "Item2",
  "Item3",
  "Item4",
]


export default function ProfileManagement() {
  const [value, setValue] = useState("")

  const [isOpen, setIsOpen] = useState(false)

  const handleParent = (e) => {
    // e.stopPropagation()
    console.log('parent')
    setIsOpen(false)
    
  }
  
  const handleSpan = (e) => {
    e.stopPropagation()
    console.log('child')
    setValue(e)
    setIsOpen(false)
  }

  return (
    <div className="p-4 space-y-6 relative" onClick={handleParent}>
      <h1 className="text-2xl font-bold text-gray-700">Outlet Info</h1>

      <div className="bg-white rounded shadow p-4 space-y-3 relative group transition-all">
        <div className="hover:shadow-lg transition-shadow p-2 rounded">
          <span className="text-gray-500 text-sm">Name:</span>
          <span className="ml-2 text-gray-700 font-medium">
            {outletData.name}
          </span>
        </div>
        <div className="hover:shadow-lg transition-shadow rounded">
          <span className="text-gray-500 text-sm">RES ID:</span>
          <span className="ml-2 text-gray-700 font-medium">
            {outletData.resId}
          </span>
        </div>


        <div className="flex gap-3 transition-shadow p-2 rounded">
          <label htmlFor="offer">Offer:</label>
          <div className="w-24 cursor-pointer relative">

            <div className="rounded bg-gray-300 flex items-center justify-between w-full mb-2 border-b border-gray-500 p-2 " onClick={() => setIsOpen(pre => !pre)}>
              {value}
              <img className="w-4 h-4" src={arrow} alt="img" />
            </div>
            {isOpen && (
              <div className=" rounded flex flex-col gap-3 absolute bg-gray-300 w-24">
                {data.map((item, index) => (
                  <span onClick={() => handleSpan(item)} className="hover:shadow-md w-full px-2" key={index}>{item}</span>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
