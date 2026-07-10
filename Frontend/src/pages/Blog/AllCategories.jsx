import React from "react";
import Blog from "./Blog";
import { useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";

const AllCategories = () => {
  const location = useLocation();
  const allCategoryData = location.state?.allCategories;

  return (
    <>
      <Blog />
      {allCategoryData && (
        <div className="flex flex-wrap justify-between gap-6 px-4 md:px-12 mt-6">
          {allCategoryData.map((data, idx) => (
            <div
              key={idx}
              className="w-full sm:w-[48%] lg:w-[32%] xl:w-[24%] flex-shrink-0"
            >
              <BlogImageComponent data={data} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AllCategories;
