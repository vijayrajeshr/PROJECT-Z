import React, { useState } from "react";
import { FiChevronRight, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import PaginationComponent from "./Pagination";

export const Content = ({
  mainContent,
  sideTabs,
  setSelectedContent,
  selectedContent,
}) => {
  const [expandedTab, setExpandedTab] = useState(null);
  const [expandedSubTitle, setExpandedSubTitle] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTab = (index) => {
    if (expandedTab === index) {
      setExpandedTab(null);
      setExpandedSubTitle(null);
    } else {
      setExpandedTab(index);
      setExpandedSubTitle(null);
    }
  };

  const toggleSubTitle = (index) => {
    setExpandedSubTitle((prev) => (prev === index ? null : index));
  };

  const onSelectSubItem = (sub) => {
    setSelectedContent(sub);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const visibleContent = mainContent.filter(
    (item) => item.index === selectedContent
  );

  return (
    <div className="min-h-screen bg-white text-black transition-colors duration-300">
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Content</h1>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="text-black"
        >
          {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:h-[calc(100vh-5rem)]">
        {/* Left Sidebar */}
        <aside
          className={`w-full md:w-80 border-r border-gray-300 p-6 overflow-y-auto transition-transform duration-300 ${
            isSidebarOpen ? "block" : "hidden md:block"
          }`}
        >
          <ul className="space-y-6">
            {sideTabs.map((tab, tabIndex) => {
              const hasItems = tab.items && tab.items.length > 0;
              const isTabOpen = expandedTab === tabIndex;

              return (
                <li key={tabIndex}>
                  <div
                    className={`flex justify-between items-center cursor-pointer text-lg select-none font-semibold ${
                      selectedContent === tab.title
                        ? "text-red-500"
                        : "text-black hover:text-black"
                    }`}
                    onClick={() =>
                      hasItems
                        ? toggleTab(tabIndex)
                        : setSelectedContent(tab.title)
                    }
                  >
                    <span>{tab.title}</span>
                    {hasItems &&
                      (isTabOpen ? (
                        <FiChevronDown className="text-sm" />
                      ) : (
                        <FiChevronRight className="text-sm" />
                      ))}
                  </div>

                  {hasItems && isTabOpen && (
                    <ul className="mt-3 space-y-3 pl-4 border-l border-gray-400">
                      {tab.items.map((item, itemIndex) => {
                        const hasSubItems =
                          item.subItems && item.subItems.length > 0;
                        const isSubOpen = expandedSubTitle === itemIndex;

                        return (
                          <li key={itemIndex}>
                            <div
                              onClick={() =>
                                hasSubItems
                                  ? toggleSubTitle(itemIndex)
                                  : setSelectedContent(item.subTitle)
                              }
                              className="flex justify-between items-center cursor-pointer text-base font-medium select-none text-black hover:text-black"
                            >
                              <span>{item.subTitle}</span>
                              {hasSubItems &&
                                (isSubOpen ? (
                                  <FiChevronDown className="text-xs" />
                                ) : (
                                  <FiChevronRight className="text-xs" />
                                ))}
                            </div>

                            {hasSubItems && isSubOpen && (
                              <ul className="mt-1 ml-5 space-y-1">
                                {item.subItems.map((sub, subIndex) => (
                                  <li
                                    key={subIndex}
                                    onClick={() => onSelectSubItem(sub)}
                                    className={`cursor-pointer text-sm select-none ${
                                      selectedContent === sub
                                        ? "font-bold text-black underline"
                                        : "text-black hover:text-black"
                                    }`}
                                  >
                                    {sub}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-r md:border-r border-gray-300 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {visibleContent.length > 0 ? (
            visibleContent.map((item, index) => (
              <div
                className="mb-6 border-b border-gray-200 pb-4 mx-2"
                key={index}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
                  {item.index}
                </h1>
                <div className="text-base sm:text-lg text-black">
                  {item.content?.split("\n\n").map((block, idx) => (
                    <p key={idx} className="mb-6">
                      {block.trim()}
                    </p>
                  ))}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
                  {item.subsections.heading}
                </h2>
                {Array.isArray(item.subsections.subheading) &&
                  item.subsections.subheading.map((sub, idx) => (
                    <div className="py-2" key={idx}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-black py-2">
                        {sub.heading}
                      </h3>
                      <div className="text-black text-base sm:text-lg">
                        {sub.info?.split("\n\n").map((block, idx) => (
                          <p key={idx} className="mb-6">
                            {block.trim()}
                          </p>
                        ))}
                        {Array.isArray(sub.list) && (
                          <ul className="list-disc pl-8 mt-4">
                            {sub.list.map((listItem, listIdx) => (
                              <li key={listIdx} className="mb-2">
                                {listItem?.trim()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600">Please select a topic.</p>
          )}
          <PaginationComponent
            sideTabs={sideTabs}
            setSelectedContent={setSelectedContent}
          />
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 p-8 overflow-y-auto text-sm text-black">
          {visibleContent.map((item, index) => (
            <div key={index}>
              {item.subsections.subheading.map((sub, idx) => (
                <div className="py-1 text-black" key={idx}>
                  {sub.heading}
                </div>
              ))}
            </div>
          ))}
        </aside>
      </div>

      {/* Back to Top Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-opacity duration-300"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
};
