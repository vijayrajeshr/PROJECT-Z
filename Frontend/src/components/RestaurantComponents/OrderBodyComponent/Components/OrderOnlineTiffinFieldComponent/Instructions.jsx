import React from 'react';



const OrderInstructionsWithMenu = () => {
  return (
    <div className="px-4 py-10">
      <div className="max-w-5xl w-full   p-2 border ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          📝 Important Instructions Before You Order
        </h1>

        <ul className=" text-gray-700 text-base mb-10">
          <li className="flex items-start">
            <span className="text-xl mr-3 text-indigo-600">1.</span>
            <div>
              <p>
                Please ensure that you select the <strong>same plan</strong> for all items while ordering.
              </p>
              
            </div>
          </li>

          <li className="flex items-start">
            <span className="text-xl mr-3 text-indigo-600">2.</span>
            <div>
              <p>
                All items added to the cart must have the <strong>same delivery slot</strong>.
              </p>
             
            </div>
          </li>

          <li className="flex items-start">
            <span className="text-xl mr-3 text-indigo-600">3.</span>
            <div>
              <p>
                Want to mix different plans or delivery slots? You will need to <strong>place separate orders</strong> for each combination.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <span className="text-xl mr-3 text-indigo-600">4.</span>
            <div>
              <p>
                Before checkout, review your cart to ensure <strong>all items share the same plan and delivery slot</strong>.
              </p>
            </div>
          </li>
        </ul>

        
      </div>
    </div>
  );
};

export default OrderInstructionsWithMenu;
