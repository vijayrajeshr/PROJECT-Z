// import React, { useEffect } from "react";
// import css from "./InvestorRelations.module.css";
// import { FaCircleArrowRight } from "react-icons/fa6";
// import Footer from "../../Footer/Footer";
// //
// import { Link } from "react-router-dom";

// // const InvestorRelations = () => {
// //     return (
// //         <div className={css.investorRelations}>
// //             {/* Hero Section */}
// //             <section className={css.heroSection}>
// //                 <div className={css.heroText}>
// //                     <h1>Better food for more people</h1>
// //                 </div>
// //                 <div className={css.heroDescription}>
// //                     <h2>Instant commerce indistinguishable from magic</h2>
// //                     <p>Make India malnutrition free</p>
// //                 </div>
// //             </section>

// //             {/* Company Overview */}
// //             <section className={css.companyOverview}>
// //                 <h2>Company Overview</h2>
// //                 <div className={css.companyContent}>
// //                     <div className={css.companyDetails}>
// //                         <h3>Presentation</h3>
// //                         <a href="/investors/presentation" className={css.viewMore}>See all</a>
// //                     </div>
// //                     <div className={css.companyDetails}>
// //                         <h3>Q2FY25 Results</h3>
// //                         <a href="/investors/q2fy25" className={css.viewMore}>See all</a>
// //                     </div>
// //                     <div className={css.companyDetails}>
// //                         <h3>Shareholders' Letter</h3>
// //                         <a href="/investors/shareholders-letter" className={css.viewMore}>See all</a>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* Core Offerings */}
// //             <section className={css.coreOfferings}>
// //                 <h2>Our Core Offerings</h2>
// //                 <div className={css.offerings}>
// //                     <div className={css.offering}>
// //                         <h3>Food Delivery</h3>
// //                         <p>Food ordering and delivery platform where customers can search and discover local restaurants, order food, and have it delivered reliably and quickly.</p>
// //                     </div>
// //                     <div className={css.offering}>
// //                         <h3>Quick Commerce</h3>
// //                         <p>Quick commerce platform where customers can order everyday needs across thousands of products and have them delivered within minutes.</p>
// //                     </div>
// //                     <div className={css.offering}>
// //                         <h3>Hyperpure</h3>
// //                         <p>Hyperpure is a B2B platform supplying high-quality food ingredients and other products.</p>
// //                     </div>
// //                     <div className={css.offering}>
// //                         <h3>Going-out</h3>
// //                         <p>Going-out enables discovery and ticketing of offline experiences such as in-restaurant dining and live events.</p>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* ESG Section */}
// //             <section className={css.esgSection}>
// //                 <h2>Beyond Business</h2>
// //                 <p>Our business approach is guided by our commitment to responsible and sustainable growth. Our ESG update outlines the many ways in which we make the impact of our business more sustainable and help make the world a better place for everyone.</p>
// //                 <ul className={css.esgList}>
// //                     <li><strong>Feeding India:</strong> A not-for-profit organisation designing interventions to reduce hunger and malnutrition.</li>
// //                     <li><strong>Net Zero Emissions:</strong> We aim to achieve net zero emissions by 2033.</li>
// //                     <li><strong>Reducing Plastic Waste:</strong> Ensuring completely plastic-neutral deliveries since April 2022.</li>
// //                 </ul>
// //             </section>

// //             {/* Blog Section */}
// //             <section className={css.blogsSection}>
// //                 <h2>From Our Blogs</h2>
// //                 <div className={css.blogsList}>
// //                     <div className={css.blogPost}>
// //                         <h3>Technology</h3>
// //                         <p>Apache Flink Journey @Zomato: From Inception to Innovation</p>
// //                     </div>
// //                     <div className={css.blogPost}>
// //                         <h3>Restaurants</h3>
// //                         <p>The Big Brand Theory: How Ma’s Recipes Became a Leading Burmese Cuisine Brand</p>
// //                     </div>
// //                     <div className={css.blogPost}>
// //                         <h3>Product</h3>
// //                         <p>Food Rescue: Our Initiative to Minimize Food Wastage</p>
// //                     </div>
// //                 </div>
// //             </section>

