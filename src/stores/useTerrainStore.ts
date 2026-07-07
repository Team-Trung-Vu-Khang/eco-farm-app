import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Terrain {
  id: number;
  code?: string;
  name: string;
  type?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialTerrains: Terrain[] = [
  {
    id: 1,
    code: "east",
    name: "Đông",
    type: "aspect",
    description:
      "Địa hình hướng về phía Đông, thường đón ánh nắng mặt trời vào buổi sáng sớm.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "west",
    name: "Tây",
    type: "aspect",
    description:
      "Địa hình hướng về phía Tây, thường chịu tác động của ánh nắng gay gắt vào buổi chiều.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "south",
    name: "Nam",
    type: "aspect",
    description:
      "Địa hình hướng về phía Nam, thường ấm áp và đón được nhiều ánh sáng mặt trời trong suốt cả ngày.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "north",
    name: "Bắc",
    type: "aspect",
    description:
      "Địa hình hướng về phía Bắc, ít nhận được ánh sáng mặt trời trực tiếp nên thường mát mẻ và ẩm hơn.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    code: "convex",
    name: "Lồi",
    type: "curvature",
    description:
      "Bề mặt địa hình nhô cao lên so với khu vực xung quanh, có khả năng thoát nước tự nhiên rất tốt.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    code: "concave",
    name: "Lõm",
    type: "curvature",
    description:
      "Bề mặt địa hình trũng xuống tạo thành dạng lòng chảo, dễ tích tụ dòng chảy và giữ nước.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "flat",
    name: "Bằng phẳng",
    type: "curvature",
    description:
      "Bề mặt địa hình tương đối đồng bằng, độ dốc nhỏ hoặc không đáng kể, thuận lợi cho xây dựng và canh tác.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 8,
    code: "roughness-hight", // Lưu ý: chữ "hight" có thể là lỗi chính tả của "high"
    name: "Cao",
    type: "roughness",
    description:
      "Bề mặt rất gồ ghề và hiểm trở, có nhiều thay đổi về độ cao liên tục và nhiều chướng ngại vật.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 9,
    code: "roughness-medium",
    name: "Trung Bình",
    type: "roughness",
    description:
      "Độ gồ ghề ở mức vừa phải, có sự nhấp nhô nhưng không gây cản trở quá lớn đối với các hoạt động chung.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 10,
    code: "roughness-short", // Lưu ý: "short" có thể là lỗi chính tả/ngữ nghĩa của "low"
    name: "Thấp",
    type: "roughness",
    description:
      "Bề mặt tương đối nhẵn mịn, ít vật cản và chướng ngại vật, dễ dàng cho việc di chuyển.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 11,
    code: "geological-history-sedimentary",
    name: "Trầm tích",
    type: "geological-history",
    description:
      "Địa hình được hình thành do sự lắng đọng và tích tụ của các vật liệu như cát, bùn, hoặc mảnh vụn sinh vật qua thời gian dài.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 12,
    code: "geological-volcanic",
    name: "Núi lửa",
    type: "geological-history",
    description:
      "Địa hình được hình thành từ các hoạt động phun trào macma, dung nham và tro bụi của núi lửa trong quá khứ.",
    status: "active",
    createdAt: "2024-01-15",
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
