import React from 'react';

const Info = () => {
  return (
    <div className="relative bg-[#E8F2F9] flex flex-col items-center py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">EXPLORE QAIRLINES</h2>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="relative group">
          <img
            src="https://placehold.co/600x400"
            alt="A fleet of airplanes"
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white text-lg font-semibold">Aircraft Fleet</h3>
            <p className="text-white text-sm mb-2">Experience the best in air travel with our modern fleet of aircrafts.</p>
            <a href="#" className="text-white text-sm underline">View Details</a>
          </div>
        </div>

        <div className="relative group">
          <img
            src="https://placehold.co/600x400"
            alt="An abstract blue background"
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white text-lg font-semibold">Mạng bay</h3>
            <a href="#" className="text-white text-sm underline">Xem Chi Tiết</a>
          </div>
        </div>

        <div className="relative group">
          <img
            src="https://placehold.co/600x400"
            alt="A family on a flight"
            className="rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white text-lg font-semibold">Hạng vé</h3>
            <a href="#" className="text-white text-sm underline">Xem Chi Tiết</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;