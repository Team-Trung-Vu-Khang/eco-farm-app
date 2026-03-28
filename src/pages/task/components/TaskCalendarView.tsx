import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Task } from "../../../stores/useTaskStore";
import { TASK_WEEK_DAYS } from "../data/constants";

interface TaskCalendarViewProps {
  data: Task[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
}

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const toDateString = (date: Date) => date.toISOString().split("T")[0];

const getTaskCardClassName = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export function TaskCalendarView({
  data,
  currentDate,
  onDateChange,
  onEdit,
  onView,
}: TaskCalendarViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: Array<Date | null> = [];

  for (let i = 0; i < firstDay; i += 1) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i += 1) {
    days.push(new Date(year, month, i));
  }

  const getTasksForDay = (date: Date) => {
    const dateStr = toDateString(date);
    return data.filter(
      (task) => task.startDate <= dateStr && task.endDate >= dateStr,
    );
  };

  const today = toDateString(new Date());

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold capitalize">
          Tháng {month + 1}/{year}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(new Date(year, month - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(new Date(year, month + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b bg-muted/50">
        {TASK_WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {days.map((date, idx) => (
          <div
            key={idx}
            className={`min-h-[120px] p-2 border-r border-b last:border-r-0 relative hover:bg-muted/30 transition-colors ${
              date ? "" : "bg-muted/10"
            }`}
          >
            {date && (
              <>
                <div
                  className={`text-sm font-medium mb-2 ${
                    toDateString(date) === today
                      ? "bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center"
                      : "text-muted-foreground"
                  }`}
                >
                  {date.getDate()}
                </div>

                <div className="space-y-1.5 overflow-hidden">
                  {getTasksForDay(date).map((task) => (
                    <div
                      key={task.id}
                      onClick={(event) => {
                        event.stopPropagation();
                        onView(task);
                      }}
                      className={`text-xs p-1.5 rounded cursor-pointer truncate border group flex items-center justify-between transition-all hover:ring-1 hover:ring-primary/20 hover:shadow-sm ${getTaskCardClassName(task.status)}`}
                      title={task.name}
                    >
                      <span className="truncate flex-1">{task.name}</span>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onEdit(task);
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-black/5 rounded transition-opacity"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
