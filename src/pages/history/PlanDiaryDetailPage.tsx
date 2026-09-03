import { useParams } from "wouter";
import { HistoryFormContent } from "./components/HistoryFormContent";

export default function PlanDiaryDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();

  return (
    <HistoryFormContent
      initialTaskId={taskId}
      allowModeToggle={false}
      isPlannedModeDefault={true}
      pageTitle="Ghi nhật ký công việc theo kế hoạch"
      backUrl="/diary/plan"
    />
  );
}
