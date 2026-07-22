import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AquacultureDistribution } from "@/pages/aquaculture-distribution-detail/AquacultureDistributionDetailPage";

const MOCK_DISTRIBUTIONS: AquacultureDistribution[] = [
  {
    id: "aq-dist-1",
    code: "AQD-001",
    name: "Phân bổ tôm thẻ Cần Giờ",
    scope: "Vùng nuôi tôm Cần Giờ",
    targetName: "Khu nuôi tôm Cần Giờ",
    method: "Nuôi thâm canh tuần hoàn",
    totalStock: 48000,
    status: "active",
    stockedDate: "2026-03-12",
    expectedHarvest: "2026-10-20",
    areaSize: 2.5,
    healthScore: 97,
    waterTemp: 29.1,
    salinity: 16.8,
    varieties: [
      { name: "Tôm thẻ chân trắng", count: 32000, color: "#16a34a" },
      { name: "Tôm sú giống", count: 16000, color: "#ca8a04" },
    ],
    center: [10.403, 106.804],
    polygon: [
      [10.399, 106.799],
      [10.399, 106.809],
      [10.407, 106.81],
      [10.408, 106.801],
    ],
    units: [
      {
        id: "aq-unit-1",
        code: "AQU-001",
        name: "Ao nuôi số 1",
        species: "Tôm thẻ chân trắng",
        status: "healthy",
        weight: 18,
        stockedDate: "2026-03-12",
        coordinate: { lat: 10.4028, lng: 106.8035 },
      },
      {
        id: "aq-unit-2",
        code: "AQU-002",
        name: "Ao nuôi số 2",
        species: "Tôm thẻ chân trắng",
        status: "healthy",
        weight: 17,
        stockedDate: "2026-03-14",
        coordinate: { lat: 10.404, lng: 106.8052 },
      },
      {
        id: "aq-unit-3",
        code: "AQU-003",
        name: "Ao ươm giống",
        species: "Tôm sú giống",
        status: "warning",
        weight: 9,
        stockedDate: "2026-04-02",
        coordinate: { lat: 10.4052, lng: 106.8029 },
      },
    ],
  },
  {
    id: "aq-dist-2",
    code: "AQD-002",
    name: "Phân bổ cá rô phi Long Sơn",
    scope: "Khu nuôi thủy sản Long Sơn",
    targetName: "Ao nuôi số 2",
    method: "Nuôi bán thâm canh",
    totalStock: 36000,
    status: "monitoring",
    stockedDate: "2026-04-20",
    expectedHarvest: "2026-11-15",
    areaSize: 3.1,
    healthScore: 89,
    waterTemp: 28.4,
    salinity: 11.2,
    varieties: [
      { name: "Cá rô phi đơn tính", count: 24000, color: "#0ea5e9" },
      { name: "Cá mú chấm nâu", count: 12000, color: "#7c3aed" },
    ],
    center: [10.457, 106.85],
    polygon: [
      [10.454, 106.846],
      [10.455, 106.855],
      [10.46, 106.857],
      [10.462, 106.848],
    ],
    units: [
      {
        id: "aq-unit-4",
        code: "AQU-004",
        name: "Bè nuôi số 4",
        species: "Cá rô phi đơn tính",
        status: "healthy",
        weight: 22,
        stockedDate: "2026-04-20",
        coordinate: { lat: 10.4562, lng: 106.8492 },
      },
      {
        id: "aq-unit-5",
        code: "AQU-005",
        name: "Bè nuôi số 5",
        species: "Cá mú chấm nâu",
        status: "critical",
        weight: 19,
        stockedDate: "2026-04-22",
        coordinate: { lat: 10.4578, lng: 106.8507 },
      },
    ],
  },
];

interface AquacultureDistributionState {
  records: AquacultureDistribution[];
  addRecord: (
    payload: Omit<AquacultureDistribution, "id" | "code">,
  ) => AquacultureDistribution;
  deleteRecord: (id: string) => void;
  getRecordById: (id: string) => AquacultureDistribution | undefined;
}

const toInitialRecords = (): AquacultureDistribution[] => MOCK_DISTRIBUTIONS;

const useAquacultureDistributionStore = create<AquacultureDistributionState>()(
  devtools(
    persist(
      (set, get) => ({
        records: toInitialRecords(),

        addRecord: (payload) => {
          const state = get();
          const maxId = state.records
            .map((r) => Number(r.id.replace("aq-dist-", "")))
            .filter((n) => !Number.isNaN(n))
            .reduce((m, n) => Math.max(m, n), 0);

          const nextNumber = maxId + 1;
          const newRecord: AquacultureDistribution = {
            ...payload,
            id: `aq-dist-${nextNumber}`,
            code: `AQD-${String(nextNumber).padStart(3, "0")}`,
          };

          set(
            (prev) => ({ records: [newRecord, ...prev.records] }),
            false,
            "aquacultureDistribution/addRecord",
          );

          return newRecord;
        },

        deleteRecord: (id) =>
          set(
            (prev) => ({
              records: prev.records.filter((item) => item.id !== id),
            }),
            false,
            "aquacultureDistribution/deleteRecord",
          ),

        getRecordById: (id) => get().records.find((item) => item.id === id),
      }),
      {
        name: "aquaculture-distribution-storage",
        partialize: (state) => ({ records: state.records }),
      },
    ),
  ),
);

export default useAquacultureDistributionStore;
