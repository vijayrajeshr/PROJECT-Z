import React from "react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white text-white  px-14 font-['Poppins'] rounded-b-lg shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Brand Section */}
        <div>
          <h1 className="text-5xl  font-bold tracking-wide text-black">zomato</h1>
          <div className="text-black text-sm px-4">-restaurant partner-</div>
        </div>

        {/* Empty space for future content */}
        <div></div>
      </div>
    </header>
  );
};

export default Header;
