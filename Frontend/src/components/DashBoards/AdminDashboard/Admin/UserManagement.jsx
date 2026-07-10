import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/user/all-user`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError("Failed to fetch users");
        console.error(err);
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-3">
      <h3>User List</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role?.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
