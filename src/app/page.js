'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-500 p-4 text-center">
        <h1 className="text-white text-2xl font-bold">Cleaning Services App</h1>
      </nav>
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome!</h1>
        <p className="text-center text-lg mb-8">
          Use the navigation below to register clients or business centers.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/register-client" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Register Client
          </Link>
          <Link href="/register-business-center" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Register Business Center
          </Link>
          <Link href="/view-clients" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Brows Clients
          </Link>
        </div>
      </main>
      <footer className="text-center py-4 bg-gray-100">
        © 2024 Cleaning Services
      </footer>
    </div>
  );
}