import React, { useState, useEffect } from "react";
import TiffinLeftPanel from "../../../components/DashBoards/AdminDashboard/TiffinComponets/AdminTiffinLeftPanel";
import TiffinRightPanel from "../../../components/DashBoards/AdminDashboard/TiffinComponets/TiffinRightPanle/TiffinRightPanel";

export default function AdminAddTiffin({ email, setEmail, nextStep }) {
  const initialComponent =
    localStorage.getItem("selectedComponent") || "Manage-Tiffin";
  const [selectedComponet, setSelectedComponet] = useState(initialComponent);

  // Save the selected component whenever it changes
  useEffect(() => {
    if (selectedComponet) {
      localStorage.setItem("selectedComponent", selectedComponet);
    }
  }, [selectedComponet]);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 overflow-hidden ">
        <TiffinLeftPanel
          onselectComponet={setSelectedComponet}
          nextStep={nextStep}
        />
        <TiffinRightPanel
          selectedComponet={selectedComponet}
          email={email}
          setEmail={setEmail}
        />
      </div>
    </div>
  );
}
