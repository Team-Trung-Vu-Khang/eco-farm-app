import PageWrapper from "@/components/PageWrapper";
import {
  useCultivationZones,
  farmGrowthCycleSeasonApi,
  systemGrowthCycleSeasonApi,
} from "@/features/farm";
import {
  useFarmWorkflowById,
  useFarmWorkflowMutations,
} from "@/features/farm-workflow/hooks";
import type { FarmWorkflowScopeRequest } from "@/features/farm-workflow/types/farm-workflow.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
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
import { ArrowLeft, Calendar, Layers, Save, Sprout } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "wouter";
import * as z from "zod";
import GeographicalSelector from "./components/GeographicalSelector";
import GrowthCycleSelector from "./components/GrowthCycleSelector";
import {
  createEmptyPlanDraft,
  createNodeId,
  DEFAULT_DRAFT_PLAN_NAME,
  getNextInfoNodePosition,
  PLACEHOLDER_POSITION,
  usePlanWorkflowDraftStore,
  type DiagramInfoRecord,
} from "./hooks/usePlanWorkflowDraftStore";
import type { GeographicalSelection, GrowthCycleSelection, Plan } from "./types";
import type { GrowthCycle } from "../growth-cycle/types/types";
import {
  getFallbackPlans,
  mapCultivationZonesToRegionTree,
  mapWorkflowResponseToInfoRecord,
  upsertFallbackPlan,
} from "./utils/api-mappers";
import { summarizeSelections } from "./utils/location";

const WORKFLOW_PATH = "/plan-growth/create/workflow";
const WORKFLOW_DOMAIN_CODE = "CROP" as const;

function toWorkflowScopes(
  selections: GeographicalSelection[],
): FarmWorkflowScopeRequest[] {
  return selections.map((selection) => ({
    scopeType:
      selection.type === "plot"
        ? "PLOT"
        : selection.type === "area"
          ? "AREA"
          : "REGION",
    scopeId: Number(selection.plotId || selection.areaId || selection.regionId),
  }));
}

function toDurationDays(years: string, months: string, days: string) {
  const totalDays =
    (Number(years) || 0) * 365 +
    (Number(months) || 0) * 30 +
    (Number(days) || 0);
  return Math.max(1, totalDays);
}

function mapSeasonsToGrowthCycles(seasons: any[]): GrowthCycle[] {
  return seasons.map((season) => ({
    id: String(season.id),
    name: season.name || season.code || `Season #${season.id}`,
    cycleType: "plant",
    scope: "crop",
    scopeNames: [],
    cropId: String(season.productionSubject?.id ?? ""),
    cropName: season.productionSubject?.name || "",
    totalDays: (season.stages || []).reduce(
      (total: number, stage: any) => total + (Number(stage.durationDays) || 0),
      0,
    ),
    numStages: (season.stages || []).length,
    stages: (season.stages || []).map((stage: any, index: number) => ({
      id: String(stage.id ?? `${season.id}-${index}`),
      name: stage.name || `Giai đoạn ${index + 1}`,
      duration: Number(stage.durationDays) || 0,
      usePdf: false,
      content: stage.description || "",
    })),
    createdAt: 0,
    updatedAt: 0,
  }));
}

