import React from "react";
import DashboardStats from "../../../components/DashBoards/MarketingDashboard/Dashboard/DashboardStats";
import DashboardAnalytics from "../../../components/DashBoards/MarketingDashboard/Dashboard/DashboardAnalytics";
import { OffersProvider } from "../../../context/OffersContext";
import { ResourceProvider } from "../../../context/Banner_CollectionContext";

export default function DashboardHomeMarketing() {

  return (
    <div className="space-y-2">
      <div>
        <ResourceProvider resourceType="banners">
          <OffersProvider>

            <DashboardStats />
          </OffersProvider>

        </ResourceProvider>

      </div>

      {/* <div className="md:flex-row flex flex-col gap-2 md:h-[70vh] h-[95vh]">
        <ResourceProvider resourceType="banners">
          <OffersProvider>
            <DashboardAnalytics />
          </OffersProvider>
        </ResourceProvider>
      </div> */}

      {/* <div className="md:flex-row flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
        <TodayOrdersSummary />
        <CommentList fullWidth={false} maxHeight={false} />
      </div> */}
    </div >
  );
}
