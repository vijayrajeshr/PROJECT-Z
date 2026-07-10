export default Pages = () => {
    return(
        <>
    {/* pages */}
    <div className="mb-8">
      <label className="block text-gray-600 text-sm mb-1">Type</label>
      {isEditMode ? (
        <select
          value={data.type}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      ) : (
        <div className="bg-gray-100 px-3 py-2 rounded-md">
          {data.type || "N/A"}
        </div>
      )}
    </div>

  </>
    )
}