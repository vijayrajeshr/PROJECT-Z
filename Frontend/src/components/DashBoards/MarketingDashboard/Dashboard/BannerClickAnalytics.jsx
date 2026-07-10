import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useResource } from "../../../../context/Banner_CollectionContext";

export const BannerClickAnalytics = () => {
    const [bannersTimeframe, setBannersTimeframe] = useState("Today");
    const [clicksData, setClicksData] = useState([]);
    const { resources } = useResource();
    const navigate = useNavigate()
    
    const timeTabs = ["Today", "This Week", "This Month"];

    const getStartDate = (timeframe) => {
        const now = new Date();
        const currentUTC = new Date(now.toISOString().slice(0, -1)); // UTC date handling

        switch (timeframe) {
            case "Today":
                return new Date(Date.UTC(
                    currentUTC.getUTCFullYear(),
                    currentUTC.getUTCMonth(),
                    currentUTC.getUTCDate()
                ));
            case "This Week":
                // Start on Monday
                const day = currentUTC.getUTCDay();
                const diff = day === 0 ? 6 : day - 1;
                const startDate = new Date(currentUTC);
                startDate.setUTCDate(currentUTC.getUTCDate() - diff);
                startDate.setUTCHours(0, 0, 0, 0);
                return startDate;
            case "This Month":
                return new Date(Date.UTC(
                    currentUTC.getUTCFullYear(),
                    currentUTC.getUTCMonth(),
                    1
                ));
            default:
                return new Date(0); // All time
        }
    };

    const filterClicks = (clicks, timeframe) => {
        const startDate = getStartDate(timeframe);
        return clicks.filter(click => 
            new Date(click.date) >= startDate
        ).length;
    };

    useEffect(() => {
        const updateData = () => {
            const data = resources.map(banner => ({
                name: banner.title,
                clicks: filterClicks(banner.clicks, bannersTimeframe)
            }));
            setClicksData(data);
        };
        updateData();
    }, [bannersTimeframe, resources]);

    const handleBannerFilter = (e) => {
        const selectedBanner = e.target.value;
        const filterData = (bannersArray) => 
            bannersArray.map(banner => ({
                name: banner.title,
                clicks: filterClicks(banner.clicks, bannersTimeframe)
            }));

        if (selectedBanner === "All") {
            setClicksData(filterData(resources));
        } else {
            const foundBanner = resources.find(banner => banner.title === selectedBanner);
            foundBanner && setClicksData([{
                name: foundBanner.title,
                clicks: filterClicks(foundBanner.clicks, bannersTimeframe)
            }]);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow space-y-4 md:w-1/2 w-full">
            <ChartHeader
                title="Banner Click Analytics"
                description="View banner clicks for different time periods"
                navigateTo={() => navigate('/dashboard/marketing/campaign-management')}
            />

            <div className="flex justify-between items-center flex-wrap gap-2">
                <TimeTabs
                    tabs={timeTabs}
                    activeTab={bannersTimeframe}
                    setActiveTab={setBannersTimeframe}
                />
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="clicks"
                        type="category"
                        tick={{ fontSize: 15}}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                        dataKey="clicks"
                        fill="#009999"
                        name="Total Clicks"
                        maxBarSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Access the full data object from payload
        const { name, clicks } = payload[0].payload;
        return (
            <div className="p-2 bg-white border border-gray-300">
                <p className="font-semibold mb-1">{name}</p>
                <p className="text-sky-600">Clicks: {clicks}</p>
            </div>
        );
    }
    return null;
};

const ChartHeader = ({ title, description, navigateTo }) => (
    <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                {title}
            </h1>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <MdOutlineNavigateNext
            className="text-blue-600 cursor-pointer"
            onClick={navigateTo}
            size={24}
        />
    </div>
);

const TimeTabs = ({ tabs, activeTab, setActiveTab }) => (
    <div className="flex gap-2">
        {tabs.map((tab) => (
            <TabButton
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
            />
        ))}
    </div>
);

const TabButton = ({ label, isActive, onClick }) => (
    <button
        className={`px-2 py-1 text-sm font-normal rounded ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
        onClick={onClick}
    >
        {label}
    </button>
);