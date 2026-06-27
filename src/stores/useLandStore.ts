import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Land {
  id: number;
  code: string;
  name: string;
  imageUrl?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

const initialLands: Land[] = [
  {
    id: 1,
    code: "phusa",
    name: "Đất phù sa",
    imageUrl: "https://sudospaces.com/vietchem/2024/03/dat-phu-sa-1.jpg",
    description:
      "Giàu dinh dưỡng, tơi xốp, khả năng giữ nước tốt, thường được bồi đắp liên tục tại các lưu vực sông ngòi.",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "feralit",
    name: "Đất feralit",
    imageUrl:
      "https://cdn.thuviennhadat.vn/upload/hinh-anh-bai-viet/TTMN/thang-04-2025/17-4-2025/dat-feralit-o-nuoc-ta-thuong-bi-chua-chu-yeu-la-do-dau.jpg",
    description:
      "Thường có màu đỏ hoặc vàng, giàu sắt và nhôm. Phổ biến ở vùng đồi núi nhưng rất dễ bị xói mòn nếu thiếu thảm thực vật che phủ.",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "mun",
    name: "Đất mùn",
    imageUrl: "https://sfarm.vn/wp-content/uploads/2021/01/mun-huu-co-la-gi.jpg",
    description:
      "Rất giàu chất hữu cơ, kết cấu tơi xốp, thường hình thành ở các vùng đồi núi cao có điều kiện khí hậu mát mẻ.",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "xam",
    name: "Đất xám",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwQYFS5DSBfO3vTYZvEb7LgDn2PkbfkBUPeA&s",
    description:
      "Có kết cấu nhẹ, nghèo dinh dưỡng, thường xuyên khô cằn và cần có biện pháp cải tạo phù hợp để có thể canh tác nông nghiệp.",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "phen",
    name: "Đất phèn",
    imageUrl: "https://tanhuyhoang.net/wp-content/uploads/2021/10/Picture44.jpg",
    description:
      "Có độ chua (pH) cao, chứa nhiều hợp chất phèn độc hại cho rễ cây, cần được cải tạo kỹ lưỡng bằng phương pháp thau chua rửa phèn hoặc bón vôi.",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "cat",
    name: "Đất cát",
    imageUrl:
      "https://chaunhuatrongcayblog.wordpress.com/wp-content/uploads/2023/09/image-6.png",
    description:
      "Kết cấu rời rạc, khả năng thoát nước và hấp thụ nhiệt rất nhanh nhưng lại nghèo chất dinh dưỡng.",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "bazan",
    name: "Đất bazan",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlmrvqQAVCVUx0FvNxr-07y7p_B9K2dnaUMg&s",
    description:
      "Đặc trưng bởi màu đỏ nâu, vô cùng tơi xốp, dồi dào dinh dưỡng và giữ ẩm tốt. Rất phù hợp để trồng cây công nghiệp lâu năm.",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "man",
    name: "Đất mặn",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIAYBsCMJ6MMb0Bkh1U-3RvBomWf7Nyb9XIQ&s",
    description:
      "Chứa hàm lượng muối hòa tan cao, cản trở sự sinh trưởng của thực vật thông thường. Cần cải tạo bằng rửa mặn hoặc chuyên canh cây chịu mặn.",
    status: "active",
    createdAt: "2024-01-17",
  },
];

interface LandState {
  lands: Land[];
  isLoading: boolean;
  error: string | null;

  setLands: (lands: Land[]) => void;
  addLand: (land: Omit<Land, "id" | "createdAt" | "status">) => void;
  updateLand: (id: number, land: Partial<Land>) => void;
  deleteLand: (id: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const useLandStore = create<LandState>()(
  devtools(
    persist(
      (set) => ({
        lands: initialLands,
        isLoading: false,
        error: null,

        setLands: (lands) => set({ lands }),
        addLand: (landData) =>
          set((state) => ({
            lands: [
              {
                ...landData,
                id: Date.now(),
                status: "active",
                createdAt: new Date().toISOString().split("T")[0],
              },
              ...state.lands,
            ],
          })),
        updateLand: (id, landData) =>
          set((state) => ({
            lands: state.lands.map((l) =>
              l.id === id ? { ...l, ...landData } : l,
            ),
          })),
        deleteLand: (id) =>
          set((state) => ({
            lands: state.lands.filter((l) => l.id !== id),
          })),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
      }),
      {
        name: "land-storage",
      },
    ),
    { name: "LandStore" },
  ),
);

export default useLandStore;
