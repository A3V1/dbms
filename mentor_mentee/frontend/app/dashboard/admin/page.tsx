'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, UserCheck, Calendar, Award, MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';
import { adminAPI, AdminDashboardData } from '@/services/api';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminAPI.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        console.error('Error fetching admin dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const stats = [
    {
      name: 'Total Users',
      value: dashboardData.stats.total_users,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Mentors',
      value: dashboardData.stats.total_mentors,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: 'Mentees',
      value: dashboardData.stats.total_mentees,
      icon: Users,
      color: 'bg-yellow-500'
    },
    {
      name: 'Meetings',
      value: dashboardData.stats.total_meetings,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      name: 'Achievements',
      value: dashboardData.stats.total_achievements,
      icon: Award,
      color: 'bg-pink-500'
    },
    {
      name: 'Messages',
      value: dashboardData.stats.total_messages,
      icon: MessageSquare,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link 
            href="/dashboard/admin/settings" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6 flex items-center"
            >
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link 
              href="/dashboard/admin/users" 
              className="p-4 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50 text-center"
            >
              Manage Users
            </Link>
            <Link 
              href="/dashboard/admin/mentors" 
              className="p-4 border-2 border-green-500 rounded-lg text-green-500 hover:bg-green-50 text-center"
            >
              Manage Mentors
            </Link>
            <Link 
              href="/dashboard/admin/mentees" 
              className="p-4 border-2 border-yellow-500 rounded-lg text-yellow-500 hover:bg-yellow-50 text-center"
            >
              Manage Mentees
            </Link>
            <Link 
              href="/dashboard/admin/reports" 
              className="p-4 border-2 border-purple-500 rounded-lg text-purple-500 hover:bg-purple-50 text-center"
            >
              View Reports
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <Link 
              href="/dashboard/admin/users" 
              className="text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recent_users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'mentor' 
                          ? 'bg-green-100 text-green-800' 
                          : user.role === 'mentee'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link 
                        href={`/dashboard/admin/users/${user.id}`}
                        className="text-blue-500 hover:underline mr-3"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/admin/users/${user.id}/edit`}
                        className="text-green-500 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <Link 
              href="/dashboard/admin/activities" 
              className="text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recent_activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activity.activity_type === 'meeting' 
                      ? 'bg-purple-100 text-purple-800' 
                      : activity.activity_type === 'achievement'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.activity_type.charAt(0).toUpperCase() + activity.activity_type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 