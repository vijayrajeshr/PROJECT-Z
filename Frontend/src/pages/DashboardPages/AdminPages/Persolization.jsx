import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useContextData } from "../../../context/OutletContext";

function ProfileSettings() {
  const { axiosApi } = useContextData();
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [bio, setBio] = useState("This is your bio");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("1990-01-01");
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", location: "New York, USA" },
    { id: 2, device: "Safari on iPhone", location: "California, USA" },
  ]);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      console.error("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      console.error("New password and confirm password do not match.");
      return;
    }
    axiosApi
      .put(`${import.meta.env.VITE_SERVER_URL}/profile/update`, {
        email,
        firstName,
        lastName,
        bio,
        phone,
        gender,
        dob,
        newPassword,
      })
      .then(() => {
        alert("Password updated successfully.");
      })
      .catch(() => {
        alert("Failed to update password.");
      });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    setShowDeletePrompt(false);
    console.log("Account deleted successfully.");
  };

  useEffect(() => {
    axiosApi
      .get(`${import.meta.env.VITE_SERVER_URL}/profile/findByEmai`, {
        params: { email },
      })
      .then((response) => {
        const { firstName, lastName, bio, phone, gender, dob, email } =
          response.data.profile;
        console.log(response.data.profile);
        setEmail(email);
        setFirstName(firstName);
        setLastName(lastName);
        setBio(bio);
        setPhone(phone);
        setGender(gender);
        setDob(dob);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [email]);

  return (
    <div className="w-full mt-10 p-6  shadow-md rounded-lg">
      {/* Edit Profile Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Edit Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Profile Picture
            </label>
            <input
              type="file"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Change Password
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </section>

      {/* Active Sessions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Active Sessions
        </h2>
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="p-4 border border-gray-300 rounded-lg flex justify-between items-center bg-gray-50 hover:bg-gray-100"
            >
              <div>
                <p className="font-medium text-gray-700">{session.device}</p>
                <p className="text-sm text-gray-500">{session.location}</p>
              </div>
              <button
                onClick={() =>
                  setSessions((prev) => prev.filter((s) => s.id !== session.id))
                }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Delete Account Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Delete Account
        </h2>
        <button
          onClick={() => setShowDeletePrompt(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
        {showDeletePrompt && (
          <div className="mt-6 p-6 border border-red-400 bg-red-50 rounded-lg">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeletePrompt(false)}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfileSettings;
