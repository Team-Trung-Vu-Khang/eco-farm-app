import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, PencilLine } from "lucide-react";
import { useLocation, useRoute, useSearch } from "wouter";
import useTaskStore from "../../stores/useTaskStore";
import {
  TaskDetailBody,
  TaskDetailHeader,
} from "./components/TaskDetailContent";

export default function TaskDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/task/:id");
  const search = useSearch();
  const getTaskById = useTaskStore((state) => state.getTaskById);

  // Preserve the plan scope so "back" returns to the filtered list.
  const planId = new URLSearchParams(search).get("planId") || "";
  const backTo = planId ? `/task?planId=${planId}` : "/task";

  const task = params?.id ? getTaskById(Number(params.id)) : undefined;

  if (!task) {
    return (
      <PageWrapper
        title="Không tìm thấy công việc"
        description="Công việc bạn đang xem không còn tồn tại trong hệ thống."
      >
        <Button variant="outline" onClick={() => setLocation(backTo)}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Chi tiết công việc"
      description={`Mã công việc: ${task.code}`}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setLocation(backTo)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button onClick={() => setLocation(`/task/${task.id}/edit`)}>
            <PencilLine className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <TaskDetailHeader task={task} />
        <TaskDetailBody task={task} />
      </div>
    </PageWrapper>
  );
}
