interface MeetingItemProps {
    title: string
    with: string
    time: string
    day: string
  }
  
  export default function MeetingItem({ title, with: withPerson, time, day }: MeetingItemProps) {
    return (
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{withPerson}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{day}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    )
  }
  
  