import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ComparisonChart({ timePeriod, serviceView, data }) {
  const getOrders = (data, timePeriod) => {
    const parseDate = (dateStr) => {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date format: ${dateStr}`);
        return null;
      }
      return date;
    };

    const today = new Date(); // Use current date
    let result = [];

    if (timePeriod === "weekly") {
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (i + 1) * 7);
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - i * 7);

        const weekData = data.filter((e) => {
          const orderDate = parseDate(e.createdAt);
          return orderDate && orderDate >= weekStart && orderDate < weekEnd;
        });

        const takeawayCount = weekData.filter(
          (e) => e.status === "ready"
        ).length;
        const diningCount = weekData.filter(
          (e) => e.status === "accepted"
        ).length;
        result.push({
          name: `Week ${4 - i}`,
          takeawayOrders: takeawayCount,
          diningOrders: diningCount,
          totalOrders: takeawayCount + diningCount,
        });
      }
    } else if (timePeriod === "monthly") {
      for (let i = 0; i < 4; i++) {
        const monthStart = new Date(
          today.getFullYear(),
          today.getMonth() - i,
          1
        );
        const monthEnd = new Date(
          today.getFullYear(),
          today.getMonth() - i + 1,
          0
        );

        const monthData = data.filter((e) => {
          const orderDate = parseDate(e.createdAt);
          return orderDate && orderDate >= monthStart && orderDate <= monthEnd;
        });

        const monthName = monthStart.toLocaleString("default", {
          month: "short",
        });
        const takeawayCount = monthData.filter(
          (e) => e.status === "ready"
        ).length;
        const diningCount = monthData.filter(
          (e) => e.status === "accepted"
        ).length;
        result.push({
          name: `${monthName} ${monthStart.getFullYear()}`,
          takeawayOrders: takeawayCount,
          diningOrders: diningCount,
          totalOrders: takeawayCount + diningCount,
        });
      }
    } else if (timePeriod === "yearly") {
      for (let i = 0; i < 4; i++) {
        const yearStart = new Date(today.getFullYear() - i, 0, 1);
        const yearEnd = new Date(today.getFullYear() - i, 11, 31);

        const yearData = data.filter((e) => {
          const orderDate = parseDate(e.createdAt);
          return orderDate && orderDate >= yearStart && orderDate <= yearEnd;
        });

        const takeawayCount = yearData.filter(
          (e) => e.status === "ready"
        ).length;
        const diningCount = yearData.filter(
          (e) => e.status === "accepted"
        ).length;
        result.push({
          name: `${yearStart.getFullYear()}`,
          takeawayOrders: takeawayCount,
          diningOrders: diningCount,
          totalOrders: takeawayCount + diningCount,
        });
      }
    }

    return result.reverse();
  };

  const chartData = getOrders(data, timePeriod);

  // Validate serviceView
  let displayView = serviceView;
  const validServiceViews = ["both", "dining", "takeaway", "all"];
  if (!validServiceViews.includes(serviceView)) {
    console.warn(`Invalid serviceView: ${serviceView}. Defaulting to 'both'.`);
    displayView = "both";
  }

  // Handle no data case
  if (!chartData.length) {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Order Comparison</h2>
        <p>No data available for the selected time period.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Order Comparison</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {displayView === "both" && (
              <>
                <Bar
                  dataKey="takeawayOrders"
                  name="Takeaway Orders"
                  fill="#10b981"
                  barSize={30}
                />
                <Bar
                  dataKey="diningOrders"
                  name="Dining Orders"
                  fill="#8884d8"
                  barSize={30}
                />
              </>
            )}
            {displayView === "dining" && (
              <Bar
                dataKey="diningOrders"
                name="Dining Orders"
                fill="#8884d8"
                barSize={30}
              />
            )}
            {displayView === "takeaway" && (
              <Bar
                dataKey="takeawayOrders"
                name="Takeaway Orders"
                fill="#10b981"
                barSize={30}
              />
            )}
            {displayView === "all" && (
              <Bar
                dataKey="totalOrders"
                name="Total Orders"
                fill="#ff7300"
                barSize={30}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
