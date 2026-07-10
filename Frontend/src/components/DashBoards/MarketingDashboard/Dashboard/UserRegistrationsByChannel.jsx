import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Calendar } from 'lucide-react';

const UserRegistrationsByChannel = () => {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ total: 0, channels: [] });

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Simulate API call with delay < 3 seconds
            setTimeout(() => {
                // Mock data generation based on date range (randomized for demo)
                const channels = [
                    { name: 'Direct', value: Math.floor(Math.random() * 100) + 20 },
                    { name: 'Social Media', value: Math.floor(Math.random() * 150) + 50 },
                    { name: 'Organic Search', value: Math.floor(Math.random() * 80) + 30 },
                    { name: 'Referral', value: Math.floor(Math.random() * 40) + 10 },
                    { name: 'Paid Ads', value: Math.floor(Math.random() * 60) + 15 },
                ];
                const total = channels.reduce((acc, curr) => acc + curr.value, 0);

                setData({ total, channels });
                setLoading(false);
            }, 600); // 0.6s delay
        };

        fetchData();
    }, [startDate, endDate]);

    const [activeRange, setActiveRange] = useState('Week');

    const handleRangeChange = (range) => {
        setActiveRange(range);
        const end = new Date();
        const start = new Date();

        if (range === 'Week') {
            start.setDate(end.getDate() - 7);
        } else if (range === 'Month') {
            start.setMonth(end.getMonth() - 1);
        } else if (range === 'Year') {
            start.setFullYear(end.getFullYear() - 1);
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-[1.01] duration-300 col-span-1 lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                        <Users className="text-indigo-600 h-6 w-6" />
                        User Registrations by Channel
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">New user acquisition breakdown</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex gap-1 mr-2">
                        {['Week', 'Month', 'Year'].map((range) => (
                            <button
                                key={range}
                                onClick={() => handleRangeChange(range)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${activeRange === range
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Range:</span>
                    </div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col justify-center items-center bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                    <span className="text-gray-600 font-medium mb-2">Total New Registrations</span>
                    <span className="text-4xl font-extrabold text-indigo-700">
                        {loading ? "..." : data.total}
                    </span>
                    <span className="text-xs text-indigo-500 mt-2 bg-indigo-100 px-2 py-1 rounded-full">
                        {startDate} to {endDate}
                    </span>
                </div>

                <div className="md:col-span-2 h-64">
                    {loading ? (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">Loading data...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.channels} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1000}>
                                    {data.channels.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserRegistrationsByChannel;
