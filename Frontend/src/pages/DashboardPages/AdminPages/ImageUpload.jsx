import { useState } from "react";
import axios from "axios";
import { useContextData } from "../../../context/OutletContext";

function ImageUpload() {
  const { axiosApi } = useContextData();
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleUpload = async (isMultiple) => {
    const formData = new FormData();
    if (isMultiple) {
      if (images.length === 0) return alert("Please select images");
      images.forEach((img) => formData.append("images", img));
    } else {
      if (!image) return alert("Please select an image");
      formData.append("image", image);
    }
    try {
      const endpoint = isMultiple ? "/upload-multiple" : "/upload";
      const res = await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/image${endpoint}`,
        formData
      );
      setUploadedImages([
        ...uploadedImages,
        ...(res.data.images || [res.data]),
      ]);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDelete = async (public_id) => {
    try {
      await axiosApi.delete(
        `${import.meta.env.VITE_SERVER_URL}/image/delete/${public_id}`
      );
      setUploadedImages(
        uploadedImages.filter((img) => img.public_id !== public_id)
      );
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleMultipleDelete = async () => {
    if (selectedImages.length === 0)
      return alert("Please select images to delete");
    try {
      await axiosApi.post(
        `${import.meta.env.VITE_SERVER_URL}/image/delete-multiple`,
        {
          public_ids: selectedImages,
        }
      );
      setUploadedImages(
        uploadedImages.filter((img) => !selectedImages.includes(img.public_id))
      );
      setSelectedImages([]);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div>
      <h2>Cloudinary Image Manager</h2>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={() => handleUpload(false)}>Upload Single</button>
      <br />
      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
      />
      <button onClick={() => handleUpload(true)}>Upload Multiple</button>
      <br />
      <h3>Uploaded Images</h3>
      <div>
        {uploadedImages.map((img) => (
          <div key={img.public_id}>
            <img src={img.url} alt="Uploaded" width="100" />
            <input
              type="checkbox"
              onChange={(e) => {
                const updatedSelection = e.target.checked
                  ? [...selectedImages, img.public_id]
                  : selectedImages.filter((id) => id !== img.public_id);
                setSelectedImages(updatedSelection);
              }}
            />
            <button onClick={() => handleDelete(img.public_id)}>Delete</button>
          </div>
        ))}
      </div>
      <button
        onClick={handleMultipleDelete}
        disabled={selectedImages.length === 0}
      >
        Delete Selected Images
      </button>
    </div>
  );
}

export default ImageUpload;
