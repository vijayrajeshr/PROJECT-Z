import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Home, Menu, ShoppingBag, TrendingUp, Flag, X, ChevronRight } from 'lucide-react';

const ErrorPage = () => {
  // Core state
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [deliveryComments, setDeliveryComments] = useState('Searching for your page...');
  const [speed, setSpeed] = useState(1);
  const [shake, setShake] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();

  // Reset animation function
  const resetAnimation = () => {
    setPosition(0);
    setDirection(1);
    setSpeed(1);
    setDeliveryComments("Searching for your page...");
    triggerNotification("Search restarted! Let's find your order.");
  };

  // Notification system
  const triggerNotification = (message) => {
    setShowNotification({ message, id: Date.now() });
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Rider animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (position > 90 && direction === 1) {
        setDirection(-1);
        setDeliveryComments("Looking over here now...");
        setShake(true);
      } else if (position < 0 && direction === -1) {
        setDirection(1);
        setDeliveryComments("Maybe it's this way?");
        setShake(true);
      }

      setPosition(prev => prev + direction * speed * 0.16);
    }, 16);
    return () => clearInterval(interval);
  }, [position, direction, speed]);

  // Reset shake effect
  useEffect(() => {
    if (shake) {
      setTimeout(() => setShake(false), 500);
    }
  }, [shake]);

  // Random hover comments for the delivery rider
  const getHoverComment = () => {
    const comments = [
      "Hey! I'm working here! 😤",
      "Need directions? 🧭",
      "Food's getting cold! 🥶",
      "Did you order the 404 special? 🍕",
      "This website is under construction... or demolition? 🚧",
      "Maybe try the biryani section? 🍚",
      "Butter chicken, yes. This page, no. 🍗",
      "My GPS is as confused as you are! 📱",
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const handleRiderHover = () => {
    setDeliveryComments(getHoverComment());
    setTimeout(() => {
      setDeliveryComments("Searching for your page...");
    }, 2000);
  };

  const speedUp = () => {
    if (speed < 10) {
      setSpeed(prev => prev + 1);
      const comments = [
        "Speeding up! 🚀",
        "Gotta go fast! 💨",
        "Zooming! 🏎️",
        "Manager is calling! 📱",
        "Ordered food getting cold! 🥘"
      ];
      setDeliveryComments(speed > 7 ? "Maximum speed! 🔥" : comments[Math.floor(Math.random() * comments.length)]);

      if (speed === 9) {
        triggerNotification("TURBO MODE UNLOCKED! 🚀");
      }
    }
  };

  // Zomato red theme colors
  const zomatoRed = "#E23744";

  // Vehicle selection based on speed
  const getVehicleIcon = () => {
    if (speed > 8) return "🚀";
    if (speed > 6) return "🏍️";
    if (speed > 4) return "🛵";
    if (speed > 2) return "🚲";
    return "🚶";
  };

  // Scene elements
  const getSceneElements = () => {
    return (
      <>
        <div className="absolute top-8 left-1/4 translate-x-8 text-3xl opacity-90 animate-float-slow">☁️</div>
        <div className="absolute top-3 right-1/4 -translate-x-12 text-2xl opacity-70 animate-float">☁️</div>
        <div className="absolute top-6 right-1/3 text-4xl text-yellow-400 animate-pulse-slow">☀️</div>
        <div className="absolute bottom-12 left-8 text-xl">🏙️</div>
        <div className="absolute bottom-12 right-8 text-xl">🏪</div>
      </>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 flex items-center bg-white rounded-lg shadow-xl overflow-hidden animate-slide-in">
          <div className="w-2 h-full bg-red-500 self-stretch"></div>
          <div className="py-3 px-4 flex-1 font-medium">{showNotification.message}</div>
          <button
            onClick={() => setShowNotification(false)}
            className="p-3 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className={`max-w-[100%] w-full bg-white shadow-2xl overflow-hidden transition-all duration-500 ${shake ? 'animate-shake' : ''}`}>
        {/* Top Accent Bar */}
        {/* <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-400 w-full"></div> */}

        {/* Main Content */}
        <div className="p-8 text-gray-800">
          <div className="text-center mb-8">
            <div className="relative inline-block mx-auto">
              <div
                className="w-28 h-28 flex items-center justify-center rounded-full mb-6 mx-auto transition-transform duration-300 hover:scale-110 bg-gradient-to-br from-red-50 to-red-100 border-4 border-white shadow-lg"
              >
                <div className="text-6xl animate-bounce-subtle">🍽️</div>
              </div>
              <div 
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-400 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-md"
                style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                404
              </div>
            </div>

            <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-400">
              Recipe Not Found
            </h1>
            <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium">
              Our chef looked everywhere but couldn't find this dish in our menu!
            </p>
          </div>

          {/* Delivery Scene */}
          <div
            className="h-36 relative my-8 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-gray-100 shadow-inner hover:shadow-xl cursor-pointer transition-all duration-300 border border-gray-100"
            onClick={speedUp}
          >
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {getSceneElements()}
            </div>

            {/* Delivery Rider with Speech Bubble */}
            <div
              className="absolute transition-all duration-300 cursor-pointer z-10"
              style={{
                left: `${position}%`,
                bottom: '8px',
                transform: 'translateX(-50%)',
              }}
              onMouseEnter={handleRiderHover}
            >
              <div className="relative">
                {/* Speech bubble */}
                <div
                  className="absolute -top-16 w-44 py-2 px-3 rounded-xl text-xs font-medium shadow-lg 
                  bg-white text-gray-800 border-l-2 border-red-500 transition-all duration-300 text-center"
                  style={{
                    transform: `translateX(-50%)`,
                    opacity: 0.95,
                  }}
                >
                  {deliveryComments}
                  <div className="absolute -bottom-2 left-1/2 w-4 h-4 -ml-2 bg-white transform rotate-45"></div>
                </div>

                {/* Vehicle icon container */}
                <div
                  className="flex flex-col items-center"
                  style={{
                    transform: direction === 1 ? 'scaleX(-1)' : 'scaleX(1)',
                  }}
                >
                  <div
                    className="w-16 h-16 flex items-center justify-center text-3xl shadow-lg transition-transform rounded-full animate-hover bg-gradient-to-r from-red-400 to-red-500"
                  >
                    {getVehicleIcon()}
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Road */}
            <div className="absolute bottom-0 w-full h-6 bg-gray-600 shadow-inner overflow-hidden">
              <div
                className="h-full w-full relative"
                style={{
                  backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 3px, transparent 3px, transparent 20px)`,
                  animation: `roadScroll ${16 / speed}s linear infinite ${direction === -1 ? 'reverse' : 'normal'}`
                }}>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute right-3 bottom-8 flex gap-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetAnimation();
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all text-white bg-gradient-to-r from-red-500 to-red-400"
              >
                <RefreshCw size={14} />
              </button>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center bg-white shadow-md"
                style={{ color: zomatoRed }}
              >
                <TrendingUp size={12} className="mr-1.5" />
                {speed}/10
              </div>
            </div>
          </div>

          <div className="text-center space-y-2 mb-8">
            <p className="text-gray-500 text-xs font-medium">
              Tap the scene to speed up our delivery guy's search!
            </p>
            <div className="inline-flex items-center text-xs px-4 py-1.5 rounded-full bg-red-50 text-red-500 font-medium shadow-sm">
              <Flag size={12} className="mr-2" />
              <span>Mission: Find page "404"</span>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="w-full py-4 bg-white rounded-xl border border-gray-100 transition-all hover:shadow-md hover:bg-gray-50 flex items-center px-5 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full mr-4 bg-red-50">
                <Menu size={18} className="text-red-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-sm">Browse Our Menu</h3>
                <p className="text-xs text-gray-500">
                  Maybe you'll find something even better!
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:transform group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full py-4 bg-white rounded-xl border border-gray-100 transition-all hover:shadow-md hover:bg-gray-50 flex items-center px-5 group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full mr-4 bg-red-50">
                <ShoppingBag size={18} className="text-red-500" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-sm">Today's Specials</h3>
                <p className="text-xs text-gray-500">
                  Check out our most popular dishes
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Home Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3.5 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 mx-auto text-sm font-bold bg-gradient-to-r from-red-500 to-red-400"
            >
              <Home size={18} />
              <span>Take Me Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes roadScroll {
          0% { background-position: 0 0; }
          100% { background-position: 80px 0; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes hover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes slide-in {
          0% { transform: translateX(100%); }
          10% { transform: translateX(-10px); }
          12% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }

        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-hover {
          animation: hover 1.5s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-slide-in {
          animation: slide-in 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;

