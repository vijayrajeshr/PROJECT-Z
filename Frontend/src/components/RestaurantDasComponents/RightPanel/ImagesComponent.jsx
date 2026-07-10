import { FiUpload, FiImage, FiVideo } from "react-icons/fi";

const ImagesComponent = ({
  isEditMode,
  images,
  video,
  onImageChange,
  onVideoChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-600 text-sm mb-2">
        Images and Video
      </label>
      <div className="grid grid-cols-4 gap-4">
        {/* Image Upload Slots */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center"
          >
            {isEditMode ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onImageChange(index, e.target.files[0]);
                    }
                  }}
                  className="hidden"
                  id={`image-upload-${index}`}
                />
                <label
                  htmlFor={`image-upload-${index}`}
                  className="cursor-pointer flex items-center justify-center"
                >
                  {images[index] ? (
                    <img
                      src={
                        images[index] instanceof File
                          ? URL.createObjectURL(images[index])
                          : images[index]
                      }
                      alt={`Uploaded ${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage size={24} className="text-gray-400" />
                  )}
                </label>
              </>
            ) : images[index] ? (
              <img
                src={images[index]}
                alt={`Image ${index}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiImage size={24} className="text-gray-400" />
            )}
          </div>
        ))}

        {/* Video Upload Slot */}
        <div className="w-24 h-24 border rounded-md overflow-hidden flex items-center justify-center">
          {isEditMode ? (
            <>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    onVideoChange(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex items-center justify-center"
              >
                {video ? (
                  video instanceof File ? (
                    <video
                      src={URL.createObjectURL(video)}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )
                ) : (
                  <FiVideo size={24} className="text-gray-400" />
                )}
              </label>
            </>
          ) : video ? (
            <video
              src={video}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <FiVideo size={24} className="text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesComponent;
