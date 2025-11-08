import React from 'react';

export default function NavbarOwner() {
  return (
    <div className="flex justify-end items-center p-4 border-b bg-white shadow-sm">
      <div className="text-right">
        <p className="font-medium">Ahmad Dhani</p>
        <p className="text-sm text-gray-500">ahmaddhani@gmail.com</p>
      </div>
      <div className="w-10 h-10 ml-4 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">👤</span>
      </div>
    </div>
  );
}
