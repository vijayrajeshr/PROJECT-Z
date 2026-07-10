"use client";
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import OutletDashboard from "./OutletDashboard";
import Sidebar from "../Sidebar";

function App() {
  const [expanded, setExpanded] = useState(true);
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  return (
    <Router>
      <Sidebar
        expanded={expanded}
        setExpanded={setExpanded}
        selectedOutlet={selectedOutlet}
      />
      <main className="flex-1 overflow-y-auto p-4">
        <OutletDashboard setSelectedOutlet={setSelectedOutlet} />
      </main>
    </Router>
  );
}

export default App;
