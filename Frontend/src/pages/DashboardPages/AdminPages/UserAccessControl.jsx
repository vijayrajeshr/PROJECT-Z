
import React, { useEffect, useState } from "react";
import { MdSort, MdRefresh } from "react-icons/md";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaCaretDown } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import SelectMultiRole from "../../../components/DashBoards/AdminDashboard/UserAccessControl/SelectMultiRole";
import Signup from "./Signup";
import Tooltip from "../../../utils/Tooltip";
import { useContextData } from "../../../context/OutletContext";

const UserAccessControl = () => {
  const [toggleAccess, setToggleAccess] = useState(false);
  const { axiosApi } = useContextData();
  const [userCollection, setUserCollection] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userlist, setUserList] = useState([]);
  const [selectMany, setSelectMany] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosApi.get("/user/all-user");
        if (res.data.response) {
          setUserCollection(res.data.users);
          setIsFirstLoad(false);
        }
      } catch (err) {
        // Avoid noisy toast on subsequent operations; show only for the initial load
        if (isFirstLoad) {
          // Keep a user-visible error only on first load

        } else {
          console.error("Failed to load users:", err);
        }
        setIsFirstLoad(false);
      }
    };
    getUser();
  }, [toggleAccess]);

  const userSort = async (word) => {

    if (!userCollection) return;

    let sortedUsers = [...userCollection];

    switch (word) {
      case "lastLogin":
        sortedUsers.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
        break;
      case "newest":
        sortedUsers.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "oldest":
        sortedUsers.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "alphabet":
        sortedUsers.sort((a, b) => (a.username || "").toLowerCase().localeCompare((b.username || "").toLowerCase()));
        break;
      default:
        break;
    }

    setUserCollection(sortedUsers);
    toast.success(`Sorted by ${word}`);
  };

  const handleReset = async () => {
    try {
      const res = await axiosApi.get("/user/all-user", { withCredentials: true });
      if (res.data.response) {
        setUserCollection(res.data.users);
        toast.success("Filters reset");
      }
    } catch {
      toast.error("Failed to reset users");
    }
  };



  const accessOptions = [
    { label: "Admin", value: "admin" },
    { label: "Moderator", value: "moderator" },
    { label: "Marketing Guy", value: "marketingPerson" },
  ];

  const sortOption = [
    { label: "Last login", value: "lastLogin" },
    { label: "Newest User", value: "newest" },
    { label: "Oldest User", value: "oldest" },
    { label: "Alphabetical", value: "alphabet" },
  ];

  const toggleUserBan = async (userId) => {
    try {
      const res = await axiosApi.put(`/user/ban-user/${userId}`, {}, { withCredentials: true });
      if (res.data.response) {
        toast.success(res.data.message || "Ban status updated");
        setUserCollection(prev =>
          prev.map(user =>
            user._id === userId ? { ...user, isBanned: !user.isBanned } : user
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update ban status");
      }
    } catch (error) {
      console.error("Ban toggle error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to ban/unban user");
    }
  };


  const deleteUser = async (userId) => {
    try {
      const res = await axiosApi.delete(`/user/delete-user/${userId}`, { withCredentials: true });
      if (res.data.response) {
        toast.success(res.data.message || "User deleted successfully");
        setUserCollection(prev => prev.filter(user => user._id !== userId));
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };


  const bannedMany = async (method, actionType) => {
    if (userlist.length === 0) return toast.error("Select at least one user");

    try {
      if (method === "delete") {
        // DELETE /user/delete-many expects the body to be the array of ids.
        // axios.delete sends a request body via the config.data field.
        console.debug("Batch delete userlist:", userlist);
        const res = await axiosApi.delete("/user/delete-many", {
          data: userlist,
          withCredentials: true,
        });

        if (res.data.response) {
          toast.success(res.data.message || "Users deleted successfully");
          setUserCollection(prev => prev.filter(user => !userlist.includes(user._id)));
          setUserList([]);
          setSelectMany(false);
        } else {
          toast.error(res.data.message || "Delete failed");
        }
      } else if (method === "put") {
        // PUT /user/banned-many expects body { data: [...] } and query mode=ban|unban
        const mode = actionType === "ban" ? "ban" : "unban";
        const res = await axiosApi.put(
          `/user/banned-many?mode=${mode}`,
          { data: userlist },
          { withCredentials: true }
        );

        if (res.data.response) {
          toast.success(res.data.message || `Users ${mode}ned successfully`);
          const newBanStatus = actionType === "ban";
          setUserCollection(prev =>
            prev.map(user =>
              userlist.includes(user._id) ? { ...user, isBanned: newBanStatus } : user
            )
          );
          setUserList([]);
          setSelectMany(false);
        } else {
          toast.error(res.data.message || `${actionType} action failed`);
        }
      }
    } catch (error) {
      console.error("Batch action error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  const handleUserSearch = async (e) => {
    setSearchTerm(e.target.value);
    try {
      const res = await axiosApi.get(`/user/search?q=${e.target.value}`, { withCredentials: true });
      if (res.data.users) {
        setUserCollection(res.data.users);

      }
    } catch {
      toast.error("Search failed");
    }
  };

  const pushInUserList = (id) => {
    setUserList((prev) => prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]);
  };

  useEffect(() => {
    if (selectMany && userCollection) {
      setUserList(userCollection.map((el) => el._id));
    } else {
      setUserList([]);
    }
  }, [selectMany]);

  const multiAccess = async (role) => {
    try {
      const res = await axiosApi.get(`/user/filter?word=${role}`, { withCredentials: true });
      if (res.data.response === true) {
        setUserCollection(res.data.users);
        toast.success("Filtered by role");
      }
    } catch {
      toast.error("Failed to filter");
    }
  };

  const handleCloseClick = () => {
    setAddUser(false);
    toast("Closed add user form");
  };

  return (
    <>
      <Toaster position="top-right" />
      {addUser && (
        <div className="w-full h-screen bg-[rgb(0,0,0,.3)] fixed z-50">
          <div className="bg-white w-auto h-auto absolute top-40 left-[30%] ">
            <Signup
              handleCloseClick={handleCloseClick}
              onUserAdded={(newUser) => {
                setUserCollection((prev) => [newUser, ...prev]); // 👈 This line is the key
                setAddUser(false);
              }}
            />


          </div>
        </div>
      )}

      {/* Top Control Panel */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow mb-4 gap-4">
        {/* Left Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by username or email"
            onChange={handleUserSearch}
            className="w-[250px] sm:w-[300px] px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm placeholder:text-gray-400"
          />



          <Tooltip text="Filter Users by Role" position="bottom">
            <SelectMultiRole
              roles={[]}
              setToggleAccess={setToggleAccess}
              setUserCollection={setUserCollection}
            />
          </Tooltip>

          {userlist.length > 0 && (
            <div className="flex gap-2">
              <button
                className="text-sm font-semibold px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => bannedMany("delete")}
              >
                Delete
              </button>
              <button
                className="text-sm font-semibold px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg"
                onClick={() => bannedMany("put", "ban")}
              >
                Ban
              </button>
              <button
                className="text-sm font-semibold px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg"
                onClick={() => bannedMany("put", "allow")}
              >
                Unban
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          {/* Refresh Button - Moved here */}
          <Tooltip text="Reset Filters" position="bottom">
            <button
              onClick={handleReset}
              className="flex items-center justify-center bg-gray-300 text-gray-700 rounded-full p-2 w-9 h-9 hover:bg-gray-400 transition-all shadow-sm"
            >
              <MdRefresh size={18} />
            </button>
          </Tooltip>

          {/* Multi Access Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-200 transition-all">
              Multi Access <FaCaretDown className="mt-[1px]" />
            </MenuButton>
            <MenuItems className="absolute mt-2 right-0 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
              {accessOptions.map(({ label, value }) => (
                <MenuItem key={value}>
                  {({ active }) => (
                    <button
                      onClick={() => multiAccess(value)}
                      className={`w-full px-4 py-2 text-sm text-left ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                    >
                      {label}
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>

          {/* Add User Button */}
          <button
            className="text-sm font-semibold px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-all"
            onClick={() => setAddUser(true)}
          >
            Add User
          </button>



          {/* Sort Dropdown */}
          <Tooltip text="Sort Users" position="bottom">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="flex items-center justify-center bg-gray-300 text-gray-700 rounded-full p-2 w-9 h-9 hover:bg-gray-400 transition-all">
                <MdSort size={16} />
              </MenuButton>
              <MenuItems className="absolute mt-2 right-0 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                {sortOption.map(({ label, value }) => (
                  <MenuItem key={value}>
                    {({ active }) => (
                      <button
                        onClick={() => userSort(value)}
                        className={`w-full px-3 py-2 text-sm text-left ${active
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-700"
                          }`}
                      >
                        {label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </Tooltip>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow relative w-full flex" style={{ overflow: "visible" }}>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4">
                <input
                  type="checkbox"
                  onChange={() => setSelectMany((prev) => !prev)}
                  checked={selectMany}
                />
              </th>
              <th className="p-1 border-e text-gray-600">User ID</th>
              <th className="p-1 border-e text-gray-600">Name</th>
              <th className="p-1 border-e text-gray-600">Email</th>
              <th className="p-1 border-e text-gray-600">Role</th>
              <th className="px-4 py-2 border-e text-gray-600">Last Login</th>
              <th className="p-1 border-e text-gray-600">Join Us</th>
              <th className="p-1 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userCollection?.map((user, idx) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition-all">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={userlist.includes(user._id)}
                    onChange={() => pushInUserList(user._id)}
                  />
                </td>
                <td className="p-1 text-[9px] border-e font-semibold">{user._id}</td>
                <td className="p-1 border-e">{user.username}</td>
                <td className="p-1 border-e">{user.email}</td>
                <td className="p-1 flex flex-col border-e">
                  {user.role.map((el, idx) => (
                    <span
                      key={idx}
                      className={`m-1 px-2 py-1 text-[9px] rounded ${el === "eventCreator"
                        ? "bg-blue-100 text-blue-800"
                        : el === "user"
                          ? "bg-green-100 text-green-800"
                          : el === "restaurantOwner"
                            ? "bg-yellow-100 text-yellow-800"
                            : el === "moderator"
                              ? "bg-red-100 text-red-800"
                              : el === "kitchenOwner"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                    >
                      {el}
                    </span>
                  ))}
                </td>
                <td className="p-1 border-e">
                  {Math.floor((new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)) === 0
                    ? "today"
                    : `${Math.floor(
                      (new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)
                    )} days ago`}
                </td>
                <td className="p-1 border-e">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 w-[350px] min-h-[60px] text-center align-middle">
                  <div className="flex flex-nowrap justify-center items-center gap-2 min-h-[40px]">
                    <button
                      className="text-sm font-semibold px-4 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>

                    {user.isBanned ? (
                      <button
                        className="text-sm font-semibold px-4 py-1 bg-green-200 text-green-800 rounded-md hover:bg-green-300"
                        onClick={() => toggleUserBan(user._id)}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="text-sm font-semibold px-4 py-1 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
                        onClick={() => toggleUserBan(user._id)}
                      >
                        Ban
                      </button>
                    )}

                    <div className="min-w-1">
                      <SelectMultiRole
                        userId={user._id}
                        roles={user.role}
                        setToggleAccess={setToggleAccess}
                        onRoleUpdate={(updatedRoles) => {
                          setUserCollection((prev) =>
                            prev.map((u) =>
                              u._id === user._id ? { ...u, role: updatedRoles } : u
                            )
                          );
                        }}
                      />
                    </div>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserAccessControl;
