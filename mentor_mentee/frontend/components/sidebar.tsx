import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, CheckSquare, MessageSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">MentorHub</h1>
      </div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link href="/mentors" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <Users className="h-5 w-5" />
          Mentors
        </Link>
        <Link href="/meetings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <Calendar className="h-5 w-5" />
          Meetings
        </Link>
        <Link href="/tasks" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <CheckSquare className="h-5 w-5" />
          Tasks
        </Link>
        <Link href="/messages" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <MessageSquare className="h-5 w-5" />
          Messages
        </Link>
        <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-gray-700">
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </nav>
    </aside>
  );
}

