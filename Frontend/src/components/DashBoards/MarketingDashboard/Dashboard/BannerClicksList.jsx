// export const BannerClicksList = ({ banners, timeframe }) => {
//     return (
//       <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">
//           Detailed Banner Performance
//         </h3>
//         <div className="space-y-3">
//           {banners.map((banner) => (
//             <div
//               key={banner.id}
//               className="bg-white p-3 rounded shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium text-gray-700">{banner.title}</span>
//                 <span className="text-sm text-blue-600 font-semibold">
//                   Total: {banner.totalClicks}
//                 </span>
//               </div>
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div className="text-center p-2 bg-gray-50 rounded">
//                   <p className="text-xs text-gray-500 mb-1">Today</p>
//                   <p className="font-semibold">{banner.dailyClicks}</p>
//                 </div>
//                 <div className="text-center p-2 bg-gray-50 rounded">
//                   <p className="text-xs text-gray-500 mb-1">This Week</p>
//                   <p className="font-semibold">{banner.weeklyClicks}</p>
//                 </div>
//                 <div className="text-center p-2 bg-gray-50 rounded">
//                   <p className="text-xs text-gray-500 mb-1">This Month</p>
//                   <p className="font-semibold">{banner.monthlyClicks}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };


export const BannerClicksList = ({ banners, timeframe }) => {
  return (
    <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Detailed Banner Performance
      </h3>
      <div className="space-y-4">
        {banners.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No banner data available for the selected timeframe.
          </p>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-lg text-gray-800">
                  {banner.title}
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm text-gray-500">Total Clicks:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {banner.totalClicks}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-3 border-t pt-3 border-gray-200">
                <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-inner border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Today</p>
                  <p className="font-bold text-gray-700 flex items-center">
                    {banner.dailyClicks}
                    {/* Simple trend indicator (example logic) */}
                    {banner.dailyClicks > (banner.yesterdayClicks || 0) ? (
                      <span className="ml-2 text-green-500 text-xs">▲</span>
                    ) : banner.dailyClicks < (banner.yesterdayClicks || 0) ? (
                      <span className="ml-2 text-red-500 text-xs">▼</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-inner border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">This Week</p>
                  <p className="font-bold text-gray-700">
                    {banner.weeklyClicks}
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 bg-white rounded-md shadow-inner border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">This Month</p>
                  <p className="font-bold text-gray-700">
                    {banner.monthlyClicks}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};