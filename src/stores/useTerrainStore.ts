import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Terrain {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialTerrains: Terrain[] = [
  {
    id: 1,
    code: "DH001",
    name: "Đồng bằng",
    description:
      "Địa hình bằng phẳng, độ dốc thấp, phù hợp canh tác lúa và hoa màu",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "DH002",
    name: "Trung du",
    description: "Vùng chuyển tiếp giữa miền núi và đồng bằng, độ dốc vừa phải",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "DH003",
    name: "Đồi",
    description: "Địa hình dốc nhẹ, bát úp, phù hợp cây công nghiệp và ăn quả",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 4,
    code: "DH004",
    name: "Núi",
    description: "Địa hình chia cắt mạnh, độ dốc cao, phù hợp lâm nghiệp",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 5,
    code: "DH005",
    name: "Cao nguyên",
    description: "Vùng đất tương đối bằng phẳng ở độ cao lớn, khí hậu ôn hòa",
    status: "active",
    createdAt: "2024-01-17",
  },
  {
    id: 6,
    code: "DH006",
    name: "Ven biển",
    description:
      "Khu vực giáp biển, đất cát hoặc nhiễm mặn, chịu ảnh hưởng thủy triều",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 7,
    code: "DH007",
    name: "Bán ngập / trũng",
    description:
      "Khu vực thường xuyên ngập nước hoặc trũng thấp, phù hợp thủy sản",
    status: "active",
    createdAt: "2024-01-18",
  },
];

interface TerrainState {
  terrains: Terrain[];
  isLoading: boolean;
  error: string | null;

  setTerrains: (terrains: Terrain[]) => void;
  addTerrain: (terrain: Omit<Terrain, "id" | "createdAt" | "status">) => void;
  updateTerrain: (id: number, terrain: Partial<Terrain>) => void;
  deleteTerrain: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useTerrainStore = create<TerrainState>()(
  devtools(
    persist(
      (set) => ({
        terrains: initialTerrains,
        isLoading: false,
        error: null,

        setTerrains: (terrains) => set({ terrains }),
        addTerrain: (terrainData) =>
          set((state) => ({
            terrains: [
              {
                ...terrainData,
                id: Date.now(),
                status: "active",
                createdAt: new Date().toISOString().split("T")[0],
              },
              ...state.terrains,
            ],
          })),
        updateTerrain: (id, terrainData) =>
          set((state) => ({
            terrains: state.terrains.map((t) =>
              t.id === id ? { ...t, ...terrainData } : t,
            ),
          })),
        deleteTerrain: (id) =>
          set((state) => ({
            terrains: state.terrains.filter((t) => t.id !== id),
          })),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "terrain-storage",
      },
    ),
    { name: "TerrainStore" },
  ),
);

export default useTerrainStore;
