// frontend/src/pages/BookingSuccessPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Printer, Ticket } from 'lucide-react';

const BookingSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-2xl text-center border-t-4 border-red-500">
                
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                
                <p className="text-gray-600 mb-6">
                    Your tickets have been successfully issued and are now available in your profile.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/my-tickets')}
                        className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Ticket className="w-5 h-5" /> View My Tickets
                    </button>
                    
                    <button
                        onClick={() => navigate('/events')}
                        className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Continue Browsing
                    </button>
                    
                    {/* Placeholder for future wallet integration */}
                    <button
                        className="w-full text-sm text-gray-500 hover:text-gray-700 mt-2 flex items-center justify-center gap-2"
                        disabled
                    >
                        <span className="opacity-70">Add to Wallet (Coming Soon)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;