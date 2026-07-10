// frontend/src/pages/MyTicketsPage.jsx

import React, { useEffect, useState } from 'react';
import { fetchMyTickets } from '../services/eventService';
import { useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        // Fetches all individual tickets owned by the user
        const data = await fetchMyTickets();
        setTickets(data);
      } catch (error) {
        // Will likely show 401 if user is not logged in
        toast.error("Failed to load tickets. Please check your login status.");
        // Optional: redirect to login if 401 error is detected
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const renderTicketStatus = (status) => {
    let style = "bg-gray-100 text-gray-600";
    if (status === 'active') style = "bg-green-100 text-green-600";
    if (status === 'checked_in') style = "bg-blue-100 text-blue-600";
    if (status === 'resale_pending') style = "bg-yellow-100 text-yellow-600";

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${style}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };
  
  if (loading) return <div className="p-10 text-center">Loading your tickets...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
        <Ticket className="w-8 h-8 mr-3 text-red-500" /> My Event Tickets
      </h1>
      <p className="text-gray-600 mb-8">View your upcoming, active, and past event tickets.</p>

      {tickets.length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700">No Tickets Found</h3>
          <p className="text-gray-500 mt-2">Time to book your next event!</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}

      <div className="space-y-6">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100">
            {/* Left QR Section (Conceptual) */}
            <div className="bg-gray-800 text-white p-4 flex flex-col items-center justify-center space-y-2 w-full md:w-48">
              <div className="text-center">
                  <h4 className="font-semibold text-sm">QR Code:</h4>
                  {/* In a real app, you would render a QR code library here using ticket.qrSecret */}
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.qrSecret}`}
                    alt="QR Code" 
                    className="w-24 h-24 bg-white p-1 mx-auto my-2" 
                  />
                  <p className="text-xs truncate">{ticket.qrSecret.substring(0, 8)}...</p>
              </div>
            </div>

            {/* Right Details Section */}
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{ticket.event?.title || 'Unknown Event'}</h2>
                        <h3 className="text-lg text-gray-600 mt-1">{ticket.ticketType?.name || 'General Admission'}</h3>
                    </div>
                    {renderTicketStatus(ticket.status)}
                </div>

                <div className="mt-4 text-sm space-y-1 text-gray-600">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(ticket.event?.startAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{ticket.event?.venue?.name || 'Venue Details Not Available'}</span>
                    </div>
                    {ticket.seatInfo && (
                         <p className="font-medium text-red-500">Seat: {ticket.seatInfo.section} / {ticket.seatInfo.seat}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <button className="text-sm text-red-500 font-semibold hover:text-red-700">
                        Transfer
                    </button>
                    {ticket.status === 'active' && (
                        <button className="text-sm text-gray-500 font-semibold hover:text-gray-700">
                            Resell
                        </button>
                    )}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTicketsPage;