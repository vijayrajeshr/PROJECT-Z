import React, { useState } from "react";
import Axios from "axios";
import { useContextData } from "../../../context/OutletContext";
function PrivacyAndSecurity() {
  const { axiosApi } = useContextData();
  // const [blockedUsers, setBlockedUsers] = useState([
  //   { id: 1, username: "JohnDoe", email: "john@example.com" },
  //   { id: 2, username: "JaneSmith", email: "jane@example.com" },
  // ]);
  const [locationSharing, setLocationSharing] = useState(false);
  const [visibility, setVisibility] = useState("Public");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'mobile' or 'email'
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("11111@gmail.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleUnblockUser = (userId) => {
    setBlockedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
    alert("User unblocked successfully.");
  };

  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    axiosApi
      .put(`${import.meta.env.VITE_SERVER_URL}/2fa/update-location-sharing`, {
        email,
        locationSharing,
      })
      .then((response) => {
        alert(
          `Location sharing has been ${
            !locationSharing ? "enabled" : "disabled"
          }.`
        );
      })
      .catch((error) => {
        alert(
          `Location sharing has Failed.. to  ${
            !locationSharing ? "enabled" : "disabled"
          }.`
        );
      });
  };

  const changeVisibility = (newVisibility) => {
    setVisibility(newVisibility);

    axiosApi
      .put(`${import.meta.env.VITE_SERVER_URL}/2fa/update-visibility`, {
        email,
        visibility,
      })
      .then((response) => {
        alert(`Visibility changed to ${newVisibility} profile.`);
      })
      .catch((error) => {
        alert(`Visibility changed Failed to .. ${newVisibility} profile.`);
      });
  };

  const enable2FA = (method) => {
    setAuthMethod(method);
    setOtpVerified(false);
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Allow only a single digit
    setOtp(updatedOtp);
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    axiosApi
      .post(`${import.meta.env.VITE_SERVER_URL}/2fa/verify-otp`, {
        email,
        enteredOtp,
      })
      .then((response) => {
        setOtpVerified(true);
        setTwoFactorAuth(true);
        alert("Two-Factor Authentication successfully enabled!");
      })
      .catch((error) => {
        alert("Two-Factor Authentication is Disabled!");
      });
  };

  const disable2FA = () => {
    setTwoFactorAuth(false);
    setAuthMethod(null);
    setMobileNumber("");
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setOtpVerified(false);
    alert("Two-Factor Authentication has been disabled.");
  };
  const handleOpt = () => {
    try {
      axiosApi
        .post(`${import.meta.env.VITE_SERVER_URL}/2fa/enable`, { email: email })
        .then((response) => {
          alert("opt SuccessFully sent");
        })
        .catch((error) => {
          alert("failed to Sent");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Manage Blocked Users */}
      {/* <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Manage Blocked Users</h2>
        {blockedUsers.length > 0 ? (
          <ul className="list-disc pl-4 space-y-2">
            {blockedUsers.map((user) => (
              <li key={user.id} className="flex justify-between items-center">
                <span>
                  {user.username} ({user.email})
                </span>
                <button
                  onClick={() => handleUnblockUser(user.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No blocked users.</p>
        )}
      </div> */}

      {/* Location Sharing */}
      <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Location Sharing</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLocationSharing}
            className={`px-4 py-2 ${
              locationSharing ? "bg-green-500" : "bg-gray-500"
            } text-white rounded hover:opacity-90`}
          >
            {locationSharing ? "Disable" : "Enable"} Location Sharing
          </button>
          <p>
            Location sharing is currently
            <span className="font-bold">
              {" "}
              {locationSharing ? "Enabled" : "Disabled"}
            </span>
            .
          </p>
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Visibility Settings</h2>
        <div className="space-y-2">
          <button
            onClick={() => changeVisibility("Public")}
            className={`px-4 py-2 ${
              visibility === "Public" ? "bg-blue-500" : "bg-gray-500"
            } text-white rounded hover:opacity-90`}
          >
            Public Profile
          </button>
          <button
            onClick={() => changeVisibility("Private")}
            className={`px-4 py-2 ml-4 ${
              visibility === "Private" ? "bg-blue-500" : "bg-gray-500"
            } text-white rounded hover:opacity-90`}
          >
            Private Profile
          </button>
        </div>
        <p>
          Current visibility: <span className="font-bold">{visibility}</span>.
        </p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
        {!twoFactorAuth && !authMethod && (
          <div className="space-y-2">
            {/* <button
              onClick={() => enable2FA("mobile")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enable 2FA with Mobile Number
            </button> */}
            <button
              onClick={() => enable2FA("email")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Enable 2FA with Email
            </button>
          </div>
        )}

        {authMethod && !otpVerified && (
          <div className="space-y-4">
            {authMethod === "mobile" && (
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="block w-full p-2 border rounded"
              />
            )}
            {authMethod === "email" && (
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 border rounded"
              />
            )}
            <button
              onClick={() => handleOpt()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Send OTP
            </button>

            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-10 h-10 text-center border rounded focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </div>
        )}

        {twoFactorAuth && otpVerified && (
          <div className="space-y-2">
            <p className="text-green-600 font-bold">
              Two-Factor Authentication is Enabled.
            </p>
            <button
              onClick={disable2FA}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disable 2FA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivacyAndSecurity;