// //             {/* Email Subscription */}
// //             <section className={css.subscriptionSection}>
// //                 <h2>Subscribe to Our Email Alerts</h2>
// //                 <form className={css.subscriptionForm}>
// //                     <input type="email" placeholder="Enter your email" />
// //                     <button type="submit">Subscribe</button>
// //                 </form>
// //             </section>

// //             {/* Contact Us */}
// //             <section className={css.contactSection}>
// //                 <h2>Have Questions?</h2>
// //                 <p>Reach out to us by emailing at <a href="mailto:shareholders@zomato.com">shareholders@zomato.com</a>, and we’ll get back to you.</p>
// //             </section>
// //         </div>
// //     );
// // };

// // export default InvestorRelations;

// const InvestorRelations = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   return (
//     <div>
//       <div className={css.heroBanner}>
//         <div className={css.herobody}>
//           <div className={css.title}>
//             <a href="/">
//               <h1>Zomato</h1>
//             </a>
//             <h2>Investor Relations</h2>
//           </div>

//           <div className={css.navLinks}>
//             <a href="/">
//               {" "}
//               <button> Home </button>
//             </a>
//             {/* Wrap the button inside Link */}
//             <Link to="/investors/announcement">
//               <button>Announcements</button>
//             </Link>
//             <a href="/blog">
//               <button> Blog </button>
//             </a>
//             <Link to="/investors/governance">
//               <button>Governance</button>
//             </Link>
//             <Link to="/investors/esg">
//               {" "}
//               <button>ESG</button>
//             </Link>
//             <Link to="/investors/resources">
//               <button> Resources</button>
//             </Link>{" "}
//           </div>
//         </div>

//         <div className={css.container}>
//           <div className={css.leftcontainer}>
//             <h1> Better food for more people</h1>
//             <h2> Zomato hyperpure </h2>
//             <h1> Instant commerce indistinguishable from magic </h1>
//             <h2>blinket</h2>
//             <h1> World class going-out experiences in India </h1>
//             <h2>district</h2>
//             <h1> Make India malnutrition free </h1>
//             <h2>feeding india</h2>
//           </div>

//           <div className={css.rightcontainer}>
//             <div className={css.mainbox}>
//               <h1>company overview</h1>
//               <div className={css.box1}>
//                 <img src="https://b.zmtcdn.com/data/o2_assets/e57a966283f35002a8e3bab05f2eb9dc1698913839.png" />
//                 <h2> Presentation </h2>
//                 <FaCircleArrowRight />
//               </div>
//               <h1> Q3FY25 results </h1>

//               <div className={css.box1}>
//                 <img src="https://b.zmtcdn.com/data/o2_assets/e57a966283f35002a8e3bab05f2eb9dc1698913839.png" />
//                 <h2> Presentation </h2>
//                 <FaCircleArrowRight />
//               </div>

//               <div className={css.box1}>
//                 <img src="https://b.zmtcdn.com/data/o2_assets/e57a966283f35002a8e3bab05f2eb9dc1698913839.png" />
//                 <h2> Presentation </h2>
//                 <FaCircleArrowRight />
//               </div>

//               <div className={css.box1}>
//                 <img src="https://b.zmtcdn.com/data/o2_assets/e57a966283f35002a8e3bab05f2eb9dc1698913839.png" />
//                 <h2> Presentation </h2>
//                 <FaCircleArrowRight />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <h1 className={css.tt}> Our core offerings </h1>
//       <div className={css.ourCore}>
//         <div className={css.boxContent}>
//           <div className={css.leftC1}>
//             <h1> Food delivery </h1>
//             <p>
//               {" "}
//               Food ordering and delivery platform where customers can search and
//               discover local restaurants, order food, and have it delivered
//               reliably and quickly{" "}
//             </p>

