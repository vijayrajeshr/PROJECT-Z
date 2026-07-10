import React, { useState, useEffect } from "react";
// import DashboardAnalytics from "../../../components/DashboardComponets/Analytics";
import DashboardAnalytics from "../../../components/DashBoards/TiffinDashboard/DashboardComponets/Analytics";
import TodayOrdersSummary from "../../../components/DashBoards/TiffinDashboard/DashboardComponets/TodaysOrderSummary";
import { FaArrowLeftLong } from "react-icons/fa6";
import DashboardStats from "../../../components/DashBoards/TiffinDashboard/DashboardComponets/DashboardStats";
import CommentList from "../../../components/DashBoards/TiffinDashboard/TiffinComponets/TiffinRightPanle/DataManagementComponents/ShowComments";

export default function DashboardHome() {
  return (
    <div className="space-y-2">
      <div>
        <DashboardStats />
      </div>

      <div className="md:flex-row flex flex-col gap-2 md:h-[70vh] h-auto">
        <DashboardAnalytics />
      </div>

      <div className="gap-2 w-full overflow-y-auto">
        <TodayOrdersSummary />
        {/* <CommentList
          fullWidth={false}
          maxHeight={false}
          limit={2}
          toggleShowMore={true}
        /> */}
      </div>
    </div>
  );
}
