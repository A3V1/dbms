'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Users, Calendar, MessageSquare, Award } from 'lucide-react';

export default function MentorDashboard() {
  const stats = [
    {
      name: 'Active Mentees',
      value: '5',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Upcoming Meetings',
      value: '3',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      name: 'Unread Messages',
      value: '12',
      icon: MessageSquare,
      color: 'bg-yellow-500'
    },
    {
      name: 'Achievements Given',
      value: '8',
      icon: Award,
      color: 'bg-purple-500'
    }
  ];

  const upcomingMeetings = [
    {
      mentee: 'John Doe',
      topic: 'Career Guidance',
      date: '2024-03-10 14:00',
      status: 'confirmed'
    },
    {
      mentee: 'Jane Smith',
      topic: 'Technical Discussion',
      date: '2024-03-11 15:30',
      status: 'pending'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50">
              Schedule Meeting
            </button>
            <button className="p-4 border-2 border-green-500 rounded-lg text-green-500 hover:bg-green-50">
              Send Message
            </button>
            <button className="p-4 border-2 border-purple-500 rounded-lg text-purple-500 hover:bg-purple-50">
              Award Achievement
            </button>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting, index) => (
              <div
                key={index}
                className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{meeting.mentee}</p>
                    <p className="text-sm text-gray-600">{meeting.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(meeting.date).toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        meeting.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 