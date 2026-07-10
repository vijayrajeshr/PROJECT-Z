import React, { useState } from "react";
import TermsAdd from "./TermsAdd";
import UserAgreement from "./userAgreement";
function Terms() {
  const [termsOfService, setTermsOfService] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  



  return (
    <div className="p-6 space-y-8">
      

      {/* View & Update Terms of Service */}
      <div className="bg-white p-4 rounded-md w-full">
        <TermsAdd/>
      </div>

    

      {/* User Agreement Acknowledgment */}
      {/* <div className="bg-white p-4 rounded-md w-full">
        <h2 className="text-lg font-semibold text-gray-800">
          User Agreement Acknowledgment
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={userAgreement}
            onChange={handleUserAgreementToggle}
            className="form-checkbox h-5 w-5 text-green-600"
          />
          <label className="text-sm text-gray-700">
            Enable User Agreement Acknowledgment
          </label>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          {userAgreement
            ? "User Agreement Acknowledgment is currently enabled. Users must accept the agreement before proceeding."
            : "User Agreement Acknowledgment is currently disabled."}
        </p>
      </div> */}
      <UserAgreement/>
    </div>
  );
}

export default Terms;
