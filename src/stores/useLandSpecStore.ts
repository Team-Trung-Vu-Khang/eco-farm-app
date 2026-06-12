import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface LandSpec {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialLandSpecs: LandSpec[] = [
  {
    id: 1,
    code: "aspect",
    name: "Hướng dốc",
    description:
      "Hướng mặt nghiêng của địa hình so với la bàn (Đông, Tây, Nam, Bắc), ảnh hưởng trực tiếp đến lượng bức xạ mặt trời mà khu vực tiếp nhận.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "curvature",
    name: "Độ cong địa hình",
    description:
      "Đặc điểm lồi, lõm hay bằng phẳng của bề mặt, quyết định khả năng phân tán hoặc hội tụ dòng chảy và sự tích tụ dinh dưỡng.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "slope",
    name: "Độ dài dốc",
    description:
      "Chiều dài và mức độ nghiêng của sườn dốc, có tác động lớn đến tốc độ dòng chảy bề mặt và nguy cơ xói mòn đất.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "roughness",
    name: "Độ gồ ghề",
    description:
      "Sự nhấp nhô và mức độ không bằng phẳng của bề mặt địa hình, ảnh hưởng đến khả năng di chuyển, cơ giới hóa và canh tác.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    code: "proximity",
    name: "Khoảng cách đến nguồn nước",
    description:
      "Khoảng cách từ vị trí khu đất đến các nguồn nước mặt gần nhất (sông, suối, ao, hồ), quan trọng cho việc tưới tiêu và sinh hoạt.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    code: "vegetation-cover",
    name: "Độ che phủ bề mặt",
    description:
      "Tỷ lệ % diện tích đất được che phủ bởi thảm thực vật (rừng, cỏ, cây bụi), đóng vai trò giữ ẩm và bảo vệ đất khỏi xói mòn.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "drainage-pattern",
    name: "Đặc điểm thủy văn",
    description:
      "Mạng lưới, hướng dòng chảy bề mặt và khả năng thoát nước tự nhiên của khu vực, quyết định mức độ rủi ro ngập úng.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 8,
    code: "surface-material",
    name: "Phân bố đá",
    description:
      "Loại vật liệu, kích thước và tỷ lệ đá lộ trên bề mặt, ảnh hưởng đến độ phì nhiêu cũng như mức độ khó khăn khi làm đất.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 9,
    code: "geological-history",
    name: "Lịch sử địa chất",
    description:
      "Nguồn gốc hình thành và các quá trình biến đổi địa chất qua các thời kỳ (như trầm tích, hoạt động núi lửa), quyết định tính chất cơ bản của đất mẹ.",
    status: "active",
    createdAt: "2024-01-15",
  },
];

interface LandSpecState {
  landSpecs: LandSpec[];
  isLoading: boolean;
  error: string | null;

  setLandSpecs: (landSpecs: LandSpec[]) => void;
  addLandSpec: (
    landSpec: Omit<LandSpec, "id" | "createdAt" | "status">,
  ) => void;
  updateLandSpec: (id: number, landSpec: Partial<LandSpec>) => void;
  deleteLandSpec: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useLandSpecStore = create<LandSpecState>()(
  devtools(
    persist(
      (set) => ({
        landSpecs: initialLandSpecs,
        isLoading: false,
        error: null,

        setLandSpecs: (landSpecs) => set({ landSpecs }),
        addLandSpec: (landSpecData) =>
          set((state) => ({
            landSpecs: [
              {
                ...landSpecData,
                id: Date.now(),
                status: "active",
                createdAt: new Date().toISOString().split("T")[0],
              },
              ...state.landSpecs,
            ],
          })),
        updateLandSpec: (id, landSpecData) =>
          set((state) => ({
            landSpecs: state.landSpecs.map((ls) =>
              ls.id === id ? { ...ls, ...landSpecData } : ls,
            ),
          })),
        deleteLandSpec: (id) =>
          set((state) => ({
            landSpecs: state.landSpecs.filter((ls) => ls.id !== id),
          })),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "land-spec-storage",
      },
    ),
    { name: "LandSpecStore" },
  ),
);

export default useLandSpecStore;
