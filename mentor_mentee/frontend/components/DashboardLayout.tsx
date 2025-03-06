'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  UserCircle, 
  Calendar, 
  MessageSquare, 
  Award, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    {
      name: 'Profile',
      href: `/${user?.role}/profile`,
      icon: UserCircle
    },
    {
      name: 'Meetings',
      href: `/${user?.role}/meetings`,
      icon: Calendar
    },
    {
      name: 'Messages',
      href: `/${user?.role}/messages`,
      icon: MessageSquare
    },
    {
      name: 'Achievements',
      href: `/${user?.role}/achievements`,
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
            {user?.role === 'mentor' ? 'Mentor' : 'Mentee'} Dashboard
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="ml-4">{item.name}</span>}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {user?.first_name} {user?.last_name}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{user?.email}</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  {user?.first_name?.[0]}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 