//             <h2>Q3FY25</h2>
//             <div className={css.b2}>
//               <div className={css.l1}>
//                 <h4>INR 9,913 crore</h4>
//                 {/* <p>Food delivery GOV</p> */}
//               </div>
//               <div className={css.r1}>
//                 <h4>20.5 million</h4>
//                 {/* <p>Avg. monthly transacting customers</p> */}
//               </div>
//             </div>
//           </div>
//           <div className={css.rightC1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/b51825c339e733d4d9b364df636d1ef11682669740.png" />
//           </div>
//         </div>

//         <div className={css.boxContent}>
//           <div className={css.leftC1}>
//             <h1> Grocery & Essentials Delivery </h1>
//             <p>
//               {" "}
//               Beyond food, we bring daily essentials right to your doorstep.
//               From fresh fruits and vegetables to household items, shop from
//               trusted local stores with lightning-fast delivery and easy payment
//               options.{" "}
//             </p>
//           </div>
//           <div className={css.rightC1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/b51825c339e733d4d9b364df636d1ef11682669740.png" />
//           </div>
//         </div>

//         <div className={css.boxContent}>
//           <div className={css.leftC1}>
//             <h1> Dine-Out Reservation </h1>
//             <p>
//               {" "}
//               Enjoy hassle-free dining experiences by reserving tables at your
//               favorite restaurants directly through our platform. Get real-time
//               availability, exclusive offers, and instant confirmations—perfect
//               for date nights, family dinners, or business lunches.{" "}
//             </p>
//           </div>
//           <div className={css.rightC1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/b51825c339e733d4d9b364df636d1ef11682669740.png" />
//           </div>
//         </div>

//         <div className={css.boxContent}>
//           <div className={css.leftC1}>
//             <h1>Zomato Pro Membership </h1>
//             <p>
//               {" "}
//               Unlock premium benefits with Zomato Pro! Get up to 40% off on
//               dining out and food delivery, priority support, and exclusive
//               access to events. It’s the smartest way to save while enjoying
//               more of what you love.{" "}
//             </p>
//           </div>
//           <div className={css.rightC1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/b51825c339e733d4d9b364df636d1ef11682669740.png" />
//           </div>
//         </div>
//       </div>

//       <div className={css.beyondBusiness}>
//         <h1> Beyond business </h1>

//         <p>
//           At Zomato, our business approach is guided by our commitment to
//           responsible and sustainable growth. Our ESG update outlines the many
//           ways in which we make the impact of our business more sustainable and
//           help make the world a better place for everyone. Some of our key
//           sustainability initiatives include:
//         </p>

//         <div className={css.businessContainer}>
//           <div className={css.b1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/1ef4b31977addf56d67ede5f6eed18a91691498028.png" />
//             <h2> Feeding India </h2>
//             <p className=" p-2 text-sm">
//               {" "}
//               A not-for-profit organisation, designing interventions to reduce
//               hunger and malnutrition among underserved communities in India{" "}
//             </p>
//           </div>
//           <div className={css.b1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/1ef4b31977addf56d67ede5f6eed18a91691498028.png" />
//             <h2>Zomato for Restaurants </h2>
//             <p className=" p-2 text-sm ">
//               {" "}
//               Help restaurants grow with tools to manage orders, improve
//               delivery, track performance, and reach more customers.{" "}
//             </p>
//           </div>
//           <div className={css.b1}>
//             <img src="https://b.zmtcdn.com/data/o2_assets/1ef4b31977addf56d67ede5f6eed18a91691498028.png" />
//             <h2>Advertising Solutions</h2>
//             <p className=" p-2 text-sm">
//               {" "}
//               A not-for-profit organisation, designing interventions to reduce
//               hunger and malnutrition among underserved communities in India{" "}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* blogs */}
//       <div className={css.fromBlog}>
//         <h1> From our blog </h1>
//         <span>
//           {" "}
//           Explore our blog for insightful articles, personal reflections,
//           impactful resources, and ideas that inspire us at Zomato{" "}
//         </span>
//       </div>
//       <div className={css.blogs}>
//         <div className={css.box}>
//           <img src="/images/blog1.png" />
//           <p>Shuvra Saha | 4 February 2025</p>
//           <h2>Idli, spice, and everything nice–Myso...</h2>
//           <span>
//             {" "}
//             Inspired by a chance meeting in a small town, Mysore Raman Idli has
//             built a strong following by serving delicious South Indian dishes
//             rooted in tradition{" "}
//           </span>
//         </div>
//         <div className={css.box}>
//           <img src="/images/blog2.png" />
//           <p>Shuvra Saha | 4 February 2025</p>
//           <h2> Q3FY25 shareholders’ letter and re... </h2>
//           <span> A quick capture of headline results from this quarter </span>
//         </div>
//         <div className={css.box}>
//           <img src="/images/blog3.png" />
//           <p>Shuvra Saha | 4 February 2025</p>
//           <h2> The Big Brand Theory | Carving a spice </h2>
//           <span>
//             {" "}
//             Explore how the fusion of tradition and innovation shaped the
//             creation of a legacy brand{" "}
//           </span>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default InvestorRelations;

