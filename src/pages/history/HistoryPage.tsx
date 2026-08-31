import { useMemo } from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  DataTable,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Clock3, ClipboardList, Plus, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import usePersonnelStore from "@/stores/usePersonnelStore";

interface MaterialAllocationRecord {
  id: number;
  stageId: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  actualQuantity?: string;
}

interface HistoryRecord {
  id: number;
  regimenId: string;
  regimenName: string;
  seasonName: string;
  planName: string;
  regionName: string;
  description: string;
  workDescription: string;
  completionPercent: number;
  imageCount: number;
  stages: string[];
  materialAllocations: MaterialAllocationRecord[];
  assignedPersonnelIds: number[];
  assignedAt: string;
  updatedAt: string;
  dueDate: string;
}

const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 1,
    regimenId: "1",
    regimenName: "QT001 - Quy trình canh tác Lúa hữu cơ 2024",
    seasonName: "Vụ Đông Xuân 2024",
    planName: "Kế hoạch làm đất và gieo sạ",
    regionName: "Vùng canh tác A1",
    description:
      "Cập nhật tiến độ canh tác hữu cơ, bổ sung phân bón và ghi nhận ảnh hiện trường.",
    workDescription: "Làm đất, gieo sạ và bón phân đợt 1.",
    completionPercent: 80,
    imageCount: 5,
    stages: ["Làm đất", "Gieo sạ", "Bón phân đợt 1", "Bón phân đợt 2"],
    materialAllocations: [
      {
        id: 1,
        stageId: "Làm đất",
        materialType: "Phân bón",
        materialName: "Phân hữu cơ vi sinh",
        quantity: "200",
        actualQuantity: "195",
        unit: "kg",
      },
      {
        id: 2,
        stageId: "Bón phân đợt 1",
        materialType: "Phân bón",
        materialName: "Ure",
        quantity: "50",
        actualQuantity: "48",
        unit: "kg",
      },
    ],
    assignedPersonnelIds: [1, 7],
    assignedAt: "2024-03-18T08:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z",
    dueDate: "2024-03-25T23:59:59Z",
  },
  {
    id: 2,
    regimenId: "2",
    regimenName: "QT002 - Quy trình rau màu an toàn",
    seasonName: "Vụ Hè Thu 2024",
    planName: "Kế hoạch chăm sóc luống rau",
    regionName: "Khu sản xuất B2",
    description: "Bổ sung vật tư, theo dõi tưới tiêu và ghi ảnh cập nhật.",
    workDescription: "Kiểm tra luống, dặm cây và tưới bổ sung.",
    completionPercent: 45,
    imageCount: 3,
    stages: ["Làm luống", "Gieo hạt", "Chăm sóc"],
    materialAllocations: [
      {
        id: 3,
        stageId: "Làm luống",
        materialType: "Vật tư khác",
        materialName: "Màng phủ đất",
        quantity: "50",
        actualQuantity: "50",
        unit: "m",
      },
    ],
    assignedPersonnelIds: [1, 3],
    assignedAt: "2024-09-01T07:30:00Z",
    updatedAt: "2024-09-02T10:15:00Z",
    dueDate: "2024-09-08T23:59:59Z",
  },
  {
    id: 3,
    regimenId: "3",
    regimenName: "QT003 - Quy trình chăm sóc cây ăn trái",
    seasonName: "Vụ Thu Đông 2024",
    planName: "Kế hoạch phục hồi sau mưa",
    regionName: "Vùng canh tác C3",
    description: "Nhật ký đang quá hạn, cần xử lý và cập nhật lại hiện trạng.",
    workDescription: "Tỉa cành, vệ sinh vườn và bổ sung dinh dưỡng.",
    completionPercent: 20,
    imageCount: 0,
    stages: ["Tỉa cành", "Bón phân"],
    materialAllocations: [
      {
        id: 4,
        stageId: "Bón phân",
        materialType: "Phân bón",
        materialName: "Kali Sulphate",
        quantity: "25",
        actualQuantity: "20",
        unit: "kg",
      },
    ],
    assignedPersonnelIds: [1],
    assignedAt: "2024-10-01T07:30:00Z",
    updatedAt: "2024-10-03T11:45:00Z",
    dueDate: "2024-09-28T23:59:59Z",
  },
  {
    id: 4,
    regimenId: "4",
    regimenName: "QT004 - Quy trình phun phòng bệnh",
    seasonName: "Vụ Mùa 2024",
    planName: "Kế hoạch phòng bệnh giai đoạn mưa",
    regionName: "Khu sản xuất D4",
    description: "Bản ghi cập nhật mới nhất về kiểm tra sâu bệnh.",
    workDescription: "Khảo sát vườn, phun phòng và ghi nhận ảnh.",
    completionPercent: 60,
    imageCount: 2,
    stages: ["Khảo sát", "Phun phòng"],
    materialAllocations: [
      {
        id: 5,
        stageId: "Phun phòng",
        materialType: "Thuốc BVTV",
        materialName: "Thuốc phòng nấm sinh học",
        quantity: "1",
        actualQuantity: "1",
        unit: "lít",
      },
    ],
    assignedPersonnelIds: [1, 5],
    assignedAt: "2024-10-10T06:15:00Z",
    updatedAt: "2024-10-30T09:00:00Z",
    dueDate: "2024-11-05T23:59:59Z",
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

function formatDateTime(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOverdue(record: HistoryRecord) {
  return new Date(record.dueDate).getTime() < Date.now();
}

function sortByDateDesc<T extends { assignedAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
  );
}

function sortByUpdatedDesc<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function sortByDueAsc(items: HistoryRecord[]) {
  return [...items].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}

const historyColumns: Column<HistoryRecord>[] = [
  {
    key: "regimenName",
    label: "Nhật ký",
    width: "360px",
    render: (value, row) => (
      <div className="min-w-[360px] space-y-4 py-4 pr-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 text-[10px]"
          >
            {String(value)}
          </Badge>
          <span className="text-[11px] font-semibold text-slate-400">
            {formatDateTime(row.assignedAt)}
          </span>
        </div>
        <p className="text-base font-semibold leading-6 text-slate-900">
          {row.planName}
        </p>
        <p className="text-sm leading-6 text-slate-500">{row.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 text-[10px]">
            {row.imageCount} ảnh
          </Badge>
          <Badge variant="outline" className={isOverdue(row) ? "border-orange-200 bg-orange-50 text-orange-700 text-[10px]" : "border-slate-200 bg-slate-50 text-slate-600 text-[10px]"}>
            {isOverdue(row) ? "Đã quá hạn" : "Đang được giao"}
          </Badge>
        </div>
      </div>
    ),
  },
  {
    key: "seasonName",
    label: "Thông tin cập nhật",
    width: "300px",
    render: (_value, row) => (
      <div className="min-w-[300px] space-y-4 py-4 pr-4 text-sm">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Vụ mùa
          </p>
          <p className="mt-1 font-semibold text-slate-900">{row.seasonName}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Kế hoạch
          </p>
          <p className="mt-1 font-semibold text-slate-900">{row.planName}</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Vùng canh tác
          </p>
          <p className="mt-1 font-semibold text-slate-900">{row.regionName}</p>
        </div>
      </div>
    ),
  },
  {
    key: "completionPercent",
    label: "Công việc",
    width: "320px",
    render: (value, row) => (
      <div className="min-w-[320px] space-y-4 py-4 pr-4">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Number(value)}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
            {String(value)}%
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600">{row.workDescription}</p>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Cập nhật gần nhất
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatDate(row.updatedAt)}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "materialAllocations",
    label: "Vật tư",
    width: "360px",
    render: (_value, row) => (
      <div className="min-w-[360px] space-y-4 py-4 pr-4">
        {row.materialAllocations.length > 0 ? (
          row.materialAllocations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-4 text-sm"
            >
              <div className="font-semibold leading-6 text-slate-900">
                {item.materialName}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {item.materialType}
              </div>
              <div className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                {item.actualQuantity || item.quantity} {item.unit}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm italic text-slate-400">Chưa ghi nhận vật tư.</p>
        )}
      </div>
    ),
  },
];

function HistoryTable({ records }: { records: HistoryRecord[] }) {
  return (
    <DataTable
      columns={historyColumns}
      data={records}
      searchable
      searchPlaceholder="Tìm kiếm nhật ký..."
      selectable={false}
    />
  );
}

export function HistoryPage() {
  const [, setLocation] = useLocation();
  const personnel = usePersonnelStore((state) => state.personnel);

  const currentPersonnelId = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = Number(window.localStorage.getItem("history-current-personnel-id"));
      if (Number.isFinite(stored) && stored > 0) return stored;
    }
    return personnel.find((item) => item.status === "active")?.id ?? personnel[0]?.id ?? 0;
  }, [personnel]);

  const visibleRecords = useMemo(
    () =>
      MOCK_HISTORY.filter((record) =>
        record.assignedPersonnelIds.includes(currentPersonnelId),
      ),
    [currentPersonnelId],
  );

  const assignedSorted = useMemo(() => sortByDateDesc(visibleRecords), [visibleRecords]);
  const updatedSorted = useMemo(() => sortByUpdatedDesc(visibleRecords), [visibleRecords]);
  const overdueSorted = useMemo(() => sortByDueAsc(visibleRecords.filter(isOverdue)), [visibleRecords]);

  const stats = useMemo(
    () => ({
      total: visibleRecords.length,
      overdue: overdueSorted.length,
      updated: updatedSorted.length,
      assigned: assignedSorted.length,
    }),
    [assignedSorted.length, overdueSorted.length, updatedSorted.length, visibleRecords.length],
  );

  return (
    <PageWrapper
      title="Nhật ký theo kế hoạch"
      description="Chỉ hiển thị các nhật ký được giao cho bạn"
      actions={
        <Button
          className="h-10 rounded-lg px-4 text-sm font-bold bg-green-600 hover:bg-green-700 text-white gap-2"
          onClick={() => setLocation("/history/create")}
        >
          <Plus className="h-4 w-4" />
          Thêm nhật ký
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Được giao
          </p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-slate-900">{stats.assigned}</p>
            <ClipboardList className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
            Vừa cập nhật
          </p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-slate-900">{stats.updated}</p>
            <RefreshCw className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-1">
            Quá hạn
          </p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-orange-700">{stats.overdue}</p>
            <Clock3 className="h-5 w-5 text-orange-600" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="assigned" className="gap-2">
            Được giao mới nhất
          </TabsTrigger>
          <TabsTrigger value="updated" className="gap-2">
            Vừa mới cập nhật
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2 text-orange-700 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
            Đã quá hạn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-5">
          <HistoryTable records={assignedSorted} />
        </TabsContent>

        <TabsContent value="updated" className="mt-5">
          <HistoryTable records={updatedSorted} />
        </TabsContent>

        <TabsContent value="overdue" className="mt-5">
          <HistoryTable records={overdueSorted} />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
}

export default HistoryPage;
