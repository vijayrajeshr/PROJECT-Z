import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById, createBooking, confirmMockPayment } from '../services/eventService';
import { Calendar, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify'; // You have this in App.jsx

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({}); // { ticketTypeId: quantity }
  const [bookingProcessing, setBookingProcessing] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  // Handle quantity change
  const updateQuantity = (ticketTypeId, change) => {
    const current = quantities[ticketTypeId] || 0;
    const newValue = Math.max(0, current + change);
    setQuantities(prev => ({ ...prev, [ticketTypeId]: newValue }));
  };

  // Handle "Book Now" Click
  const handleBooking = async () => {
    // 1. Prepare items
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, quantity]) => ({ ticketTypeId, quantity }));

    if (items.length === 0) {
      toast.warn("Please select at least one ticket");
      return;
    }

    setBookingProcessing(true);
    try {
      // 2. Create Booking (Pending)
      const booking = await createBooking({ eventId: id, items });
      
      // 3. Mock Payment Confirmation (Instant)
      await confirmMockPayment(booking._id);

      toast.success("Booking Confirmed! Tickets sent to your profile.");
      // Redirect to user's tickets page (we will build this route next)
      // navigate('/user/tickets'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!event) return <div className="p-10 text-center">Event not found</div>;

  const imageUrl = event.images?.[0] || "https://via.placeholder.com/800x400";

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <button onClick={() => navigate(-1)} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-red-500" />
                <span>{new Date(event.startAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center mt-1 text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <span>{event.venue?.name}, {event.venue?.city}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About Event</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Tickets Section */}
          <div className="mt-10 border-t pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Select Tickets</h3>
            
            <div className="space-y-4">
              {event.ticketTypes.map((ticket) => (
                <div key={ticket._id} className="flex justify-between items-center p-4 border rounded-lg hover:border-red-200 transition-colors">
                  <div>
                    <h4 className="font-bold text-lg">{ticket.name}</h4>
                    <p className="text-gray-500 text-sm">{ticket.type === 'GA' ? 'General Admission' : 'Reserved Seating'}</p>
                    <p className="text-red-600 font-bold mt-1">${(ticket.priceCents / 100).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => updateQuantity(ticket._id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      disabled={!quantities[ticket._id]}
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-semibold">{quantities[ticket._id] || 0}</span>
                    <button 
                      onClick={() => updateQuantity(ticket._id, 1)}
                      className="w-8 h-8 rounded-full border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-50"
                      disabled={bookingProcessing}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="mt-8 flex justify-end items-center gap-6">
              <div className="text-right">
                <p className="text-gray-500 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Object.entries(quantities).reduce((total, [tId, qty]) => {
                    const ticket = event.ticketTypes.find(t => t._id === tId);
                    return total + ((ticket?.priceCents || 0) * qty) / 100;
                  }, 0).toFixed(2)}
                </p>
              </div>
              
              <button 
                onClick={handleBooking}
                disabled={bookingProcessing}
                className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:bg-gray-300 flex items-center gap-2"
              >
                {bookingProcessing ? 'Processing...' : (
                  <>
                    Confirm Booking <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;