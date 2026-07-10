import React from "react";
import { Star } from "lucide-react";

export const MetricCard = ({ title, value, icon: Icon, trend, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full sm:w-1/2 lg:w-1/4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-600">{title}</h2>
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      </div>
      <div className="text-3xl font-bold text-gray-800">
        {rating ? (
          <div className="flex items-center">
            <span className="mr-2">{value}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          value
        )}
      </div>
      <p
        className={`text-xs mt-1 ${
          trend >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {trend > 0 ? "+" : ""}
        {trend}%
      </p>
    </div>
  );
};
