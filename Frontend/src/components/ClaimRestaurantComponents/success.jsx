import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className=" space-y-8 p-10 bg-white shadow-lg rounded-xl text-center">
        <CheckCircle className="h-32 w-32 text-green-500 mx-auto" />
        <h2 className="text-3xl font-extrabold text-gray-900">
          Claim Submitted Successfully
        </h2>
        <p className="mt-4 text-gray-600">
          Your restaurant claim has been received and is under review. We will
          contact you via email with further updates.
        </p>
        <div className="pt-5">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
