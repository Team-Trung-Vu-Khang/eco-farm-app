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
  getDetailPayload,
  useAquacultureGrowthWorkflowDraftStore,
  type DetailPayload,
} from "./hooks/useAquacultureGrowthWorkflowDraftStore";

const WORKFLOW_PATH = "/plan-aquaculture-growth/create/workflow";

export default function PlanAquacultureGrowthWorkflowDetailEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams();
  const nodeId = params.nodeId as string;

  const node = useAquacultureGrowthWorkflowDraftStore((state) =>
    state.nodes.find((item) => item.id === nodeId),
  );
  const updateNodePayload = useAquacultureGrowthWorkflowDraftStore((state) => state.updateNodePayload);

  const [draft, setDraft] = useState<DetailPayload>(() =>
    node
      ? getDetailPayload(node)
      : {
          taskName: "",
          taskDescription: "",
          labor: "",
          materialCategory: "",
          materialType: "",
          materialName: "",
          quantity: "",
          unit: "",
        },
  );

  if (!node || node.data.setupKind !== "detail") {
    return (
      <PageWrapper title="Không tìm thấy chi tiết giai đoạn" description="">
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Chi tiết giai đoạn này không còn tồn tại trong workflow.
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
    toast({ title: "Đã lưu", description: "Chi tiết giai đoạn đã được cập nhật." });
    setLocation(WORKFLOW_PATH);
  };

  return (
    <PageWrapper
      title="Chỉnh sửa chi tiết giai đoạn"
      description="Công việc và vật tư cho giai đoạn này"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-9 px-3" onClick={() => setLocation(WORKFLOW_PATH)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button className="h-9 px-3" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Lưu chi tiết
          </Button>
        </div>
      }
    >
      <Card className="mx-auto max-w-2xl border-slate-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-name">Tên công việc</Label>
              <Input
                id="task-name"
                value={draft.taskName}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, taskName: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="labor">Nhân lực</Label>
              <Input
                id="labor"
                value={draft.labor}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, labor: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Mô tả công việc</Label>
            <Textarea
              id="task-description"
              rows={3}
              value={draft.taskDescription}
              onChange={(event) =>
                setDraft((current) => ({ ...current, taskDescription: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material-category">Danh mục vật tư</Label>
              <Input
                id="material-category"
                value={draft.materialCategory}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, materialCategory: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-type">Loại vật tư</Label>
              <Input
                id="material-type"
                value={draft.materialType}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, materialType: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-name">Tên vật tư</Label>
            <Input
              id="material-name"
              value={draft.materialName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, materialName: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="material-quantity">Số lượng</Label>
              <Input
                id="material-quantity"
                value={draft.quantity}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, quantity: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material-unit">Đơn vị</Label>
              <Input
                id="material-unit"
                value={draft.unit}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, unit: event.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
