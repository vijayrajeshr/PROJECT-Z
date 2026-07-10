import React, { useState, useEffect } from "react";
import { Calendar, Layers, Utensils, ShoppingBag } from "lucide-react";
import StatCard from "./StatCard";
import RecentReviews from "./RecentReviews";
import ComparisonChart from "./ComparisonChart";
import { useNavigate, useParams } from "react-router-dom";
import { serviceTimeData } from "./data";
import axios from "axios";

export default function RestaurantDashboard() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");
  const [selectedServiceView, setSelectedServiceView] = useState("both");
  const [totalDiningReviewData, setTotalDiningReviewData] = useState([]);
  const [totalTakeawayReviewData, setTotalTakeawayReviewData] = useState([]);
  const [totalDiningOrderData, setTotalDiningOrderData] = useState([]);
  const [totalTakeawayOrderData, setTotalTakeawayOrderData] = useState([]);

  const [alldiningorder, setAllDiningOrders] = useState([]);
  const [alltakeawayorder, setAllTakeawayOrders] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const effectiveTimePeriod = {
    week: "weekly",
    month: "monthly",
    year: "yearly",
  }[selectedTimePeriod];

  // Fetch reviews
  useEffect(() => {
    const getAllReviewData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/api/reviews/restaurant-dashboard/getall-reviews/${id}`,

          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        const data = response.data.review.reviews || [];

        setTotalDiningReviewData(data.filter((e) => e.reviewType === "dining"));
        setTotalTakeawayReviewData(
          data.filter((e) => e.reviewType === "takeaway")
        );
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    getAllReviewData();
  }, [id, effectiveTimePeriod]);

  useEffect(() => {
    const getAllOrderData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/history/ordertakeaway/${id}`,
          { withCredentials: true }
        );

        const data = response.data?.data || [];

        setAllTakeawayOrders(Array.isArray(data) ? data : []);
        const acceptedOrders = data.filter((e) => e.status === "ready");
        setTotalTakeawayOrderData(acceptedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getAllOrderData();
  }, [id, effectiveTimePeriod]);

  useEffect(() => {
    const getAllDiningOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/history/dining-booking/${id}`,
          { withCredentials: true }
        );
        console.log(response, "data");

        const data = response.data?.data || [];
        setAllDiningOrders(Array.isArray(data) ? data : []);
        const diningOrders = data.filter((e) => e.status === "accepted");
        setTotalDiningOrderData(diningOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getAllDiningOrders();
  }, [id, effectiveTimePeriod]);

  function getTimeframeCount(data = [], state) {
    if (!data || !Array.isArray(data)) return 0;

    const now = new Date();
    let cutoffDate;

    switch (state) {
      case "weekly":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "yearly":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return data.length;
    }

    return data.filter((item) => new Date(item.createdAt) >= cutoffDate).length;
  }

  function calculateOrderAccuracy(correctOrders = [], totalOrders = []) {
    if (!totalOrders.length) return 0;
    return (correctOrders.length / totalOrders.length) * 100;
  }

  const calculateMetrics = () => {
    let totalOrders = 0;
    let totalCustomers = 0;
    let totalReviews = 0;
    let totalAccuracy = 0;

    const totaldiningOrder = alldiningorder
      // .filter((e) => e.mode === "dining")
      .filter((order) => {
        const now = new Date();
        let cutoffDate;
        switch (effectiveTimePeriod) {
          case "weekly":
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "monthly":
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "yearly":
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            return true;
        }
        return new Date(order.createdAt) >= cutoffDate;
      });

    const totaltakeawayOrder = alltakeawayorder
      // .filter((e) => e.mode === "takeaway")
      .filter((order) => {
        const now = new Date();
        let cutoffDate;
        switch (effectiveTimePeriod) {
          case "weekly":
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "monthly":
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "yearly":
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            return true;
        }
        return new Date(order.createdAt) >= cutoffDate;
      });
    // Filter orders by timeframe for orders, customers, and reviews
    const timeframeDiningOrders = totalDiningOrderData.filter((order) => {
      const now = new Date();
      let cutoffDate;
      switch (effectiveTimePeriod) {
        case "weekly":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "yearly":
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          return true;
      }
      return new Date(order.createdAt) >= cutoffDate;
    });

    const timeframeTakeawayOrders = totalTakeawayOrderData.filter((order) => {
      const now = new Date();
      let cutoffDate;
      switch (effectiveTimePeriod) {
        case "weekly":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "yearly":
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          return true;
      }
      return new Date(order.createdAt) >= cutoffDate;
    });

    // Calculate unique customers within timeframe using Set
    const timeframeDiningCustomers = new Set(
      timeframeDiningOrders
        .filter((order) => order.username)
        .map((order) => order.username)
    ).size;

    const timeframeTakeawayCustomers = new Set(
      timeframeTakeawayOrders
        .filter((order) => order?.userId?.username)
        .map((order) => order?.userId?.username)
    ).size;

    if (selectedServiceView === "dining") {
      totalOrders = timeframeDiningOrders.length;
      totalCustomers = timeframeDiningCustomers;
      totalReviews = getTimeframeCount(
        totalDiningReviewData,
        effectiveTimePeriod
      );
      // Use totalDiningOrder for accuracy (not filtered by timeframe)
      totalAccuracy = calculateOrderAccuracy(
        timeframeDiningOrders,
        totaldiningOrder
      );
    } else if (selectedServiceView === "takeaway") {
      totalOrders = timeframeTakeawayOrders.length;
      totalCustomers = timeframeTakeawayCustomers;
      totalReviews = getTimeframeCount(
        totalTakeawayReviewData,
        effectiveTimePeriod
      );
      // Use totalTakeawayOrder for accuracy (not filtered by timeframe)
      totalAccuracy = calculateOrderAccuracy(
        timeframeTakeawayOrders,
        totaltakeawayOrder
      );
    } else {
      totalOrders =
        timeframeDiningOrders.length + timeframeTakeawayOrders.length;
      // Combine unique customers from both dining and takeaway using Set
      const combinedCustomersDining = new Set(
        [...timeframeDiningOrders]
          .filter((order) => order.username)
          .map((order) => order.username)
      ).size;
      const combinedCustomersTakeaway = new Set(
        [...timeframeTakeawayOrders]
          .filter((order) => order?.userId?.username)
          .map((order) => order?.userId?.username)
      ).size;
      totalCustomers = combinedCustomersDining + combinedCustomersTakeaway;
      totalReviews =
        getTimeframeCount(totalDiningReviewData, effectiveTimePeriod) +
        getTimeframeCount(totalTakeawayReviewData, effectiveTimePeriod);
      // Use combined total orders for accuracy (not filtered by timeframe)
      totalAccuracy = calculateOrderAccuracy(
        [...timeframeTakeawayOrders, ...timeframeDiningOrders],
        [...alldiningorder, ...alltakeawayorder]
      );
    }

    return {
      totalOrders,
      totalCustomers,
      totalReviews,
      orderAccuracyRate: totalAccuracy.toFixed(1) + "%",
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {["week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimePeriod(period)}
              className={`px-3 py-1 rounded-md flex items-center ${
                selectedTimePeriod === period
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {["dining", "takeaway", "both"].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedServiceView(view)}
              className={`px-3 py-1 rounded-md flex items-center ${
                selectedServiceView === view
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {view === "dining" && <Utensils className="w-4 h-4 mr-1" />}
              {view === "takeaway" && <ShoppingBag className="w-4 h-4 mr-1" />}
              {view === "both" && <Layers className="w-4 h-4 mr-1" />}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate(`/AllOutletdata/${id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Show all outlet data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          label="Total Orders"
          value={metrics.totalOrders.toString()}
          icon={ShoppingBag}
        />
        <StatCard
          label="Total Customers"
          value={metrics.totalCustomers.toString()}
          icon={Layers}
        />
        <StatCard
          label="Total Reviews"
          value={metrics.totalReviews.toString()}
          icon={Utensils}
        />
        <StatCard
          label="Order Accuracy Rate"
          value={metrics.orderAccuracyRate}
          icon={Calendar}
        />
      </div>

      <div>
        <ComparisonChart
          timePeriod={effectiveTimePeriod}
          serviceView={selectedServiceView}
          data={[...alldiningorder, ...alltakeawayorder]}
        />
      </div>

      <div>
        <RecentReviews />
      </div>
    </div>
  );
}