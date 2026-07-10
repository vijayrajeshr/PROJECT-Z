// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./PartnerWithUs.css";
// import Footer from "../../components/Footer/Footer";
// // dummy questions
// const faqs = [
//   {
//     question: "How do I sign up as a restaurant partner?",
//     answer:
//       'Click on the "Get Started" button and fill out the sign-up form. Our team will reach out for verification and onboarding.',
//   },
//   {
//     question: "What documents are required for onboarding?",
//     answer:
//       "You’ll need your restaurant license, FSSAI certificate, PAN card, and bank details for payouts.",
//   },
//   {
//     question: "How long does the onboarding process take?",
//     answer:
//       "Typically, it takes 3–5 business days after you submit all necessary documents.",
//   },
//   {
//     question: "How will I receive customer orders?",
//     answer:
//       "Orders will appear in your partner dashboard or app, where you can manage and track deliveries in real time.",
//   },
// ];

// const PartnerWithUs = () => {
//   const [activeFaq, setActiveFaq] = useState(null);
//   const navigate = useNavigate();

//   const toggleFaq = (index) => {
//     setActiveFaq(activeFaq === index ? null : index);
//   };

//   const handleStartJourney = () => {
//     navigate("/add-restaurant"); // Redirects to AddRestaurant page
//   };

//   return (
//     <>
//       <div className="partner-page">
//         {/* Hero Section */}
//         <section className="hero">
//           <div className="hero-content">
//             <h1>PARTNER WITH US</h1>
//             <p>
//               Grow your restaurant with India’s leading food delivery platform
//             </p>
//             <button
//               className="cta-button"
//               onClick={() => {
//                 const middle = window.innerHeight / 1 + window.scrollY;
//                 window.scrollTo({
//                   top: middle,
//                   behavior: "smooth",
//                 });
//               }}
//             >
//               Get Started
//             </button>
//           </div>
//         </section>

//         {/* Why Partner With Us */}
//         <section className="benefits">
//           <h2 className="section-title">Why Partner With Us?</h2>
//           <div className="benefit-list">
//             <div className="benefit-item">
//               <h3>🔍 Reach Millions</h3>
//               <p>
//                 Expose your restaurant to millions of hungry customers searching
//                 for great food every day.
//               </p>
//             </div>
//             <div className="benefit-item">
//               <h3>💸 Boost Sales</h3>
//               <p>
//                 Drive higher order volume with better visibility, exclusive
//                 offers, and marketing boosts.
//               </p>
//             </div>
//             <div className="benefit-item">
//               <h3>📈 Grow Your Brand</h3>
//               <p>
//                 Leverage expert marketing tools, promotions, and insights to
//                 strengthen your brand presence.
//               </p>
//             </div>
//             <div className="benefit-item">
//               <h3>🤝 Reliable Support</h3>
//               <p>
//                 Enjoy dedicated partner support to help with operations,
//                 marketing, and customer service.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Partner With Us Now Section */}
//         <section className="partner-now">
//           <h2 className="section-title">Partner With Us Now</h2>
//           <p className="partner-now-text">
//             Join thousands of successful restaurant partners who have boosted
//             their business, reached new customers, and elevated their brand.
//           </p>

//           {/* Updated Button with click handler */}
//           <button
//             className="cta-button large-button"
//             onClick={handleStartJourney}
//           >
//             Start Your Journey
//           </button>
//         </section>

//         {/* Testimonials */}
//         <section className="testimonials">
//           <h2 className="section-title">What Our Partners Say</h2>
//           <div className="testimonial-card">
//             <p>
//               "Since partnering, our online orders have surged by 50%. The
//               platform's marketing team is top-notch!"
//             </p>
//             <span>– Raj, The Spice House</span>
//           </div>
//           <div className="testimonial-card">
//             <p>
//               "The onboarding process was smooth, and the dashboard makes
//               managing orders effortless."
//             </p>
//             <span>– Priya, Urban Café</span>
//           </div>
//         </section>

