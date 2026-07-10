import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MultiSelectDropdown from "../../../components/DashBoards/AdminDashboard/UserAccessControl/MultiSelectDropdown";
import { useContextData } from "../../../context/OutletContext";

const Signup = ({ handleCloseClick }) => {
  const { axiosApi } = useContextData();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  let [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role: selectedOptions,
  });

  console.log(selectedOptions);

  const handleChange = (evt) => {
    let { name, value } = evt.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const res = await axiosApi.post(
        import.meta.env.VITE_SERVER_URL + "/user/signup",
        {
          username: user.username,
          password: user.password,
          email: user.email,
          role: selectedOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      if (res.data.response === true) {
        toast.success(res.data.message);
        setUser({
          username: "",
          password: "",
          email: "",
          role: [],
        });
        setSelectedOptions([]);
        handleCloseClick();
      }
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || err.message || "Signup failed";
      toast.error(errorMessage);
    }
  };

  return (
   <div className="rounded-lg shadow-lg w-96 p-8 bg-white">
  <div className="flex justify-end mb-2">
    <span
      className="bg-black text-white px-2 py-1 rounded cursor-pointer"
      onClick={handleCloseClick}
    >
      X
    </span>
  </div>
  <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="text"
      name="username"
      placeholder="Username"
      value={user.username}
      onChange={handleChange}
      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      value={user.email}
      onChange={handleChange}
      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={user.password}
      onChange={handleChange}
      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <MultiSelectDropdown
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
    />
    <button
      type="submit"
      className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Sign Up
    </button>
  </form>
</div>

  );
};

export default Signup;
