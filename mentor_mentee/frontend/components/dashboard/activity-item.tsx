import { CheckCircle, FileText } from "lucide-react"

interface ActivityItemProps {
  message: string
  time: string
  type: "assignment" | "meeting" | "message"
}

export default function ActivityItem({ message, time, type }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case "assignment":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FileText className="h-4 w-4" />
          </div>
        )
      case "meeting":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <FileText className="h-4 w-4" />
          </div>
        )
    }
  }

  return (
    <div className="flex items-start gap-3">
      {getIcon()}
      <div>
        <p className="font-medium">{message}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  )
}

