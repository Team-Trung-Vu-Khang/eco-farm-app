import PageWrapper from "@/components/PageWrapper";
import type { FarmTaskResponse, FarmTaskStatus } from "@/features/farm-task";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  MultiSelect,
  RemoteAutoCompleteSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Apple,
  Bug,
  Calendar,
  ChevronLeft,
  ClipboardList,
  ExternalLink,
  Image as ImageIcon,
  Layers,
  Link2,
  MapPin,
  PackageOpen,
  Plus,
  RefreshCw,
  Sprout,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { GeographicalSelectionCard } from "./components/GeographicalSelectionCard";
import { HarvestGeographicalSelectorDialog } from "./components/HarvestGeographicalSelectorDialog";

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface HarvestDetail {
  id: string;
  targetId: string;
  targetLabel: string;
  codeName: string;
  quantity: string;
  unitBase: string;
}

interface ActualSupply {
  lineId: number;
  actualQuantity: string;
}

interface LogFormData {
  completionPercent: string;
  status: FarmTaskStatus;
  description: string;
  images: File[];
  // harvest
  harvestScope: "region" | "crop";
  harvestTargets: string[];
  harvestDetails: HarvestDetail[];
  harvestFiles: File[];
  // supply actuals
  supplyActuals: ActualSupply[];
}

const WORK_TYPE_OPTIONS = [
  {
    value: "cultivation",
    label: "Canh tác",
    icon: Layers,
    activeClass: "border-blue-500 bg-blue-50/50 text-blue-700",
    iconClass: "bg-blue-500 text-white",
  },
  {
    value: "facility-upgrade",
    label: "Nâng cấp CSVC",
    icon: Wrench,
    activeClass: "border-slate-500 bg-slate-50/80 text-slate-700",
    iconClass: "bg-slate-700 text-white",
  },
  {
    value: "treatment",
    label: "Điều trị",
    icon: Bug,
    activeClass: "border-red-500 bg-red-50/50 text-red-700",
    iconClass: "bg-red-500 text-white",
  },
  {
    value: "amendment",
    label: "Cải tạo đất",
    icon: Sprout,
    activeClass: "border-green-500 bg-green-50/50 text-green-700",
    iconClass: "bg-green-500 text-white",
  },
  {
    value: "harvest",
    label: "Thu hoạch",
    icon: Apple,
    activeClass: "border-orange-500 bg-orange-50/50 text-orange-700",
    iconClass: "bg-orange-500 text-white",
  },
] as const;

function getWorkflowLabel(domainCode?: string) {
  if (domainCode === "LIVESTOCK") return "Vụ nuôi";
  if (domainCode === "AQUACULTURE") return "Vụ nuôi thủy sản";
  return "Vụ mùa";
}

function getWorkflowSubtitle(domainCode?: string) {
  if (domainCode === "LIVESTOCK" || domainCode === "AQUACULTURE")
    return "Chăn nuôi và nuôi trồng thủy sản";
  return "Vùng trồng";
}

function getWorkTypeFromTask(task: FarmTaskResponse): string {
  const catName = (task.taskCategory?.name ?? "").toLowerCase();
  const catCode = (task.taskCategory?.code ?? "").toLowerCase();
  if (
    catName.includes("harvest") ||
    catName.includes("thu hoạch") ||
    catCode.includes("thu-hoach")
  )
    return "harvest";
  if (
    catName.includes("điều trị") ||
    catName.includes("treatment") ||
    catCode.includes("dieu-tri")
  )
    return "treatment";
  if (
    catName.includes("cải tạo") ||
    catName.includes("amendment") ||
    catCode.includes("cai-tao")
  )
    return "amendment";
  if (
    catName.includes("nâng cấp") ||
    catName.includes("facility") ||
    catCode.includes("facility")
  )
    return "facility-upgrade";
  return "cultivation";
}

import { MOCK_TASKS } from "./mock/history.mock";

