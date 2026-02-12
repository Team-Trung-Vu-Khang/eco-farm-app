import { create } from "zustand";

export interface Position {
  id: number;
  code: string;
  name: string;
  group: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface PositionStore {
  positions: Position[];

  // CRUD operations
  getPositionById: (id: number) => Position | undefined;
  addPosition: (position: Omit<Position, "id" | "createdAt">) => void;
  updatePosition: (
    id: number,
    updates: Partial<Omit<Position, "id" | "createdAt">>,
  ) => void;
  deletePosition: (id: number) => void;
}

const usePositionStore = create<PositionStore>((set, get) => ({
  // Initial data
  positions: [
    // Nhóm quản lý – điều hành
    {
      id: 1,
      code: "POS-MNG-01",
      name: "Chủ trang trại (Farm Owner)",
      group: "Nhóm quản lý – điều hành",
      description:
        "Người sở hữu và chịu trách nhiệm cao nhất về hoạt động của trang trại.",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      code: "POS-MNG-02",
      name: "Giám đốc trang trại (Farm Director)",
      group: "Nhóm quản lý – điều hành",
      description:
        "Điều hành toàn bộ hoạt động sản xuất kinh doanh của trang trại.",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      code: "POS-MNG-03",
      name: "Quản lý sản xuất nông nghiệp",
      group: "Nhóm quản lý – điều hành",
      description: "Quản lý trực tiếp các hoạt động sản xuất nông nghiệp.",
      status: "active",
      createdAt: "2024-01-02",
    },
    {
      id: 4,
      code: "POS-MNG-04",
      name: "Quản lý vùng trồng",
      group: "Nhóm quản lý – điều hành",
      description:
        "Quản lý hoạt động canh tác tại một khu vực hoặc vùng trồng cụ thể.",
      status: "active",
      createdAt: "2024-01-02",
    },
    {
      id: 5,
      code: "POS-MNG-05",
      name: "Tổ trưởng sản xuất",
      group: "Nhóm quản lý – điều hành",
      description:
        "Trực tiếp chỉ đạo và giám sát đội ngũ sản xuất tại hiện trường.",
      status: "active",
      createdAt: "2024-01-03",
    },
    {
      id: 6,
      code: "POS-MNG-06",
      name: "Giám sát hiện trường",
      group: "Nhóm quản lý – điều hành",
      description:
        "Giám sát việc thực hiện quy trình kỹ thuật và công việc hàng ngày.",
      status: "active",
      createdAt: "2024-01-03",
    },

    // Nhóm kỹ thuật trồng trọt
    {
      id: 7,
      code: "POS-TECH-01",
      name: "Kỹ sư nông nghiệp",
      group: "Nhóm kỹ thuật trồng trọt",
      description: "Chịu trách nhiệm kỹ thuật chung về trồng trọt.",
      status: "active",
      createdAt: "2024-01-04",
    },
    {
      id: 8,
      code: "POS-TECH-02",
      name: "Kỹ sư trồng trọt (Agronomist)",
      group: "Nhóm kỹ thuật trồng trọt",
      description:
        "Nghiên cứu và áp dụng các biện pháp kỹ thuật để tối ưu hóa năng suất.",
      status: "active",
      createdAt: "2024-01-04",
    },
    {
      id: 9,
      code: "POS-TECH-03",
      name: "Kỹ thuật viên canh tác",
      group: "Nhóm kỹ thuật trồng trọt",
      description: "Thực hiện và giám sát các quy trình canh tác kỹ thuật.",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: 10,
      code: "POS-TECH-04",
      name: "Chuyên viên kỹ thuật cây trồng",
      group: "Nhóm kỹ thuật trồng trọt",
      description:
        "Chuyên sâu về kỹ thuật cho nhóm cây ăn trái, cây công nghiệp hoặc rau màu.",
      status: "active",
      createdAt: "2024-01-05",
    },

    // Nhóm bảo vệ thực vật
    {
      id: 11,
      code: "POS-PPRO-01",
      name: "Kỹ sư bảo vệ thực vật",
      group: "Nhóm bảo vệ thực vật",
      description: "Chẩn đoán và đưa ra phác đồ phòng trừ sâu bệnh hại.",
      status: "active",
      createdAt: "2024-01-06",
    },
    {
      id: 12,
      code: "POS-PPRO-02",
      name: "Kỹ thuật viên IPM",
      group: "Nhóm bảo vệ thực vật",
      description: "Thực hiện quản lý dịch hại tổng hợp.",
      status: "active",
      createdAt: "2024-01-06",
    },
    {
      id: 13,
      code: "POS-PPRO-03",
      name: "Giám sát phun thuốc",
      group: "Nhóm bảo vệ thực vật",
      description: "Giám sát quy trình pha chế và phun thuốc bảo vệ thực vật.",
      status: "active",
      createdAt: "2024-01-07",
    },

    // Nhóm đất – phân bón – dinh dưỡng
    {
      id: 14,
      code: "POS-SOIL-01",
      name: "Kỹ sư thổ nhưỡng",
      group: "Nhóm đất – phân bón – dinh dưỡng",
      description: "Phân tích và quản lý sức khỏe đất đai.",
      status: "active",
      createdAt: "2024-01-08",
    },
    {
      id: 15,
      code: "POS-SOIL-02",
      name: "Chuyên viên dinh dưỡng cây trồng",
      group: "Nhóm đất – phân bón – dinh dưỡng",
      description: "Xây dựng chế độ dinh dưỡng và phân bón cho cây trồng.",
      status: "active",
      createdAt: "2024-01-08",
    },

    // Nhóm tưới – hệ thống – nhà màng
    {
      id: 16,
      code: "POS-SYS-01",
      name: "Kỹ sư tưới (Irrigation Engineer)",
      group: "Nhóm tưới – hệ thống – nhà màng",
      description: "Thiết kế và vận hành hệ thống tưới tiêu.",
      status: "active",
      createdAt: "2024-01-09",
    },
    {
      id: 17,
      code: "POS-SYS-02",
      name: "Kỹ thuật viên nhà kính",
      group: "Nhóm tưới – hệ thống – nhà màng",
      description: "Vận hành và bảo trì hệ thống nhà màng, nhà kính.",
      status: "active",
      createdAt: "2024-01-09",
    },
    {
      id: 18,
      code: "POS-SYS-03",
      name: "Kỹ thuật viên thủy canh",
      group: "Nhóm tưới – hệ thống – nhà màng",
      description: "Chuyên trách kỹ thuật cho hệ thống trồng thủy canh.",
      status: "active",
      createdAt: "2024-01-10",
    },

    // Nhóm giống – vườn ươm
    {
      id: 19,
      code: "POS-SEED-01",
      name: "Quản lý vườn ươm",
      group: "Nhóm giống – vườn ươm",
      description: "Quản lý hoạt động sản xuất và chăm sóc cây giống.",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 20,
      code: "POS-SEED-02",
      name: "Kỹ thuật viên giống",
      group: "Nhóm giống – vườn ươm",
      description: "Thực hiện kỹ thuật nhân giống và chọn lọc giống.",
      status: "active",
      createdAt: "2024-01-11",
    },

    // Nhóm thu hoạch – sơ chế – chất lượng
    {
      id: 21,
      code: "POS-HARV-01",
      name: "Tổ trưởng thu hoạch",
      group: "Nhóm thu hoạch – sơ chế – chất lượng",
      description: "Điều phối hoạt động thu hoạch nông sản.",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 22,
      code: "POS-HARV-02",
      name: "Quản lý sơ chế – đóng gói",
      group: "Nhóm thu hoạch – sơ chế – chất lượng",
      description: "Quản lý quy trình sơ chế và đóng gói sau thu hoạch.",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 23,
      code: "POS-QC-01",
      name: "Nhân viên QC nông sản",
      group: "Nhóm thu hoạch – sơ chế – chất lượng",
      description: "Kiểm soát chất lượng nông sản đầu ra.",
      status: "active",
      createdAt: "2024-01-13",
    },

    // Nhóm tiêu chuẩn – chứng nhận – truy xuất
    {
      id: 24,
      code: "POS-STD-01",
      name: "Chuyên viên VietGAP/GlobalGAP",
      group: "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
      description: "Đảm bảo tuân thủ các tiêu chuẩn thực hành nông nghiệp tốt.",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 25,
      code: "POS-STD-02",
      name: "Nhân viên ghi chép nhật ký canh tác",
      group: "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
      description: "Ghi chép và lưu trữ hồ sơ nhật ký sản xuất.",
      status: "active",
      createdAt: "2024-01-14",
    },

    // Nhóm kho – vật tư – logistics
    {
      id: 26,
      code: "POS-LOG-01",
      name: "Thủ kho nông trại",
      group: "Nhóm kho – vật tư – logistics",
      description: "Quản lý nhập xuất tồn vật tư nông nghiệp và nông sản.",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 27,
      code: "POS-LOG-02",
      name: "Điều phối vận chuyển nông sản",
      group: "Nhóm kho – vật tư – logistics",
      description: "Điều phối phương tiện và lịch trình vận chuyển.",
      status: "active",
      createdAt: "2024-01-15",
    },

    // Nhóm cơ giới – bảo trì
    {
      id: 28,
      code: "POS-MECH-01",
      name: "Quản lý cơ giới",
      group: "Nhóm cơ giới – bảo trì",
      description: "Quản lý đội xe máy và thiết bị cơ giới nông nghiệp.",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 29,
      code: "POS-MECH-02",
      name: "Lái máy nông nghiệp",
      group: "Nhóm cơ giới – bảo trì",
      description: "Vận hành máy cày, máy gặt và các thiết bị cơ giới khác.",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 30,
      code: "POS-MECH-03",
      name: "Thợ máy nông nghiệp",
      group: "Nhóm cơ giới – bảo trì",
      description: "Bảo trì và sửa chữa máy móc thiết bị nông nghiệp.",
      status: "active",
      createdAt: "2024-01-17",
    },

    // Nhóm lao động trực tiếp
    {
      id: 31,
      code: "POS-LAB-01",
      name: "Công nhân nông nghiệp",
      group: "Nhóm lao động trực tiếp",
      description: "Thực hiện các công việc lao động phổ thông tại trang trại.",
      status: "active",
      createdAt: "2024-01-18",
    },
    {
      id: 32,
      code: "POS-LAB-02",
      name: "Công nhân thời vụ",
      group: "Nhóm lao động trực tiếp",
      description: "Lao động làm việc theo thời vụ hoặc công nhật.",
      status: "active",
      createdAt: "2024-01-18",
    },
  ],

  // CRUD operations
  getPositionById: (id) => {
    return get().positions.find((p) => p.id === id);
  },

  addPosition: (positionData) => {
    set((state) => {
      const newId =
        state.positions.length > 0
          ? Math.max(...state.positions.map((p) => p.id)) + 1
          : 1;
      const newPosition: Position = {
        ...positionData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        positions: [...state.positions, newPosition],
      };
    });
  },

  updatePosition: (id, updates) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  },

  deletePosition: (id) => {
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    }));
  },
}));

export default usePositionStore;
