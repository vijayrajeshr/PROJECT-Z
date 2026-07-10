import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLevel, setSearchLevel] = useState(null); // 'tab', 'section', or 'item'
  
  // Helper function to normalize text for comparison
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };
  
  // Function to filter menu items based on search query and level hierarchy
  const filterMenuItems = (menuTabs) => {
    if (!searchQuery.trim()) {
      setSearchLevel(null);
      return menuTabs; // Return original menu if no search query
    }
    
    // Normalize the search query to handle special characters
    const query = normalizeText(searchQuery);
    
    // Check if any tab names match the query
    const tabMatches = menuTabs.filter(tab => 
      normalizeText(tab.name).includes(query)
    );
    
    // If we have tab matches, only show those tabs with all their content
    if (tabMatches.length > 0) {
      setSearchLevel('tab');
      return tabMatches;
    }
    
    // Check for section matches
    const tabsWithSectionMatches = menuTabs
      .map(tab => {
        const matchingSections = tab.sections.filter(section => 
          normalizeText(section.name).includes(query)
        );
        
        if (matchingSections.length > 0) {
          return {
            ...tab,
            sections: matchingSections
          };
        }
        return null;
      })
      .filter(Boolean);
    
    if (tabsWithSectionMatches.length > 0) {
      setSearchLevel('section');
      return tabsWithSectionMatches;
    }
    
    // Finally, check for item matches
    const tabsWithItemMatches = menuTabs
      .map(tab => {
        const sectionsWithItemMatches = tab.sections
          .map(section => {
            const matchingItems = section.items.filter(item => 
              normalizeText(item.name).includes(query)
            );
            
            if (matchingItems.length > 0) {
              return {
                ...section,
                items: matchingItems,
                itemCount: matchingItems.length
              };
            }
            return null;
          })
          .filter(Boolean);
        
        if (sectionsWithItemMatches.length > 0) {
          return {
            ...tab,
            sections: sectionsWithItemMatches
          };
        }
        return null;
      })
      .filter(Boolean);
    
    setSearchLevel('item');
    return tabsWithItemMatches.length > 0 ? tabsWithItemMatches : [];
  };
  
  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      filterMenuItems,
      searchLevel,
      normalizeText // Export the helper function for consistency
    }}>
      {children}
    </SearchContext.Provider>
  );
};