import React from 'react';

export function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`text-white p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
}