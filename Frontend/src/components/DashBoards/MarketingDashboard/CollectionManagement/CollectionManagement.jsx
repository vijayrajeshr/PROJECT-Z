import React, { useState, useRef, useEffect } from "react";
import { useContextData } from "../../../../context/OutletContext";
import { toast } from "react-toastify";
import CollectionType from "./CollectionType";

const CollectionManagement = () => {
  const { axiosApi } = useContextData();
  const NAME_REGEX = /^[A-Za-z0-9\s'&()\-\.]+$/;
  const DESCRIPTION_REGEX = /^[A-Za-z0-9\s.,'&()\-:;!?"]+$/;
  const [collections, setCollections] = useState([]);
  const [newCollection, setNewCollection] = useState({ 
    name: "", 
    description: "", 
    image: null,
    imagePreview: null,
    restaurants: [] 
  });
  const [editMode, setEditMode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const itemsPerPage = 3;

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get(`${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections`);
      setCollections(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
      setCollections([]);
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      setNewCollection({ 
        ...newCollection, 
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    } else {
      toast.error('Please select an image under 2MB');
    }
  };

  // Handle restaurant selection
  const handleRestaurantChange = (selectedRestaurants) => {
    setNewCollection({
      ...newCollection,
      restaurants: selectedRestaurants
    });
  };

  // Add new collection
  const handleAddCollection = async () => {
    if (!newCollection.name.trim() || !newCollection.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (newCollection.name.length > 120) {
      toast.error("Name exceeds limit");
      return;
    }

    if (!NAME_REGEX.test(newCollection.name)) {
      toast.error("Name contains invalid characters");
      return;
    }

    if (newCollection.description.length > 500) {
      toast.error("Description exceeds limit");
      return;
    }

    if (!DESCRIPTION_REGEX.test(newCollection.description)) {
      toast.error("Invalid characters in description");
      return;
    }

    if (!newCollection.image) {
      toast.error("Collection image is required.");
      return;
    }
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", newCollection.name);
      formData.append("description", newCollection.description);
      formData.append("isDefault", false);
      formData.append("status", "Active");
      
      // Add restaurants to form data
      if (newCollection.restaurants && newCollection.restaurants.length > 0) {
        newCollection.restaurants.forEach(restaurantId => {
          formData.append("restaurants[]", restaurantId);
        });
      }
      
      if (newCollection.image) {
        // The field name should match what the backend expects
        formData.append("images", newCollection.image);
      }
  
      console.log("Sending collection data:", {
        title: newCollection.name,
        description: newCollection.description,
        hasImage: !!newCollection.image,
        restaurantsCount: newCollection.restaurants?.length || 0
      });
  
      const response = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      console.log("Collection creation response:", response.data);
      toast.success("Collection added successfully!");
      setNewCollection({ name: "", description: "", image: null, imagePreview: null, restaurants: [] });
      fetchCollections();
    } catch (error) {
      console.error("Error adding collection:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add collection");
    } finally {
      setLoading(false);
    }
  };

  // Edit collection
  const handleEditCollection = (collection) => {
    setNewCollection({
      name: collection.title,
      description: collection.description || "",
      image: null,
      imagePreview: collection.photoWeb || null,
      id: collection._id,
      restaurants: collection.restaurants || []
    });
    setEditMode(collection._id);
  };

  // Update collection
  const handleUpdateCollection = async () => {
    if (!newCollection.name.trim() || !newCollection.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (newCollection.name.length > 120) {
      toast.error("Name exceeds limit");
      return;
    }

    if (!NAME_REGEX.test(newCollection.name)) {
      toast.error("Name contains invalid characters");
      return;
    }

    if (newCollection.description.length > 500) {
      toast.error("Description exceeds limit");
      return;
    }

    if (!DESCRIPTION_REGEX.test(newCollection.description)) {
      toast.error("Invalid characters in description");
      return;
    }
  
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", newCollection.name);
      formData.append("description", newCollection.description);
      
      // Add restaurants to form data
      if (newCollection.restaurants && newCollection.restaurants.length > 0) {
        newCollection.restaurants.forEach(restaurantId => {
          formData.append("restaurants[]", restaurantId);
        });
      }
      
      // Remove this section since we don't want to update the image in edit mode
      // if (newCollection.image) {
      //   formData.append("file", newCollection.image);
      // }

      await axiosApi.put(
        `${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections/${newCollection.id}`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Collection updated successfully!");
      setNewCollection({ name: "", description: "", image: null, imagePreview: null, restaurants: [] });
      setEditMode(null);
      fetchCollections();
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error("Failed to update collection");
    } finally {
      setLoading(false);
    }
  };

  // Delete collection
  const handleDeleteCollection = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        setLoading(true);
        await axiosApi.delete(`${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections/${id}`);
        toast.success("Collection deleted successfully!");
        fetchCollections();
      } catch (error) {
        console.error("Error deleting collection:", error);
        if (error.response?.data?.message === "At least one default Collection must remain") {
          toast.error("Cannot delete a default collection. Please make another collection default first.");
        } else {
          toast.error("Failed to delete collection");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected collection(s)?`)) return;
    try {
      setLoading(true);
      await axiosApi.post(`${import.meta.env.VITE_SERVER_URL}/api/marketing-dashboard/collections/bulk-delete`, {
        ids: selectedIds,
      });
      toast.success("Selected collections deleted successfully!");
      setSelectedIds([]);
      fetchCollections();
    } catch (error) {
      console.error("Error bulk deleting collections:", error);
      const msg = error.response?.data?.message || "Failed to delete selected collections";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Search filtering
  const filteredCollections = Array.isArray(collections)
  ? collections.filter((col) =>
      col.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollections = filteredCollections.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h1 className="text-2xl font-bold">Collection Management</h1>
          <p className="text-blue-100">Create and manage your restaurant collections</p>
        </div>
        
        {/* Main Content Area - Side by Side Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Add/Edit Collection Form */}
          <div className="md:w-1/2 p-6 border-r border-gray-200">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {editMode ? "Edit Collection" : "Add New Collection"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collection Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newCollection.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter collection name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newCollection.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Describe this collection"
                    rows="3"
                  ></textarea>
                </div>
                
                {/* Photo Upload Container - Only show in Create mode, not in Edit mode */}
                {!editMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Collection Image</label>
                    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleImageChange}
                        id="collection-image"
                      />
                      <label htmlFor="collection-image" className="cursor-pointer block py-8">
                        <div className="flex flex-col items-center justify-center">
                          {newCollection.imagePreview ? (
                            <img 
                              src={newCollection.imagePreview} 
                              alt="Preview" 
                              className="w-32 h-32 object-cover mb-2 rounded-md shadow-md" 
                            />
                          ) : (
                            <>
                              <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 2MB</p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Display current image in edit mode (read-only) */}
                {editMode && newCollection.imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Collection Image</label>
                    <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <img 
                        src={newCollection.imagePreview} 
                        alt="Current collection image" 
                        className="h-32 object-cover rounded-md shadow-md" 
                      />
                    </div>
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    onClick={editMode ? handleUpdateCollection : handleAddCollection}
                    disabled={loading}
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'} text-white py-3 rounded-md transition-all font-medium shadow-md`}
                  >
                    {loading ? 'Processing...' : (editMode ? "Update Collection" : "Add Collection")}
                  </button>
                  
                  {editMode && (
                    <button
                      onClick={() => {
                        setEditMode(null);
                        setNewCollection({ name: "", description: "", image: null, imagePreview: null, restaurants: [] });
                      }}
                      className="w-full mt-2 bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 transition-all font-medium"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Restaurant Selection */}
          <div className="md:w-1/2 p-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <CollectionType 
                isEditMode={!!editMode}
                selectedResource={newCollection}
                onChange={handleRestaurantChange}
                selectedRestaurants={newCollection.restaurants}
              />
            </div>
          </div>
        </div>
        
        {/* Collection List Section */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Existing Collections</h2>
            <div className="flex items-center gap-3">
              <div className="text-sm px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Selected: <span className="font-semibold">{selectedIds.length}</span>
              </div>
              <div className="w-48">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Search collections..."
                />
              </div>
              <button
                onClick={handleDeleteSelected}
                disabled={!selectedIds.length || loading}
                className={`px-4 py-2 rounded-md text-white ${selectedIds.length && !loading ? "bg-red-500 hover:bg-red-600" : "bg-gray-300 cursor-not-allowed"}`}
              >
                Delete Selected
              </button>
            </div>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {!loading && filteredCollections.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCollections.map((collection) => (
                <div
                  key={collection._id}
                  className={`relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 ${selectedIds.includes(collection._id) ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs text-gray-600">Select</span>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(collection._id)}
                      onChange={() => handleToggleSelect(collection._id)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </div>
                  {collection.photoWeb && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={collection.photoWeb} 
                        alt={collection.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{collection.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${collection.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {collection.status}
                      </span>
                      {collection.isDefault && (
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {collection.restaurants?.length || 0} Restaurants
                      </span>
                    </div>
                    <div className="flex mt-4 space-x-2">
                      <button
                        onClick={() => handleEditCollection(collection)}
                        className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-all font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCollection(collection._id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500 text-lg">No collections found. Add a new one above.</p>
            </div>
          )}
          
          {/* Pagination Controls */}
          {filteredCollections.length > itemsPerPage && (
            <div className="mt-8 flex justify-center items-center space-x-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"} transition-all`}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">Page {currentPage} of {Math.ceil(filteredCollections.length / itemsPerPage)}</span>
              <button
                disabled={indexOfLastItem >= filteredCollections.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded-md ${indexOfLastItem >= filteredCollections.length ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"} transition-all`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionManagement;
