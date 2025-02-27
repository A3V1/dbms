import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}


import { Bell, Calendar, Circle, MessageCircle, Users } from "lucide-react"
import Sidebar from "@/components/sidebar"
import StatsCard from "@/components/dashboard/stats-card"
import MeetingItem from "@/components/dashboard/meeting-item"
import TaskItem from "@/components/dashboard/task-item"
import ActivityItem from "@/components/dashboard/activity-item"

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
  )
}

