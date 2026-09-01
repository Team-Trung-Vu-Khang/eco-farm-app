import React, { useRef, useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
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
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Link2,
  PackageOpen,
  RefreshCw,
  Upload,
  User,
  X,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { HarvestGeographicalSelectorDialog } from "./components/HarvestGeographicalSelectorDialog";
import { GeographicalSelectionCard } from "./components/GeographicalSelectionCard";
import { useLocation, useParams } from "wouter";
import type { FarmTaskResponse, FarmTaskStatus } from "@/features/farm-task";

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

// ─── Mock Tasks ───────────────────────────────────────────────────────────────

const MOCK_TASKS: FarmTaskResponse[] = [
  {
    id: 1,
    code: "CV-0001",
    name: "Kiểm tra sức khỏe cây trồng đợt 1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 20, code: "KH-LUA-01", name: "Kế hoạch Vụ Đông Xuân 2024" },
    scopeType: "PLOT",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: { id: 11, code: "KHU-A1", name: "Khu A1" },
    plot: { id: 101, code: "LO-01", name: "Lô 01" },
    sourceWorkItem: null,
    taskCategory: { id: 1, code: "CAT-CANH-TAC", name: "Canh tác" },
    priority: "HIGH",
    note: "Kiểm tra sâu bệnh và tình trạng sinh trưởng.",
    personnel: [
      { id: 3, fullName: "Lê Văn Cường", role: "ASSIGNEE" },
      { id: 4, fullName: "Phạm Thị Dung", role: "SUPERVISOR" },
    ],
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 1,
        supplyItem: { id: 201, code: "VT-001", name: "Phân hữu cơ vi sinh" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 200,
        displayOrder: 1,
      },
      {
        id: 2,
        supplyItem: { id: 202, code: "VT-002", name: "Thuốc BVTV sinh học" },
        unitBase: { id: 2, code: "LT", name: "lít" },
        quantity: 5,
        displayOrder: 2,
      },
    ],
    status: "DOING",
    createdAt: "2024-03-08T07:00:00Z",
    updatedAt: "2024-03-12T09:30:00Z",
  },
  {
    id: 2,
    code: "CV-0002",
    name: "Bón phân đợt 2 — Vụ rau màu Hè Thu",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 11, code: "QT002", name: "QT002 - Rau màu an toàn" },
    plan: { id: 21, code: "KH-RAU-02", name: "Kế hoạch Hè Thu 2024" },
    scopeType: "AREA",
    region: { id: 2, code: "VCB", name: "Vùng Canh Tác B" },
    area: { id: 12, code: "KHU-B2", name: "Khu B2" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 2, code: "CAT-BON-PHAN", name: "Bón phân" },
    priority: "MEDIUM",
    note: "Bón phân NPK theo liều lượng quy định.",
    personnel: [{ id: 5, fullName: "Hoàng Văn Em", role: "ASSIGNEE" }],
    startDate: "2024-09-05",
    endDate: "2024-09-07",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 3,
        supplyItem: { id: 203, code: "VT-003", name: "Phân NPK 20-20-15" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 150,
        displayOrder: 1,
      },
    ],
    status: "TODO",
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-09-01T08:00:00Z",
  },
  {
    id: 3,
    code: "CV-0003",
    name: "Thu hoạch lúa Đông Xuân — Lô 01 & Lô 02",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 20, code: "KH-LUA-01", name: "Kế hoạch Vụ Đông Xuân 2024" },
    scopeType: "REGION",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 3, code: "CAT-THU-HOACH", name: "Thu hoạch" },
    priority: "HIGH",
    note: "Thu hoạch theo đợt, ưu tiên lô có sản lượng cao nhất.",
    personnel: [
      { id: 7, fullName: "Đặng Văn Giang", role: "ASSIGNEE" },
      { id: 8, fullName: "Bùi Thị Hạnh", role: "ASSIGNEE" },
      { id: 3, fullName: "Lê Văn Cường", role: "SUPERVISOR" },
    ],
    startDate: "2024-08-20",
    endDate: "2024-08-25",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "DONE",
    createdAt: "2024-08-15T06:30:00Z",
    updatedAt: "2024-08-25T16:00:00Z",
  },
  {
    id: 4,
    code: "CV-0004",
    name: "Phun thuốc trừ sâu đợt 1 — Khu C",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 12, code: "QT003", name: "QT003 - Cây ăn trái GAP" },
    plan: { id: 22, code: "KH-CAT-01", name: "Kế hoạch Chăm sóc Q1/2025" },
    scopeType: "AREA",
    region: { id: 3, code: "VCC", name: "Vùng Canh Tác C" },
    area: { id: 13, code: "KHU-C1", name: "Khu C1" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 4, code: "CAT-PHUN-THUOC", name: "Phun thuốc BVTV" },
    priority: "HIGH",
    note: "Phun thuốc sinh học theo lịch định kỳ.",
    personnel: [
      { id: 9, fullName: "Đỗ Văn Hùng", role: "ASSIGNEE" },
      { id: 11, fullName: "Ngô Văn Minh", role: "SUPERVISOR" },
    ],
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 4,
        supplyItem: {
          id: 204,
          code: "VT-004",
          name: "Thuốc trừ sâu sinh học Bt",
        },
        unitBase: { id: 2, code: "LT", name: "lít" },
        quantity: 10,
        displayOrder: 1,
      },
      {
        id: 5,
        supplyItem: { id: 205, code: "VT-005", name: "Bình phun áp suất" },
        unitBase: { id: 3, code: "CAI", name: "cái" },
        quantity: 2,
        displayOrder: 2,
      },
    ],
    status: "TODO",
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-05T09:00:00Z",
  },
  {
    id: 5,
    code: "CV-0005",
    name: "Cải tạo đất sau vụ — Khu A1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 23, code: "KH-CAI-TAO-01", name: "Kế hoạch Cải tạo đất Q3" },
    scopeType: "AREA",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: { id: 11, code: "KHU-A1", name: "Khu A1" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 5, code: "CAT-CAI-TAO", name: "Cải tạo đất" },
    priority: "LOW",
    note: "Cày bừa, bón vôi và cải tạo cơ cấu đất.",
    personnel: [{ id: 15, fullName: "Nguyễn Văn Sơn", role: "ASSIGNEE" }],
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 6,
        supplyItem: { id: 206, code: "VT-006", name: "Vôi bột nông nghiệp" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 500,
        displayOrder: 1,
      },
    ],
    status: "DONE",
    createdAt: "2024-06-25T08:00:00Z",
    updatedAt: "2024-07-05T17:00:00Z",
  },
  {
    id: 6,
    code: "CV-0006",
    name: "Tưới nước bổ sung — Vụ Hè Thu (QUÁ HẠN)",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 11, code: "QT002", name: "QT002 - Rau màu an toàn" },
    plan: { id: 21, code: "KH-RAU-02", name: "Kế hoạch Hè Thu 2024" },
    scopeType: "PLOT",
    region: { id: 2, code: "VCB", name: "Vùng Canh Tác B" },
    area: { id: 12, code: "KHU-B2", name: "Khu B2" },
    plot: { id: 102, code: "LO-02", name: "Lô 02" },
    sourceWorkItem: null,
    taskCategory: { id: 6, code: "CAT-TUOI-NUOC", name: "Tưới nước" },
    priority: "MEDIUM",
    note: "Tưới bổ sung do thiếu mưa kéo dài.",
    personnel: [
      { id: 6, fullName: "Vũ Thị Phương", role: "ASSIGNEE" },
      { id: 4, fullName: "Phạm Thị Dung", role: "SUPERVISOR" },
    ],
    startDate: "2024-08-01",
    endDate: "2024-08-05",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "TODO",
    createdAt: "2024-07-28T10:00:00Z",
    updatedAt: "2024-07-28T10:00:00Z",
  },
  {
    id: 7,
    code: "CV-0007",
    name: "Lấy mẫu đất kiểm tra dinh dưỡng — Vùng C",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 12, code: "QT003", name: "QT003 - Cây ăn trái GAP" },
    plan: { id: 22, code: "KH-CAT-01", name: "Kế hoạch Chăm sóc Q1/2025" },
    scopeType: "REGION",
    region: { id: 3, code: "VCC", name: "Vùng Canh Tác C" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 7, code: "CAT-LAY-MAU", name: "Lấy mẫu đất" },
    priority: "LOW",
    note: null,
    personnel: [
      { id: 13, fullName: "Lý Văn Phúc", role: "ASSIGNEE" },
      { id: 14, fullName: "Mai Thị Quyên", role: "ASSIGNEE" },
    ],
    startDate: "2025-02-01",
    endDate: "2025-02-03",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 7,
        supplyItem: { id: 207, code: "VT-007", name: "Túi lấy mẫu đất" },
        unitBase: { id: 3, code: "CAI", name: "cái" },
        quantity: 20,
        displayOrder: 1,
      },
    ],
    status: "TODO",
    createdAt: "2025-01-25T11:00:00Z",
    updatedAt: "2025-01-25T11:00:00Z",
  },
];

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

