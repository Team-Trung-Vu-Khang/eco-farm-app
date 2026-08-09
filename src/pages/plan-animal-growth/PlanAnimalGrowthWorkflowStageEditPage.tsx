import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  getStagePayload,
  useAnimalGrowthWorkflowDraftStore,
  type StagePayload,
} from "./hooks/useAnimalGrowthWorkflowDraftStore";

const WORKFLOW_PATH = "/plan-animal-growth/create/workflow";

export default function PlanAnimalGrowthWorkflowStageEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams();
  const nodeId = params.nodeId as string;

  const node = useAnimalGrowthWorkflowDraftStore((state) =>
    state.nodes.find((item) => item.id === nodeId),
  );
  const updateNodePayload = useAnimalGrowthWorkflowDraftStore((state) => state.updateNodePayload);

  const [draft, setDraft] = useState<StagePayload>(() =>
    node ? getStagePayload(node) : { stageName: "", stageDescription: "", duration: "" },
  );

  if (!node || node.data.setupKind !== "stage") {
    return (
      <PageWrapper title="Không tìm thấy giai đoạn" description="">
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Giai đoạn này không còn tồn tại trong workflow.
            <div className="mt-4">
              <Button variant="outline" onClick={() => setLocation(WORKFLOW_PATH)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const handleSave = () => {
    updateNodePayload(nodeId, draft);
    toast({ title: "Đã lưu", description: "Thông tin giai đoạn đã được cập nhật." });
    setLocation(WORKFLOW_PATH);
  };

  return (
    <PageWrapper
      title="Chỉnh sửa giai đoạn"
      description="Tên, thời lượng và mô tả cho giai đoạn này"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-9 px-3" onClick={() => setLocation(WORKFLOW_PATH)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button className="h-9 px-3" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Lưu giai đoạn
          </Button>
        </div>
      }
    >
      <Card className="mx-auto max-w-2xl border-slate-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stage-name">Tên giai đoạn</Label>
              <Input
                id="stage-name"
                value={draft.stageName}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, stageName: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage-duration">Thời lượng</Label>
              <Input
                id="stage-duration"
                value={draft.duration}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, duration: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description">Mô tả giai đoạn</Label>
            <Textarea
              id="stage-description"
              rows={4}
              value={draft.stageDescription}
              onChange={(event) =>
                setDraft((current) => ({ ...current, stageDescription: event.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
