// Mock Data for multi-domain reports (crops, livestock, aqua)

export interface KPIItem {
  title: string;
  value: string | number;
  subText: string;
  iconType: "map" | "grid" | "sprout" | "home" | "activity" | "trending";
}

export interface HealthStatus {
  name: string;
  value: number;
  color: string;
}

export interface HarvestChartData {
  month: string;
  yield: number; // in kg
}

export interface YieldTrendData {
  time: string;
  efficiency: number; // efficiency depending on domain (e.g. kg/ha or kg/head)
}

export interface DomainMockData {
  kpis: KPIItem[];
  health: HealthStatus[];
  plansStats: { pending: number; inProgress: number; completed: number };
  tasksStats: { pending: number; inProgress: number; completed: number };
  activePlans: Array<{ id: string; name: string; type: string; date: string; status: string }>;
  dueTasks: Array<{ id: string; name: string; assignee: string; date: string; priority: "HIGH" | "MEDIUM" | "LOW" }>;
  harvestData: HarvestChartData[];
  yieldTrend: YieldTrendData[];
  recentHarvests: Array<{ id: string; name: string; quantity: number; quality: string; size: string; date: string }>;
  inventoryStats: { totalValue: number; expiringCount: number; lowStockCount: number };
  inventoryList: Array<{ id: string; name: string; unit: string; startQty: number; inQty: number; outQty: number; endQty: number }>;
}

