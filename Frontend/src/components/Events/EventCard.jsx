import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react'; // You have lucide-react in package.json

const EventCard = ({ event }) => {
  // Format date to be readable (e.g., "Fri, Oct 20 • 7:00 PM")
  const eventDate = new Date(event.startAt).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  // Use the first image or a placeholder
  const imageUrl = event.images && event.images.length > 0 
    ? event.images[0] 
    : "https://via.placeholder.com/400x225?text=No+Image"; 

  // Calculate lowest price if ticketTypes exist
  const lowestPrice = event.ticketTypes && event.ticketTypes.length > 0
    ? Math.min(...event.ticketTypes.map(t => t.priceCents)) / 100
    : null;

  return (
    <Link to={`/events/${event._id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
             <h3 className="text-white text-xl font-bold truncate">{event.title}</h3>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-2">
          
          {/* Date */}
          <div className="flex items-center text-red-500 font-semibold text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {eventDate}
          </div>

          {/* Venue */}
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">{event.venue?.name || "Venue TBD"}</span>
          </div>

          {/* Description Preview */}
          <p className="text-gray-600 text-sm line-clamp-2">
            {event.description}
          </p>

          {/* Price / Footer */}
          <div className="pt-3 mt-2 border-t border-gray-100 flex justify-between items-center">
            {lowestPrice !== null ? (
               <span className="text-gray-900 font-bold">
                 From ${lowestPrice.toFixed(2)}
               </span>
            ) : (
               <span className="text-gray-400 text-sm">Check details</span>
            )}
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
              Book Now
            </span>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default EventCard;