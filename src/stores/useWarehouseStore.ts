import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface WarehouseArea {
  id: string;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  safetyDistanceWater?: number;
  createdAt: string;
}

export interface AreaAllocation {
  id: string;
  areaId: string;
  name: string;
  notes?: string;
  storageType: 'General' | 'Acidic_Fertilizer' | 'Pesticide' | 'Cold_Storage' | 'Locked_Cabinet';
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  allocationId: string;
  materialId: number;
  materialType: 'crop' | 'livestock' | 'aquaculture';
  quantity: number;
  unit: string;
  lotNumber?: string;
  expiryDate?: string;
  lastUpdated: string;
}

export interface WarehouseTransaction {
  id: string;
  type: 'IN' | 'OUT';
  materialId: number;
  materialType: 'crop' | 'livestock' | 'aquaculture';
  materialName: string;
  allocationId: string;
  locationName: string;
  quantity: number;
  unit: string;
  lotNumber?: string;
  expiryDate?: string;
  purpose?: string;
  prescriptionCode?: string;
  createdAt: string;
}

interface WarehouseState {
  areas: WarehouseArea[];
  allocations: AreaAllocation[];
  inventory: InventoryItem[];
  transactions: WarehouseTransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addArea: (area: Omit<WarehouseArea, "id" | "createdAt">) => string;
  updateArea: (id: string, area: Partial<WarehouseArea>) => void;
  deleteArea: (id: string) => void;
  
  addAllocation: (allocation: Omit<AreaAllocation, "id">) => string;
  updateAllocation: (id: string, allocation: Partial<AreaAllocation>) => void;
  deleteAllocation: (id: string) => void;

  adjustStock: (
    allocationId: string, 
    materialId: number, 
    materialType: 'crop' | 'livestock' | 'aquaculture',
    quantityChange: number, 
    unit: string,
    lotNumber?: string,
    expiryDate?: string
  ) => void;

  recordTransaction: (
    transaction: Omit<WarehouseTransaction, "id" | "createdAt">
  ) => string;
  
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
}

// Initial rich mock data
const initialAreas: WarehouseArea[] = [
  {
    id: "area-1",
    code: "KHO-01",
    name: "Kho Trung Tâm Miền Đông",
    address: "KCN Tân Bình, Quận Tân Phú, TP.HCM",
    latitude: 10.8077699,
    longitude: 106.6632456,
    safetyDistanceWater: 25.5,
    createdAt: "2026-08-01"
  },
  {
    id: "area-2",
    code: "KHO-02",
    name: "Kho Nông trường Alpha",
    address: "Xã Gia Lai, Huyện Chư Prông, Gia Lai",
    latitude: 13.9822,
    longitude: 107.9892,
    safetyDistanceWater: 45.0,
    createdAt: "2026-08-03"
  }
];

const initialAllocations: AreaAllocation[] = [
  {
    id: "alloc-1-1",
    areaId: "area-1",
    name: "Kệ A1 - Vật tư khô",
    notes: "Chứa phân bón và bao bì các loại",
    storageType: "General",
    isActive: true
  },
  {
    id: "alloc-1-2",
    areaId: "area-1",
    name: "Tủ đặc chủng khóa từ",
    notes: "Thuốc độc nhóm Ia, Ib cần kiểm soát đặc biệt",
    storageType: "Locked_Cabinet",
    isActive: true
  },
  {
    id: "alloc-1-3",
    areaId: "area-1",
    name: "Kho lạnh vaccine",
    notes: "Duy trì nhiệt độ 2-8 độ C",
    storageType: "Cold_Storage",
    isActive: true
  },
  {
    id: "alloc-2-1",
    areaId: "area-2",
    name: "Khu chứa phân bón axit",
    notes: "Khu vực lót gạch chống ăn mòn",
    storageType: "Acidic_Fertilizer",
    isActive: true
  },
  {
    id: "alloc-2-2",
    areaId: "area-2",
    name: "Kệ B2 - Thuốc BVTV",
    notes: "Khu vực cao, thoáng mát cách xa nguồn nước",
    storageType: "Pesticide",
    isActive: true
  }
];

const initialInventory: InventoryItem[] = [
  {
    id: "inv-1",
    allocationId: "alloc-1-1",
    materialId: 1,
    materialType: "crop",
    quantity: 120,
    unit: "Gói",
    lotNumber: "LOT-A25",
    expiryDate: "2028-06-30",
    lastUpdated: "2026-08-08T19:46:55Z"
  },
  {
    id: "inv-2",
    allocationId: "alloc-1-2",
    materialId: 3,
    materialType: "crop",
    quantity: 15,
    unit: "Chai",
    lotNumber: "LOT-G20",
    expiryDate: "2027-12-31",
    lastUpdated: "2026-08-08T20:10:00Z"
  },
  {
    id: "inv-3",
    allocationId: "alloc-1-3",
    materialId: 2,
    materialType: "livestock",
    quantity: 350,
    unit: "Lọ",
    lotNumber: "LOT-VAC99",
    expiryDate: "2027-03-15",
    lastUpdated: "2026-08-08T21:15:22Z"
  }
];

