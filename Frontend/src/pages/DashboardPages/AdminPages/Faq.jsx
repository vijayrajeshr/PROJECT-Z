import React, { useRef, useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast from "react-hot-toast";
import { useContextData } from "../../../context/OutletContext";

function Faq() {
  const [videos, setVideos] = useState([]);
  const [editVideoName, setEditVideoName] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { axiosApi } = useContextData();

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState("");
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const [type, setType] = useState("");
  const videoRef = useRef();

  useEffect(() => {
    handleFetchFaqs();
  }, []);

  const handleFetchFaqs = () => {
    axiosApi
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/faq`)
      .then((response) => {
        setFaqs(response.data.faqs || response.data);
      })
      .catch((error) => {
        console.error("Error fetching FAQs:", error);
      });
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    if (faqs[index]) {
      setEditedQuestion(faqs[index].q);
      setEditedAnswer(faqs[index].a);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedQuestion("");
    setEditedAnswer("");
  };

  const handleSaveClick = (faqId) => {
    if (!faqId) return;
    axiosApi
      .put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/faq/${faqId}`, {
        q: editedQuestion.trim(),
        a: editedAnswer.trim(),
      })
      .then(() => {
        handleCancelEdit();
        handleFetchFaqs();
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteClick = (faqId) => {
    if (!faqId || !window.confirm("Delete this FAQ?")) return;
    axiosApi
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/faq/${faqId}`)
      .then(() => handleFetchFaqs())
      .catch((error) => console.error(error));
  };

  const filteredFaqs = selectedCategoryFilter
    ? faqs.filter((faq) => {
        const matchCategory = faq.category === selectedCategoryFilter;
        const matchSearch = !searchQuery || 
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
      })
    : faqs.filter((faq) => {
        return !searchQuery || 
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      });

  const handleVideoSubmit = (event) => {
    const video = event.target.files[0];
    if (video) {
      const videoUrl = URL.createObjectURL(video);
      setVideos((prev) => [...prev, { type, video: videoUrl }]);
    }
  };

  const handleAddNewFaq = async (e) => {
    e.preventDefault();
    
    if (!newQuestion.trim() || !newAnswer.trim() || !newFaqCategory.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmittingNew(true);
    try {
      await axiosApi.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/faq`,
        {
          q: newQuestion.trim(),
          a: newAnswer.trim(),
          category: newFaqCategory,
        }
      );
      toast.success("FAQ added successfully!");
      setNewQuestion("");
      setNewAnswer("");
      setNewFaqCategory("");
      handleFetchFaqs();
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error(error.response?.data?.message || "Failed to add FAQ");
      setSubmitError(error.response?.data?.message || "Failed to add FAQ");
    } finally {
      setIsSubmittingNew(false);
    }
  };

  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Help & FAQ Management</h1>
          <p className="text-blue-100 text-lg">Create and manage frequently asked questions, categories, and help videos</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left Column - Add FAQ Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="bg-white bg-opacity-25 p-2 rounded-lg">
                      <FaPlus size={18} className="text-white" />
                    </div>
                    Create New FAQ
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleAddNewFaq} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., How do I create a restaurant?"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Answer <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        rows={5}
                        placeholder="Detailed answer here..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newFaqCategory}
                        onChange={(e) => setNewFaqCategory(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Restaurant Dashboard">Restaurant Dashboard</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Tiffin">Tiffin</option>
                        <option value="Live Event">Live Event</option>
                        <option value="Moderator Dashboard">Moderator Dashboard</option>
                        <option value="clam Restaurant">Claim Restaurant</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingNew}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <FaPlus size={16} /> {isSubmittingNew ? "Adding..." : "Create FAQ"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ List */}
          <div className="lg:col-span-2">
            {/* Filter & Search */}
            <div className="mb-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Search FAQs</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions or answers..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Filter by Category</label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Categories ({filteredFaqs.length})</option>
                  <option value="Tiffin">Tiffin</option>
                  <option value="Live Event">Live Event</option>
                  <option value="Restaurant Dashboard">Restaurant Dashboard</option>
                  <option value="Moderator Dashboard">Moderator Dashboard</option>
                  <option value="Marketing">Marketing</option>
                  <option value="clam Restaurant">Claim Restaurant</option>
                </select>
              </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                  >
                    {editIndex !== i ? (
                      <>
                        <button
                          onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition flex items-start justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex-shrink-0">
                                {i + 1}
                              </span>
                              <p className="text-base font-semibold text-gray-900 leading-snug">
                                {item.q}
                              </p>
                            </div>
                            {item.category && (
                              <div className="ml-11">
                                <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                  {item.category}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-gray-400 hover:text-gray-600">
                              {expandedIndex === i ? (
                                <FaChevronUp size={20} />
                              ) : (
                                <FaChevronDown size={20} />
                              )}
                            </span>
                          </div>
                        </button>

                        {/* Expanded Content */}
                        {expandedIndex === i && (
                          <div className="border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-6">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-6 text-sm sm:text-base">
                              {item.a}
                            </p>
                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => handleEditClick(i)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm"
                              >
                                <FaEdit size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium text-sm"
                              >
                                <FaTrash size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-6 bg-blue-50 border-t-4 border-blue-600">
                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">✎</span> Edit FAQ #{i + 1}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Question</label>
                            <textarea
                              value={editedQuestion}
                              onChange={(e) => setEditedQuestion(e.target.value)}
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Answer</label>
                            <textarea
                              value={editedAnswer}
                              onChange={(e) => setEditedAnswer(e.target.value)}
                              rows={5}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                            />
                          </div>
                          <div className="flex gap-3 justify-end pt-2 border-t border-blue-200">
                            <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2 text-sm"
                            >
                              <FaTimes size={14} /> Cancel
                            </button>
                            <button
                              onClick={() => handleSaveClick(item._id)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition inline-flex items-center gap-2 text-sm"
                            >
                              <FaSave size={14} /> Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium text-lg">No FAQs found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Help Videos</h2>
          <p className="text-gray-600 mb-8">Upload and manage video tutorials for different categories</p>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="bg-white bg-opacity-25 p-2 rounded-lg">
                  <FaPlus size={20} className="text-white" />
                </div>
                Upload New Video
              </h3>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Category</label>
                  <select
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Choose a category</option>
                    <option value="Tiffin">Tiffin</option>
                    <option value="Live Event">Live Event</option>
                    <option value="Restaurant Dashboard">Restaurant Dashboard</option>
                    <option value="Moderator Dashboard">Moderator Dashboard</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">Video File</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSubmit}
                    className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                  />
                </div>
              </div>

              {videos.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-6">
                    Videos ({videos.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className="group rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative bg-black aspect-video">
                          <video
                            src={video.video}
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            controls
                          />
                        </div>
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                          <p className="text-center text-sm font-semibold text-gray-900">
                            {video.type || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;
