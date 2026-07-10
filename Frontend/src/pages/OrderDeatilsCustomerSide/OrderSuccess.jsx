import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, animate } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = ({ setIsVisible }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: You can add a delay before showing the "OK" button
    const timer = setTimeout(() => {
      setShowOkButton(true);
    }, 1500); // Show OK button after 1.5 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1.5,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 10,
        delay: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: 1.8,
        ease: "easeOut",
      },
    },
  };

  const handleOkClick = () => {
    setIsVisible(false);

    navigate("/"); // Navigate to the home page
  };

  const [showOkButton, setShowOkButton] = useState(false);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-white flex flex-col justify-center items-center z-50"
      variants={containerVariants}
      initial="hidden"
      animate={"visible"}
    >
      <motion.div
        className="text-green-500"
        variants={iconVariants}
        initial="hidden"
        animate={"visible"}
      >
        <FaCheckCircle size={80} />
      </motion.div>

      <motion.h2
        className="text-3xl font-semibold text-gray-800 mt-4"
        variants={textVariants}
        initial="hidden"
        animate={"visible"}
      >
        Order Placed Successfully!
      </motion.h2>

      <motion.p
        className="text-gray-600 mt-2 text-center"
        variants={textVariants}
        initial="hidden"
        animate={"visible"}
        transition={{ ...textVariants.transition, delay: 0.8 }}
      >
        Thank you for your order. It will be processed shortly.
      </motion.p>

      {showOkButton && (
        <motion.button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full mt-8 focus:outline-none focus:shadow-outline"
          onClick={handleOkClick}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          OK
        </motion.button>
      )}
    </motion.div>
  );
};

export default OrderSuccess;
