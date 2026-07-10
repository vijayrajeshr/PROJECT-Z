
import { useState, useEffect } from "react";
import HeroBanner from "/images/profilebanner.jpg";
import userPlaceholder from "/icons/biryaniC.png"; // Renamed to avoid conflict with 'user' variable
import editIcon from "/icons/edit.png"; // Renamed to avoid conflict with 'edit' variable
import EditProfileModal from "../../../Modals/EditProfileModal/EditProfileModal";

const UserHero = () => {
  const [modal, setModal] = useState(false);

  // Initialize state with values from localStorage or defaults
  const [profilePhoto, setProfilePhoto] = useState(() => {
    const savedPhoto = localStorage.getItem("userProfilePhoto");
    return savedPhoto || userPlaceholder;
  });

  const [userName, setUserName] = useState(() => {
    const savedData = localStorage.getItem("userProfileData");
    if (savedData) {
      try {
        const { username } = JSON.parse(savedData);
        return username || "Name";
      } catch (error) {
        console.error("Error parsing userProfileData:", error);
      }
    }
    return "Name";
  });

  const [coverPhoto, setCoverPhoto] = useState(() => {
    const storedCover = localStorage.getItem("userCoverImage");
    return storedCover || HeroBanner;
  });

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("userProfilePhoto", profilePhoto);
    // The userName is already saved in localStorage via 'userProfileData' in the modal,
    // so saving it again here might be redundant or could lead to inconsistencies if not managed carefully.
    // Assuming userProfileData is the single source of truth for userName.
    // localStorage.setItem('userName', userName); // Consider if this line is truly needed or if 'userProfileData' handles it.
    localStorage.setItem("userCoverImage", coverPhoto);
  }, [profilePhoto, userName, coverPhoto]);

  return (
    <>
      <div className="relative bg-white shadow-md rounded-lg overflow-hidden md:mx-4 px-10 mx-10   mt-6">
        {/* Cover Photo Section */}
        <div className="h-32 sm:h-48 md:h-64 bg-gray-200">
          <img
            className="w-full h-full object-cover"
            src={coverPhoto}
            alt="User Hero Section Banner"
          />
        </div>

        {/* Profile Info Section */}
        <div className="relative px-4 pb-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 md:-mt-24">
            {/* Profile Image */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={profilePhoto}
                alt="User Profile"
              />
            </div>

            {/* User Details and Edit Button */}
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-end mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div className="mb-4 sm:mb-0">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  {userName}
                </div>
                {/* Location can be added here if needed */}
                {/* <span className="text-gray-600 text-sm flex items-center justify-center sm:justify-start">
                  <img src={locationIcon} className="w-4 h-4 mr-1" alt="location icon" /> Location
                </span> */}
              </div>

              {/* Edit Profile Button and Stats */}
              <div className="flex flex-col items-center sm:items-end">
                <button
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 text-sm mb-4 sm:mb-2"
                  onClick={() => setModal((val) => !val)}
                >
                  <img
                    src={editIcon}
                    alt="edit icon"
                    className="w-4 h-4 mr-2"
                  />
                  Edit Profile
                </button>

                <div className="flex justify-center sm:justify-end space-x-6 text-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-800">1</span>
                    <span className="text-sm text-gray-600">Reviews</span>
                  </div>
                  <div className="h-full border-l border-gray-300"></div>{" "}
                  {/* Divider */}
                  {/* <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-800">1</span>
                    <span className="text-sm text-gray-600">Photos</span>
                  </div> */}
                  {/* Followers can be added here if needed */}
                  {/* <div className="h-full border-l border-gray-300"></div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-800">1</span>
                    <span className="text-sm text-gray-600">Followers</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <EditProfileModal
          setModal={setModal}
          setProfilePhoto={setProfilePhoto}
          setUserName={setUserName}
          currentPhoto={profilePhoto}
          currentName={userName}
          setCoverPhoto={setCoverPhoto}
          currentCover={coverPhoto}
        />
      )}
    </>
  );
};

export default UserHero;