const MOCK_HARVEST_OPTIONS = [
  {
    label: "Lô 01 - Thửa lúa A1",
    value: "plot-101",
    keywords: ["LO-01", "A1"],
  },
  {
    label: "Lô 02 - Thửa lúa A2",
    value: "plot-102",
    keywords: ["LO-02", "A2"],
  },
  { label: "Khu B2 - Rau màu Hè Thu", value: "area-12", keywords: ["KHU-B2"] },
  {
    label: "Vùng Canh Tác C - Cây ăn trái",
    value: "region-3",
    keywords: ["VCC"],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getScopeDisplay(task: FarmTaskResponse) {
  const parts: string[] = [];
  if (task.region?.name) parts.push(task.region.name);
  if (task.area?.name) parts.push(task.area.name);
  if (task.plot?.name) parts.push(task.plot.name);
  return parts.join(" › ") || "—";
}

function createHarvestDetail(targetId: string, label: string): HarvestDetail {
  return {
    id: `h-${targetId}`,
    targetId,
    targetLabel: label,
    codeName: label,
    quantity: "",
    unitBase: "",
  };
}

const UNIT_OPTIONS = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Tấn", value: "tấn" },
  { label: "Cái / Chiếc", value: "cái" },
  { label: "Lít", value: "lít" },
  { label: "Mét vuông (m²)", value: "m²" },
  { label: "Hecta (ha)", value: "ha" },
];

const STATUS_OPTIONS: { label: string; value: FarmTaskStatus }[] = [
  { label: "Chờ thực hiện", value: "TODO" },
  { label: "Đang thực hiện", value: "DOING" },
  { label: "Hoàn thành", value: "DONE" },
  { label: "Đã hủy", value: "CANCELLED" },
];

function isHarvestTask(task: FarmTaskResponse): boolean {
  const catName = (task.taskCategory?.name ?? "").toLowerCase();
  return (
    catName.includes("harvest") ||
    catName.includes("thu hoạch") ||
    catName.includes("thu-hoạch")
  );
}

// ─── Info Block ───────────────────────────────────────────────────────────────

function InfoBlock({
  task,
  formData,
  setFormData,
}: {
  task: FarmTaskResponse;
  formData: LogFormData;
  setFormData: React.Dispatch<React.SetStateAction<LogFormData>>;
}) {
  const domainCode = task.domainCode ?? "CROP";
  const workType = getWorkTypeFromTask(task);

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-green-600" />
          Thông tin cập nhật
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Vụ mùa / Quy trình */}
        <div className="space-y-2">
          <Label required>{getWorkflowLabel(domainCode)}</Label>
          <RemoteAutoCompleteSelect
            options={[
              {
                label: task.workflow?.name || "Chưa chọn",
                value: String(task.workflow?.id || "1"),
              },
            ]}
            value={String(task.workflow?.id || "1")}
            onChange={() => {}}
            onSearch={(_query) => {
              // API search callback placeholder for future backend API integration
            }}
            placeholder={task.workflow?.name || "Chưa chọn"}
            searchPlaceholder={`Tìm ${getWorkflowLabel(domainCode).toLowerCase()}...`}
            disabled
          />
          <p className="text-xs text-slate-500">
            {getWorkflowSubtitle(domainCode)} đang được áp dụng cho nhật ký này.
          </p>
        </div>

        {/* Kế hoạch & Công việc Comboboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required>Kế hoạch</Label>
            <RemoteAutoCompleteSelect
              options={[
                {
                  label: task.plan
                    ? `${task.plan.code} - ${task.plan.name}`
                    : "Chưa có kế hoạch",
                  value: String(task.plan?.id || "20"),
                },
              ]}
              value={String(task.plan?.id || "20")}
              onChange={() => {}}
              onSearch={(_query) => {}}
              placeholder={
                task.plan
                  ? `${task.plan.code} - ${task.plan.name}`
                  : "Chưa có kế hoạch"
              }
              searchPlaceholder="Tìm kế hoạch..."
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label required>Công việc</Label>
            <RemoteAutoCompleteSelect
              options={[
                {
                  label: task.code ? `${task.code} - ${task.name}` : task.name,
                  value: String(task.id),
                },
              ]}
              value={String(task.id)}
              onChange={() => {}}
              onSearch={(_query) => {}}
              placeholder={
                task.code ? `${task.code} - ${task.name}` : task.name
              }
              searchPlaceholder="Tìm công việc..."
              disabled
            />
          </div>
        </div>

        {/* 3 mini cards block */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Card 1: Vụ mùa */}
          {task.workflow ? (
            <a
              href={`/plan-growth/create/workflow/${task.workflow.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {getWorkflowLabel(domainCode)}
                </p>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate group-hover:text-green-700">
                {task.workflow.name}
              </p>
            </a>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {getWorkflowLabel(domainCode)}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                Chưa chọn
              </p>
            </div>
          )}

          {/* Card 2: Kế hoạch */}
          {task.plan ? (
            <a
              href={`/plan-growth/${task.plan.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Kế hoạch
                </p>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate group-hover:text-green-700">
                {`${task.plan.code} - ${task.plan.name}`}
              </p>
            </a>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Kế hoạch
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                Chưa có kế hoạch
              </p>
            </div>
          )}

          {/* Card 3: Công việc */}
          {task ? (
            <a
              href={`/diary/plan/${task.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Công việc
                </p>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-green-600 transition-colors" />
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate group-hover:text-green-700">
                {task.code ? `${task.code} - ${task.name}` : task.name}
              </p>
            </a>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Công việc
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                —
              </p>
            </div>
          )}
        </div>

        {/* Loại công việc */}
        <div className="space-y-3">
          <Label required>Loại công việc</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {WORK_TYPE_OPTIONS.map((option) => {
              const isActive = workType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled
                  className={`cursor-not-allowed rounded-2xl border-2 px-3 py-4 transition-all flex flex-col items-center text-center gap-1.5 group ${
                    isActive
                      ? option.activeClass
                      : "border-slate-100 bg-white opacity-40 text-slate-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${
                      isActive ? option.iconClass : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <option.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ngày bắt đầu & kết thúc */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label required>Ngày bắt đầu</Label>
            <div className="relative">
              <Input
                type="date"
                disabled
                clearable={false}
                className="h-11 bg-slate-50 border-slate-200 pl-10 cursor-not-allowed text-slate-700 font-medium"
                value={task.startDate || ""}
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ngày kết thúc</Label>
            <div className="relative">
              <Input
                type="date"
                disabled
                clearable={false}
                className="h-11 bg-slate-50 border-slate-200 pl-10 cursor-not-allowed text-slate-700 font-medium"
                value={task.endDate || ""}
              />
              <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="space-y-2">
          <Label>Mô tả chi tiết</Label>
          <Textarea
            placeholder="Nhập mô tả hoặc ghi chú..."
            rows={4}
            className="bg-white border-slate-200 focus:ring-green-500/20"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Harvest Block ────────────────────────────────────────────────────────────

function HarvestBlock({
  formData,
  setFormData,
  harvestOptions,
  onOpenGeoDialog,
}: {
  formData: LogFormData;
  setFormData: React.Dispatch<React.SetStateAction<LogFormData>>;
  harvestOptions: { label: string; value: string; keywords?: string[] }[];
  onOpenGeoDialog?: (detailId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncDetails = (nextTargets: string[]) => {
    const byValue = new Map(harvestOptions.map((o) => [o.value, o]));
    setFormData((prev) => {
      const existing = new Map(prev.harvestDetails.map((d) => [d.targetId, d]));
      const nextDetails = nextTargets.map((id) => {
        const old = existing.get(id);
        const opt = byValue.get(id);
        if (old) return { ...old, targetLabel: opt?.label ?? old.targetLabel };
        return createHarvestDetail(id, opt?.label ?? id);
      });
      return {
        ...prev,
        harvestTargets: nextTargets,
        harvestDetails: nextDetails,
      };
    });
  };

  const scopeLabel =
    formData.harvestScope === "region" ? "Vùng canh tác" : "Cây canh tác";

  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Apple className="w-4 h-4 text-orange-500" />
          Thu hoạch
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-5">
        {/* Toggle */}
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Đối tượng thu hoạch
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["region", "crop"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    harvestScope: s,
                    harvestTargets: [],
                    harvestDetails: [],
                  }))
                }
                className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                  formData.harvestScope === s
                    ? "border-orange-400 bg-white text-orange-700 shadow-sm"
                    : "border-orange-100 bg-orange-50/40 text-slate-600"
                }`}
              >
                {s === "region" ? "Vùng canh tác" : "Cây canh tác"}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-select or Dialog trigger */}
        {formData.harvestScope === "region" ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenGeoDialog?.("")}
            className="w-full h-11 border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-400 text-orange-700 font-bold gap-2 transition-all rounded-xl shadow-sm cursor-pointer text-xs justify-center"
          >
            <MapPin className="w-4 h-4 text-orange-500" />
            <span>
              {formData.harvestDetails.length > 0
                ? `Đã chọn ${formData.harvestDetails.length} đơn vị địa lý (Bấm để thay đổi / chọn thêm)`
                : "Chọn các vùng / khu vực / lô địa lý thu hoạch..."}
            </span>
          </Button>
        ) : (
          <MultiSelect
            options={harvestOptions}
            value={formData.harvestTargets}
            onChange={syncDetails}
            placeholder={`Chọn ${scopeLabel.toLowerCase()}`}
            searchPlaceholder={`Tìm ${scopeLabel.toLowerCase()}`}
            emptyText="Không tìm thấy mục phù hợp."
            clearable
          />
        )}

        {/* Upload */}
        <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/30 p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.txt"
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) {
                setFormData((prev) => ({
                  ...prev,
                  harvestFiles: [
                    ...prev.harvestFiles,
                    ...Array.from(e.target.files!),
                  ],
                }));
              }
              e.target.value = "";
            }}
          />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Upload danh sách
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã cây / vùng — Sản lượng — Đơn vị cơ bản
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-orange-200 text-orange-700 hover:bg-orange-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Tải lên
            </Button>
          </div>
          {formData.harvestFiles.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {formData.harvestFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-3 py-1.5 text-xs"
                >
                  <span className="truncate font-medium text-slate-700">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        harvestFiles: prev.harvestFiles.filter(
                          (_, idx) => idx !== i,
                        ),
                      }))
                    }
                    className="text-slate-300 hover:text-red-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Per-item detail table */}
        {formData.harvestTargets.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Chi tiết thu hoạch
              </p>
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                {formData.harvestTargets.length} mục
              </Badge>
            </div>
            {formData.harvestDetails.map((detail, index) => (
              <div
                key={detail.id}
                className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm space-y-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {detail.targetLabel}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formData.harvestScope === "region" ? "Vùng" : "Cây"} #
                      {index + 1}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextTargets = formData.harvestTargets.filter(
                        (id) => id !== detail.targetId,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        harvestTargets: nextTargets,
                        harvestDetails: prev.harvestDetails.filter(
                          (d) => d.targetId !== detail.targetId,
                        ),
                      }));
                    }}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-500">
                    {formData.harvestScope === "region"
                      ? "Vùng canh tác địa lý"
                      : "Mã cây / giống cây"}
                  </Label>

                  {formData.harvestScope === "region" ? (
                    detail.codeName ? (
                      /* UI sau khi chọn vùng địa lý (kiểu SelectionCard phân cấp) */
                      <GeographicalSelectionCard
                        codeName={detail.codeName}
                        onChangeLocation={() => onOpenGeoDialog?.(detail.id)}
                        onRemove={() => {
                          setFormData((prev) => ({
                            ...prev,
                            harvestDetails: prev.harvestDetails.map((d) =>
                              d.id === detail.id ? { ...d, codeName: "" } : d,
                            ),
                          }));
                        }}
                      />
                    ) : (
                      /* UI khi chưa có dữ liệu (dạng nút mẫu GeographicalSelector) */
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenGeoDialog?.(detail.id)}
                        className="w-full h-11 border-2 border-dashed border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-400 text-orange-700 font-bold gap-2 transition-all rounded-xl shadow-sm cursor-pointer text-xs"
                      >
                        <Plus className="w-4 h-4 text-orange-500" />
                        Chọn vùng canh tác
                      </Button>
                    )
                  ) : (
                    /* Chọn theo cây -> giữ input gõ mã cây */
                    <Input
                      disabled
                      clearable={false}
                      className="h-10 bg-white border-slate-200 text-sm"
                      placeholder="Nhập mã cây / tên cây..."
                      value={detail.codeName}
                      onChange={(e) => {
                        const next = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          harvestDetails: prev.harvestDetails.map((d) =>
                            d.id === detail.id ? { ...d, codeName: next } : d,
                          ),
                        }));
                      }}
                    />
                  )}
                </div>

                <div className="grid grid-cols-12 gap-3">
                  <div className="space-y-1.5 md:col-span-8">
                    <Label className="text-xs font-semibold text-slate-500">
                      Sản lượng
                    </Label>
                    <Input
                      type="number"
                      className="h-10 bg-white border-slate-200 text-sm"
                      value={detail.quantity}
                      onChange={(e) => {
                        const next = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          harvestDetails: prev.harvestDetails.map((d) =>
                            d.id === detail.id ? { ...d, quantity: next } : d,
                          ),
                        }));
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-4">
                    <Label className="text-xs font-semibold text-slate-500">
                      Đơn vị cơ bản
                    </Label>
                    <Select
                      value={detail.unitBase}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          harvestDetails: prev.harvestDetails.map((d) =>
                            d.id === detail.id ? { ...d, unitBase: value } : d,
                          ),
                        }));
                      }}
                    >
                      <SelectTrigger className="h-10 bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map((u) => (
                          <SelectItem key={u.value} value={u.value}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-6 text-sm text-slate-500">
            Chưa chọn đối tượng thu hoạch.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const logFormSchema = z.object({
  completionPercent: z
    .string()
    .min(1, "Vui lòng nhập % hoàn thành")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "% Hoàn thành phải nằm trong khoảng từ 0 đến 100" },
    ),
  status: z.string().min(1, "Vui lòng chọn trạng thái"),
});

export default function PlanDiaryDetailPage() {
  const [, setLocation] = useLocation();
  const { taskId } = useParams<{ taskId: string }>();
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [geoDialogOpen, setGeoDialogOpen] = useState(false);
  const [activeDetailIdForGeo, setActiveDetailIdForGeo] = useState<
    string | null
  >(null);

  // Mock Task retrieval
  const task = useMemo(() => {
    return (
      MOCK_TASKS.find((t) => String(t.id) === String(taskId)) || MOCK_TASKS[0]
    );
  }, [taskId]);

  const [formData, setFormData] = useState<LogFormData>({
    completionPercent: "50",
    status: task.status,
    description: "",
    images: [],
    harvestScope: "region",
    harvestTargets: [],
    harvestDetails: [],
    harvestFiles: [],
    supplyActuals: [],
  });

  // Image handlers
  const handleImageFiles = (files: FileList) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length)
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...valid] }));
  };

  // Supply actual handler
  const setActualQty = (lineId: number, val: string) => {
    setFormData((prev) => {
      const others = prev.supplyActuals.filter((s) => s.lineId !== lineId);
      return {
        ...prev,
        supplyActuals: [...others, { lineId, actualQuantity: val }],
      };
    });
  };

  const getActualQty = (lineId: number) =>
    formData.supplyActuals.find((s) => s.lineId === lineId)?.actualQuantity ??
    "";

  const handleSubmit = async () => {
    setErrors({});
    const validationResult = logFormSchema.safeParse({
      completionPercent: formData.completionPercent,
      status: formData.status,
    });

    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(formattedErrors);
      toast({
        title: "Thông tin chưa hợp lệ",
        description:
          "Vui lòng kiểm tra lại thông tin % hoàn thành hoặc các trường lỗi.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Đã lưu",
        description: "Nhật ký công việc đã được ghi nhận thành công (Demo).",
      });
      setLocation("/diary/plan");
    }, 600);
  };

  const showHarvest = isHarvestTask(task);

  return (
    <PageWrapper
      title="Ghi nhật ký công việc"
      description={`${task.code} — ${task.name}`}
      actions={
        <Button
          variant="outline"
          className="h-10 rounded-lg px-4 text-sm gap-2"
          onClick={() => setLocation("/diary/plan")}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="mx-auto w-full max-w-[1600px] pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 pb-10">
          {/* ── Cột trái ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Block 1 — Info */}
            <InfoBlock
              task={task}
              formData={formData}
              setFormData={setFormData}
            />

            {/* Block 2 — Harvest (conditional) */}
            {showHarvest && (
              <HarvestBlock
                formData={formData}
                setFormData={setFormData}
                harvestOptions={MOCK_HARVEST_OPTIONS}
                onOpenGeoDialog={(id) => {
                  setActiveDetailIdForGeo(id);
                  setGeoDialogOpen(true);
                }}
              />
            )}
          </div>

          {/* ── Cột phải ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Block 3 — Work log */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  Ghi nhận công việc
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {/* % + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label required>% Hoàn thành</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0–100"
                        className={`h-11 bg-white border-slate-200 pr-8 ${
                          errors.completionPercent
                            ? "border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                        value={formData.completionPercent}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            completionPercent: e.target.value,
                          }));
                          if (errors.completionPercent) {
                            setErrors((prev) => ({
                              ...prev,
                              completionPercent: "",
                            }));
                          }
                        }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                        %
                      </span>
                    </div>
                    {errors.completionPercent && (
                      <p className="text-xs font-medium text-red-500 mt-1">
                        {errors.completionPercent}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label>Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: v as FarmTaskStatus,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Mô tả tiến độ</Label>
                  <Textarea
                    rows={4}
                    placeholder="Mô tả kết quả thực hiện, ghi chú..."
                    className="bg-white border-slate-200 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Image upload */}
                <div>
                  <Label className="mb-1.5 block">Hình ảnh thực tế</Label>
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files?.length)
                        handleImageFiles(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all flex flex-col items-center justify-center min-h-[120px] ${
                      isDragging
                        ? "border-green-500 bg-green-50/50"
                        : "border-slate-200 bg-slate-50/50 hover:border-green-400 hover:bg-white"
                    }`}
                  >
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length)
                          handleImageFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <div className="h-9 w-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                      <Upload className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      Kéo thả ảnh vào đây
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      hoặc click để chọn file
                    </p>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {formData.images.map((file, i) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div
                            key={i}
                            className="group relative h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                          >
                            <img
                              src={url}
                              alt={`preview-${i}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData((prev) => ({
                                  ...prev,
                                  images: prev.images.filter(
                                    (_, idx) => idx !== i,
                                  ),
                                }));
                              }}
                              className="absolute top-1 right-1 h-5 w-5 bg-red-500/80 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Block 4 — Supply Lines Actuals */}
            {task.supplyLines.length > 0 && (
              <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <PackageOpen className="w-4 h-4 text-green-600" />
                      Danh mục vật tư
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {task.supplyLines.length} loại
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5 space-y-3">
                  {task.supplyLines.map((line) => (
                    <div
                      key={line.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                          <Link2 className="h-3 w-3" />
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate flex-1">
                          {line.supplyItem?.name ?? `Vật tư #${line.id}`}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          KH: {line.quantity} {line.unitBase?.name ?? ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-[10px] text-slate-500 shrink-0 w-24">
                          Thực tế ({line.unitBase?.name ?? ""}):
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Nhập số lượng thực tế"
                          className="h-8 text-sm bg-white border-slate-200 flex-1"
                          value={getActualQty(line.id)}
                          onChange={(e) =>
                            setActualQty(line.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            type="button"
            className="h-11 px-6 rounded-xl text-sm font-semibold"
            onClick={() => setLocation("/diary/plan")}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="h-11 px-8 rounded-xl text-sm bg-green-600 hover:bg-green-700 text-white font-bold shadow-md shadow-green-600/20"
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Lưu nhật ký
          </Button>
        </div>
      </div>

      {/* Dialog chọn các vùng địa lý thu hoạch (Multi-select) */}
      <HarvestGeographicalSelectorDialog
        open={geoDialogOpen}
        onOpenChange={setGeoDialogOpen}
        selectedItems={formData.harvestDetails
          .filter((d) => d.codeName)
          .map((d) => ({
            id: d.targetId,
            codeName: d.codeName,
            label: d.targetLabel,
            type: d.codeName.includes(" › ")
              ? d.codeName.split(" › ").length >= 3
                ? "plot"
                : "area"
              : "region",
          }))}
        onConfirmSelections={(selectedGeoItems) => {
          const currentMap = new Map(
            formData.harvestDetails.map((d) => [d.targetId, d]),
          );

          const nextTargets = selectedGeoItems.map((item) => item.id);
          const nextDetails = selectedGeoItems.map((item) => {
            const existing = currentMap.get(item.id);
            if (existing) {
              return {
                ...existing,
                codeName: item.codeName,
                targetLabel: item.label,
              };
            }
            return {
              id: `h-geo-${item.id}`,
              targetId: item.id,
              targetLabel: item.label,
              codeName: item.codeName,
              quantity: "",
              unitBase: "kg",
            };
          });

          setFormData((prev) => ({
            ...prev,
            harvestTargets: nextTargets,
            harvestDetails: nextDetails,
          }));
        }}
      />
    </PageWrapper>
  );
}
