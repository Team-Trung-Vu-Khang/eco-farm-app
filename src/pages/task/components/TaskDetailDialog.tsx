import {
  Dialog,
  DialogContent,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type Task } from "../../../stores/useTaskStore";
import { TaskDetailBody, TaskDetailHeader } from "./TaskDetailContent";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal presentation of a task. The task list itself now navigates to
 * `/task/:id` instead; this wrapper is kept for the places that still show a
 * task inline (crop detail, cultivation region, animal husbandry region).
 */
export default function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-slate-50/50">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6">
            <TaskDetailHeader task={task} />
            <TaskDetailBody task={task} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
