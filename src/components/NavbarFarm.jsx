import React from 'react';

export default function NavbarFarm() {
  return (
    <div className="flex justify-end items-center p-4 border-b bg-white shadow-sm">
      <div className="text-right">
        <p className="font-medium">Budi</p>
        <p className="text-sm text-gray-500">Owner: Ahmad Dhani</p>
      </div>
      <div className="w-10 h-10 ml-4 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">👤</span>
      </div>
    </div>
  );
}