// Info nodes created before the API integration carry a local
// `info-<timestamp>-<rand>` id; only numeric ids are real backend workflow ids.
function isPersistedWorkflowId(id: string) {
  return /^\d+$/.test(id);
}

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

  const { items: cultivationZones } = useCultivationZones({
    params: { domainCode: WORKFLOW_DOMAIN_CODE, page: 0, size: 100 },
  });
  const [seasonSearch, setSeasonSearch] = useState("");
  const seasonQueryParams = {
    domainCode: WORKFLOW_DOMAIN_CODE,
    keyword: seasonSearch.trim() || undefined,
    size: 20,
  };
  const userSeasonsQuery = useInfiniteQuery({
    queryKey: ["workflow-seasons", "user", seasonQueryParams],
    queryFn: ({ pageParam }) =>
      farmGrowthCycleSeasonApi.list({ ...seasonQueryParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) =>
      lastPage.last ? undefined : Number(lastPage.page) + 1,
  });
  const systemSeasonsQuery = useInfiniteQuery({
    queryKey: ["workflow-seasons", "system", seasonQueryParams],
    queryFn: ({ pageParam }) =>
      systemGrowthCycleSeasonApi.list({ ...seasonQueryParams, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) =>
      lastPage.last ? undefined : Number(lastPage.page) + 1,
  });
  const growthCycles = useMemo(() => {
    const byId = new Map<number, any>();
    [
      ...systemSeasonsQuery.data?.pages.flatMap((page: any) => page.content || []) || [],
      ...userSeasonsQuery.data?.pages.flatMap((page: any) => page.content || []) || [],
    ].forEach((season) => {
      if (season?.id != null) byId.set(Number(season.id), season);
    });
    return mapSeasonsToGrowthCycles(Array.from(byId.values()));
  }, [systemSeasonsQuery.data, userSeasonsQuery.data]);
  const seasonsLoading =
    userSeasonsQuery.isLoading ||
    systemSeasonsQuery.isLoading ||
    userSeasonsQuery.isFetchingNextPage ||
    systemSeasonsQuery.isFetchingNextPage;
  const seasonsHaveMore =
    Boolean(userSeasonsQuery.hasNextPage) || Boolean(systemSeasonsQuery.hasNextPage);
  const loadMoreSeasons = () => {
    if (userSeasonsQuery.hasNextPage && !userSeasonsQuery.isFetchingNextPage) {
      void userSeasonsQuery.fetchNextPage();
    }
    if (systemSeasonsQuery.hasNextPage && !systemSeasonsQuery.isFetchingNextPage) {
      void systemSeasonsQuery.fetchNextPage();
    }
  };
  const regions = useMemo(
    () => mapCultivationZonesToRegionTree(cultivationZones),
    [cultivationZones],
  );
  const infoNodes = usePlanWorkflowDraftStore((state) => state.infoNodes);
  const setInfoNodes = usePlanWorkflowDraftStore((state) => state.setInfoNodes);
  const nodes = usePlanWorkflowDraftStore((state) => state.nodes);
  const addNode = usePlanWorkflowDraftStore((state) => state.addNode);
  const { createWorkflow, updateWorkflow } = useFarmWorkflowMutations();

  const localRecord = nodeId
    ? infoNodes.find((item) => item.id === nodeId)
    : undefined;
  // Only persisted (numeric-id) workflows exist on the backend — local
  // draft-only nodes fall back to the in-memory record below.
  const isPersistedNodeId = nodeId ? isPersistedWorkflowId(nodeId) : false;
  const { data: workflowDetail, isLoading: isLoadingWorkflowDetail } =
    useFarmWorkflowById(nodeId ?? "", {
      enabled: isEdit && isPersistedNodeId,
    });

  const editingRecord: DiagramInfoRecord | undefined = workflowDetail
    ? mapWorkflowResponseToInfoRecord(
        workflowDetail,
        localRecord?.position ?? getNextInfoNodePosition(infoNodes),
      )
    : localRecord;

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
  const [plannedDurationYears, setPlannedDurationYears] = useState(
    editingRecord?.plannedDurationYears ?? "",
  );
  const [plannedDurationMonths, setPlannedDurationMonths] = useState(
    editingRecord?.plannedDurationMonths ?? "",
  );
  const [plannedDurationDays, setPlannedDurationDays] = useState(
    editingRecord?.plannedDurationDays ?? "",
  );
  // Not part of the backend workflow scope response — only the local draft
  // record (`localRecord`) carries it, so fall back to that rather than
  // `editingRecord` (which may be the freshly API-mapped record).
  const [growthCycleSelections, setGrowthCycleSelections] = useState<
    GrowthCycleSelection[]
  >(
    localRecord?.growthCycleSelections ??
      (editingRecord?.seasonIds ?? []).map((seasonId) => ({
        id: `season-${seasonId}`,
        type: "cycle",
        cycleId: String(seasonId),
      })),
  );
  // Plan Growth keeps its existing UI. Existing API-linked seasons are only
  // carried through edit/update; no new selector is introduced here.
  const [seasonIds, setSeasonIds] = useState<number[]>(
    editingRecord?.seasonIds ?? [],
  );

  const selectionSummary = useMemo(
    () => summarizeSelections(selections, regions || []),
    [regions, selections],
  );

  const growthCycleSummary = useMemo(() => {
    const cycleIds = Array.from(
      new Set(growthCycleSelections.map((s) => s.cycleId)),
    );

    return cycleIds
      .map((cycleId) => {
        const cycle = growthCycles.find((c) => c.id === cycleId);
        if (!cycle) return null;
        const selectionsForCycle = growthCycleSelections.filter(
          (s) => s.cycleId === cycleId,
        );

        if (selectionsForCycle.some((s) => s.type === "cycle")) {
          return { cycleName: cycle.name, items: ["Toàn bộ chu kỳ"] };
        }

        const stageNames = selectionsForCycle
          .map((s) => cycle.stages.find((st) => st.id === s.stageId)?.name)
          .filter((name): name is string => Boolean(name));
        if (stageNames.length === 0) return null;

        return { cycleName: cycle.name, items: stageNames };
      })
      .filter(
        (group): group is { cycleName: string; items: string[] } =>
          group !== null,
      );
  }, [growthCycleSelections, growthCycles]);

  // `useForm`/`useState` above only see `editingRecord` at first render —
  // the API detail resolves later, so re-sync once it lands.
  useEffect(() => {
    if (!workflowDetail) return;
    const record = mapWorkflowResponseToInfoRecord(
      workflowDetail,
      localRecord?.position ?? getNextInfoNodePosition(infoNodes),
    );
    form.reset({ name: record.name, description: record.description });
    setSelections(record.selections);
    setPlannedDurationYears(record.plannedDurationYears);
    setPlannedDurationMonths(record.plannedDurationMonths);
    setPlannedDurationDays(record.plannedDurationDays);
    setSeasonIds(record.seasonIds ?? []);
    setGrowthCycleSelections(
      (record.seasonIds ?? []).map((seasonId) => ({
        id: `season-${seasonId}`,
        type: "cycle",
        cycleId: String(seasonId),
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowDetail]);

  if (
    isEdit &&
    !editingRecord &&
    !(isPersistedNodeId && isLoadingWorkflowDetail)
  ) {
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

  const isSaving = createWorkflow.isPending || updateWorkflow.isPending;

  const handleSave = async (values: z.infer<typeof formSchema>) => {
    if (selections.length === 0) {
      setRegionsTouched(true);
      return;
    }

    const isFirstInfoNode = infoNodes.length === 0;
    const payload = {
      domainCode: WORKFLOW_DOMAIN_CODE,
      name: values.name,
      description: values.description || undefined,
      durationDays: toDurationDays(
        plannedDurationYears,
        plannedDurationMonths,
        plannedDurationDays,
      ),
      scopes: toWorkflowScopes(selections),
      seasonIds,
      status: "ACTIVE" as const,
    };

    try {
      const record: DiagramInfoRecord =
        editingRecord && isPersistedWorkflowId(editingRecord.id)
          ? {
              ...editingRecord,
              name: values.name,
              description: values.description || "",
              selections,
              plannedDurationYears,
              plannedDurationMonths,
              plannedDurationDays,
              growthCycleSelections,
              seasonIds,
            }
          : {
              id: "",
              name: values.name,
              description: values.description || "",
              selections,
              plannedDurationYears,
              plannedDurationMonths,
              plannedDurationDays,
              growthCycleSelections,
              seasonIds,
              isActive: true,
              position:
                editingRecord?.position ?? getNextInfoNodePosition(infoNodes),
            };

      if (editingRecord && isPersistedWorkflowId(editingRecord.id)) {
        await updateWorkflow.mutateAsync({
          id: editingRecord.id,
          payload,
        });
        setInfoNodes((prev) =>
          prev.map((item) => (item.id === record.id ? record : item)),
        );
      } else {
        const created = await createWorkflow.mutateAsync(payload);
        record.id = String(created.id);
        setInfoNodes((prev) => [
          ...prev.filter((item) => item.id !== editingRecord?.id),
          record,
        ]);
        // Mark this freshly-created workflow as the active draft — otherwise
        // navigating to its numeric-id canvas URL right after would look
        // like opening a different (persisted) workflow, and the canvas
        // page's API-detail fetch would wipe the starter plan node just
        // added below.
        usePlanWorkflowDraftStore.setState({ activeWorkflowId: record.id });

        // First info node in an empty draft seeds the tree with a starter plan
        // node, mirroring the previous dialog-driven flow.
        if (isFirstInfoNode && nodes.length === 0) {
          const nextPlanId =
            getFallbackPlans().reduce(
              (maxId, item) => Math.max(maxId, item.id),
              0,
            ) + 1;
          const createdPlan = {
            ...createEmptyPlanDraft(DEFAULT_DRAFT_PLAN_NAME),
            id: nextPlanId,
            createdAt: new Date().toISOString().split("T")[0],
          } as Plan;
          upsertFallbackPlan(createdPlan);
          addNode({
            id: createNodeId("plan"),
            type: "workflowCard",
            position: PLACEHOLDER_POSITION,
            data: { setupKind: "plan", planId: createdPlan.id },
          });
        }
      }

      toast({
        title: "Thành công",
        description: editingRecord
          ? "Đã cập nhật node thông tin quy trình"
          : "Đã thêm node thông tin quy trình",
      });
      // Route with the persisted workflow id so the canvas page's URL keeps
      // reflecting which workflow is open (bookmarkable/reload-safe).
      setLocation(`${WORKFLOW_PATH}/${record.id}`);
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu sơ đồ quy trình",
      });
    }
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
          <Button
            className="h-9 px-3"
            disabled={isSaving}
            onClick={form.handleSubmit(handleSave)}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Đang lưu..." : "Lưu sơ đồ"}
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

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                  Thời gian dự kiến
                </label>
                <div className="flex items-center gap-4 rounded-lg border px-4 shadow-sm">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={plannedDurationYears}
                      onChange={(e) => setPlannedDurationYears(e.target.value)}
                      placeholder="0"
                      className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
                    />
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      năm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={plannedDurationMonths}
                      onChange={(e) => setPlannedDurationMonths(e.target.value)}
                      placeholder="0"
                      className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
                    />
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      tháng
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={plannedDurationDays}
                      onChange={(e) => setPlannedDurationDays(e.target.value)}
                      placeholder="0"
                      className="w-16 h-9 border-0 bg-transparent px-0 text-center text-base shadow-none focus-visible:ring-0"
                    />
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                      ngày
                    </span>
                  </div>
                </div>
              </div>

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

              {selections.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                    Giai đoạn sinh trưởng
                  </label>
                  <GrowthCycleSelector
                    growthCycles={growthCycles}
                    existingSelections={growthCycleSelections}
                    onSearchChange={setSeasonSearch}
                    isLoading={seasonsLoading}
                    hasMore={seasonsHaveMore}
                    onLoadMore={loadMoreSeasons}
                    onConfirm={(nextSelections) => {
                      setGrowthCycleSelections(nextSelections);
                      setSeasonIds(
                        Array.from(
                          new Set(
                            nextSelections.map((selection) =>
                              Number(selection.cycleId),
                            ),
                          ),
                        ).filter((id) => Number.isFinite(id)),
                      );
                    }}
                  />

                  {growthCycleSummary.length > 0 && (
                    <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
                      <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                        <Sprout className="w-3 h-3" />
                        Giai đoạn sinh trưởng đã chọn
                      </div>
                      <div className="space-y-3">
                        {growthCycleSummary.map((group) => (
                          <div key={group.cycleName} className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                              <div className="w-1 h-1 rounded-full bg-emerald-500" />
                              {group.cycleName}
                            </div>
                            <div className="flex flex-wrap gap-1.5 pl-2.5">
                              {group.items.map((label, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm bg-emerald-100 text-emerald-800"
                                >
                                  {label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
