const CityConfirmationDialog = ({ isOpen, onClose, cityName, onConfirm, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Confirm City Selection</h2>
        <p className="mb-6">Do you want to view Tiffin services in {cityName}?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            No, Show All Tiffins
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityConfirmationDialog;