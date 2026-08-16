import PageWrapper from "@/components/PageWrapper";
import usePlanStore from "@/stores/usePlanStore";
import useRegionStore from "@/stores/useRegionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Card,
  CardContent,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Layers, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "wouter";
import * as z from "zod";
import GeographicalSelector from "./components/GeographicalSelector";
import {
  createEmptyPlanDraft,
  createInfoNodeId,
  createNodeId,
  DEFAULT_DRAFT_PLAN_NAME,
  getNextInfoNodePosition,
  PLACEHOLDER_POSITION,
  usePlanWorkflowDraftStore,
  type DiagramInfoRecord,
} from "./hooks/usePlanWorkflowDraftStore";
import type { GeographicalSelection } from "./types";
import { summarizeSelections } from "./utils/location";

const WORKFLOW_PATH = "/plan-growth/create/workflow";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên sơ đồ là bắt buộc" }),
  description: z.string().optional(),
});

export default function PlanGrowthWorkflowInfoFormPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ nodeId?: string }>();
  const nodeId = params.nodeId;
  const isEdit = Boolean(nodeId);

  const { regions } = useRegionStore();
  const infoNodes = usePlanWorkflowDraftStore((state) => state.infoNodes);
  const setInfoNodes = usePlanWorkflowDraftStore((state) => state.setInfoNodes);
  const nodes = usePlanWorkflowDraftStore((state) => state.nodes);
  const addNode = usePlanWorkflowDraftStore((state) => state.addNode);
  const addPlan = usePlanStore((state) => state.addPlan);

  const editingRecord = nodeId
    ? infoNodes.find((item) => item.id === nodeId)
    : undefined;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingRecord?.name ?? "",
      description: editingRecord?.description ?? "",
    },
  });

  const [selections, setSelections] = useState<GeographicalSelection[]>(
    editingRecord?.selections ?? [],
  );
  const [regionsTouched, setRegionsTouched] = useState(false);

  const selectionSummary = useMemo(
    () => summarizeSelections(selections, regions || []),
    [regions, selections],
  );

  if (isEdit && !editingRecord) {
    return (
      <PageWrapper title="Không tìm thấy node quy trình" description="">
        <Card>
          <CardContent className="p-6 text-sm text-slate-600">
            Node thông tin quy trình này không còn tồn tại.
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setLocation(WORKFLOW_PATH)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại workflow
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const handleSave = (values: z.infer<typeof formSchema>) => {
    if (selections.length === 0) {
      setRegionsTouched(true);
      return;
    }

    const isFirstInfoNode = infoNodes.length === 0;

    if (editingRecord) {
      setInfoNodes((prev) =>
        prev.map((item) =>
          item.id === editingRecord.id
            ? {
                ...item,
                name: values.name,
                description: values.description || "",
                selections,
              }
            : item,
        ),
      );
    } else {
      const newRecord: DiagramInfoRecord = {
        id: createInfoNodeId(),
        name: values.name,
        description: values.description || "",
        selections,
        isActive: true,
        position: getNextInfoNodePosition(infoNodes),
      };
      setInfoNodes((prev) => [...prev, newRecord]);

      // First info node in an empty draft seeds the tree with a starter plan
      // node, mirroring the previous dialog-driven flow.
      if (isFirstInfoNode && nodes.length === 0) {
        addPlan(createEmptyPlanDraft(DEFAULT_DRAFT_PLAN_NAME));
        const created = usePlanStore.getState().plans.at(-1);
        if (created) {
          addNode({
            id: createNodeId("plan"),
            type: "workflowCard",
            position: PLACEHOLDER_POSITION,
            data: { setupKind: "plan", planId: created.id },
          });
        }
      }
    }

    toast({
      title: "Thành công",
      description: editingRecord
        ? "Đã cập nhật node thông tin quy trình"
        : "Đã thêm node thông tin quy trình",
    });
    setLocation(WORKFLOW_PATH);
  };

  return (
    <PageWrapper
      title={isEdit ? "Chỉnh sửa sơ đồ quy trình" : "Tạo sơ đồ quy trình"}
      description="Tên, mô tả và vùng canh tác áp dụng cho quy trình này"
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(WORKFLOW_PATH)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button className="h-9 px-3" onClick={form.handleSubmit(handleSave)}>
            <Save className="mr-2 h-4 w-4" />
            Lưu sơ đồ
          </Button>
        </div>
      }
    >
      <Card className="mx-auto max-w-3xl border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên sơ đồ
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Sơ đồ canh tác lúa vụ Hè Thu"
                        data-testid="input-diagram-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả sơ bộ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả sơ bộ về sơ đồ quy trình"
                        rows={3}
                        data-testid="input-diagram-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Vùng canh tác <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
                    Chọn 1 khu vực/lô từ sơ đồ ban đầu
                  </span>
                </div>
                <GeographicalSelector
                  regions={regions || []}
                  enterpriseId=""
                  existingSelections={selections}
                  onConfirm={(newSelections) => {
                    setSelections(newSelections);
                    setRegionsTouched(true);
                  }}
                />
                {regionsTouched && selections.length === 0 && (
                  <p className="text-xs text-destructive">
                    Vui lòng chọn ít nhất một vùng canh tác
                  </p>
                )}

                {selectionSummary.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
                    <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      Phạm vi đã chọn
                    </div>
                    <div className="space-y-3">
                      {selectionSummary.map((group) => (
                        <div key={group.regionId} className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                            {group.regionName}
                          </div>
                          <div className="flex flex-wrap gap-1.5 pl-2.5">
                            {group.items.map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className={cn(
                                  "text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm",
                                  item.type === "region"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : item.type === "area"
                                      ? "bg-blue-50 text-blue-700 border-blue-100"
                                      : "bg-white text-slate-600 border-slate-200",
                                )}
                              >
                                <span className="opacity-70 mr-1 uppercase text-[8px] font-black">
                                  {item.type === "region"
                                    ? "Vùng"
                                    : item.type === "area"
                                      ? "Khu"
                                      : "Lô"}
                                </span>
                                {item.name}
                                {item.parentName && (
                                  <span className="ml-1 opacity-50 font-normal italic">
                                    ({item.parentName})
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
