import React, { useState, useEffect, useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  Users,
  Star,
  ShoppingBag,
  Target,
  Calendar,
  Layers,
  UtensilsCrossed,
  ShoppingBasket,
} from "lucide-react";
import { useUser } from "../../../../context/userContent";
import axios from "axios";

// Constants
const TIME_PERIODS = ["week", "month", "year", "all"];
const SERVICE_TYPES = ["dining", "takeaway", "both"];

// MetricCard Component
const MetricCard = ({ title, value, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      <span
        className={`text-sm ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
      >
        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
      </span>
      <span className="text-gray-500 text-sm ml-2">vs last period</span>
    </div>
  </div>
);

const AllOutletData = () => {
  const [activeService, setActiveService] = useState("both");
  const [timePeriod, setTimePeriod] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [outlets, setOutlets] = useState([]);
  const [previousOutlets, setPreviousOutlets] = useState([]);
  const [reviewsdata, setReviewsData] = useState([]);
  const [previousReviewsData, setPreviousReviewsData] = useState([]);
  const { user } = useUser();
  const token = localStorage.getItem("token");

  // Helper function to get date ranges
  const getDateRanges = (period) => {
    const now = new Date();
    let currentStart, currentEnd, previousStart, previousEnd;

    switch (period) {
      case "week":
        currentEnd = new Date(now);
        currentStart = new Date(now);
        currentStart.setDate(now.getDate() - 7);
        previousEnd = new Date(currentStart);
        previousStart = new Date(currentStart);
        previousStart.setDate(currentStart.getDate() - 7);
        break;
      case "month":
        currentEnd = new Date(now);
        currentStart = new Date(now);
        currentStart.setMonth(now.getMonth() - 1);
        previousEnd = new Date(currentStart);
        previousStart = new Date(currentStart);
        previousStart.setMonth(currentStart.getMonth() - 1);
        break;
      case "year":
        currentEnd = new Date(now);
        currentStart = new Date(now);
        currentStart.setFullYear(now.getFullYear() - 1);
        previousEnd = new Date(currentStart);
        previousStart = new Date(currentStart);
        previousStart.setFullYear(currentStart.getFullYear() - 1);
        break;
      case "all":
      default:
        currentEnd = new Date(now);
        currentStart = new Date(0); // Start of epoch
        previousEnd = new Date(currentStart);
        previousStart = new Date(0); // No previous period for 'all'
        break;
    }

    return { currentStart, currentEnd, previousStart, previousEnd };
  };

  // Filter items by date range
  const filterByDateRange = (items, startDate, endDate) => {
    if (!Array.isArray(items)) {
      console.warn("filterByDateRange: items is not an array", items);
      return [];
    }

    const filtered = items.filter((item) => {
      if (!item.createdAt) {
        console.warn("Item missing createdAt:", item);
        return false;
      }
      const createdAt = new Date(item.createdAt);
      if (isNaN(createdAt.getTime())) {
        console.warn("Invalid createdAt date:", item.createdAt);
        return false;
      }
      return createdAt >= startDate && createdAt <= endDate;
    });

    return filtered;
  };

  // Fetch outlet data
  const fetchOutletData = async () => {
    setLoading(true);
    try {
      const encodedEmail = encodeURIComponent(user.email);

      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/history/multiple-firms/${encodedEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const { data, success, message } = response.data;

      if (!success) throw new Error(message || "Failed to fetch outlet data");

      if (!Array.isArray(data)) {
        console.warn("Outlet data is not an array:", data);
        setOutlets([]);
        setPreviousOutlets([]);
        setError("Invalid outlet data format");
        return;
      }

      const { currentStart, currentEnd, previousStart, previousEnd } =
        getDateRanges(timePeriod);

      const currentFiltered = filterByDateRange(data, currentStart, currentEnd);
      const previousFiltered = filterByDateRange(
        data,
        previousStart,
        previousEnd
      );

      setOutlets(currentFiltered);
      setPreviousOutlets(previousFiltered);
      setError("");
    } catch (error) {
      console.error("Error fetching outlet data:", error.message);
      setOutlets([]);
      setPreviousOutlets([]);
      setError(error.message || "Failed to fetch outlet data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews data
  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const encodedEmail = encodeURIComponent(user.email);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/reviews/multiple-reviews/${encodedEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const { response: success, review, message } = response.data;

      if (!success) throw new Error(message || "Failed to fetch reviews");

      // Flatten reviews from firm objects
      const flatReviews = Array.isArray(review)
        ? review.flatMap((firm) =>
            Array.isArray(firm.reviews) ? firm.reviews : []
          )
        : [];

      if (!Array.isArray(flatReviews) || flatReviews.length === 0) {
        console.warn("No valid reviews found:", flatReviews);
        setReviewsData([]);
        setPreviousReviewsData([]);
        setError("No reviews available");
        return;
      }

      const { currentStart, currentEnd, previousStart, previousEnd } =
        getDateRanges(timePeriod);

      // Filter for current and previous periods
      const currentFiltered = filterByDateRange(
        flatReviews,
        currentStart,
        currentEnd
      );
      const previousFiltered = filterByDateRange(
        flatReviews,
        previousStart,
        previousEnd
      );
      setReviewsData(currentFiltered);
      setPreviousReviewsData(previousFiltered);
      setError("");
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      setReviewsData([]);
      setPreviousReviewsData([]);
      setError(error.message || "Restaurant not found");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when timePeriod changes
  useEffect(() => {
    fetchOutletData();
    fetchReviewsData();
  }, [timePeriod, user]);

  // Aggregate orders by outlet for chart
  const aggregateOrdersByDate = useMemo(() => {
    const outletIds = [
      ...new Set(outlets.map((order) => order.firm?._id).filter(Boolean)),
    ];
    const outletMap = {};

    outletIds.forEach((outletId, index) => {
      outletMap[outletId] = {
        diningOrders: 0,
        takeawayOrders: 0,
        name: `Outlet ${index + 1}`,
      };
    });

    outlets.forEach((order) => {
      if (
        order.status === "accepted" &&
        order.firm &&
        outletIds.includes(order.firm._id)
      ) {
        outletMap[order.firm._id].diningOrders += 1;
      } else if (
        order.status === "ready" &&
        Array.isArray(order.items) &&
        order.items.length > 0
      ) {
        const hasMatchingItem = order.items.some(
          (item) =>
            item.sourceEntityId && outletIds.includes(item.sourceEntityId)
        );
        if (hasMatchingItem) {
          const matchingFirmId = order.items.find(
            (item) =>
              item.sourceEntityId && outletIds.includes(item.sourceEntityId)
          ).sourceEntityId;
          outletMap[matchingFirmId].takeawayOrders += 1;
        }
      }
    });

    const chartData = Object.entries(outletMap).map(([outletId, data]) => ({
      name: data.name,
      diningOrders: data.diningOrders,
      takeawayOrders: data.takeawayOrders,
    }));

    return chartData;
  }, [outlets]);

  // Calculate average rating
  function calculateAverageRating(reviews = []) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return Number((totalRating / reviews.length).toFixed(1));
  }

  // Calculate metrics
  const calculateMetrics = useMemo(() => {
    return (service, filteredOrders, filteredReviews) => {
      const serviceOrdersDining = filteredOrders.filter(
        (order) => service === "both" || order.status === "accepted"
      );
      const serviceOrdersTakeaway = filteredOrders.filter(
        (order) => service === "both" || order.status === "ready"
      );

      const serviceReviews = filteredReviews.filter(
        (review) => service === "both" || review.reviewType === service
      );

      // Normalize username for unique customer counting
      const getUsername = (order) => {
        const username =
          order.username || order.userId?.username || order.userId?._id || "";
        return username.trim().toLowerCase();
      };

      const uniqueCustomersDining = new Set(
        serviceOrdersDining
          .filter((order) => order.status === "accepted")
          .map((order) => getUsername(order))
          .filter((username) => username)
      ).size;

      const uniqueCustomersTakeaway = new Set(
        serviceOrdersTakeaway
          .filter((order) => order.status === "ready")
          .map((order) => getUsername(order))
          .filter((username) => username)
      ).size;

      // Count valid orders for totalOrders (successful orders)
      let totalOrders = 0;
      if (service === "dining" || service === "both") {
        totalOrders += serviceOrdersDining.filter(
          (order) => order.status === "accepted"
        ).length;
      }
      if (service === "takeaway" || service === "both") {
        totalOrders += serviceOrdersTakeaway.filter(
          (order) => order.status === "ready"
        ).length;
      }

      // Count all orders for accuracy denominator
      let totalOrdersCount = 0;
      if (service === "dining" || service === "both") {
        totalOrdersCount += filteredOrders.filter(
          (order) => order.firm?._id
        ).length;
      }
      if (service === "takeaway" || service === "both") {
        totalOrdersCount += filteredOrders.filter(
          (order) =>
            Array.isArray(order.items) &&
            order.items.some((item) => item.sourceEntityId)
        ).length;
      }

      const totalRevenue = serviceOrdersTakeaway.reduce((sum, order) => {
        let orderRevenue = 0;
        if (order.status === "ready" && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (item.sourceEntityId) {
              orderRevenue += order.totalPrice || 0;
            }
          });
        }
        return sum + orderRevenue;
      }, 0);

      const avgAccuracyRate =
        totalOrdersCount > 0
          ? Number(((totalOrders / totalOrdersCount) * 100).toFixed(1))
          : 0;

      return {
        totalOrders,
        totalCustomers:
          service === "takeaway"
            ? uniqueCustomersTakeaway
            : service === "dining"
            ? uniqueCustomersDining
            : uniqueCustomersDining + uniqueCustomersTakeaway,
        totalRevenue: totalRevenue.toFixed(2),
        avgRating: calculateAverageRating(serviceReviews),
        avgAccuracyRate,
      };
    };
  }, []);

  // Calculate trend
  const calculateTrend = (currentValue, previousValue) => {
    if (previousValue === 0) return currentValue === 0 ? 0 : 100;
    return Number(
      (((currentValue - previousValue) / previousValue) * 100).toFixed(1)
    );
  };

  // Calculate metrics for current and previous periods
  const currentMetricsDining = useMemo(
    () => calculateMetrics("dining", outlets, reviewsdata),
    [outlets, reviewsdata, calculateMetrics]
  );
  const currentMetricsTakeaway = useMemo(
    () => calculateMetrics("takeaway", outlets, reviewsdata),
    [outlets, reviewsdata, calculateMetrics]
  );
  const previousMetricsDining = useMemo(
    () => calculateMetrics("dining", previousOutlets, previousReviewsData),
    [previousOutlets, previousReviewsData, calculateMetrics]
  );
  const previousMetricsTakeaway = useMemo(
    () => calculateMetrics("takeaway", previousOutlets, previousReviewsData),
    [previousOutlets, previousReviewsData, calculateMetrics]
  );

  // Calculate combined metrics
  const metrics = useMemo(() => {
    if (activeService === "both") {
      const totalOrdersDining = currentMetricsDining.totalOrders;
      const totalOrdersTakeaway = currentMetricsTakeaway.totalOrders;
      const totalOrdersCountDining = outlets.filter(
        (order) => order.firm?._id
      ).length;
      const totalOrdersCountTakeaway = outlets.filter(
        (order) =>
          Array.isArray(order.items) &&
          order.items.some((item) => item.sourceEntityId)
      ).length;
      const totalOrders = totalOrdersDining + totalOrdersTakeaway;
      const totalOrdersCount =
        totalOrdersCountDining + totalOrdersCountTakeaway;
      const avgAccuracyRate =
        totalOrdersCount > 0
          ? Number(((totalOrders / totalOrdersCount) * 100).toFixed(1))
          : 0;

      return [
        {
          title: "Total Customers",
          value: (
            currentMetricsDining.totalCustomers +
            currentMetricsTakeaway.totalCustomers
          ).toLocaleString(),
          icon: <Users className="text-blue-500" />,
          trend: calculateTrend(
            currentMetricsDining.totalCustomers +
              currentMetricsTakeaway.totalCustomers,
            previousMetricsDining.totalCustomers +
              previousMetricsTakeaway.totalCustomers
          ),
        },
        {
          title: "Total Orders",
          value: (
            currentMetricsDining.totalOrders +
            currentMetricsTakeaway.totalOrders
          ).toLocaleString(),
          icon: <ShoppingBag className="text-green-500" />,
          trend: calculateTrend(
            currentMetricsDining.totalOrders +
              currentMetricsTakeaway.totalOrders,
            previousMetricsDining.totalOrders +
              previousMetricsTakeaway.totalOrders
          ),
        },
        {
          title: "Average Rating",
          value: (
            (currentMetricsDining.avgRating +
              currentMetricsTakeaway.avgRating) /
            2
          ).toFixed(1),
          icon: <Star className="text-yellow-500" />,
          trend: calculateTrend(
            (currentMetricsDining.avgRating +
              currentMetricsTakeaway.avgRating) /
              2,
            (previousMetricsDining.avgRating +
              previousMetricsTakeaway.avgRating) /
              2
          ),
        },
        {
          title: "Order Accuracy",
          value: `${avgAccuracyRate.toFixed(1)}%`,
          icon: <Target className="text-red-500" />,
          trend: calculateTrend(
            avgAccuracyRate,
            (previousMetricsDining.avgAccuracyRate +
              previousMetricsTakeaway.avgAccuracyRate) /
              2
          ),
        },
      ];
    }

    const serviceMetrics = calculateMetrics(
      activeService,
      outlets,
      reviewsdata
    );
    const previousServiceMetrics = calculateMetrics(
      activeService,
      previousOutlets,
      previousReviewsData
    );

    return [
      {
        title: "Total Customers",
        value: serviceMetrics.totalCustomers.toLocaleString(),
        icon: <Users className="text-blue-500" />,
        trend: calculateTrend(
          serviceMetrics.totalCustomers,
          previousServiceMetrics.totalCustomers
        ),
      },
      {
        title: "Total Orders",
        value: serviceMetrics.totalOrders.toLocaleString(),
        icon: <ShoppingBag className="text-green-500" />,
        trend: calculateTrend(
          serviceMetrics.totalOrders,
          previousServiceMetrics.totalOrders
        ),
      },
      {
        title: "Average Rating",
        value: serviceMetrics.avgRating.toFixed(1),
        icon: <Star className="text-yellow-500" />,
        trend: calculateTrend(
          serviceMetrics.avgRating,
          previousServiceMetrics.avgRating
        ),
      },
      {
        title: "Order Accuracy",
        value: `${serviceMetrics.avgAccuracyRate.toFixed(1)}%`,
        icon: <Target className="text-red-500" />,
        trend: calculateTrend(
          serviceMetrics.avgAccuracyRate,
          previousServiceMetrics.avgAccuracyRate
        ),
      },
    ];
  }, [
    activeService,
    currentMetricsDining,
    currentMetricsTakeaway,
    previousMetricsDining,
    previousMetricsTakeaway,
    calculateMetrics,
    outlets,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            All Outlet Report
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
              {TIME_PERIODS.map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timePeriod === period
                      ? "bg-indigo-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={`Filter by ${period}`}
                >
                  <Calendar className="w-4 h-4" />
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {SERVICE_TYPES.map((service) => (
                <button
                  key={service}
                  onClick={() => setActiveService(service)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    activeService === service
                      ? service === "dining"
                        ? "bg-blue-500 text-white"
                        : service === "takeaway"
                        ? "bg-green-500 text-white"
                        : "bg-purple-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label={`Filter by ${service}`}
                >
                  {service === "dining" && (
                    <UtensilsCrossed className="w-5 h-5" />
                  )}
                  {service === "takeaway" && (
                    <ShoppingBasket className="w-5 h-5" />
                  )}
                  {service === "both" && <Layers className="w-5 h-5" />}
                  {service.charAt(0).toUpperCase() + service.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading &&
          !error &&
          outlets.length === 0 &&
          reviewsdata.length === 0 && (
            <p className="text-gray-500 mb-4">
              No data available for the selected time period.
            </p>
          )} */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Orders by Outlet</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={aggregateOrdersByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {activeService === "both" ? (
                  <>
                    <Bar
                      dataKey="diningOrders"
                      name="Dining Orders"
                      fill="rgba(59, 130, 246, 0.5)"
                      stroke="rgb(59, 130, 246)"
                      barSize={30}
                    />
                    <Bar
                      dataKey="takeawayOrders"
                      name="Takeaway Orders"
                      fill="rgba(34, 197, 94, 0.5)"
                      stroke="rgb(34, 197, 94)"
                      barSize={30}
                    />
                  </>
                ) : (
                  <Bar
                    dataKey={
                      activeService === "dining"
                        ? "diningOrders"
                        : "takeawayOrders"
                    }
                    name={`${
                      activeService === "dining" ? "Dining" : "Takeaway"
                    } Orders`}
                    fill={
                      activeService === "dining"
                        ? "rgba(59, 130, 246, 0.5)"
                        : "rgba(34, 197, 94, 0.5)"
                    }
                    stroke={
                      activeService === "dining"
                        ? "rgb(59, 130, 246)"
                        : "rgb(34, 197, 94)"
                    }
                    barSize={30}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOutletData;
