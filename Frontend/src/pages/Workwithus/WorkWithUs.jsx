import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WhatMakeUs from "./WhatMakeUs";
import Footer from "../../components/Footer/Footer";

const WorkWithUs = () => {
  const titles = [
    "Customer Obsession",
    "Start With Why",
    "Grit",
    "Continuous Learning",
  ];
  const descriptions = [
    "always start with the customer and do what’s best for them",
    "before we do anything, always ask “why are we doing this?”",
    "focus on the goals you set out to achieve and have the courage to see them through",
    "the biggest competitive advantage is our ability to learn (and unlearn) faster",
  ];
  const employeeBenefits = [
    {
      img: "https://b.zmtcdn.com/data/o2_assets/d4f69d4716faf5a71093b87fac1c45f31659589465.png",
      title: "Period Leave",
      desc: "Zomato's Period Leave Policy has been designed to give our female and transgender employees the necessary time off to cater to their health when needed, during their menstrual cycle. Eligible zomans can avail up to 10 days of period leaves in a year.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/6b21acbc84ce1ae1bb8d3b6d4f8bca211659589491.png",
      title: "Health and Fitness",
      desc: "At Zomato, we believe it's important to focus on one's health. Our in-house fitness coaches and nutritionist focus on creating a healthier work environment for all.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/c6e69c0f57802e3f4e5152f075fed08c1659589516.png",
      title: "No Probation Period",
      desc: "There's no probation period for anyone who works with us at Zomato.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/be8e2e8c6a99fe895a31ef966fae21b61659589545.png",
      title: "Medical Coverage",
      desc: "All Zomans (including spouse and children) are covered under an extensive medical health insurance policy. In India, they also have access to unlimited telehealth consultations with a doctor.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/029645238077010b6db5ef5b7fce75321659589567.png",
      title: "Paternity and Maternity Leave",
      desc: "For men and women at Zomato, we offer 26 weeks paid leave. This policy also applies to non-birthing parents, and in cases of surrogacy, adoption, and same-sex partners.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/3a3bf55bfb44f108fdfc777c5770eabd1659589590.png",
      title: "In-house Wellness Support",
      desc: "We all experience challenging situations in our lives. To manage these stressors and concerns, both at a personal and professional level, one can always reach out to our in-house team of counsellors.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/69963755d428dcc83c7f7bdee7db0f691659589614.png",
      title: "In-house Creche",
      desc: "We have an in-house creche in our Gurgaon office and have partnered with day cares in other cities.",
    },
    {
      img: "https://b.zmtcdn.com/data/o2_assets/185d1a63264f12676ce7fdb5b516916a1659589636.png",
      title: "Flexi Benefits",
      desc: "Our flexi benefit plan enables zomans to modify the components of their compensation based on benefits such as newspaper and periodical allowance, leave and travel allowance, vehicle running and maintenance, telephone bill expenses, etc.",
    },
  ];

  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOver1, setMouseOver1] = useState(false);
  const [mouseOver2, setMouseOver2] = useState(false);

  const handleMouseOver = () => {
    setMouseOver(true);
    setTimeout(() => setMouseOver(false), 1000);
  };

  const handleMouseOver1 = () => {
    setMouseOver1(true);
    setTimeout(() => setMouseOver1(false), 1000);
  };

  const handleMouseOver2 = () => {
    setMouseOver2(true);
    setTimeout(() => setMouseOver2(false), 1000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 w-full bg-black/40 text-white z-50 flex justify-between items-center px-4 py-3 sm:px-6 md:px-8">
        <a href="/">
          <h1 className="text-2xl sm:text-3xl font-bold">Zomato</h1>
        </a>
        <div className="flex gap-4 sm:gap-6">
          <Link
            className="text-base sm:text-lg hover:text-red-300 transition-colors"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-base sm:text-lg hover:text-red-300 transition-colors"
            to="/whoweare"
          >
            Who we are
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh]">
        <img
          src="/images/workwithus.png"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-16 sm:top-20 md:top-24 left-4 sm:left-8 md:left-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight sm:leading-snug md:leading-normal">
            We Listen More
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight sm:leading-snug md:leading-normal">
            When People Root
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight sm:leading-snug md:leading-normal">
            For You
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-4 max-w-xs sm:max-w-sm md:max-w-md">
            We only accept applications through employee referrals.
          </p>
        </div>
      </div>

      {/* What Makes Us */}
      <div className="w-full bg-gray-100 py-8 sm:py-12 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
          What Makes Us Who We Are
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
          {titles.slice(0, 3).map((title, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md w-full sm:w-3/4 md:w-1/3 p-4 sm:p-6 text-center"
            >
              <div className="w-full h-16 sm:h-20 md:h-24 flex justify-center items-center">
                <img
                  className="h-full object-contain"
                  src={
                    i === 0
                      ? "https://b.zmtcdn.com/data/o2_assets/9e1c5ce0772e0387f9d74f9ac8fb7d271659417276.png"
                      : i === 1
                      ? "https://b.zmtcdn.com/data/o2_assets/8dbae9624cc1964bfa5966b4f4a2151a1659417312.png"
                      : "https://b.zmtcdn.com/data/o2_assets/bb48e7c08e4f1a54070dfac177b717c81659417457.png"
                  }
                  alt={title}
                />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl border-b pb-2 mt-4 font-semibold">
                {title}
              </h2>
              <p className="mt-4 text-sm sm:text-base md:text-lg">
                {descriptions[i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Benefits */}
      <div className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 md:mb-12 text-left">
          Employee Benefits
        </h2>
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {employeeBenefits.map((item, idx) => (
            <WhatMakeUs key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Building Zomato Together */}
      <div className="w-full py-8 sm:py-12 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
          Building Zomato Together
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
          {[
            {
              handler: handleMouseOver,
              state: mouseOver,
              img: "https://b.zmtcdn.com/data/o2_assets/a7f85a53bbe2120919c577d88484832c1661235791.png",
              text: "I joined Zomato as a Sales Manager and cut to five years later, I am now managing our entire restaurant dining team in Abu Dhabi. I started my journey by interacting with a diverse se...",
            },
            {
              handler: handleMouseOver1,
              state: mouseOver1,
              img: "https://b.zmtcdn.com/data/o2_assets/1e3adfe97f3384f28d3a65a1dfffc4d11661434076.png",
              text: "What I look forward to at the end of each day is a sense of accomplishment – what I have learnt and what I did to make a difference. It’s been three beautiful years and Zomato has given me a comfortable space to learn, grow, and prosper everyday",
            },
            {
              handler: handleMouseOver2,
              state: mouseOver2,
              img: "https://b.zmtcdn.com/data/o2_assets/79fb2b4984ea571d3b56482c199fdb991661405190.png",
              text: "I’ve been at Zomato for about 5 years now. Right after my graduation, I joined Z as a noob and learnt from the greatest minds. From building customer experiences team to strategising logistics and then to creating perfect",
            },
          ].map(({ handler, state, img, text }, index) => (
            <div
              key={index}
              onMouseEnter={handler}
              className="w-full sm:w-1/3 h-64 sm:h-80 md:h-96 cursor-pointer rounded-xl overflow-hidden"
            >
              {state ? (
                <div className="w-full h-full bg-gradient-to-br from-red-700 via-red-400 to-red-700 text-white p-4 sm:p-6 flex items-center justify-center">
                  <p className="text-sm sm:text-base md:text-lg">{text}</p>
                </div>
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={img}
                  alt="Zomato Member"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Glimpses Of Life At Zomato */}
      <div className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 md:mb-12">
            Glimpses Of Life At Zomato
          </h1>

          {/* Masonry column layout */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {[
              "/images/life1.png",
              "/images/life2.png",
              "/images/life3.png",
              "/images/life4.png",
              "/images/life5.png",
              "/images/life6.png",
            ].map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Life at Zomato ${idx + 1}`}
                className="w-full rounded-lg mb-4 break-inside-avoid"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-24 sm:h-32 md:h-40"></div>

      {/* Everyday Extraordinary */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh]">
        <img
          src="https://b.zmtcdn.com/data/o2_assets/60a2ed05c65decc1afc09adc7ecc68c81659679957.png"
          className="w-full h-full object-cover"
          alt="Extraordinary"
        />
        <div className="absolute top-8 sm:top-12 md:top-16 left-4 sm:left-8 md:left-16 text-white max-w-lg sm:max-w-xl md:max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-snug md:leading-normal">
            Everyday
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight sm:leading-snug md:leading-normal">
            Extraordinary
          </h1>
          <p className="text-sm sm:text-base md:text-lg mt-4 sm:mt-6">
            The right people got us here, and we are on the lookout for those
            who will bring us closer to our vision, and make a difference.
          </p>
          <p className="text-sm sm:text-base md:text-lg mt-2 sm:mt-4">
            If you know someone at Zomato, reach out to them and share why you
            would be a great fit.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorkWithUs;
