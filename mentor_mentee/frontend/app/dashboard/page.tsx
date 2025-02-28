"use client";

import { Bell, Calendar, Circle, MessageCircle, Users } from "lucide-react";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/dashboard/stats-card";
import MeetingItem from "@/components/dashboard/meeting-item";
import TaskItem from "@/components/dashboard/task-item";
import ActivityItem from "@/components/dashboard/activity-item";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b bg-white p-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-gray-500" />
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </header>

        <main className="p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Mentors"
              value="24"
              icon={<Users className="h-5 w-5" />}
              color="bg-blue-100 text-blue-600"
            />
            <StatsCard
              title="Pending Meetings"
              value="8"
              icon={<Calendar className="h-5 w-5" />}
              color="bg-orange-100 text-orange-600"
            />
            <StatsCard
              title="Tasks Due"
              value="12"
              icon={<Circle className="h-5 w-5" />}
              color="bg-red-100 text-red-600"
            />
            <StatsCard
              title="Messages"
              value="36"
              icon={<MessageCircle className="h-5 w-5" />}
              color="bg-green-100 text-green-600"
            />
          </div>

          {/* Main Content */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upcoming Meetings */}
            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-4 text-lg font-semibold">Upcoming Meetings</h2>
              <div className="space-y-4">
                <MeetingItem title="Progress Review" with="with John Smith" time="2:00 PM" day="Today" />
                <MeetingItem title="Project Discussion" with="with Team A" time="11:00 AM" day="Tomorrow" />
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="rounded-lg border bg-white p-4">
              <h2 className="mb-4 text-lg font-semibold">Recent Tasks</h2>
              <div className="space-y-4">
                <TaskItem title="Review Project Proposal" dueDate="Today" priority="High" />
                <TaskItem title="Feedback Session" dueDate="Tomorrow" priority="Medium" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem message="Sarah Johnson submitted a new assignment" time="2 hours ago" type="assignment" />
              <ActivityItem message="Meeting with Team B completed" time="4 hours ago" type="meeting" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 