import React from 'react';

export function ContactInfoCard({ icon, title, children }) {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 bg-red-100 text-red-500 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <div className="text-gray-600 space-y-1">
        {children}
      </div>
    </div>
  );
}