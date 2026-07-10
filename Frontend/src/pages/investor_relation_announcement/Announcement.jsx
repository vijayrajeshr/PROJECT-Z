// import React, { useState } from 'react';
// import './Announcement.css';
// import Footer from '../../components/Footer/Footer';

// const announcements = [
//   {
//     title: 'Q4 FY25 Earnings Call Scheduled',
//     date: 'April 15, 2025',
//     category: 'Board meeting',
//     description:
//       'Zomato Limited will host its Q4 FY25 earnings conference call on April 15 at 5:00 PM IST. The management will discuss the financial performance, growth in delivery volumes, profitability in Blinkit, and roadmap for FY26. Investors and analysts are invited to register for the live webcast via our investor relations page.',
//   },
//   {
//     title: 'Zomato Green Fleet: Nationwide Rollout',
//     date: 'March 10, 2025',
//     category: 'Investments',
//     description:
//       'Continuing our commitment to sustainability, Zomato has launched its 100% electric vehicle (EV) delivery fleet across Delhi NCR, Mumbai, Bangalore, and Hyderabad. This initiative is expected to reduce our carbon footprint by over 30% in 2025 and supports our ESG goal of achieving net-zero emissions by 2030.',
//   },
//   {
//     title: 'Appointment of Ms. Ritu Arora to Board of Directors',
//     date: 'January 25, 2025',
//     category: 'Board meeting',
//     description:
//       'Zomato is pleased to welcome Ms. Ritu Arora to its Board of Directors as an Independent Director. With over two decades of experience in sustainable investments and corporate governance, her expertise will be instrumental in strengthening our ESG framework and strategic oversight.',
//   },
//   {
//     title: 'Strategic Partnership with ONDC for Hyperlocal Expansion',
//     date: 'February 18, 2025',
//     category: "Shareholders' awareness",
//     description:
//       'Zomato has signed a strategic agreement with the Open Network for Digital Commerce (ONDC) to expand its hyperlocal services across Tier 2 and Tier 3 cities. The partnership aims to democratize digital commerce and enable better visibility for local restaurants and small businesses on our platform.',
//   },
//   {
//     title: 'Zomato Ventures: Launch of $100M FoodTech Fund',
//     date: 'March 5, 2025',
//     category: 'Investments',
//     description:
//       'Zomato has announced the launch of "Zomato Ventures", a $100 million fund dedicated to backing early-stage FoodTech startups in India and Southeast Asia. This initiative will focus on sustainability, AI in food logistics, and innovations in cloud kitchens and agri-tech.',
//   },
// ];

// const categories = [
//   'All',
//   'Board meeting',
//   'Investments',
//   "Shareholders' awareness",
//   "Shareholders' meeting",
//   'Other corporate filings',
// ];

// const Announcement = () => {
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   const filteredAnnouncements =
//     selectedCategory === 'All'
//       ? announcements
//       : announcements.filter(item => item.category === selectedCategory);

//   return (
//     <div className="announcement-container">
//       <h1 className="announcement-title">Investor Announcements</h1>

//       <div className="announcement-layout">
//         <aside className="filter-sidebar">
//           <h2 className="filter-heading">Filter by Category</h2>
//           {categories.map(cat => (
//             <button
//               key={cat}
//               className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
//               onClick={() => setSelectedCategory(cat)}
//               aria-pressed={selectedCategory === cat}
//             >
//               {cat}
//             </button>
//           ))}
//         </aside>

//         <section className="announcement-list" role="list">
//           {filteredAnnouncements.length === 0 && (
//             <p className="no-results">No announcements found for this category.</p>
//           )}
//           {filteredAnnouncements.map((item, index) => (
//             <article key={index} className="announcement-card" role="listitem" tabIndex={0}>
//               <h2 className="card-title">{item.title}</h2>
//               <time className="announcement-date" dateTime={new Date(item.date).toISOString()}>
//                 {item.date}
//               </time>
//               <p className="card-description">{item.description}</p>
//             </article>
//           ))}
//         </section>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Announcement;
import React, { useState } from "react";
import Footer from "../../components/Footer/Footer";

const announcements = [
  {
    title: "Q4 FY25 Earnings Call Scheduled",
    date: "April 15, 2025",
    category: "Board meeting",
    description:
      "Zomato Limited will host its Q4 FY25 earnings conference call on April 15 at 5:00 PM IST. The management will discuss the financial performance, growth in delivery volumes, profitability in Blinkit, and roadmap for FY26. Investors and analysts are invited to register for the live webcast via our investor relations page.",
  },
  {
    title: "Zomato Green Fleet: Nationwide Rollout",
    date: "March 10, 2025",
    category: "Investments",
    description:
      "Continuing our commitment to sustainability, Zomato has launched its 100% electric vehicle (EV) delivery fleet across Delhi NCR, Mumbai, Bangalore, and Hyderabad. This initiative is expected to reduce our carbon footprint by over 30% in 2025 and supports our ESG goal of achieving net-zero emissions by 2030.",
  },
  {
    title: "Appointment of Ms. Ritu Arora to Board of Directors",
    date: "January 25, 2025",
    category: "Board meeting",
    description:
      "Zomato is pleased to welcome Ms. Ritu Arora to its Board of Directors as an Independent Director. With over two decades of experience in sustainable investments and corporate governance, her expertise will be instrumental in strengthening our ESG framework and strategic oversight.",
  },
  {
    title: "Strategic Partnership with ONDC for Hyperlocal Expansion",
    date: "February 18, 2025",
    category: "Shareholders' awareness",
    description:
      "Zomato has signed a strategic agreement with the Open Network for Digital Commerce (ONDC) to expand its hyperlocal services across Tier 2 and Tier 3 cities. The partnership aims to democratize digital commerce and enable better visibility for local restaurants and small businesses on our platform.",
  },
  {
    title: "Zomato Ventures: Launch of $100M FoodTech Fund",
    date: "March 5, 2025",
    category: "Investments",
    description:
      'Zomato has announced the launch of "Zomato Ventures", a $100 million fund dedicated to backing early-stage FoodTech startups in India and Southeast Asia. This initiative will focus on sustainability, AI in food logistics, and innovations in cloud kitchens and agri-tech.',
  },
];

const categories = [
  "All",
  "Board meeting",
  "Investments",
  "Shareholders' awareness",
  "Shareholders' meeting",
  "Other corporate filings",
];

const Announcement = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredAnnouncements =
    selectedCategory === "All"
      ? announcements
      : announcements.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white font-sans text-gray-900">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#E23744] mb-10">
        Investor Announcements
      </h1>

      <div className="flex flex-col mb-40 md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="md:w-56 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 md:block hidden">
            Filter by Category
          </h2>
          <div className="flex flex-wrap md:flex-col gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`flex-1 md:flex-none text-sm font-medium py-2 px-4 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition ${
                  selectedCategory === cat
                    ? "bg-[#E23744] text-white border-[#E23744]"
                    : "bg-white"
                }`}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Announcement List */}
        <section className="flex-1 flex flex-col gap-6 " role="list">
          {filteredAnnouncements.length === 0 && (
            <p className="text-gray-500 italic text-base p-5">
              No announcements found for this category.
            </p>
          )}
          {filteredAnnouncements.map((item, index) => (
            <article
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
              role="listitem"
              tabIndex={0}
            >
              <h2 className="text-xl font-semibold text-[#E23744] mb-2">
                {item.title}
              </h2>
              <time
                className="text-sm text-gray-500 block mb-3"
                dateTime={new Date(item.date).toISOString()}
              >
                {item.date}
              </time>
              <p className="text-base text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Announcement;
