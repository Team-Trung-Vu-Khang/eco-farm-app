import { create } from "zustand";

export interface Position {
  id: number;
  code: string;
  name: string;
  group: string;
  description: string;
  responsibilities: string[];
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
    // Nhóm lãnh đạo – ban giám đốc
    {
      id: 101,
      code: "POS-DIR-01",
      name: "Chủ tịch Hội đồng quản trị (Chairman of the Board)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Người đứng đầu Hội đồng quản trị, chịu trách nhiệm định hướng chiến lược tổng thể và giám sát hoạt động ban điều hành.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 102,
      code: "POS-DIR-02",
      name: "Phó Chủ tịch Hội đồng quản trị (Vice Chairman)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ Chủ tịch HĐQT trong điều phối công việc của Hội đồng quản trị và thay thế khi Chủ tịch vắng mặt.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 103,
      code: "POS-DIR-03",
      name: "Tổng Giám đốc (CEO / General Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Người điều hành cao nhất của doanh nghiệp, chịu trách nhiệm toàn diện về hoạt động sản xuất kinh doanh trước Hội đồng quản trị.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 104,
      code: "POS-DIR-04",
      name: "Phó Tổng Giám đốc (Deputy CEO)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ Tổng Giám đốc điều hành các mảng hoạt động được phân công và thay thế khi Tổng Giám đốc ủy quyền.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 105,
      code: "POS-DIR-05",
      name: "Giám đốc điều hành (COO – Chief Operating Officer)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Chịu trách nhiệm vận hành hàng ngày của toàn bộ hệ thống sản xuất và kinh doanh.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 106,
      code: "POS-DIR-06",
      name: "Giám đốc tài chính (CFO – Chief Financial Officer)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Quản lý toàn bộ tài chính, ngân sách, kế hoạch đầu tư và báo cáo tài chính của doanh nghiệp.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 107,
      code: "POS-DIR-07",
      name: "Giám đốc kinh doanh (CSO / Commercial Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Phụ trách chiến lược bán hàng, phát triển thị trường và quản lý đội ngũ kinh doanh.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 108,
      code: "POS-DIR-08",
      name: "Giám đốc kỹ thuật (CTO / Technical Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Phụ trách toàn bộ lĩnh vực kỹ thuật nông nghiệp, nghiên cứu và phát triển công nghệ canh tác.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 109,
      code: "POS-DIR-09",
      name: "Giám đốc sản xuất (Production Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Phụ trách toàn bộ hoạt động sản xuất nông nghiệp, điều phối các vùng trồng và nhà máy sơ chế.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 110,
      code: "POS-DIR-10",
      name: "Giám đốc nhân sự (CHRO / HR Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Phụ trách chiến lược nhân sự, tuyển dụng, đào tạo và phát triển nguồn nhân lực.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 111,
      code: "POS-DIR-11",
      name: "Phó Giám đốc sản xuất",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ Giám đốc sản xuất trong điều phối các hoạt động canh tác và phân công nhiệm vụ các tổ đội.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 112,
      code: "POS-DIR-12",
      name: "Phó Giám đốc kỹ thuật",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ Giám đốc kỹ thuật trong nghiên cứu, áp dụng và giám sát quy trình kỹ thuật nông nghiệp.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 113,
      code: "POS-DIR-13",
      name: "Phó Giám đốc kinh doanh",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ Giám đốc kinh doanh trong triển khai chiến lược bán hàng và quản lý kênh phân phối.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 114,
      code: "POS-DIR-14",
      name: "Giám đốc vùng (Regional Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Phụ trách quản lý và điều phối hoạt động của toàn bộ các trang trại, vùng trồng trong khu vực địa lý được giao.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 115,
      code: "POS-DIR-15",
      name: "Giám đốc dự án (Project Director)",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Chịu trách nhiệm triển khai và quản lý các dự án nông nghiệp lớn theo đúng tiến độ, ngân sách và chất lượng.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 116,
      code: "POS-DIR-16",
      name: "Trưởng Ban kiểm soát",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Đứng đầu Ban kiểm soát nội bộ, đảm bảo hoạt động doanh nghiệp tuân thủ pháp luật và quy chế nội bộ.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 117,
      code: "POS-DIR-17",
      name: "Thư ký Hội đồng quản trị",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ công tác hành chính pháp lý cho Hội đồng quản trị, soạn thảo biên bản, nghị quyết và tài liệu họp.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 118,
      code: "POS-DIR-18",
      name: "Trợ lý Tổng Giám đốc / Giám đốc",
      group: "Nhóm lãnh đạo – ban giám đốc",
      description:
        "Hỗ trợ trực tiếp Tổng Giám đốc hoặc Giám đốc trong lịch làm việc, điều phối công việc nội bộ và đối ngoại.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },

    // Nhóm quản lý – điều hành
    {
      id: 1,
      code: "POS-MNG-01",
      name: "Chủ trang trại (Farm Owner)",
      group: "Nhóm quản lý – điều hành",
      description:
        "Người sở hữu và chịu trách nhiệm cao nhất về hoạt động của trang trại.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 3,
      code: "POS-MNG-03",
      name: "Quản lý sản xuất nông nghiệp",
      group: "Nhóm quản lý – điều hành",
      description: "Quản lý trực tiếp các hoạt động sản xuất nông nghiệp.",
      responsibilities: [],
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
      responsibilities: [],
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
      responsibilities: [],
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
      responsibilities: [],
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
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-04",
    },
    {
      id: 9,
      code: "POS-TECH-03",
      name: "Kỹ thuật viên canh tác",
      group: "Nhóm kỹ thuật trồng trọt",
      description: "Thực hiện và giám sát các quy trình canh tác kỹ thuật.",
      responsibilities: [],
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
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-06",
    },
    {
      id: 12,
      code: "POS-PPRO-02",
      name: "Kỹ thuật viên IPM",
      group: "Nhóm bảo vệ thực vật",
      description: "Thực hiện quản lý dịch hại tổng hợp.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-06",
    },
    {
      id: 13,
      code: "POS-PPRO-03",
      name: "Giám sát phun thuốc",
      group: "Nhóm bảo vệ thực vật",
      description: "Giám sát quy trình pha chế và phun thuốc bảo vệ thực vật.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-08",
    },
    {
      id: 15,
      code: "POS-SOIL-02",
      name: "Chuyên viên dinh dưỡng cây trồng",
      group: "Nhóm đất – phân bón – dinh dưỡng",
      description: "Xây dựng chế độ dinh dưỡng và phân bón cho cây trồng.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-09",
    },
    {
      id: 17,
      code: "POS-SYS-02",
      name: "Kỹ thuật viên nhà kính",
      group: "Nhóm tưới – hệ thống – nhà màng",
      description: "Vận hành và bảo trì hệ thống nhà màng, nhà kính.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-09",
    },
    {
      id: 18,
      code: "POS-SYS-03",
      name: "Kỹ thuật viên thủy canh",
      group: "Nhóm tưới – hệ thống – nhà màng",
      description: "Chuyên trách kỹ thuật cho hệ thống trồng thủy canh.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 20,
      code: "POS-SEED-02",
      name: "Kỹ thuật viên giống",
      group: "Nhóm giống – vườn ươm",
      description: "Thực hiện kỹ thuật nhân giống và chọn lọc giống.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 22,
      code: "POS-HARV-02",
      name: "Quản lý sơ chế – đóng gói",
      group: "Nhóm thu hoạch – sơ chế – chất lượng",
      description: "Quản lý quy trình sơ chế và đóng gói sau thu hoạch.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 23,
      code: "POS-QC-01",
      name: "Nhân viên QC nông sản",
      group: "Nhóm thu hoạch – sơ chế – chất lượng",
      description: "Kiểm soát chất lượng nông sản đầu ra.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 25,
      code: "POS-STD-02",
      name: "Nhân viên ghi chép nhật ký canh tác",
      group: "Nhóm tiêu chuẩn – chứng nhận – truy xuất",
      description: "Ghi chép và lưu trữ hồ sơ nhật ký sản xuất.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 27,
      code: "POS-LOG-02",
      name: "Điều phối vận chuyển nông sản",
      group: "Nhóm kho – vật tư – logistics",
      description: "Điều phối phương tiện và lịch trình vận chuyển.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 29,
      code: "POS-MECH-02",
      name: "Lái máy nông nghiệp",
      group: "Nhóm cơ giới – bảo trì",
      description: "Vận hành máy cày, máy gặt và các thiết bị cơ giới khác.",
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 30,
      code: "POS-MECH-03",
      name: "Thợ máy nông nghiệp",
      group: "Nhóm cơ giới – bảo trì",
      description: "Bảo trì và sửa chữa máy móc thiết bị nông nghiệp.",
      responsibilities: [],
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
      responsibilities: [],
      status: "active",
      createdAt: "2024-01-18",
    },
    {
      id: 32,
      code: "POS-LAB-02",
      name: "Công nhân thời vụ",
      group: "Nhóm lao động trực tiếp",
      description: "Lao động làm việc theo thời vụ hoặc công nhật.",
      responsibilities: [],
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
