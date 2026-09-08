import { useState, useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  Clock,
  Image as ImageIcon,
  ImageOff,
  Link2,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";

interface MaterialAllocationRecord {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
}

interface HistoryRecord {
  id: number;
  origin: "PLANNED" | "AD_HOC";
  regimenId: string;
  regimenName: string;
  startDate: string;
  endDate: string;
  description: string;
  imageCount: number;
  stages: string[];
  materialAllocations: MaterialAllocationRecord[];
  createdAt: string;
  status: "ongoing" | "completed" | "draft";
}

// Mock data based on HistoryCreatePage fields
const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 1,
    origin: "PLANNED",
    regimenId: "1",
    regimenName: "QT001 - Quy trình canh tác Lúa hữu cơ 2024",
    startDate: "2024-03-01",
    endDate: "2024-08-15",
    description:
      "Vụ Đông Xuân 2024, áp dụng kỹ thuật canh tác hữu cơ không thuốc hóa học.",
    imageCount: 5,
    stages: [
      "Làm đất",
      "Gieo sạ",
      "Bón phân đợt 1",
      "Bón phân đợt 2",
      "Thu hoạch",
    ],
    materialAllocations: [
      {
        id: 1,
        stageId: "Làm đất",
        materialType: "Phân bón",
        materialName: "Phân hữu cơ vi sinh",
        quantity: "200",
        unit: "kg",
      },
      {
        id: 2,
        stageId: "Bón phân đợt 1",
        materialType: "Phân bón",
        materialName: "Ure",
        quantity: "50",
        unit: "kg",
      },
    ],
    createdAt: "2024-03-01T08:00:00Z",
    status: "completed",
  },
  {
    id: 2,
    origin: "AD_HOC",
    regimenId: "2",
    regimenName:
      "QT002 - Quy trình rau màu an toàn (Phun thuốc bọ trĩ phát sinh)",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    description: "Xử lý phát sinh bọ trĩ bộc phát trên diện rộng mùa mưa.",
    imageCount: 3,
    stages: ["Chăm sóc", "Phun thuốc BVTV"],
    materialAllocations: [
      {
        id: 3,
        stageId: "Phun thuốc BVTV",
        materialType: "Thuốc BVTV",
        materialName: "Thuốc sinh học Bt",
        quantity: "10",
        unit: "lít",
      },
    ],
    createdAt: "2024-09-01T07:30:00Z",
    status: "ongoing",
  },
  {
    id: 3,
    origin: "AD_HOC",
    regimenId: "3",
    regimenName: "QT003 - Quy trình chăm sóc cây ăn trái (Sửa đường ống rò rỉ)",
    startDate: "2025-01-15",
    endDate: "",
    description: "Sửa chữa hệ thống ống tưới nhỏ giọt bị vỡ khu C1.",
    imageCount: 2,
    stages: ["Bảo trì hệ thống"],
    materialAllocations: [],
    createdAt: "2025-01-15T09:00:00Z",
    status: "completed",
  },
  {
    id: 4,
    origin: "PLANNED",
    regimenId: "2",
    regimenName: "QT002 - Quy trình rau màu an toàn",
    startDate: "2024-10-01",
    endDate: "2024-10-15",
    description: "Bón phân đợt 3 theo đúng lộ trình quy trình kỹ thuật.",
    imageCount: 1,
    stages: ["Bón phân đợt 3"],
    materialAllocations: [
      {
        id: 4,
        stageId: "Bón phân đợt 3",
        materialType: "Phân bón",
        materialName: "Phân NPK 20-20-15",
        quantity: "100",
        unit: "kg",
      },
    ],
    createdAt: "2024-10-01T08:00:00Z",
    status: "completed",
  },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const historyColumns: Column<HistoryRecord>[] = [
  {
    key: "regimenName",
    label: "Quy trình / Vụ mùa",
    render: (value, row) => (
      <div className="flex items-start gap-2.5 min-w-[220px]">
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
            row.origin === "AD_HOC"
              ? "bg-amber-100 text-amber-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {row.origin === "AD_HOC" ? (
            <Zap className="h-4 w-4" />
          ) : (
            <ClipboardList className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-[13px] leading-snug">
            {String(value)}
          </p>
          {row.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">
              {row.description}
            </p>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "origin",
    label: "Phân loại",
    render: (value) => {
      if (value === "AD_HOC") {
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold flex items-center gap-1 w-fit"
          >
            <Zap className="h-2.5 w-2.5" />
            Phát sinh
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold flex items-center gap-1 w-fit"
        >
          <CalendarDays className="h-2.5 w-2.5" />
          Theo kế hoạch
        </Badge>
      );
    },
  },
  {
    key: "startDate",
    label: "Thời gian",
    render: (_value, row) => (
      <div className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap">
        <CalendarDays className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span className="font-medium">{formatDate(row.startDate)}</span>
        {row.endDate && (
          <>
            <span className="text-slate-300">→</span>
            <span className="font-medium">{formatDate(row.endDate)}</span>
          </>
        )}
      </div>
    ),
  },
  {
    key: "stages",
    label: "Hạng mục",
    render: (value) => {
      const stages = value as string[];
      if (!stages || stages.length === 0)
        return <span className="text-xs text-slate-300 italic">Chưa có</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {stages.slice(0, 2).map((s) => (
            <span
              key={s}
              className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
            >
              {s}
            </span>
          ))}
          {stages.length > 2 && (
            <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              +{stages.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "materialAllocations",
    label: "Vật tư",
    render: (value) => {
      const allocations = value as MaterialAllocationRecord[];
      return (
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <Link2 className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold">{allocations?.length ?? 0}</span>
          <span className="text-slate-400">loại</span>
        </div>
      );
    },
  },
  {
    key: "imageCount",
    label: "Ảnh",
    render: (value) => (
      <div className="flex items-center gap-1 text-xs text-slate-600">
        <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold">{String(value)}</span>
        <span className="text-slate-400">ảnh</span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => {
      const map: Record<string, { label: string; className: string }> = {
        completed: {
          label: "Hoàn thành",
          className: "bg-green-50 text-green-700 border-green-200",
        },
        ongoing: {
          label: "Đang thực hiện",
          className: "bg-blue-50 text-blue-700 border-blue-200",
        },
        draft: {
          label: "Nháp",
          className: "bg-slate-50 text-slate-600 border-slate-200",
        },
      };
      const info = map[String(value)] ?? map["draft"];
      return (
        <Badge
          variant="outline"
          className={`text-[10px] font-bold ${info.className}`}
        >
          {info.label}
        </Badge>
      );
    },
  },
];

export function HistoryPage() {
  const [, setLocation] = useLocation();

  const stats = useMemo(() => {
    const total = MOCK_HISTORY.length;
    const withEvidence = MOCK_HISTORY.filter((r) => r.imageCount > 0).length;
    const withoutEvidence = total - withEvidence;

    // Tần suất cập nhật / tháng: số bản ghi / số tháng kể từ bản đầu tiên
    let frequencyPerMonth: string = "—";
    if (total > 0) {
      const dates = MOCK_HISTORY.map((r) => new Date(r.createdAt).getTime());
      const earliest = Math.min(...dates);
      const latest = Math.max(...dates);
      const diffMonths =
        (new Date(latest).getFullYear() - new Date(earliest).getFullYear()) *
          12 +
        (new Date(latest).getMonth() - new Date(earliest).getMonth());
      frequencyPerMonth =
        diffMonths === 0
          ? `${total} lần`
          : `${(total / (diffMonths + 1)).toFixed(1)} lần`;
    }

    // Thời gian cập nhật mới nhất
    let latestUpdate: string = "—";
    if (total > 0) {
      const dates = MOCK_HISTORY.map((r) => new Date(r.createdAt).getTime());
      const latestDate = new Date(Math.max(...dates));
      latestUpdate = latestDate.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    return {
      total,
      withEvidence,
      withoutEvidence,
      frequencyPerMonth,
      latestUpdate,
    };
  }, []);

  const handleView = (row: HistoryRecord) => {
    setLocation(`/history/${row.id}`);
  };

  const handleEdit = (row: HistoryRecord) => {
    setLocation(`/history/${row.id}/edit`);
  };

  return (
    <PageWrapper
      title="Nhật ký canh tác"
      description="Danh sách toàn bộ nhật ký vụ mùa đã được ghi nhận"
      actions={
        <Button
          className="h-10 rounded-lg px-4 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2"
          onClick={() => setLocation("/diary/incident")}
        >
          <Plus className="h-4 w-4" />
          Thêm nhật ký
        </Button>
      }
    >
      {/* Stat Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Block 1: Tổng số lần cập nhật */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Tổng lần cập nhật
              </p>
              <p className="text-3xl font-extrabold text-slate-800 leading-none">
                {stats.total}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Camera className="h-3.5 w-3.5 text-green-500" />
              <span className="font-bold text-green-600">
                {stats.withEvidence}
              </span>
              <span className="text-slate-400">có bằng chứng</span>
            </div>
            <div className="w-px h-4 bg-slate-100" />
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ImageOff className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-bold text-slate-600">
                {stats.withoutEvidence}
              </span>
              <span className="text-slate-400">không bằng chứng</span>
            </div>
          </div>
        </div>

        {/* Block 2: Tần suất cập nhật */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Số lần trong tháng
              </p>
              <p className="text-3xl font-extrabold text-slate-800 leading-none">
                3
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Thông tin cập nhật mới nhất trong tháng
          </p>
        </div>

        {/* Block 3: Cập nhật mới nhất */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Cập nhật mới nhất
              </p>
              <p className="text-2xl font-extrabold text-slate-800 leading-none">
                {stats.latestUpdate}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Nhật ký gần nhất được ghi nhận vào ngày này
          </p>
        </div>
      </div>

      <DataTable<HistoryRecord>
        columns={historyColumns}
        data={MOCK_HISTORY}
        searchable
        searchPlaceholder="Tìm kiếm nhật ký..."
        onView={handleView}
        onEdit={handleEdit}
      />
    </PageWrapper>
  );
}

export default HistoryPage;
