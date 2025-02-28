'use client';

import Link from 'next/link';

export default function Sidebar({ role }: { role: 'mentor' | 'mentee' | 'admin' }) {
  return (
    <nav className="w-64 bg-white shadow-sm p-4">
      <div className="space-y-1">
        {role === 'mentor' && (
          <>
            <Link href="/mentor/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Dashboard
            </Link>
            <Link href="/mentor/meetings" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Meetings
            </Link>
            <Link href="/mentor/mentees" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Mentees
            </Link>
          </>
        )}
      </div>
    </nav>
  );
} 