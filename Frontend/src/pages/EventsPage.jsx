// frontend/src/pages/EventsPage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllEvents } from '../services/eventService';
import EventCard from '../components/Events/EventCard';
import { Search, MapPin, SlidersHorizontal, ArrowRight, TrendingUp, Sparkles, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// --- COLOR PALETTE (Shades of #02757A) ---
const primaryColor = '#02757A'; // Main Teal
const lightShade = '#E0F2F2'; // Very light teal
const mediumShade = '#66B2B2'; // Medium teal
const darkShade = '#005558'; // Darker teal

// --- STATIC DATA FOR CREATIVE APPEAL ---
const STATIC_CATEGORIES = [
    { name: 'Concerts', icon: 'music', count: 3 },
    { name: 'Workshops', icon: 'tool', count: 1 },
    { name: 'Festivals', icon: 'party', count: 1 },
    { name: 'Comedy', icon: 'laugh', count: 2 },
    { name: 'Food & Wine', icon: 'utensils', count: 4 },
    { name: 'Tech & AI', icon: 'cpu', count: 2 },
    { name: 'Art & Exhibitions', icon: 'palette', count: 3 },
];

const STATIC_HIGHLIGHTS = [
    { title: 'Innovation Summit 2024', category: 'Conference', date: 'Dec 12', img: 'https://images.pexels.com/photos/1181395/pexels-photo-1181395.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { title: 'Global Food Fair', category: 'Culinary', date: 'Nov 25', img: 'https://images.pexels.com/photos/1036858/pexels-photo-1036858.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { title: 'Jazz & Blues Fest', category: 'Music', date: 'Oct 28', img: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
};

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('Toronto, ON, Canada');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAllEvents();
                setEvents(data);
            } catch (err) {
                setError("Could not connect to Events API. Please check backend status.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSearch = () => {
        // Implement actual search logic here, potentially filtering 'events' state
        // or making a new API call with search parameters.
        console.log(`Searching for "${searchTerm}" in "${selectedCity}"`);
        toast.info(`Searching for "${searchTerm}" in "${selectedCity}"... (Static for now)`);
        // For now, let's just clear the search term and simulate results
        // setSearchTerm(''); 
    };
    
    // Icon renderer with a few more options
    const renderIcon = (iconName) => {
        const iconProps = { className: "w-6 h-6", color: primaryColor };
        switch (iconName) {
            case 'music': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg></motion.div>;
            case 'tool': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-platter"><path d="M12 9H2v6h10a7 7 0 0 0 7-7V9a7 7 0 0 0-7-7H2Z"/><path d="M22 6C22 9.5 19 12 12 12H2"/><path d="m5 16-2 2h4l2-2m-4 0v-2"/></svg></motion.div>;
            case 'party': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-party-popper"><path d="M5.8 11.3 2.5 14.6a2 2 0 0 0 0 2.8l3.4 3.4a2 2 0 0 0 2.8 0l3.3-3.3"/><path d="M11.5 12.8 14.8 9.5a2 2 0 0 0 0-2.8L11.4 3.3a2 2 0 0 0-2.8 0L5.3 6.6"/><path d="M16 16h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2Z"/><path d="M14 11V9a2 2 0 0 0-2-2H9"/><path d="M7 11v2a2 2 0 0 0 2 2h2"/><path d="M16 11v2a2 2 0 0 1-2 2h-2"/><path d="M11 7v2a2 2 0 0 1-2 2H7"/><path d="M22 21 16 15"/><path d="m17 17 4 4"/></svg></motion.div>;
            case 'laugh': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-laugh"><circle cx="12" cy="12" r="10"/><path d="M9 10s.5-1 2-1 2 1 2 1"/><line x1="12" y1="15" x2="12" y2="15"/><path d="M17 10s-.5-1-2-1-2 1-2 1"/></svg></motion.div>;
            case 'utensils': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-restaurant"><path d="M12 2C7 2 3 6 3 11v7a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-7c0-5-4-9-9-9Z"/><path d="M12 9v6"/><path d="M8 11h8"/></svg></motion.div>;
            case 'cpu': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cpu"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M15 2v3"/><path d="M15 19v3"/><path d="M9 2v3"/><path d="M9 19v3"/><path d="M2 9h3"/><path d="M2 15h3"/><path d="M19 9h3"/><path d="M19 15h3"/></svg></motion.div>;
            case 'palette': return <motion.div whileHover={{ scale: 1.1 }}><svg xmlns="http://www.w3.org/2000/svg" {...iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-palette"><circle cx="12" cy="12" r="10"/><path d="M12 5v14m-7-7h14m-10-4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/></svg></motion.div>;
            default: return <motion.div whileHover={{ scale: 1.1 }}><Sparkles className="w-6 h-6" color={primaryColor} /></motion.div>;
        }
    };


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 pb-20"
        >

            {/* --- HERO / SEARCH BAR --- */}
            <div className="bg-white shadow-xl py-12 mb-10 border-b border-teal-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 variants={itemVariants} className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                        Your Passport to Unforgettable Events
                    </motion.h1>
                    <motion.p variants={itemVariants} className="text-xl text-gray-700 mb-8">
                        Discover concerts, workshops, festivals & more near you.
                    </motion.p>

                    {/* Search & Location Bar */}
                    <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
                        {/* Location Dropdown */}
                        <div className="relative w-full md:w-1/4">
                            <MapPin className="absolute left-3 top-3.5 text-teal-600 w-5 h-5" />
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border border-teal-300 bg-teal-50 text-teal-800 font-semibold shadow-md outline-none focus:ring-2 focus:ring-${primaryColor}`}
                                style={{ borderColor: primaryColor, color: darkShade, backgroundColor: lightShade }}
                            >
                                <option>Toronto, ON, Canada</option>
                                <option>Vancouver, BC</option>
                                <option>New York, NY</option>
                                <option>Los Angeles, CA</option>
                            </select>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-3/4">
                            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Event, Venue, or Artist..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 outline-none shadow-md"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-16 top-3 text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSearch}
                                className={`absolute right-2 top-2.5 px-4 py-2 rounded-lg text-white font-semibold transition-colors`}
                                style={{ backgroundColor: primaryColor }}
                            >
                                Find Events
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- EVENT COLLECTIONS / CATEGORIES --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" style={{ color: primaryColor }} /> Explore Categories
                </motion.h2>

                {/* Category Carousel */}
                <motion.div variants={containerVariants} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                    {STATIC_CATEGORIES.map(cat => (
                        <motion.div
                            key={cat.name}
                            variants={itemVariants}
                            whileHover={{ y: -6, scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                            className="flex-shrink-0 w-36 h-24 p-3 bg-white rounded-2xl shadow-md border border-gray-100 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                        >
                            <span className="mb-2">{renderIcon(cat.icon)}</span>
                            <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                            <span className="text-xs text-gray-500">{cat.count} events</span>
                        </motion.div>
                    ))}
                    {/* Static Filter Button */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -6, scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                        className="flex-shrink-0 w-36 h-24 p-3 rounded-2xl shadow-md border border-teal-200 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                        style={{ backgroundColor: lightShade }}
                    >
                        <SlidersHorizontal className="w-7 h-7" style={{ color: darkShade }} />
                        <span className="text-sm font-bold mt-2" style={{ color: darkShade }}>All Filters</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* --- FEATURED EVENTS (Hardcoded placeholder for visual impact) --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6 flex justify-between items-center">
                    Curated Picks for You
                    <Link to="/events" className="text-lg font-semibold flex items-center hover:underline" style={{ color: primaryColor }}>
                        View All <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </motion.h2>

                <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {STATIC_HIGHLIGHTS.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)" }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300"
                            onClick={() => navigate('/events')} // Link to main events page for now
                        >
                            <div className="relative h-56">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                                <span className={`absolute top-3 left-3 text-white text-sm px-3 py-1 rounded-full font-bold`} style={{ backgroundColor: primaryColor }}>{item.date}</span>
                                <span className={`absolute bottom-3 right-3 text-white text-xs px-2 py-1 rounded-lg font-medium`} style={{ backgroundColor: mediumShade }}>{item.category}</span>
                            </div>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold mt-1 mb-3 text-gray-900">{item.title}</h3>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity`}
                                    style={{ backgroundColor: lightShade, color: darkShade }}
                                >
                                    Explore Event
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* --- LIVE API DATA / ALL EVENTS --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Sparkles className="w-8 h-8" style={{ color: primaryColor }} /> All Upcoming Events
                </motion.h2>

                {loading && (
                   <div className="text-center py-16">
                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mx-auto"></div>
                     <p className="mt-5 text-xl font-medium text-gray-600">Gathering the best events for you...</p>
                   </div>
                )}

                {error && (
                   <motion.div
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className={`bg-red-100 text-red-700 p-6 rounded-lg text-center shadow-lg flex items-center justify-center gap-3`}
                   >
                       <XCircle className="w-6 h-6" />
                       <span className="font-semibold">{error}</span>
                   </motion.div>
                )}

                {!loading && !error && events.length === 0 && (
                   <motion.div
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className={`text-center text-gray-500 py-16 bg-white rounded-xl shadow-lg border border-gray-100`}
                   >
                     <h3 className="text-2xl font-bold text-gray-700">No Live Events Found</h3>
                     <p className="mt-3 text-lg">The API is ready, but your database is currently empty.</p>
                     <p className="mt-1 text-gray-500">To see events, please run the `npm run seed` command in your backend.</p>
                   </motion.div>
                )}

                {/* The API Grid - uses the EventCard component */}
                <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
                  {events.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EventsPage;