import React, { useEffect, useState } from "react";
import { FcAddImage } from "react-icons/fc";

const Step2 = ({ formData, handleChange, handleIconClick, errors }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [imagePreviews, setImagePreviews] = useState([]);

  const dietaryOptions = [
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Gluten-Free", value: "gluten-free" },
    { label: "Nut-Free", value: "nut-free" },
    { label: "Organic", value: "organic" },
    { label: "Dairy-Free", value: "dairy-free" },
    { label: "Halal", value: "halal" },
  ];

  const handleDietaryChange = (event) => {
    const { value, checked } = event.target;
    const updatedDietary = checked
      ? [...formData.dietary, value]
      : formData.dietary.filter((item) => item !== value);

    handleChange({
      target: {
        name: "dietary",
        value: updatedDietary,
      },
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));

    setImagePreviews(previews);
    handleChange(event);
  };

  return (
    <div className="p-2">
      {/* Product Name */}
      <div className="mb-1">
        <label className="text-sm font-semibold" htmlFor="productName">
          Product Name*
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      {/* Price */}
      <div className="mb-1">
        <label className="text-sm font-semibold" htmlFor="price">
          Price*
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter product price"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-1">
        <label className="text-sm font-semibold" htmlFor="description">
          Description*
        </label>
        <textarea
          className="w-full p-2 border rounded-md resize-vertical"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          required
        />
      </div>

      {/* Best Seller */}
      <div className="mb-1 flex items-center gap-4">
  <label className="text-sm font-semibold">Best Seller</label>
  <div className="flex items-center gap-4">
    <label className="text-sm flex items-center gap-2">
      <input
        type="radio"
        name="bestSeller"
        value="true"
        checked={formData.bestSeller === "true"}
        onChange={handleChange}
        className="w-4 h-4 accent-black"
      />
      Yes
    </label>
    <label className="text-sm flex items-center gap-2">
      <input
        type="radio"
        name="bestSeller"
        value="false"
        checked={formData.bestSeller === "false"}
        onChange={handleChange}
        className="w-4 h-4 accent-black"
      />
      No
    </label>
  </div>
</div>


      {/* Category */}
      <div className="mb-1">
        <label className="text-sm font-semibold" htmlFor="category">
          Select Category*
        </label>
        <select
          className="w-full p-2 border rounded-md"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="both">Both</option>
        </select>
      </div>

      {/* Group */}
      <div className="mb-1">
        <label className="text-sm font-semibold" htmlFor="group">
          Group*
        </label>
        <input
          className="w-full p-2 border rounded-md"
          type="text"
          id="group"
          name="group"
          value={formData.group}
          onChange={handleChange}
          placeholder="e.g. Beverage, Appetizers"
          required
        />
      </div>

      {/* Dietary Preferences */}
      <div className="mb-1">
        <label className="text-sm font-semibold">Dietary Preferences:</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {dietaryOptions.map(({ label, value }) => (
            <label key={value} className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                value={value}
                checked={formData.dietary.includes(value)}
                onChange={handleDietaryChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-1">
        <label className="block text-sm font-semibold">Choose Product Images</label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded-md"
        />
        {errors?.images && <span className="text-red-500">{errors.images}</span>}

        {/* Image Previews */}
        <div className="mt-4 flex flex-wrap gap-4">
          {imagePreviews.map((imageSrc, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={imageSrc}
                alt={`Preview ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <span className="text-xs mt-1">Preview {index + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;
