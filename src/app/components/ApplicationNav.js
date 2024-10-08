'use client';
import Link from 'next/link';

export default function ApplicationNav() {
  return (
    <nav className="bg-blue-500 p-4 text-center">
      <Link href="/" className="text-white hover:bg-blue-700 px-4 py-2 rounded">
        Home
      </Link>
      <Link href="/register-client" className="text-white hover:bg-blue-700 px-4 py-2 rounded ml-4">
        Register Client
      </Link>
      <Link href="/register-business-center" className="text-white hover:bg-blue-700 px-4 py-2 rounded ml-4">
        Register Business Center
      </Link>
      <Link href="/view-clients" className="text-white hover:bg-blue-700 px-4 py-2 rounded ml-4">
        View Clients
      </Link>
    </nav>
  );
}