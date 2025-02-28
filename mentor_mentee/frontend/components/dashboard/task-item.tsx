interface TaskItemProps {
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function TaskItem({ title, dueDate, priority }: TaskItemProps) {
  const priorityColor = {
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600',
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">Due: {dueDate}</p>
      </div>
      <span className={`text-sm font-medium ${priorityColor[priority]}`}>
        {priority}
      </span>
    </div>
  );
}
