import axios from "axios";
import css from "./ProfileWidget.module.css";
import rightArrowImg from "/icons/right-arrow.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const deleteReasons = [
  "I don't want to use this app anymore",
  "I'm using a different account",
  "I'm worried about my privacy",
  "You're sending me too many emails/notifications",
  "The app is not working properly",
  "Other",
];

const ProfileWidget = ({ name, tag, data }) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!selectedReason) {
      alert("Please select a reason for deleting your account");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/user/delete-user-profile`,
        { withCredentials: true }
      );

      console.log("Response:", response.data);

      console.log("Account deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error.response || error.message);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedReason("");
  };

  return (
    <div className={" flex w-full bg-white shadow-md  "}>
      <div className={"  p-3"}>
        <div className={""}>
          <h2 className={`${css.sectionTitle} font-semibold `}>
            ACCOUNT SETTINGS
          </h2>
          <div
      className={css.SettingOption}
      onClick={() => navigate("/user/ll/settings")}
    >
      Setting
    </div>
          <div
            className={css.deleteOption}
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Account
          </div>
          
        </div>
      </div>

      {showDeletePopup && (
        <div className={css.popupOverlay}>
          <div className={css.popup}>
            <h2>Delete account</h2>
            <h3>Why would you like to delete your account?</h3>

            <div className={css.reasonsList}>
              {deleteReasons.map((reason, index) => (
                <div
                  key={index}
                  className={`${css.reasonItem} ${
                    selectedReason === reason ? css.selected : ""
                  }`}
                  onClick={() => setSelectedReason(reason)}
                >
                  {reason}
                  <img src={rightArrowImg} alt="arrow" />
                </div>
              ))}
            </div>

            <div className={css.popupButtons}>
              <button className={css.cancelButton} onClick={handleCancelDelete}>
                Cancel
              </button>
              <button
                className={css.deleteButton}
                onClick={handleDeleteAccount}
                disabled={!selectedReason}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWidget;