const useWarehouseStore = create<WarehouseState>()(
  devtools(
    persist(
      (set, get) => ({
        areas: initialAreas,
        allocations: initialAllocations,
        inventory: initialInventory,
        transactions: [],
        isLoading: false,
        error: null,

        addArea: (areaData) => {
          const id = "area-" + Math.random().toString(36).substring(2, 9);
          set(
            (state) => ({
              areas: [
                ...state.areas,
                {
                  ...areaData,
                  id,
                  createdAt: new Date().toISOString().split("T")[0]
                }
              ]
            }),
            false,
            "addArea"
          );
          return id;
        },

        updateArea: (id, areaData) =>
          set(
            (state) => ({
              areas: state.areas.map((a) => (a.id === id ? { ...a, ...areaData } : a))
            }),
            false,
            "updateArea"
          ),

        deleteArea: (id) =>
          set(
            (state) => ({
              areas: state.areas.filter((a) => a.id !== id),
              allocations: state.allocations.filter((al) => al.areaId !== id)
            }),
            false,
            "deleteArea"
          ),

        addAllocation: (allocationData) => {
          const id = "alloc-" + Math.random().toString(36).substring(2, 9);
          set(
            (state) => ({
              allocations: [
                ...state.allocations,
                {
                  ...allocationData,
                  id
                }
              ]
            }),
            false,
            "addAllocation"
          );
          return id;
        },

        updateAllocation: (id, allocationData) =>
          set(
            (state) => ({
              allocations: state.allocations.map((a) =>
                a.id === id ? { ...a, ...allocationData } : a
              )
            }),
            false,
            "updateAllocation"
          ),

        deleteAllocation: (id) =>
          set(
            (state) => ({
              allocations: state.allocations.filter((a) => a.id !== id),
              inventory: state.inventory.filter((inv) => inv.allocationId !== id)
            }),
            false,
            "deleteAllocation"
          ),

        adjustStock: (allocationId, materialId, materialType, quantityChange, unit, lotNumber, expiryDate) =>
          set(
            (state) => {
              const existingItemIndex = state.inventory.findIndex(
                (item) =>
                  item.allocationId === allocationId &&
                  item.materialId === materialId &&
                  item.materialType === materialType &&
                  item.lotNumber === lotNumber
              );

              const nowStr = new Date().toISOString();

              if (existingItemIndex > -1) {
                const updatedInventory = [...state.inventory];
                const existingItem = updatedInventory[existingItemIndex];
                const newQty = existingItem.quantity + quantityChange;

                if (newQty <= 0) {
                  updatedInventory.splice(existingItemIndex, 1);
                } else {
                  updatedInventory[existingItemIndex] = {
                    ...existingItem,
                    quantity: newQty,
                    lastUpdated: nowStr
                  };
                }
                return { inventory: updatedInventory };
              } else if (quantityChange > 0) {
                const newRecord: InventoryItem = {
                  id: "inv-" + Math.random().toString(36).substring(2, 9),
                  allocationId,
                  materialId,
                  materialType,
                  quantity: quantityChange,
                  unit,
                  lotNumber,
                  expiryDate,
                  lastUpdated: nowStr
                };
                return { inventory: [newRecord, ...state.inventory] };
              }
              return {};
            },
            false,
            "adjustStock"
          ),

        recordTransaction: (transactionData) => {
          const typePrefix = transactionData.type === "IN" ? "PNK" : "PXK";
          const randomNum = Math.floor(10000 + Math.random() * 90000);
          const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
          const id = `${typePrefix}-${dateStr}-${randomNum}`;
          
          set(
            (state) => ({
              transactions: [
                {
                  ...transactionData,
                  id,
                  createdAt: new Date().toLocaleString("vi-VN")
                },
                ...state.transactions
              ]
            }),
            false,
            "recordTransaction"
          );
          return id;
        },

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        reset: () =>
          set(
            {
              areas: initialAreas,
              allocations: initialAllocations,
              inventory: initialInventory,
              transactions: [],
              isLoading: false,
              error: null
            },
            false,
            "reset"
          )
      }),
      {
        name: "warehouse-storage",
        partialize: (state) => ({
          areas: state.areas,
          allocations: state.allocations,
          inventory: state.inventory,
          transactions: state.transactions
        })
      }
    ),
    {
      name: "WarehouseStore"
    }
  )
);

export default useWarehouseStore;
