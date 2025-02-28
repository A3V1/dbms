interface MeetingItemProps {
    title: string
    with: string
    time: string
    day: string
  }
  
  export default function MeetingItem({ title, with: withPerson, time, day }: MeetingItemProps) {
    return (
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{withPerson}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{time}</p>
          <p className="text-sm text-gray-500">{day}</p>
        </div>
      </div>
    )
  }
  
  