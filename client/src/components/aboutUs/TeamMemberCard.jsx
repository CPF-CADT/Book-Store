import React from 'react';

export function TeamMemberCard({ imageUrl, name, role, bio }) {
  return (
    <div className="text-center bg-gray-50 p-8 rounded-lg">
      <img
        src={imageUrl}
        alt={`Photo of ${name}`}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md"
      />
      <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
      <p className="text-red-500 font-medium mb-3">{role}</p>
      <p className="text-gray-600 text-sm">{bio}</p>
    </div>
  );
}