function InfoBlock({ task }: { task: FarmTaskResponse }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-green-600" />
          Thông tin công việc
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {/* 3 mini info blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Vụ mùa
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {task.workflow?.name || "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Kế hoạch
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {task.plan ? `${task.plan.code} - ${task.plan.name}` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Vùng canh tác
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {getScopeDisplay(task)}
            </p>
          </div>
        </div>

        {/* Meta rows */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {formatDate(task.startDate)} → {formatDate(task.endDate)}
            </span>
            {task.durationDays ? (
              <span className="text-slate-400">({task.durationDays} ngày)</span>
            ) : null}
          </div>
          {task.personnel.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                {task.personnel.map((p) => p.fullName || `#${p.id}`).join(", ")}
              </span>
            </div>
          )}
          {task.taskCategory && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Danh mục: {task.taskCategory.name}</span>
            </div>
          )}
          {task.note && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-600 leading-relaxed">
              {task.note}
            </div>
          )}
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

export default function PlanDiaryDetailPage() {
  const [, setLocation] = useLocation();
  const { taskId } = useParams<{ taskId: string }>();
  const { toast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!formData.description && !formData.completionPercent) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập % hoàn thành hoặc mô tả tiến độ.",
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
            <InfoBlock task={task} />

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
                        className="h-11 bg-white border-slate-200 pr-8"
                        value={formData.completionPercent}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            completionPercent: e.target.value,
                          }))
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                        %
                      </span>
                    </div>
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
