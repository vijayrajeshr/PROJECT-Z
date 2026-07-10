import React, { useEffect } from "react";
import {
  TbSquareRoundedChevronLeft,
  TbSquareRoundedChevronRight,
} from "react-icons/tb";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

const Whoweare = () => {
  const blogImages = [
    "https://zomatoblog.com/wp-content/uploads/2025/02/Mysore-Raman-Blog-1.jpg",
    "https://zomatoblog.com/wp-content/uploads/2025/01/Q3FY25-Blog-cover.png",
    "https://zomatoblog.com/wp-content/uploads/2024/12/Resize-1-1.jpg",
  ];
  const imageSwitch = [
    "https://b.zmtcdn.com/web_assets/7e2c9e22ffe284beaec828fb62c4bfef1563875343.jpeg",
    "https://b.zmtcdn.com/web_assets/cfa63c11504ffe735afd3ef0383a06de1563875358.jpeg",
    "https://b.zmtcdn.com/web_assets/0e000a058ca6e5b84d5e6b486cfd00651563875325.jpeg",
    "https://b.zmtcdn.com/web_assets/4c4754484b185afd6d88e357de72f7de1563874934.jpeg",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-24 py-2 bg-black/40 text-white">
        <a href="/">
          <h4 className="text-xl font-semibold text-white md:text-2xl">
            Zomato
          </h4>
        </a>
        <div className="flex gap-4 text-base md:gap-6 md:text-lg">
          <Link to="/">Home</Link>
          <Link to="/workwithus">Work with us</Link>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[80vh]">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute z-10 flex flex-col items-center justify-center w-full text-center text-white top-1/2 transform -translate-y-1/2">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white">
            Better food for more people
          </h3>
        </div>

        <img
          src="https://b.zmtcdn.com/web/about/48fc8d7806d6a947fd041a8a1cf83bac1563875757.png"
          alt="who we are"
          className="object-cover w-full h-full"
        />
      </div>

      {/* AAAO Section */}
      <div className="w-11/12 mx-auto mt-8 sm:mt-12 md:mt-16 md:w-4/5">
        <div className="relative">
          <img
            src={imageSwitch[0]}
            alt="Quality"
            className="object-cover w-full rounded-lg aspect-[16/9] sm:aspect-[21/9] max-h-[60vh] md:max-h-[80vh]"
          />
          {/* <div className="flex justify-between text-2xl text-white absolute top-4 w-full px-4 sm:text-3xl md:text-4xl">
            <TbSquareRoundedChevronLeft />
            <TbSquareRoundedChevronRight />
          </div> */}
        </div>
        <div className="flex gap-2 mt-4 sm:gap-3 md:gap-4">
          {["A", "A", "A", "Quality"].map((item, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-semibold ${
                item === "Quality"
                  ? "bg-red-500 text-white"
                  : "border border-black"
              }`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="mt-4 sm:mt-6">
          <h2 className="text-lg font-semibold sm:text-xl md:text-2xl lg:text-3xl">
            Improving <span className="text-red-500">quality</span> of food
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base">
            We are committed to nurturing a neutral platform and are helping
            food establishments maintain high standards through Hyperpure. Food
            Hygiene Ratings is a coveted mark of quality among our restaurant
            partners.
          </p>
        </div>
      </div>

      {/* Who Are We Section */}
      <div className="flex flex-col w-11/12 mx-auto mt-8 md:flex-row md:w-4/5 md:gap-8">
        <div className="md:w-1/2">
          <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">
            <span className="border-b-4 border-red-500">Who</span> are we ?
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base">
            Launched in 2010, Our technology platform connects customers,
            restaurant partners and delivery partners, serving their multiple
            needs. Customers use our platform to search and discover
            restaurants, read and write customer generated reviews and view and
            upload photos, order food delivery, book a table and make payments
            while dining-out at restaurants. On the other hand, we provide
            restaurant partners with industry-specific marketing tools which
            enable them to engage and acquire customers to grow their business
            while also providing a reliable and efficient last mile delivery
            service. We also operate a one-stop procurement solution, Hyperpure,
            which supplies high quality ingredients and kitchen products to
            restaurant partners. We also provide our delivery partners with
            transparent and flexible earning opportunities.
          </p>
        </div>
        <div className="mt-4 md:w-1/2 md:mt-0">
          <img
            src="https://b.zmtcdn.com/web/about/a7b0a36d5107f3590895981dab2eeac31563208212.jpeg"
            alt="Who we are"
            className="object-cover w-full rounded-lg"
          />
        </div>
      </div>

      {/* From Our Blog Section */}
      <div className="w-11/12 mx-auto mt-8 md:w-4/5">
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
          From our blog
        </h1>
        <p className="mt-2 text-xs sm:text-sm md:text-base">
          Explore our blog for insightful articles, personal reflections,
          impactful resources, and ideas that inspire us at Zomato
        </p>
        <div className="flex flex-col gap-4 mt-6 sm:grid sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
          {[
            {
              img: blogImages[0],
              date: "Shuvra Saha | 4 February 2025",
              title: "Idli, spice, and everything nice–Myso...",
              desc: "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
            },
            {
              img: blogImages[1],
              date: "Shuvra Saha | 4 February 2025",
              title: "Q3FY25 shareholders’ letter and re...",
              desc: "A quick capture of headline results from this quarter",
            },
            {
              img: blogImages[2],
              date: "Shuvra Saha | 4 February 2025",
              title: "The Big Brand Theory | Carving a spice",
              desc: "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand",
            },
          ].map((blog, index) => (
            <div key={index} className="w-full cursor-pointer">
              <img
                src={blog.img}
                alt={blog.title}
                className="object-cover w-full h-40 rounded-lg sm:h-48"
              />
              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                {blog.date}
              </p>
              <h2 className="mt-1 text-sm font-medium sm:text-base md:text-lg">
                {blog.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm">{blog.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Glimpses of Life at Zomato */}
      <div className="w-11/12 mx-auto mt-12 md:w-4/5">
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
          Glimpses of life at Zomato
        </h1>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="w-full sm:w-2/3">
              <img
                src="/images/life1.png"
                alt="Life at Zomato 1"
                className="object-cover w-full h-48 rounded-lg sm:h-64 md:h-full"
              />
            </div>
            <div className="flex flex-col w-full gap-4 sm:w-1/3">
              <img
                src="/images/life2.png"
                alt="Life at Zomato 2"
                className="object-cover w-full h-24 rounded-lg sm:h-32 md:h-1/2"
              />
              <img
                src="/images/life3.png"
                alt="Life at Zomato 3"
                className="object-cover w-full h-24 rounded-lg sm:h-32 md:h-1/2"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row-reverse sm:gap-6">
            <div className="w-full sm:w-2/3">
              <img
                src="/images/life6.png"
                alt="Life at Zomato 6"
                className="object-cover w-full h-48 rounded-lg sm:h-64 md:h-full"
              />
            </div>
            <div className="flex flex-col w-full gap-4 sm:w-1/3">
              <img
                src="/images/life4.png"
                alt="Life at Zomato 4"
                className="object-cover w-full h-24 rounded-lg sm:h-32 md:h-1/2"
              />
              <img
                src="/images/life5.png"
                alt="Life at Zomato 5"
                className="object-cover w-full h-24 rounded-lg sm:h-32 md:h-1/2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-32 sm:h-48 md:h-60"></div>
      <Footer />
    </div>
  );
};

export default Whoweare;
