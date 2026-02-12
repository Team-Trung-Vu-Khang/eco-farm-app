import { create } from "zustand";

export interface Personnel {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  team: string; // Đội nhóm
  province: string;
  district: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  status: "active" | "inactive";
  avatar: string; // URL ảnh đại diện
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
}

interface PersonnelStore {
  personnel: Personnel[];

  // CRUD operations
  getPersonnelById: (id: number) => Personnel | undefined;
  addPersonnel: (personnel: Omit<Personnel, "id" | "createdAt">) => void;
  updatePersonnel: (
    id: number,
    updates: Partial<Omit<Personnel, "id" | "createdAt">>,
  ) => void;
  deletePersonnel: (id: number) => void;
  bulkAddPersonnel: (
    personnelList: Omit<Personnel, "id" | "createdAt">[],
  ) => void;
}

const usePersonnelStore = create<PersonnelStore>((set, get) => ({
  // Initial data
  personnel: [
    {
      id: 1,
      fullName: "Nguyễn Văn An",
      phone: "0901111111",
      email: "nguyenvanan@ecofarm.vn",
      position: "Kỹ sư nông nghiệp",
      department: "Phòng Kỹ Thuật",
      team: "Nhóm Nông Học",
      province: "Lâm Đồng",
      district: "Đà Lạt",
      address: "123 Đường Hùng Vương",
      taxCode: "1111111111",
      taxAddress: "Lâm Đồng",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=1",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      fullName: "Trần Thị Bình",
      phone: "0902222222",
      email: "tranthibinh@ecofarm.vn",
      position: "Kỹ sư nông nghiệp",
      department: "Phòng Kỹ Thuật",
      team: "Nhóm Nông Học",
      province: "Đắk Lắk",
      district: "Buôn Ma Thuột",
      address: "45 Đường Lê Duẩn",
      taxCode: "2222222222",
      taxAddress: "Đắk Lắk",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=2",
      createdAt: "2024-01-16",
    },
    {
      id: 3,
      fullName: "Lê Văn Cường",
      phone: "0903333333",
      email: "levancuong@ecofarm.vn",
      position: "Kỹ sư trồng trọt",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Trồng Trọt 1",
      province: "Đồng Nai",
      district: "Biên Hòa",
      address: "78 Đường Nguyễn Ái Quốc",
      taxCode: "3333333333",
      taxAddress: "Đồng Nai",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=3",
      createdAt: "2024-01-17",
    },
    {
      id: 4,
      fullName: "Phạm Thị Dung",
      phone: "0904444444",
      email: "phamthidung@ecofarm.vn",
      position: "Kỹ sư trồng trọt",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Trồng Trọt 1",
      province: "Bình Dương",
      district: "Thủ Dầu Một",
      address: "12 Đường Đại Lộ Bình Dương",
      taxCode: "4444444444",
      taxAddress: "Bình Dương",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=4",
      createdAt: "2024-01-18",
    },
    {
      id: 5,
      fullName: "Hoàng Văn Em",
      phone: "0905555555",
      email: "hoangvanem@ecofarm.vn",
      position: "Kỹ sư trồng trọt",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Trồng Trọt 2",
      province: "Tây Ninh",
      district: "Tây Ninh",
      address: "34 Đường 30/4",
      taxCode: "5555555555",
      taxAddress: "Tây Ninh",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=5",
      createdAt: "2024-01-19",
    },
    {
      id: 6,
      fullName: "Vũ Thị Phương",
      phone: "0906666666",
      email: "vuthiphuong@ecofarm.vn",
      position: "Kỹ sư trồng trọt",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Trồng Trọt 2",
      province: "Long An",
      district: "Tân An",
      address: "56 Đường Hùng Vương",
      taxCode: "6666666666",
      taxAddress: "Long An",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=6",
      createdAt: "2024-01-20",
    },
    {
      id: 7,
      fullName: "Đặng Văn Giang",
      phone: "0907777777",
      email: "dangvangiang@ecofarm.vn",
      position: "Kỹ thuật viên canh tác",
      department: "Phòng Sản Xuất",
      team: "Đội Canh Tác 1",
      province: "Tiền Giang",
      district: "Mỹ Tho",
      address: "89 Đường Ấp Bắc",
      taxCode: "7777777777",
      taxAddress: "Tiền Giang",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=7",
      createdAt: "2024-02-01",
    },
    {
      id: 8,
      fullName: "Bùi Thị Hạnh",
      phone: "0908888888",
      email: "buithihanh@ecofarm.vn",
      position: "Kỹ thuật viên canh tác",
      department: "Phòng Sản Xuất",
      team: "Đội Canh Tác 1",
      province: "Bến Tre",
      district: "Bến Tre",
      address: "90 Đường Đồng Khởi",
      taxCode: "8888888888",
      taxAddress: "Bến Tre",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=8",
      createdAt: "2024-02-02",
    },
    {
      id: 9,
      fullName: "Đỗ Văn Hùng",
      phone: "0909999999",
      email: "dovanhung@ecofarm.vn",
      position: "Kỹ thuật viên canh tác",
      department: "Phòng Sản Xuất",
      team: "Đội Canh Tác 2",
      province: "Vĩnh Long",
      district: "Vĩnh Long",
      address: "23 Đường Trưng Nữ Vương",
      taxCode: "9999999999",
      taxAddress: "Vĩnh Long",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=9",
      createdAt: "2024-02-03",
    },
    {
      id: 10,
      fullName: "Hồ Thị Lan",
      phone: "0910101010",
      email: "hothilan@ecofarm.vn",
      position: "Kỹ thuật viên canh tác",
      department: "Phòng Sản Xuất",
      team: "Đội Canh Tác 2",
      province: "Cần Thơ",
      district: "Ninh Kiều",
      address: "45 Đường 3/2",
      taxCode: "1010101010",
      taxAddress: "Cần Thơ",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=10",
      createdAt: "2024-02-04",
    },
    {
      id: 11,
      fullName: "Ngô Văn Minh",
      phone: "0911111111",
      email: "ngovanminh@ecofarm.vn",
      position: "Kỹ sư bảo vệ thực vật",
      department: "Phòng Kỹ Thuật",
      team: "Tổ BVTV",
      province: "Hậu Giang",
      district: "Vị Thanh",
      address: "67 Đường Trần Hưng Đạo",
      taxCode: "1111111112",
      taxAddress: "Hậu Giang",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=11",
      createdAt: "2024-02-05",
    },
    {
      id: 12,
      fullName: "Dương Thị Ngọc",
      phone: "0912222222",
      email: "duongthingoc@ecofarm.vn",
      position: "Kỹ sư bảo vệ thực vật",
      department: "Phòng Kỹ Thuật",
      team: "Tổ BVTV",
      province: "Sóc Trăng",
      district: "Sóc Trăng",
      address: "89 Đường Phú Lợi",
      taxCode: "1222222222",
      taxAddress: "Sóc Trăng",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=12",
      createdAt: "2024-02-06",
    },
    {
      id: 13,
      fullName: "Lý Văn Phúc",
      phone: "0913333333",
      email: "lyvanphuc@ecofarm.vn",
      position: "Chuyên viên dinh dưỡng cây trồng",
      department: "Phòng Nghiên Cứu",
      team: "R&D",
      province: "Bạc Liêu",
      district: "Bạc Liêu",
      address: "12 Đường Trần Phú",
      taxCode: "1333333333",
      taxAddress: "Bạc Liêu",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=13",
      createdAt: "2024-02-07",
    },
    {
      id: 14,
      fullName: "Mai Thị Quyên",
      phone: "0914444444",
      email: "maithiquyen@ecofarm.vn",
      position: "Kỹ sư thổ nhưỡng",
      department: "Phòng Nghiên Cứu",
      team: "R&D",
      province: "Cà Mau",
      district: "Cà Mau",
      address: "34 Đường Ngô Quyền",
      taxCode: "1444444444",
      taxAddress: "Cà Mau",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=14",
      createdAt: "2024-02-08",
    },
    {
      id: 15,
      fullName: "Nguyễn Văn Sơn",
      phone: "0915555555",
      email: "nguyenvanson@ecofarm.vn",
      position: "Kỹ thuật viên phân bón",
      department: "Phòng Sản Xuất",
      team: "Kho Phân Bón",
      province: "Kiên Giang",
      district: "Rạch Giá",
      address: "56 Đường Nguyễn Trung Trực",
      taxCode: "1555555555",
      taxAddress: "Kiên Giang",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=15",
      createdAt: "2024-02-09",
    },
    {
      id: 16,
      fullName: "Trần Văn Thành",
      phone: "0916666666",
      email: "tranvanthanh@ecofarm.vn",
      position: "Kỹ thuật viên cơ điện nông nghiệp",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Cơ Điện",
      province: "An Giang",
      district: "Long Xuyên",
      address: "78 Đường Trần Hưng Đạo",
      taxCode: "1666666666",
      taxAddress: "An Giang",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=16",
      createdAt: "2024-02-10",
    },
    {
      id: 17,
      fullName: "Lê Văn Thắng",
      phone: "0917777777",
      email: "levanthang@ecofarm.vn",
      position: "Thợ máy nông nghiệp",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Cơ Điện",
      province: "Đồng Tháp",
      district: "Cao Lãnh",
      address: "90 Đường 30/4",
      taxCode: "1777777777",
      taxAddress: "Đồng Tháp",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=17",
      createdAt: "2024-02-11",
    },
    {
      id: 18,
      fullName: "Phạm Văn Tài",
      phone: "0918888888",
      email: "phamvantai@ecofarm.vn",
      position: "Thợ máy nông nghiệp",
      department: "Phòng Kỹ Thuật",
      team: "Tổ Cơ Điện",
      province: "Trà Vinh",
      district: "Trà Vinh",
      address: "12 Đường Lê Lợi",
      taxCode: "1888888888",
      taxAddress: "Trà Vinh",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=18",
      createdAt: "2024-02-12",
    },
    {
      id: 19,
      fullName: "Hoàng Văn Tùng",
      phone: "0919999999",
      email: "hoangvantung@ecofarm.vn",
      position: "Công nhân thời vụ",
      department: "Phòng Sản Xuất",
      team: "Đội Thời Vụ",
      province: "Vĩnh Phúc",
      district: "Vĩnh Yên",
      address: "34 Đường Mê Linh",
      taxCode: "1999999999",
      taxAddress: "Vĩnh Phúc",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=19",
      createdAt: "2024-03-01",
    },
    {
      id: 20,
      fullName: "Vũ Văn Trọng",
      phone: "0920000000",
      email: "vuvantrong@ecofarm.vn",
      position: "Công nhân thời vụ",
      department: "Phòng Sản Xuất",
      team: "Đội Thời Vụ",
      province: "Phú Thọ",
      district: "Việt Trì",
      address: "56 Đường Hùng Vương",
      taxCode: "2000000000",
      taxAddress: "Phú Thọ",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=20",
      createdAt: "2024-03-02",
    },
    {
      id: 21,
      fullName: "Đặng Thị Tuyết",
      phone: "0921111111",
      email: "dangthituyet@ecofarm.vn",
      position: "Công nhân thời vụ",
      department: "Phòng Sản Xuất",
      team: "Đội Thời Vụ",
      province: "Thái Nguyên",
      district: "Thái Nguyên",
      address: "78 Đường Lương Ngọc Quyến",
      taxCode: "2111111111",
      taxAddress: "Thái Nguyên",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=21",
      createdAt: "2024-03-03",
    },
    {
      id: 22,
      fullName: "Bùi Văn Tín",
      phone: "0922222222",
      email: "buivantin@ecofarm.vn",
      position: "Công nhân thời vụ",
      department: "Phòng Sản Xuất",
      team: "Đội Thời Vụ",
      province: "Bắc Ninh",
      district: "Bắc Ninh",
      address: "90 Đường Lý Thái Tổ",
      taxCode: "2222222222",
      taxAddress: "Bắc Ninh",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=22",
      createdAt: "2024-03-04",
    },
  ],

  // CRUD operations
  getPersonnelById: (id) => {
    return get().personnel.find((p) => p.id === id);
  },

  addPersonnel: (personnelData) => {
    set((state) => {
      const newId =
        state.personnel.length > 0
          ? Math.max(...state.personnel.map((p) => p.id)) + 1
          : 1;
      const newPersonnel: Personnel = {
        ...personnelData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        personnel: [...state.personnel, newPersonnel],
      };
    });
  },

  updatePersonnel: (id, updates) => {
    set((state) => ({
      personnel: state.personnel.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  },

  deletePersonnel: (id) => {
    set((state) => ({
      personnel: state.personnel.filter((p) => p.id !== id),
    }));
  },

  bulkAddPersonnel: (personnelList) => {
    set((state) => {
      const currentMaxId =
        state.personnel.length > 0
          ? Math.max(...state.personnel.map((p) => p.id))
          : 0;

      const newPersonnel = personnelList.map((data, index) => ({
        ...data,
        id: currentMaxId + index + 1,
        createdAt: new Date().toISOString().split("T")[0],
      }));

      return {
        personnel: [...state.personnel, ...newPersonnel],
      };
    });
  },
}));

export default usePersonnelStore;
