import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: string
  icon: ReactNode
  color: string
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

