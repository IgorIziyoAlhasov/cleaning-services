'use client'
import { useState } from 'react';
import { supabase } from './../supabaseClient';
import ApplicationNav from './../components/ApplicationNav';

export default function RegisterBusinessCenter() {
  const [name, setName] = useState(''); // New state for business center name
  const [address, setAddress] = useState('');
  const [floorCount, setFloorCount] = useState('');
  const [lastVisit, setLastVisit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('business_centers')
      .insert([{ name, address, floor_count: floorCount, last_visit: lastVisit }]);

    if (error) console.log(error);
    else console.log('Business Center Registered:', data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ApplicationNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register Business Center</h1>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">

          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">Business Center Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block font-bold mb-2">Address:</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="floor_count" className="block font-bold mb-2">Floor Count:</label>
            <input
              id="floor_count"
              type="number"
              value={floorCount}
              onChange={(e) => setFloorCount(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="last_visit" className="block font-bold mb-2">Last Visit:</label>
            <input
              id="last_visit"
              type="date"
              value={lastVisit}
              onChange={(e) => setLastVisit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700">
            Register Business Center
          </button>
        </form>
      </main>
      <footer className="text-center py-4 bg-gray-100">
        © 2024 Cleaning Services
      </footer>
    </div>
  );
}