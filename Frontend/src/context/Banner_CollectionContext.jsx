// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useContextData } from "./OutletContext";

// const ResourceContext = createContext();

// export const ResourceProvider = ({ children, resourceType }) => {
//   const [resources, setResources] = useState([]);
//   const [selectedResource, setSelectedResource] = useState("");
//   const { axiosApi } = useContextData();

//   // generic API path based on resourceType (e.g., "banners" or "collections")
//   const API_PATH = `${import.meta.env.VITE_API_PATH}/${resourceType}`;

//   const refetchResources = () => {
//     axiosApi
//       .get(API_PATH)
//       .then((response) => setResources(response.data))
//       .catch(console.error);
//     console.log(resources);
//   };

//   useEffect(() => {
//     setResources([]); // Clear previous data
//     setSelectedResource("");
//     refetchResources(); // Fetch new data for the current resourceType
//   }, [API_PATH, resourceType]);

//   useEffect(() => {
//     if (resources.length > 0) {
//       setSelectedResource((prevSelected) => {
//         const stillExists = resources.find((b) => b._id === prevSelected?._id);
//         return stillExists ? prevSelected : resources[0]; // Preserve selection if exists
//       });
//     }
//   }, [resources]);

//   const handleCreate = (newResource, imageFile) => {
//     const payload = {
//       ...newResource,
//       photoWeb: imageFile || null,
//       photoApp: imageFile || null,
//     };
//     console.log(payload);
//     axiosApi
//       .post(API_PATH, payload)
//       .then(refetchResources)
//       .catch(console.error);
//   };

//   const handleDelete = (id) => {
//     axiosApi
//       .delete(`${API_PATH}/${id}`)
//       .then(() => {
//         setResources((prev) => prev.filter((r) => r._id !== id));
//         setSelectedResource((prev) => (prev?._id === id ? null : prev));
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 403) {
//           console.log(error.response.data.message);
//           toast.error(error.response.data.message); // Error toast
//         } else {
//           toast.error(
//             "An error occurred while deleting the banner. Please try again."
//           );
//         }
//       });
//   };

//   // ------------------> update funtion
//   const handleUpdate = (id, updatedFields) => {
//     const formData = new FormData();
//     Object.keys(updatedFields).forEach((key) => {
//       const value = updatedFields[key];
//       if (value instanceof File) {
//         formData.append(key, value);
//       } else if (Array.isArray(value)) {
//         value.forEach((v) => formData.append(key, v));
//       } else {
//         formData.append(key, value);
//       }
//     });

//     axiosApi
//       .put(`${API_PATH}/${id}`, formData)
//       .then(() => {
//         setResources((prev) =>
//           prev.map((r) => (r._id === id ? { ...r, ...updatedFields } : r))
//         );
//         setSelectedResource((prev) =>
//           prev?._id === id ? { ...prev, ...updatedFields } : prev
//         );
//         refetchResources(); // refech from database to update changes live
//       })
//       .catch(console.error);
//   };

//   return (
//     <ResourceContext.Provider
//       value={{
//         resourceType,
//         resources,
//         selectedResource,
//         setSelectedResource,
//         handleCreate,
//         handleDelete,
//         handleUpdate,
//       }}
//     >
//       {children}
//     </ResourceContext.Provider>
//   );
// };

// export const useResource = () => useContext(ResourceContext);


import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useContextData } from "./OutletContext";

const ResourceContext = createContext();

export const ResourceProvider = ({ children, resourceType }) => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const { axiosApi } = useContextData();

  const API_PATH = `${import.meta.env.VITE_API_PATH}/${resourceType}`;
  console.log(resourceType);
  const refetchResources = () => {
    axiosApi
      .get(API_PATH)
      .then((response) => {
        setResources(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching ${resourceType}:`, error);
        toast.error(`Failed to load ${resourceType}.`);
      });
  };

  useEffect(() => {
    setResources([]);
    setSelectedResource(null);
    refetchResources();
  }, [API_PATH, resourceType]);

  useEffect(() => {
    if (resources.length > 0) {
      setSelectedResource((prevSelected) => {
        const stillExists = resources.find((r) => r._id === prevSelected?._id);
        return stillExists ? prevSelected : resources[0];
      });
    } else {
      setSelectedResource(null);
    }
  }, [resources]);

  const handleCreate = (newResource) => {
    axiosApi
      .post(API_PATH, newResource)
      .then(() => {
        toast.success("Banner created successfully!");
        refetchResources();
      })
      .catch((error) => {
        console.error("Error creating banner:", error);
        toast.error("Failed to create banner.");
      });
  };

  const handleDelete = (id) => {
    axiosApi
      .delete(`${API_PATH}/${id}`)
      .then(() => {
        toast.success("Banner deleted successfully!");
        refetchResources();
      })
      .catch((error) => {
        console.error("Error deleting banner:", error);
        if (error.response && error.response.status === 403) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred while deleting the banner. Please try again.");
        }
      });
  };

  const handleUpdate = (id, updatedFields) => {
    const formData = new FormData();
    Object.keys(updatedFields).forEach((key) => {
      const value = updatedFields[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    axiosApi
      .put(`${API_PATH}/${id}`, formData)
      .then(() => {
        toast.success("Banner updated successfully!");
        refetchResources();
      })
      .catch((error) => {
        console.error("Error updating banner:", error);
        toast.error("Failed to update banner.");
      });
  };

  return (
    <ResourceContext.Provider
      value={{
        resourceType,
        resources,
        selectedResource,
        setSelectedResource,
        handleCreate,
        handleDelete,
        handleUpdate,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => useContext(ResourceContext);