export const mockDomainData: Record<"crops" | "livestock" | "aqua", DomainMockData> = {
  crops: {
    kpis: [
      { title: "Tổng diện tích canh tác", value: "45.3 ha", subText: "5 vùng trồng trọt trọng điểm", iconType: "map" },
      { title: "Tổng số lượng cây giống", value: "13,450 cây", subText: "Đang phát triển ổn định", iconType: "sprout" },
      { title: "Số lô canh tác hoạt động", value: "36 lô", subText: "Phân bổ trên 12 khu vực", iconType: "grid" },
    ],
    health: [
      { name: "Phát triển tốt", value: 75, color: "hsl(142, 60%, 45%)" },
      { name: "Đang điều trị bệnh", value: 15, color: "hsl(38, 92%, 50%)" },
      { name: "Phát hiện dịch bệnh", value: 5, color: "hsl(346, 84%, 50%)" },
      { name: "Giai đoạn thu hoạch", value: 5, color: "hsl(199, 89%, 48%)" },
    ],
    plansStats: { pending: 4, inProgress: 8, completed: 15 },
    tasksStats: { pending: 12, inProgress: 24, completed: 45 },
    activePlans: [
      { id: "p-c-1", name: "Kế hoạch bón phân thúc đợt 3 mùa khô sầu riêng", type: "Bón phân", date: "2026-08-28", status: "Đang chạy" },
      { id: "p-c-2", name: "Phun thuốc phòng rầy xanh gốc sầu riêng A1", type: "Phun BVTV", date: "2026-08-30", status: "Đang chạy" },
      { id: "p-c-3", name: "Xuống giống xoài cát chu kỳ thu đông khu B2", type: "Gieo trồng", date: "2026-09-05", status: "Chờ duyệt" },
    ],
    dueTasks: [
      { id: "t-c-1", name: "Dọn cỏ dại quanh gốc lô sầu riêng A1-02", assignee: "Nguyễn Văn Hùng", date: "2026-08-22", priority: "HIGH" },
      { id: "t-c-2", name: "Kiểm tra vòi tưới nhỏ giọt lô bưởi da xanh D1", assignee: "Trần Thị Lan", date: "2026-08-23", priority: "MEDIUM" },
      { id: "t-c-3", name: "Đo độ ẩm đất mẫu phân khu xoài B2", assignee: "Lê Hoàng Nam", date: "2026-08-25", priority: "LOW" },
    ],
    harvestData: [
      { month: "T3/2026", yield: 12500 },
      { month: "T4/2026", yield: 18400 },
      { month: "T5/2026", yield: 21000 },
      { month: "T6/2026", yield: 15600 },
      { month: "T7/2026", yield: 28900 },
      { month: "T8/2026", yield: 32000 },
    ],
    yieldTrend: [
      { time: "Mùa 1", efficiency: 4.5 }, // tấn/ha
      { time: "Mùa 2", efficiency: 4.8 },
      { time: "Mùa 3", efficiency: 5.1 },
      { time: "Mùa 4", efficiency: 5.3 },
    ],
    recentHarvests: [
      { id: "h-c-1", name: "Sầu riêng Ri6 lô A1-01", quantity: 8400, quality: "Loại 1", size: "3.5 - 4.5kg", date: "2026-08-20" },
      { id: "h-c-2", name: "Xoài cát Hòa Lộc lô B2-01", quantity: 4500, quality: "Loại 1", size: "350 - 450g", date: "2026-08-15" },
      { id: "h-c-3", name: "Mít Thái siêu sớm lô D1-02", quantity: 6200, quality: "Loại 2", size: "8 - 12kg", date: "2026-08-10" },
    ],
    inventoryStats: { totalValue: 345000000, expiringCount: 3, lowStockCount: 5 },
    inventoryList: [
      { id: "i-c-1", name: "Phân bón NPK 16-16-8 Đầu Trâu", unit: "bao 50kg", startQty: 120, inQty: 50, outQty: 60, endQty: 110 },
      { id: "i-c-2", name: "Thuốc trừ sâu sinh học thảo mộc", unit: "chai 1L", startQty: 80, inQty: 20, outQty: 35, endQty: 65 },
      { id: "i-c-3", name: "Tấm lưới nilon bao buồng quả", unit: "cuộn 100m", startQty: 15, inQty: 10, outQty: 8, endQty: 17 },
      { id: "i-c-4", name: "Phân bón hữu cơ vi sinh Humic", unit: "bao 25kg", startQty: 200, inQty: 0, outQty: 150, endQty: 50 },
      { id: "i-c-5", name: "Chế phẩm trichoderma kháng nấm", unit: "gói 1kg", startQty: 45, inQty: 15, outQty: 25, endQty: 35 },
    ],
  },
  livestock: {
    kpis: [
      { title: "Diện tích chuồng trại", value: "12,500 m²", subText: "8 phân khu nuôi khép kín", iconType: "home" },
      { title: "Tổng đàn gia súc/gia cầm", value: "24,800 con", subText: "Heo thịt: 4.8k, Gà đẻ: 20k", iconType: "activity" },
      { title: "Tỷ lệ hao hụt (bệnh/chết)", value: "1.4%", subText: "Giảm 0.3% so với tháng trước", iconType: "trending" },
    ],
    health: [
      { name: "Đàn khỏe mạnh", value: 88, color: "hsl(142, 60%, 45%)" },
      { name: "Đang cách ly điều trị", value: 8, color: "hsl(38, 92%, 50%)" },
      { name: "Mới tiêm phòng vắc-xin", value: 4, color: "hsl(199, 89%, 48%)" },
    ],
    plansStats: { pending: 2, inProgress: 6, completed: 11 },
    tasksStats: { pending: 8, inProgress: 18, completed: 32 },
    activePlans: [
      { id: "p-l-1", name: "Kế hoạch tiêm vắc-xin tả heo châu Phi đợt 2", type: "Y tế dự phòng", date: "2026-08-29", status: "Đang chạy" },
      { id: "p-l-2", name: "Điều chỉnh khẩu phần ăn thúc đàn heo xuất chuồng", type: "Dinh dưỡng", date: "2026-08-31", status: "Đang chạy" },
      { id: "p-l-3", name: "Khử trùng tiêu độc toàn bộ phân trại chăn nuôi heo", type: "Vệ sinh dịch tễ", date: "2026-09-02", status: "Chờ duyệt" },
    ],
    dueTasks: [
      { id: "t-l-1", name: "Cân trọng lượng mẫu heo thịt chuồng H3", assignee: "Trần Văn Sơn", date: "2026-08-23", priority: "HIGH" },
      { id: "t-l-2", name: "Kiểm tra hệ thống quạt mát thông gió chuồng G2", assignee: "Lê Minh Tuấn", date: "2026-08-24", priority: "HIGH" },
      { id: "t-l-3", name: "Bổ sung điện giải vào bồn nước uống tự động", assignee: "Vũ Thị Hồng", date: "2026-08-26", priority: "MEDIUM" },
    ],
    harvestData: [
      { month: "T3/2026", yield: 18500 },
      { month: "T4/2026", yield: 22400 },
      { month: "T5/2026", yield: 19800 },
      { month: "T6/2026", yield: 24500 },
      { month: "T7/2026", yield: 31000 },
      { month: "T8/2026", yield: 29500 },
    ],
    yieldTrend: [
      { time: "Tháng 5", efficiency: 98 }, // trọng lượng xuất chuồng trung bình kg/con
      { time: "Tháng 6", efficiency: 101 },
      { time: "Tháng 7", efficiency: 104 },
      { time: "Tháng 8", efficiency: 107 },
    ],
    recentHarvests: [
      { id: "h-l-1", name: "Heo thịt xuất chuồng H1", quantity: 15400, quality: "Đạt chuẩn xuất khẩu", size: "105 - 115kg", date: "2026-08-21" },
      { id: "h-l-2", name: "Gà đẻ trứng thải chuồng G3", quantity: 6800, quality: "Loại A", size: "1.8 - 2.2kg", date: "2026-08-16" },
      { id: "h-l-3", name: "Heo thịt xuất chuồng H4", quantity: 12500, quality: "Đạt chuẩn nội địa", size: "95 - 105kg", date: "2026-08-11" },
    ],
    inventoryStats: { totalValue: 480000000, expiringCount: 2, lowStockCount: 4 },
    inventoryList: [
      { id: "i-l-1", name: "Thức ăn hỗn hợp cho heo thịt lớn (Cargill)", unit: "bao 40kg", startQty: 250, inQty: 100, outQty: 180, endQty: 170 },
      { id: "i-l-2", name: "Thức ăn hỗn hợp cho gà đẻ trứng", unit: "bao 40kg", startQty: 180, inQty: 50, outQty: 110, endQty: 120 },
      { id: "i-l-3", name: "Vắc-xin lở mồm long móng đợt nhập mới", unit: "liều", startQty: 2000, inQty: 1000, outQty: 1500, endQty: 1500 },
      { id: "i-l-4", name: "Thuốc sát trùng khử khuẩn chuồng trại", unit: "lít", startQty: 50, inQty: 20, outQty: 30, endQty: 40 },
    ],
  },
  aqua: {
    kpis: [
      { title: "Quy mô diện tích ao nuôi", value: "8.6 ha", subText: "14 ao nuôi thâm canh tuần hoàn nước", iconType: "map" },
      { title: "Mật độ thả giống trung bình", value: "115 con/m²", subText: "Tổng thả: 980k cá/tôm giống", iconType: "activity" },
      { title: "Tỷ lệ hao hụt ao tôm giống", value: "2.1%", subText: "Ổn định so với chỉ tiêu mùa vụ", iconType: "trending" },
    ],
    health: [
      { name: "Đàn bơi khỏe, ăn mạnh", value: 85, color: "hsl(142, 60%, 45%)" },
      { name: "Nổi đầu / Kém ăn nhẹ", value: 10, color: "hsl(38, 92%, 50%)" },
      { name: "Mắc hội chứng gan tụy", value: 5, color: "hsl(346, 84%, 50%)" },
    ],
    plansStats: { pending: 3, inProgress: 5, completed: 9 },
    tasksStats: { pending: 10, inProgress: 20, completed: 38 },
    activePlans: [
      { id: "p-a-1", name: "Kế hoạch xả đáy hút bùn khử trùng ao nuôi cá A2", type: "Xử lý môi trường", date: "2026-08-30", status: "Đang chạy" },
      { id: "p-a-2", name: "Cấy chế phẩm vi sinh ổn định tảo nước ao T4", type: "Chăm sóc định kỳ", date: "2026-09-01", status: "Đang chạy" },
      { id: "p-a-3", name: "Đánh khoáng tăng độ kiềm chuẩn bị thả tôm giống T6", type: "Chuẩn bị ao thả", date: "2026-09-06", status: "Chờ duyệt" },
    ],
    dueTasks: [
      { id: "t-a-1", name: "Đo nồng độ oxy hòa tan và khí độc khí NH3 ao T2", assignee: "Vũ Văn Cường", date: "2026-08-22", priority: "HIGH" },
      { id: "t-a-2", name: "Vệ sinh cánh quạt tạo sóng quạt nước ao T4", assignee: "Nguyễn Văn Đạt", date: "2026-08-23", priority: "MEDIUM" },
      { id: "t-a-3", name: "Kiểm tra khay thức ăn tính lượng ăn dư ao T1", assignee: "Trần Thị Mai", date: "2026-08-25", priority: "LOW" },
    ],
    harvestData: [
      { month: "T3/2026", yield: 11000 },
      { month: "T4/2026", yield: 14500 },
      { month: "T5/2026", yield: 17200 },
      { month: "T6/2026", yield: 21000 },
      { month: "T7/2026", yield: 25400 },
      { month: "T8/2026", yield: 28000 },
    ],
    yieldTrend: [
      { time: "Ao A1", efficiency: 18.5 }, // sản lượng tấn/ha ao nuôi
      { time: "Ao A2", efficiency: 20.2 },
      { time: "Ao T1", efficiency: 22.8 },
      { time: "Ao T2", efficiency: 24.1 },
    ],
    recentHarvests: [
      { id: "h-a-1", name: "Tôm thẻ chân trắng ao T3", quantity: 12400, quality: "Loại A - Size 30", size: "30 con/kg", date: "2026-08-20" },
      { id: "h-a-2", name: "Cá tra xuất khẩu ao A3", quantity: 24800, quality: "Đạt chuẩn chế biến", size: "800 - 1000g", date: "2026-08-14" },
      { id: "h-a-3", name: "Tôm thẻ chân trắng ao T5", quantity: 9800, quality: "Loại B - Size 40", size: "40 con/kg", date: "2026-08-08" },
    ],
    inventoryStats: { totalValue: 290000000, expiringCount: 1, lowStockCount: 3 },
    inventoryList: [
      { id: "i-a-1", name: "Thức ăn tôm thẻ chân trắng giai đoạn 3 (UP)", unit: "bao 25kg", startQty: 180, inQty: 80, outQty: 120, endQty: 140 },
      { id: "i-a-2", name: "Chế phẩm vi sinh xử lý đáy ao nuôi (Bio-Water)", unit: "gói 500g", startQty: 60, inQty: 20, outQty: 35, endQty: 45 },
      { id: "i-a-3", name: "Khoáng bột kích lột xác tôm (Grow-Mineral)", unit: "bao 20kg", startQty: 40, inQty: 10, outQty: 25, endQty: 25 },
      { id: "i-a-4", name: "Chất ổn định độ pH khí độc (Zelite)", unit: "bao 50kg", startQty: 90, inQty: 0, outQty: 60, endQty: 30 },
    ],
  },
};
