import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HealthDiaryRecord } from "../types/health-diary.types";

interface HealthDiaryState {
  records: HealthDiaryRecord[];
  addRecord: (
    record: Omit<HealthDiaryRecord, "id" | "code" | "createdAt" | "createdBy">,
  ) => HealthDiaryRecord;
  deleteRecord: (id: number) => void;
  getRecordsByZone: (zoneId: number | string) => HealthDiaryRecord[];
}

const INITIAL_RECORDS: HealthDiaryRecord[] = [
  {
    id: 1,
    code: "HDL-20260918-001",
    zoneId: "59",
    zoneName: "Vùng lúa ST25 - Vùng canh tác nông nghiệp công nghệ cao",
    methodType: "ZONE_SCOPE",
    regionName: "Khu vực A",
    targetScopeNames: ["Khu vực A", "Lô A1", "Lô A2"],
    status: "DISEASE_DETECTED",
    notes:
      "Phát hiện vết rầy nâu rải rác tại Lô A1. Đã tiến hành khoanh vùng và lập phương án phun xịt vi sinh.",
    imageUrls: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=60",
    ],
    createdBy: {
      id: 101,
      name: "Trần Anh Vũ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vu",
    },
    createdAt: "2026-09-18 09:30",
  },
  {
    id: 2,
    code: "HDL-20260917-002",
    zoneId: "59",
    zoneName: "Vùng lúa ST25 - Vùng canh tác nông nghiệp công nghệ cao",
    methodType: "INDIVIDUAL_PLANT",
    plantCodes: ["TREE-00102", "TREE-00103", "TREE-00105", "TREE-00108"],
    plantCount: 4,
    status: "UNDER_TREATMENT",
    notes:
      "Bón phân bổ sung vi lượng và tỉa cành cho 4 cây phát hiện thiếu khoáng đợt trước.",
    imageUrls: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=60",
    ],
    createdBy: {
      id: 102,
      name: "Nguyễn Văn Hùng",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hung",
    },
    createdAt: "2026-09-17 14:15",
  },
  {
    id: 3,
    code: "HDL-20260916-003",
    zoneId: "59",
    zoneName: "Vùng lúa ST25 - Vùng canh tác nông nghiệp công nghệ cao",
    methodType: "ZONE_SCOPE",
    regionName: "Khu vực B",
    targetScopeNames: ["Lô B3"],
    status: "HEALTHY",
    notes:
      "Kiểm tra định kỳ Lô B3 sau đợt điều trị bón hữu cơ. Cây sinh trưởng bình thường, lá xanh mượt.",
    imageUrls: [],
    createdBy: {
      id: 101,
      name: "Trần Anh Vũ",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vu",
    },
    createdAt: "2026-09-16 16:45",
  },
];

export const useHealthDiaryStore = create<HealthDiaryState>()(
  persist(
    (set, get) => ({
      records: INITIAL_RECORDS,
      addRecord: (data) => {
        const currentRecords = get().records;
        const nextId =
          currentRecords.length > 0
            ? Math.max(...currentRecords.map((r) => r.id)) + 1
            : 1;
        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const code = `HDL-${dateStr}-${String(nextId).padStart(3, "0")}`;

        const newRecord: HealthDiaryRecord = {
          ...data,
          id: nextId,
          code,
          createdAt: now.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdBy: data.createdBy || {
            id: 1,
            name: "Kỹ thuật viên nông hộ",
          },
        };

        set((state) => ({
          records: [newRecord, ...state.records],
        }));

        return newRecord;
      },
      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },
      getRecordsByZone: (zoneId) => {
        return get().records.filter((r) => String(r.zoneId) === String(zoneId));
      },
    }),
    {
      name: "eco-farm-health-diary-storage",
    },
  ),
);
