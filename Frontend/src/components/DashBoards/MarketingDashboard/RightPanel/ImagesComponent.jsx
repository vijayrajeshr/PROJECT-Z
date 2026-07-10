import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { CiCircleInfo } from "react-icons/ci";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'
import { useOffers } from '../../../../context/OffersContext'
import { useResource } from '../../../../context/Banner_CollectionContext'

const ImagesComponent = ({ isEditMode, image, onImageChange, type, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState(null);
  const [imgRef, setImgRef] = useState(null);

  const [isOfferSelected, setIsOfferSelected] = useState(false);
  const { selectedResource, resourceType } = useResource();
  const [bannerOffer, setBannerOffer] = useState(selectedResource?.offer || "--Select--");
  const navigate = useNavigate();
  const { offers } = useOffers();
  console.log(offers);

  useEffect(() => {
    if (selectedResource?.offer) {
      setBannerOffer(selectedResource?.offer || "--Select--")
      setIsOfferSelected(true);
    } else {
      setBannerOffer("--Select--");
      setIsOfferSelected(false);
    }
  }, [selectedResource]);

  useEffect(() => {
    if (!image) {
      setPreviewImage(null);
    } else if (typeof image === "string") {
      setPreviewImage(image);
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setSrc(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageLoaded = (e) => {
    const { width: displayedWidth, height: displayedHeight } = e.currentTarget;
    setImgRef(e.currentTarget);

    // Desired aspect ratio:
    const aspect = 3300 / 900;

    // We want to fit the crop to that aspect, but not exceed the displayed size.
    let newWidth, newHeight;
    if (displayedWidth / displayedHeight > aspect) {
      // The image is relatively wide, so height is the limiting factor
      newHeight = displayedHeight;
      newWidth = displayedHeight * aspect;
    } else {
      // The image is relatively tall or same ratio
      newWidth = displayedWidth;
      newHeight = displayedWidth / aspect;
    }

    // Center the crop box:
    setCrop({
      unit: 'px',
      width: newWidth,
      height: newHeight,
      x: (displayedWidth - newWidth) / 2,
      y: (displayedHeight - newHeight) / 2,
    });
  };

  const getCroppedImg = () => {
    if (!imgRef || !crop?.width || !crop?.height) {
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.naturalWidth / imgRef.width;
    const scaleY = imgRef.naturalHeight / imgRef.height;

    // Final desired size is 3300 x 900
    canvas.width = 3300;
    canvas.height = 900;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'high';

    // Calculate the actual pixel values for cropping
    const pixelCrop = {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY,
    };

    ctx.drawImage(
      imgRef,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], 'cropped-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      onImageChange?.(file);
      setSrc(null);  // Hide the cropping tool after cropping
    }, 'image/jpeg');
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    setSrc(null);
    onImageChange?.(null);
  };

  const HandleBannerOffer = (e) => {
    const data = e.target.value;
    setBannerOffer(data); // Ensure the state updates
    if (onChange) {
      onChange("offer", data);
    }
  };

  return (
    <div className="mb-6">
      <div className="items-center w-full flex justify-between mb-4">

        <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2">
          Image for {type}{" "}
          {type === "Web" ? (
            <div className="relative group font-normal">
              <CiCircleInfo className="w-5 h-5 text-red-500 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded w-48 px-2 py-2">
                Image resolutions <br /> <br />Homepage Banner: <span className="text-red-400">1400x380</span> <br /> Others: <span className="text-red-400">1100x300</span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-red-500">*334x76</span>
          )}
        </h3>


        {resourceType === 'banners' && type === 'Web' && ( // Only show offers for Banners (Web)
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex">
              <label className={`mr-1  font-bold ${isOfferSelected ? 'text-green-600' : 'text-red-500'}`} htmlFor="offer">
                {isOfferSelected ? 'Offer:' : 'Select Offer'}
              </label>
              <select
                className="p-1 rounded"
                value={bannerOffer}
                name="offer"
                id="offer"
                disabled={!isEditMode}
                onChange={HandleBannerOffer}
              >
                <option value="">--Select--</option>
                {offers.map((offer, offerIndex) => (
                  <option key={offerIndex} value={offer.name}>{offer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="bg-green-600 rounded p-1 text-white"
                disabled={!isEditMode}
                onClick={() => navigate('/dashboard/marketing/RestaurantOffers')}
              >
                Create new
              </button>
            </div>
          </div>
        )}


      </div>

      <div className={`h-auto border rounded-md flex flex-col items-center justify-center p-4 ${type === "Web" ? "w-full" : "w-1/2"}`}>
        {isEditMode ? (
          <>
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="max-w-full h-auto"
                />
                <button
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : src ? (
              <div className="w-full">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={3300 / 900}
                  ruleOfThirds
                >
                  <img
                    src={src}
                    alt="Upload"
                    style={{ maxWidth: '100%' }}
                    onLoad={handleImageLoaded}
                  />
                </ReactCrop>
                <button
                  onClick={getCroppedImg}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Crop Image
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {type === 'Web'
                    ? 'Upload a banner image (3300x900 resolution required)'
                    : '334x76 resolution recommended'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`image-upload-${type}`}
                />
                <label
                  htmlFor={`image-upload-${type}`}
                  className="text-sm cursor-pointer px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Upload Banner Image
                </label>
              </>
            )}
          </>
        ) : previewImage ? (
          <img src={previewImage} alt="Banner" className="max-w-full h-auto" />
        ) : (
          <p className="text-gray-500 text-sm">No banner image available</p>
        )}
      </div>

    </div>
  );
};
export default ImagesComponent;
