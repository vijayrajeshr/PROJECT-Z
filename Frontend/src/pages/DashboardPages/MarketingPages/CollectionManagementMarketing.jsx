// src/pages/CollectionManagement.jsx
import React, { useState, useEffect } from 'react';
import LeftPanel from '../../../components/DashBoards/MarketingDashboard/CollectionLeftSide';
import RightPanel from '../../../components/DashBoards/MarketingDashboard/RightPanel';
import { useResource } from '../../../context/Banner_CollectionContext';

const campaigns = [
    {
      name: "Collections",
      categories: [
        { name: "Default Collections" },
        { name: "Collections" }
      ]
    }
  ];

const CollectionManagementMarketing = () => {
  const {selectedResource} = useResource()

  return (  
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel campaigns={campaigns} />
        {selectedResource && (
          <RightPanel />
        )}
      </div>
    </div>
  )
}

export default CollectionManagementMarketing; 