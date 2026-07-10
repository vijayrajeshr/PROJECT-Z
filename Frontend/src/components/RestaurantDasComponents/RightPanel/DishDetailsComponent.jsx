const DishDetailsComponent = ({ isEditMode, details, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm mb-2">Dish Details</label>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border text-sm font-normal px-4 py-2">
              Serving Info
            </th>
            <th className="border text-sm font-normal px-4 py-2">
              Calorie Count
            </th>
            <th className="border text-sm font-normal px-4 py-2">
              Portion Size
            </th>
            <th className="border text-sm font-normal px-4 py-2">
              Allergy Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* Serving Info Dropdown */}
            <td className="border px-4 py-2">
              {isEditMode ? (
                <select
                  value={details.servingInfo || ""}
                  onChange={(e) => {
                    onChange("servingInfo", e.target.value);
                  }}
                  className="w-full border px-2 py-1 rounded-md"
                >
                  <option value="">Select</option>
                  <option value="1 person (Small)">1 person (Small)</option>
                  <option value="2 persons (Medium)">2 persons (Medium)</option>
                  <option value="4 persons (Large)">4 persons (Large)</option>
                </select>
              ) : (
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {details.servingInfo || "N/A"}
                </div>
              )}
            </td>
            {/* Calorie Count */}
            <td className="border px-4 py-2">
              {isEditMode ? (
                <input
                  type="number"
                  value={details.calorieCount || ""}
                  onChange={(e) => onChange("calorieCount", e.target.value)}
                  className="w-full border px-2 py-1 rounded-md"
                  placeholder=""
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {details.calorieCount || "N/A"}
                </div>
              )}
            </td>
            {/* Portion Size */}
            <td className="border px-4 py-2">
              {isEditMode ? (
                <input
                  type="text"
                  value={details.portionSize || ""}
                  onChange={(e) => onChange("portionSize", e.target.value)}
                  className="w-full border px-2 py-1 rounded-md"
                  placeholder=""
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {details.portionSize || "N/A"}
                </div>
              )}
            </td>
            {/* Allergy Details */}
            <td className="border px-4 py-2">
              {isEditMode ? (
                <input
                  type="text"
                  value={details.allergyDetails || ""}
                  onChange={(e) => onChange("allergyDetails", e.target.value)}
                  className="w-full border px-2 py-1 rounded-md"
                  placeholder=""
                />
              ) : (
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                  {details.allergyDetails || "N/A"}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DishDetailsComponent;
