import React from "react";

const BlogImageComponent = ({ data }) => {
  return (
    <div className="w-full">
      <div className="w-full">
        <img
          src={data.image}
          alt="blog"
          className="w-full h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 object-cover object-center rounded-md"
        />
        <h6 className="text-gray-400 text-sm md:text-base my-2">
          {data.dateAndTime}
        </h6>
        <h2 className="text-lg md:text-xl font-semibold my-2">{data.title}</h2>
        <p className="text-sm md:text-base text-gray-700">{data.desc}</p>
      </div>
    </div>
  );
};

export default BlogImageComponent;
