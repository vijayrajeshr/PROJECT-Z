import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useContextData } from "../OutletContext";

function Login({ setLoginSet }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [issuccess, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(true); // control modal visibility
  const navigate = useNavigate();
  const { axiosApi } = useContextData();

  const switchTo = () => {
    setLogin((prev) => !prev);
    setMessage("");
    setSuccess(null);
  };

  const handleSubmit = () => {
    console.log(userName, password, email);
    if (login) {
      axiosApi
        .post(`${import.meta.env.VITE_SERVER_URL}/user/SignIn`, {
          email: email,
          password,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          setLoginSet(true);
          setShowModal(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axiosApi
        .post(`${import.meta.env.VITE_SERVER_URL}/user/register`, {
          email: email,
          password,
          username: userName,
        })
        .then((response) => {
          console.log(response.data);
          localStorage.setItem("token", response.data.token);
          setShowModal(false);
          setLoginSet(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {login ? "Login" : "Sign Up"}
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            {login ? (
              <div>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <p
                  className="mt-4 text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={switchTo}
                >
                  {"Don't have an account?"}{" "}
                  <span className="font-medium">Sign Up</span>
                </p>
                <button
                  className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <p
                  className="mt-4 text-sm text-blue-600 cursor-pointer hover:underline"
                  onClick={switchTo}
                >
                  Already have an account?{" "}
                  <span className="font-medium">Login</span>
                </p>
                <button
                  className="mt-6 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Sign Up
                </button>
              </div>
            )}
            {message && (
              <p
                className={`mt-4 text-center ${
                  issuccess ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
