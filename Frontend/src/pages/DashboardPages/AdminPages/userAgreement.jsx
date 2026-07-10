import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useContextData } from "../../../context/OutletContext";

function UserAgreement() {
  const { axiosApi } = useContextData();
  const [agreementText, setAgreementText] = useState("");
  const [type, setType] = useState("basic");
  const [acknowledgedUsers, setAcknowledgedUsers] = useState([]);
  const [adminAcceptedUsers, setAdminAcceptedUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/ack/agreements/${type}`
        );
        setAgreementText(
          response.data[0]?.content || "No agreement content found."
        );
      } catch (error) {
        console.error("Error fetching agreement:", error);
        alert("Failed to fetch agreement content.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/agree/all`
        );
        const { userAccepted, adminAccept } = response.data;

        setAcknowledgedUsers(userAccepted);
        setAdminAcceptedUsers(adminAccept);
        setOtherUsers(userAccepted.filter((user) => !user.adminAccepted));
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
    fetchUsers();
  }, [type]);

  const saveAgreement = async () => {
    try {
      await axiosApi.post(`${import.meta.env.VITE_SERVER_URL}/ack/agreements`, {
        title: type,
        content: agreementText,
      });
      alert("Agreement saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Agreement failed to save!");
    }
  };

  const sendAgreement = async () => {
    try {
      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/agree/send-agreement`,
        { templateName: type }
      );
      alert(response.data.message);
    } catch (error) {}
  };
  const handleAck = async (id) => {
    try {
      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/agree/admin-accept/${id}`
      );
      alert("Acknowledged");
    } catch (error) {
      alert("failed..");
    }
  };
  const UserList = ({ title, users }) => (
    <div>
      {console.log(users)}
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="list-disc pl-4 space-y-2">
        {users?.map((user) => (
          <li key={user.user._id} className="flex items-center justify-between">
            <span>
              {user.user.username} ({user.user.email})
            </span>
            {!user.adminAccepted && (
              <button
                onClick={() => handleAck(user._id)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Acknowledged
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Agreement</h1>

      {loading && <p>Loading...</p>}

      <div>
        <h2 className="text-lg font-semibold">Select Agreement Template</h2>
        <select
          onChange={(e) => setType(e.target.value)}
          value={type}
          className="block w-full border p-2 rounded"
        >
          <option value="basic">Basic Agreement</option>
          <option value="premium">Premium Agreement</option>
          <option value="enterprise">Enterprise Agreement</option>
        </select>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Edit User Agreement</h2>
        <textarea
          value={agreementText}
          onChange={(e) => setAgreementText(e.target.value)}
          rows="8"
          className="w-full border p-2 rounded"
          placeholder="Write the user agreement here..."
        ></textarea>
        <button
          onClick={saveAgreement}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Agreement
        </button>
      </div>

      <div>
        <button
          onClick={sendAgreement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Send Agreement to New Users
        </button>
      </div>

      <UserList
        title="Acknowledged Users (Admin Accepted)"
        users={adminAcceptedUsers}
      />
      <UserList title="Other Users (Not Admin Accepted)" users={otherUsers} />
    </div>
  );
}

export default UserAgreement;
