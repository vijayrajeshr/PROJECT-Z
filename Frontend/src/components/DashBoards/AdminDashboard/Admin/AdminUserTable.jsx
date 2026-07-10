import React from "react";

const AdminUserTable = () => {
  const users = [
    {
      _id: "1",
      username: "john_doe",
      email: "john@example.com",
      role: "user",
      isBlocked: false,
    },
    {
      _id: "2",
      username: "admin_user",
      email: "admin@example.com",
      role: "admin",
      isBlocked: false,
    },
    {
      _id: "3",
      username: "blocked_guy",
      email: "block@example.com",
      role: "vendor",
      isBlocked: true,
    },
  ];

  const handleBlockToggle = (userId) => {
    console.log(`Toggle block/unblock for user ${userId}`);
  };

  const handleRoleChange = (userId, newRole) => {
    console.log(`Change role of ${userId} to ${newRole}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border capitalize">{user.role}</td>
              <td className="p-2 border">
                {user.isBlocked ? (
                  <span className="text-red-600 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleBlockToggle(user._id)}
                  className={`px-3 py-1 text-sm rounded ${
                    user.isBlocked
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>

                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
