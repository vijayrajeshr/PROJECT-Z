import React, { useState, useEffect, useRef, useCallback } from 'react';
import {useUser} from "../../../context/userNotificationContext";
const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const  Notification=()=> {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const skipCount = useRef(0);

  const loadMoreNotifications = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/notify?limit=10&skip=${skipCount.current}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setNotifications(prevNotifications => [...prevNotifications, ...data.notifications]);
      skipCount.current += data.notifications.length;
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching notifications from backend:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    loadMoreNotifications();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreNotifications();
        }
      },
      {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, loadMoreNotifications]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'accepted':
      case 'ready':
      case 'delivered':
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen  font-inter p-4 sm:p-6 lg:p-2 ">
      <div className="w-full max-w-3xl bg-white rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        </div>
        <div className=" overflow-y-auto custom-scrollbar">
          {notifications.length === 0 && !loading && (
            <p className="p-5 text-gray-500 text-center">No notifications yet.</p>
          )}
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start p-4 m-2 border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  !notification.read ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {notification.type === 'Tiffin Order' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path><path d="M7 15.3c.5.5 1.4.8 2.5.8 1.1 0 2-.3 2.5-.8s.8-1.2.8-2.5c0-1.3-.3-2.2-.8-2.5s-1.4-.8-2.5-.8c-1.1 0-2 .3-2.5.8-.5.5-.8 1.2-.8 2.5 0 1.3.3 2.2.8 2.5z"></path>
                  </svg>
                )}
                {notification.type === 'Dining Booking' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17H2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3z"></path><path d="M6 17V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v13"></path><line x1="12" y1="17" x2="12" y2="20"></line>
                  </svg>
                )}
                {notification.type === 'New Message' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                )}
                {notification.type === 'System Alert' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                )}
                {notification.type === 'Promotion' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12V2h10l8 8-10 10-8-8z"></path><path d="M7 7h.01"></path>
                    </svg>
                )}
                 {notification.type === 'Security Alert' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                )}
                {notification.type === 'Account Activity' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                    </svg>
                )}
              </div>
              <div className="flex-grow">
                <p className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
                {notification.status && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${getStatusColorClass(notification.status)}`}>
                    {notification.status}
                  </span>
                )}
              </div>
              {!notification.read && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1 ml-2" title="Unread"></div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-5 text-center text-gray-600">
              <svg className="animate-spin h-5 w-5 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2">Loading more notifications...</p>
            </div>
          )}

          {hasMore && !loading && (
            <div ref={observerRef} className="h-1 bg-transparent"></div>
          )}

          {!hasMore && notifications.length > 0 && (
            <p className="p-5 text-gray-500 text-center">You've reached the end of your notifications.</p>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