import React, { useEffect } from "react";
import { FaCircleArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";

const InvestorRelations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans bg-white">
      {/* Hero Banner */}
      <div className="w-full bg-[#ffffff] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <a href="/">
              <h1 className="text-2xl md:text-3xl font-semibold">Zomato</h1>
            </a>
            <h2 className="text-lg md:text-xl font-medium border-b border-[#EFA1A1] pb-1">
              Investor Relations
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="/">
             <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
  Home
</button>

            </a>
          <Link to="/investors/announcement">
  <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
    Announcements
  </button>
</Link>

<a href="/blog">
  <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
    Blog
  </button>
</a>

<Link to="/investors/governance">
  <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
    Governance
  </button>
</Link>

<Link to="/investors/esg">
  <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
    ESG
  </button>
</Link>

<Link to="/investors/resources">
  <button className="bg-[#02757A] border border-white text-white px-4 py-2 rounded-md text-sm md:text-base hover:bg-red hover:text-[#EF4F5F] transition">
    Resources
  </button>
</Link>

          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between px-4 py-8 gap-6">
          <div className="md:w-1/2">
  <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-black">
    Better food for more people
  </h1>
  <h2 className="text-xl md:text-2xl font-medium border-b border-[#EFA1A1] pb-2 mb-4 text-black">
    Zomato hyperpure
  </h2>
  <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-black">
    Instant commerce indistinguishable from magic
  </h1>
  <h2 className="text-xl md:text-2xl font-medium border-b border-[#EFA1A1] pb-2 mb-4 text-black">
    Blinkit
  </h2>
  <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-black">
    World class going-out experiences in India
  </h1>
  <h2 className="text-xl md:text-2xl font-medium border-b border-[#EFA1A1] pb-2 mb-4 text-black">
    District
  </h2>
  <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-black">
    Make India malnutrition free
  </h1>
  <h2 className="text-xl md:text-2xl font-medium border-b border-[#EFA1A1] pb-2 text-black">
    Feeding India
  </h2>
</div>

          <div className="md:w-1/2 flex justify-center">
            <div className="bg-[#F7FFF7] p-6 rounded-2xl shadow-lg w-full max-w-md">
              <h1 className="text-xl md:text-2xl font-semibold mb-4 text-black">
                Company Overview
              </h1>
              {[
                "Presentation",
                "Q3FY25 Results",
                "Presentation",
                "Presentation",
              ].map((title, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-[#EDEAE5] rounded-lg mb-4 hover:bg-[#EF4F5F] hover:text-white transition"
                >
                  <img
                    src="https://b.zmtcdn.com/data/o2_assets/e57a966283f35002a8e3bab05f2eb9dc1698913839.png"
                    alt={title}
                    className="w-12 h-12 md:w-16 md:h-16"
                  />
                  <h2 className="text-lg md:text-xl font-medium">{title}</h2>
                  <FaCircleArrowRight className="ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Offerings */}
      <div className="bg-white py-16">
         <h1 className="text-3xl bg-white md:text-5xl font-semibold text-center ">
        Our Core Offerings
      </h1>
      </div>
     
      <div className="max-w-7xl  bg-white mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Food Delivery",
            description:
              "Food ordering and delivery platform where customers can search and discover local restaurants, order food, and have it delivered reliably and quickly",
            stats: [
              { value: "INR 9,913 crore", label: "Food delivery GOV" },
              {
                value: "20.5 million",
                label: "Avg. monthly transacting customers",
              },
            ],
          },
          {
            title: "Grocery & Essentials Delivery",
            description:
              "Beyond food, we bring daily essentials right to your doorstep. From fresh fruits and vegetables to household items, shop from trusted local stores with lightning-fast delivery and easy payment options.",
          },
          {
            title: "Dine-Out Reservation",
            description:
              "Enjoy hassle-free dining experiences by reserving tables at your favorite restaurants directly through our platform. Get real-time availability, exclusive offers, and instant confirmations—perfect for date nights, family dinners, or business lunches.",
          },
          {
            title: "Zomato Pro Membership",
            description:
              "Unlock premium benefits with Zomato Pro! Get up to 40% off on dining out and food delivery, priority support, and exclusive access to events. It’s the smartest way to save while enjoying more of what you love.",
          },
        ].map((offering, index) => (
          <div
            key={index}
            className="flex bg-white rounded-lg shadow-md p-6 gap-4"
          >
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-semibold mb-2">
                {offering.title}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                {offering.description}
              </p>
              {offering.stats && (
                <>
                  <h2 className="text-lg md:text-xl font-medium border-b border-gray-200 pb-2 mb-4">
                    Q3FY25
                  </h2>
                  <div className="flex gap-6">
                    {offering.stats.map((stat, i) => (
                      <div key={i}>
                        <h4 className="text-base md:text-lg font-semibold">
                          {stat.value}
                        </h4>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-20 md:w-24 flex justify-center items-center bg-white">
              <img
                src="https://b.zmtcdn.com/data/o2_assets/b51825c339e733d4d9b364df636d1ef11682669740.png"
                alt={offering.title}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Beyond Business */}
      <div className="max-w-7xl bg-white mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold mb-6">
          Beyond Business
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-8">
          At Zomato, our business approach is guided by our commitment to
          responsible and sustainable growth. Our ESG update outlines the many
          ways in which we make the impact of our business more sustainable and
          help make the world a better place for everyone. Some of our key
          sustainability initiatives include:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Feeding India",
              description:
                "A not-for-profit organisation, designing interventions to reduce hunger and malnutrition among underserved communities in India",
            },
            {
              title: "Zomato for Restaurants",
              description:
                "Help restaurants grow with tools to manage orders, improve delivery, track performance, and reach more customers.",
            },
            {
              title: "Advertising Solutions",
              description:
                "A not-for-profit organisation, designing interventions to reduce hunger and malnutrition among underserved communities in India",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-left"
            >
              <img
                src="https://b.zmtcdn.com/data/o2_assets/1ef4b31977addf56d67ede5f6eed18a91691498028.png"
                alt={item.title}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-lg md:text-xl font-semibold mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blogs */}
      <div className="max-w-7xl bg-white mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold mb-4">
            From Our Blog
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Explore our blog for insightful articles, personal reflections,
            impactful resources, and ideas that inspire us at Zomato
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              image: "/images/blog1.png",
              date: "Shuvra Saha | 4 February 2025",
              title: "Idli, spice, and everything nice–Myso...",
              description:
                "Inspired by a chance meeting in a small town, Mysore Raman Idli has built a strong following by serving delicious South Indian dishes rooted in tradition",
            },
            {
              image: "/images/blog2.png",
              date: "Shuvra Saha | 4 February 2025",
              title: "Q3FY25 shareholders’ letter and re...",
              description:
                "A quick capture of headline results from this quarter",
            },
            {
              image: "/images/blog3.png",
              date: "Shuvra Saha | 4 February 2025",
              title: "The Big Brand Theory | Carving a spice",
              description:
                "Explore how the fusion of tradition and innovation shaped the creation of a legacy brand",
            },
          ].map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-2">{blog.date}</p>
                <h2 className="text-lg md:text-xl font-medium mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600">{blog.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InvestorRelations;