//         {/* FAQ Section */}
//         <section className="faq">
//           <h2 className="section-title">Frequently Asked Questions</h2>
//           <div className="faq-list mb-20">
//             {faqs.map((faq, index) => (
//               <div
//                 key={index}
//                 className={`faq-item ${activeFaq === index ? "active" : ""}`}
//               >
//                 <div className="faq-question" onClick={() => toggleFaq(index)}>
//                   {faq.question}
//                   <span className="faq-toggle">
//                     {activeFaq === index ? "−" : "+"}
//                   </span>
//                 </div>
//                 {activeFaq === index && (
//                   <div className="faq-answer">{faq.answer}</div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </section>
//         <Footer />
//         {/* Footer */}
//       </div>
//     </>
//   );
// };

// export default PartnerWithUs;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const faqs = [
  {
    question: "How do I sign up as a restaurant partner?",
    answer:
      'Click on the "Get Started" button and fill out the sign-up form. Our team will reach out for verification and onboarding.',
  },
  {
    question: "What documents are required for onboarding?",
    answer:
      "You’ll need your restaurant license, FSSAI certificate, PAN card, and bank details for payouts.",
  },
  {
    question: "How long does the onboarding process take?",
    answer:
      "Typically, it takes 3–5 business days after you submit all necessary documents.",
  },
  {
    question: "How will I receive customer orders?",
    answer:
      "Orders will appear in your partner dashboard or app, where you can manage and track deliveries in real time.",
  },
];

const PartnerWithUs = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleStartJourney = () => {
    navigate("/add-restaurant");
  };

  return (
    <div className="font-inter bg-white text-black leading-relaxed">
      {/* Hero Section */}
      <section className="bg-black text-white text-center px-6 py-24 md:py-32">
        <div className="animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            PARTNER WITH US
          </h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">
            Grow your restaurant with India’s leading food delivery platform
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-medium transition-transform hover:scale-105"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-12">
          Why Partner With Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "🔍 Reach Millions",
              desc: "Expose your restaurant to millions of hungry customers searching for great food every day.",
            },
            {
              title: "💸 Boost Sales",
              desc: "Drive higher order volume with better visibility, exclusive offers, and marketing boosts.",
            },
            {
              title: "📈 Grow Your Brand",
              desc: "Leverage expert marketing tools, promotions, and insights to strengthen your brand presence.",
            },
            {
              title: "🤝 Reliable Support",
              desc: "Enjoy dedicated partner support to help with operations, marketing, and customer service.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-900 cursor-pointer text-white p-6 rounded-2xl text-center shadow-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <h3 className="text-blue-300 text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Now */}
      <section className="bg-gray-800 text-white text-center px-4 py-16 rounded-3xl mx-4 md:mx-12 shadow-lg">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">
          Partner With Us Now
        </h2>
        <p className="text-lg font-semibold mb-6">
          Join thousands of successful restaurant partners who have boosted
          their business, reached new customers, and elevated their brand.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-transform hover:scale-105"
          onClick={handleStartJourney}
        >
          Start Your Journey
        </button>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          What Our Partners Say
        </h2>
        <div className="space-y-6">
          {[
            {
              quote:
                "Since partnering, our online orders have surged by 50%. The platform's marketing team is top-notch!",
              author: "Raj, The Spice House",
            },
            {
              quote:
                "The onboarding process was smooth, and the dashboard makes managing orders effortless.",
              author: "Priya, Urban Café",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-gray-900 text-white p-6 italic border-l-4 border-black shadow-md rounded-md hover:shadow-lg"
            >
              <p className="mb-2">"{t.quote}"</p>
              <span className="block text-right font-bold">– {t.author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className=" text-white px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-[60rem] mx-auto h-[50vh]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border border-blue-200 transition-all cursor-pointer bg-gray-800 ${
                activeFaq === index ? "shadow-lg" : ""
              }`}
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center font-semibold text-lg">
                {faq.question}
                <span className="text-xl">
                  {activeFaq === index ? "−" : "+"}
                </span>
              </div>
              {activeFaq === index && (
                <p className="mt-2 text-sm text-blue-100">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;
