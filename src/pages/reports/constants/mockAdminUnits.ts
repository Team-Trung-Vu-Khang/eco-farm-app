export interface FarmActivityUpdate {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  images?: string[];
}

export interface AdminUnitReport {
  id: string;
  code: string;
  name: string;
  activeDays: number;
  updateCount: number;
  materialUpdateCount: number;
  distinctDaysCount: number;
  isActive: boolean; // >= 2 updates, on >= 2 distinct days, >= 1 material update
  hasEvidence: boolean;
  updates: FarmActivityUpdate[];
}

export const mockAdminUnits: AdminUnitReport[] = [
  {
    id: "unit-1",
    code: "F-0001",
    name: "HTX Nông nghiệp Số Sông Đà",
    activeDays: 15,
    updateCount: 28,
    materialUpdateCount: 4,
    distinctDaysCount: 12,
    isActive: true,
    hasEvidence: true,
    updates: [
      {
        id: "act-1-1",
        timestamp: "2026-08-24 08:30",
        action: "Phun thuốc bảo vệ thực vật",
        actor: "Nguyễn Văn Hùng (Kỹ sư)",
        details: "Sử dụng chế phẩm sinh học trị rầy phấn trắng trên sầu riêng Monthon lô A1. Liều lượng 200ml/bình 20L.",
        images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-1-2",
        timestamp: "2026-08-22 15:00",
        action: "Bón phân đợt 3",
        actor: "Trần Thị Lan (Công nhân)",
        details: "Bón phân NPK hữu cơ EcoFarm cho 500 gốc sầu riêng. Lượng bón 0.5kg/gốc.",
        images: ["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-1-3",
        timestamp: "2026-08-18 10:15",
        action: "Vận hành hệ thống tưới",
        actor: "Hệ thống tự động",
        details: "Bật tưới nhỏ giọt khu vực A2 thời gian 45 phút, lượng nước 15 lít/gốc."
      },
      {
        id: "act-1-4",
        timestamp: "2026-08-15 07:45",
        action: "Làm cỏ quanh gốc",
        actor: "Phạm Văn Nam (Nhân viên)",
        details: "Dọn cỏ sạch gốc sầu riêng A1 để tránh cạnh tranh dinh dưỡng trước khi bón phân.",
        images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80"]
      }
    ]
  },
  {
    id: "unit-2",
    code: "F-0002",
    name: "Nông trại Công nghệ cao GreenFarm",
    activeDays: 18,
    updateCount: 32,
    materialUpdateCount: 3,
    distinctDaysCount: 14,
    isActive: true,
    hasEvidence: true,
    updates: [
      {
        id: "act-2-1",
        timestamp: "2026-08-23 09:00",
        action: "Thu hoạch dưa lưới",
        actor: "Lê Minh Tuấn (Quản lý)",
        details: "Thu hoạch đợt 1 dưa lưới giống Nhật Bản nhà màng số 3. Sản lượng đạt 1.2 tấn, quả tròn đều ngọt lịm.",
        images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-2-2",
        timestamp: "2026-08-20 16:30",
        action: "Bón phân vi lượng",
        actor: "Nguyễn Hoàng Nam (Kỹ sư)",
        details: "Bổ sung Kali trắng qua hệ thống tưới nhỏ giọt để thúc trái chín ngọt đồng đều.",
        images: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-2-3",
        timestamp: "2026-08-17 11:00",
        action: "Kiểm tra sâu hại",
        actor: "Lê Minh Tuấn (Quản lý)",
        details: "Kiểm tra bọ trĩ trên ngọn dưa lưới. Ghi nhận xuất hiện mật độ rất thấp, chưa cần phun thuốc."
      }
    ]
  },
  {
    id: "unit-3",
    code: "F-0003",
    name: "Hợp tác xã Chăn nuôi Bò sữa Ba Vì",
    activeDays: 8,
    updateCount: 14,
    materialUpdateCount: 1,
    distinctDaysCount: 5,
    isActive: true,
    hasEvidence: false,
    updates: [
      {
        id: "act-3-1",
        timestamp: "2026-08-24 06:00",
        action: "Vắt sữa bò buổi sáng",
        actor: "Trần Văn Cường (Vận hành viên)",
        details: "Thực hiện quy trình vắt sữa bò bán tự động tại chuồng số 2. Tổng sản lượng thu được 450 lít."
      },
      {
        id: "act-3-2",
        timestamp: "2026-08-21 14:00",
        action: "Phun xịt khử trùng chuồng trại",
        actor: "Nguyễn Văn Đức (Nhân viên thú y)",
        details: "Phun hóa chất khử trùng khu vực xung quanh chuồng bò để ngăn chặn dịch bệnh truyền nhiễm."
      },
      {
        id: "act-3-3",
        timestamp: "2026-08-19 09:30",
        action: "Cập nhật thức ăn chăn nuôi",
        actor: "Trần Văn Cường (Vận hành viên)",
        details: "Nhập và cho bò ăn thức ăn ủ chua đợt mới. Định lượng 25kg/con."
      }
    ]
  },
  {
    id: "unit-4",
    code: "F-0004",
    name: "HTX Hữu cơ Bình Minh",
    activeDays: 3,
    updateCount: 4,
    materialUpdateCount: 0,
    distinctDaysCount: 2,
    isActive: false, // Inactive because materialUpdateCount < 1
    hasEvidence: false,
    updates: [
      {
        id: "act-4-1",
        timestamp: "2026-08-22 10:00",
        action: "Cắt cành tỉa lá",
        actor: "Nguyễn Văn A (Xã viên)",
        details: "Tỉa cành tăm, lá già cho cây bưởi diễn để tập trung dinh dưỡng nuôi quả."
      },
      {
        id: "act-4-2",
        timestamp: "2026-08-18 16:00",
        action: "Tưới nước gốc bưởi",
        actor: "Nguyễn Văn A (Xã viên)",
        details: "Tưới giữ ẩm gốc bưởi trong giai đoạn mùa khô hạn nặng."
      }
    ]
  },
  {
    id: "unit-5",
    code: "F-0005",
    name: "HTX Thủy sản Hòa Bình",
    activeDays: 2,
    updateCount: 3,
    materialUpdateCount: 0,
    distinctDaysCount: 2,
    isActive: false, // Inactive because materialUpdateCount < 1
    hasEvidence: false,
    updates: [
      {
        id: "act-5-1",
        timestamp: "2026-08-23 07:00",
        action: "Cho cá ăn sáng",
        actor: "Hoàng Văn Nam (Thành viên)",
        details: "Rải cám nổi cho cá lăng lòng hồ Sông Đà. Lượng thức ăn 15kg/lồng."
      },
      {
        id: "act-5-2",
        timestamp: "2026-08-20 15:30",
        action: "Kiểm tra nồng độ oxy hòa tan",
        actor: "Hoàng Văn Nam (Thành viên)",
        details: "Đo DO hồ lăng đạt 4.8 mg/L. Nước trong tốt, hoạt động của cá bình thường."
      }
    ]
  },
  {
    id: "unit-6",
    code: "F-0006",
    name: "Công ty CP Nông nghiệp Hữu cơ Mộc Châu",
    activeDays: 25,
    updateCount: 58,
    materialUpdateCount: 10,
    distinctDaysCount: 20,
    isActive: true,
    hasEvidence: true,
    updates: [
      {
        id: "act-6-1",
        timestamp: "2026-08-24 10:30",
        action: "Thu hoạch trà ô long",
        actor: "Vũ Thị Thảo (Giám đốc kỹ thuật)",
        details: "Hái búp trà ô long đợt thu hoạch thứ 2 tại đồi chè số 5. Sản lượng tươi đạt 2.5 tấn.",
        images: ["https://images.unsplash.com/photo-1597854710119-a5a84362a909?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-6-2",
        timestamp: "2026-08-21 08:00",
        action: "Phun chế phẩm vi sinh hữu cơ",
        actor: "Lò Văn Muôn (Đội trưởng đội 2)",
        details: "Phun chế phẩm sinh học bón lá để kích thích bật búp trà. Định mức phun 2 bình/sào chè.",
        images: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80"]
      },
      {
        id: "act-6-3",
        timestamp: "2026-08-19 14:15",
        action: "Bón phân trùn quế hữu cơ",
        actor: "Lò Văn Muôn (Đội trưởng đội 2)",
        details: "Rải phân trùn quế hữu cơ quanh luống trà để cải tạo đất tơi xốp tự nhiên."
      }
    ]
  },
  {
    id: "unit-7",
    code: "F-0007",
    name: "Nông hộ Trần Văn B",
    activeDays: 0,
    updateCount: 0,
    materialUpdateCount: 0,
    distinctDaysCount: 0,
    isActive: false,
    hasEvidence: false,
    updates: []
  }
];
