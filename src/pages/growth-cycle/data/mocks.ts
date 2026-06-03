import { initialEditorValue } from "@/pages/docs/mocks";
import type { GrowthCycle } from "../types/types";

const now = Date.now();

export const initialGrowthCycles: GrowthCycle[] = [
  // 1. VÒNG ĐỜI SINH HỌC CÂY DỪA (TỔNG QUÁT)
  {
    id: "GC_COCO_001",
    name: "Vòng đời sinh học cây dừa (Tổng quát)",
    scope: "crop",
    cropId: "Dừa",
    cropName: "Dừa",
    totalDays: 21900, // Đại diện cho ~60 năm tuổi thọ
    numStages: 4,
    stages: [
      {
        id: "coco_s1_1",
        name: "Cây con (Kiến thiết cơ bản)",
        duration: "0 - 3 năm",
        usePdf: false,
        content: `
          <p><strong>Đặc điểm sinh lý:</strong> Cây tập trung phát triển hệ thống rễ bất định và mở rộng đường kính thân; định hình bộ tán lá ban đầu; chưa tăng trưởng mạnh về chiều cao [2].</p>
          <p><strong>Yêu cầu kỹ thuật:</strong> Che bóng nhẹ (50% ánh sáng) ở giai đoạn vườn ươm; tưới nước giữ ẩm gốc đều đặn; bồi đất mô gốc từ năm thứ 2 trở đi; bón thúc NPK chia nhỏ nhiều lần [2]. Cần lưu ý phòng ngừa bọ cánh cứng (bọ dừa) tấn công đọt non ở giai đoạn này [4, 5].</p>
        `,
      },
      {
        id: "coco_s1_2",
        name: "Trưởng thành (Bắt đầu sinh sản)",
        duration: "4 - 6 năm",
        usePdf: false,
        content: `
          <p><strong>Đặc điểm sinh lý:</strong> Thân vươn cao mạnh mẽ; cây bắt đầu phân hóa mầm hoa và cho những lứa trái bói đầu tiên [2].</p>
          <p><strong>Yêu cầu kỹ thuật:</strong> Tiến hành vệ sinh tán dừa định kỳ từ 1 - 2 lần/năm; tăng cường phân lân và kali để hỗ trợ phân hóa mầm hoa, hạn chế rụng trái non [2]. Chú ý theo dõi và bắt kiến vương, đuông dừa để bảo vệ đỉnh sinh trưởng [4, 6].</p>
        `,
      },
      {
        id: "coco_s1_3",
        name: "Khai thác kinh tế (Kinh doanh)",
        duration: "6 - 40 năm",
        usePdf: false,
        content: `
          <p><strong>Đặc điểm sinh lý:</strong> Cây đạt trạng thái cân bằng sinh lý tối ưu; năng suất quả và chất lượng cơm dừa, nước dừa đạt đỉnh cao và ổn định nhất [2].</p>
          <p><strong>Yêu cầu kỹ thuật:</strong> Bón phân định lượng hàng năm; bồi bùn ao mương vườn vào đầu mùa khô; tỉa bớt cây trồng xen để đảm bảo ánh sáng quang hợp; kiểm soát dịch hại (chuột, bọ xít trái, nhện đỏ) thường xuyên [2, 4].</p>
        `,
      },
      {
        id: "coco_s1_4",
        name: "Lão hóa",
        duration: "> 40 năm",
        usePdf: false,
        content: `
          <p><strong>Đặc điểm sinh lý:</strong> Năng suất quả suy giảm dần theo thời gian; đỉnh sinh trưởng có xu hướng nhỏ lại (nhỏ đọt), các tàu lá ngắn dần và xuất hiện hiện tượng trống cổ ở một số giống [2].</p>
          <p><strong>Yêu cầu kỹ thuật:</strong> Tăng cường chăm sóc chuyên sâu bằng phân hữu cơ hoai mục và các trung - vi lượng để kéo dài tuổi thọ; loại bỏ những cá thể già cỗi không còn hiệu quả kinh tế để trồng cây mới [2].</p>
        `,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // 2. QUY TRÌNH CHĂM SÓC DỪA KINH DOANH TRONG MỘT NĂM (THÍCH ỨNG HẠN MẶN)
  {
    id: "GC_COCO_002",
    name: "Quy trình chăm sóc dừa kinh doanh (Hàng năm)",
    scope: "crop",
    cropId: "Dừa",
    cropName: "Dừa",
    totalDays: 365,
    numStages: 4,
    stages: [
      {
        id: "coco_s2_1",
        name: "Đầu mùa mưa",
        duration: "90 ngày",
        usePdf: false,
        content: `
          <p><strong>Bón phân:</strong> Bón phân hữu cơ (20-40 kg/cây/năm), lân super và vôi xám dolomite (500-1500 kg/ha) để khử chua, cải thiện đất [7]. Đào rãnh hoặc 10-12 lỗ xung quanh gốc (cách gốc 1.5-2m) để bón phân rồi lấp đất lại [3].</p>
          <p><strong>Phòng trừ sâu bệnh:</strong> Dọn vệ sinh vườn, cắt bẹ khô để phòng chuột. Kiểm tra và phòng trừ nấm <em>Phytophthora</em> gây bệnh thối đọt khi mưa nhiều, độ ẩm cao [4, 8].</p>
        `,
      },
      {
        id: "coco_s2_2",
        name: "Giữa đến cuối mùa mưa",
        duration: "90 ngày",
        usePdf: false,
        content: `
          <p><strong>Bón phân bổ sung:</strong> Bón thúc Urea và Kali clorua (giúp hạn chế rụng trái non, tăng đậu trái). Có thể bón thêm lân nung chảy vào thời điểm cuối mùa mưa [7, 9].</p>
          <p><strong>Quản lý nước:</strong> Khai thông cống rãnh, đảm bảo tiêu thoát nước tốt, tránh tình trạng vườn dừa bị ngập úng làm ảnh hưởng đến khả năng hô hấp của hệ rễ [10, 11].</p>
        `,
      },
      {
        id: "coco_s2_3",
        name: "Chuẩn bị mùa khô (Tích ngọt, giữ ẩm)",
        duration: "90 ngày",
        usePdf: false,
        content: `
          <p><strong>Trữ nước ngọt:</strong> Nạo vét hệ thống mương vườn, đóng cống ngăn mặn. Mực nước cao nhất trong mương trữ phải cách mặt liếp 0,5m để không làm thối rễ [12].</p>
          <p><strong>Giữ ẩm:</strong> Bồi bùn ao mương lên liếp (nếu mương đã được tháo rửa sạch mặn). Dùng tàu dừa, cỏ khô, rơm rạ phủ liếp giữ ẩm quanh gốc để giảm lượng nước bốc hơi [7, 12].</p>
        `,
      },
      {
        id: "coco_s2_4",
        name: "Cao điểm mùa khô (Chống hạn mặn)",
        duration: "95 ngày",
        usePdf: false,
        content: `
          <p><strong>Tưới nước:</strong> Sử dụng hệ thống tưới tiết kiệm, tưới nước ngọt dự trữ với chu kỳ 5-7 ngày/lần. Hạn chế lạm dụng phân bón hóa học nếu không có đủ nước tưới để phân tan [7, 13].</p>
          <p><strong>Quản lý dịch hại mùa nắng:</strong> Theo dõi sự bùng phát của nhện đỏ, rệp dính và bọ dừa (có thể phóng thích ong ký sinh để tiêu diệt bọ dừa) [14, 15]. Khi kết thúc hạn mặn, ưu tiên bón phân hữu cơ, Super Humic để phục hồi rễ [13].</p>
        `,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

// Growth cycles for specific varieties (scope: "variety")
export const varietyGrowthCycles: GrowthCycle[] = [
  // Dừa Xiêm xanh (id: "1")
  {
    id: "GC_VAR_001",
    name: "Quy trình canh tác Dừa Xiêm xanh (Uống nước)",
    scope: "variety",
    cropId: "Dừa",
    cropName: "Dừa",
    variety: "1",
    totalDays: 900,
    numStages: 3,
    stages: [
      {
        id: "var1_s1",
        name: "Giai đoạn kiến thiết (0-30 tháng)",
        duration: "30 tháng",
        usePdf: false,
        content: `<p><strong>Kỹ thuật trồng:</strong> Chọn cây con từ trái giống 12 tháng tuổi, trồng hố 60x60x60 cm, bón lót phân hữu cơ 10 kg/hố. Khoảng cách 6x7 m (238 cây/ha).</p><p><strong>Chăm sóc:</strong> Tưới nước 2-3 lần/tuần trong mùa khô, bón NPK 15-15-15 định kỳ 2 tháng/lần.</p>`,
      },
      {
        id: "var1_s2",
        name: "Giai đoạn ra hoa, đậu trái",
        duration: "6 tháng",
        usePdf: false,
        content: `<p><strong>Đặc điểm:</strong> Dừa Xiêm xanh ra hoa sau 18-20 tháng trồng. Mỗi tháng ra 1 buồng hoa, thời gian từ thụ phấn đến thu hoạch khoảng 12 tháng.</p><p><strong>Dinh dưỡng:</strong> Tăng cường Kali (KCl 0.5 kg/cây/năm) và Boron để hỗ trợ đậu trái, giảm rụng trái non.</p>`,
      },
      {
        id: "var1_s3",
        name: "Giai đoạn thu hoạch ổn định",
        duration: "nhiều năm",
        usePdf: false,
        content: `<p><strong>Thu hoạch:</strong> Chu kỳ thu hoạch 45-60 ngày/lần, chọn trái 7-8 tháng tuổi (nước ngọt nhất). Năng suất đạt 120-150 trái/cây/năm.</p><p><strong>Phòng trừ sâu bệnh:</strong> Theo dõi bọ cánh cứng (bọ dừa), nhện đỏ; phun thuốc phòng ngừa vào đầu mùa mưa.</p>`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // Dừa Xiêm lục (id: "2")
  {
    id: "GC_VAR_002",
    name: "Quy trình canh tác Dừa Xiêm lục cao sản",
    scope: "variety",
    cropId: "Dừa",
    cropName: "Dừa",
    variety: "2",
    totalDays: 720,
    numStages: 3,
    stages: [
      {
        id: "var2_s1",
        name: "Vườn ươm & trồng mới (0-18 tháng)",
        duration: "18 tháng",
        usePdf: false,
        content: `<p><strong>Đặc điểm giống:</strong> Dừa Xiêm lục ra hoa cực sớm, chỉ sau 18-20 tháng. Cần chọn cây giống từ vườn đầu dòng đạt chứng nhận. Trồng khoảng cách 6x6 m.</p><p><strong>Kỹ thuật:</strong> Bón lót NPK 16-16-8, bổ sung phân chuồng hoai mục 15 kg/hố. Giữ ẩm bằng lớp phủ hữu cơ.</p>`,
      },
      {
        id: "var2_s2",
        name: "Ra hoa lần đầu - kinh doanh",
        duration: "6 tháng",
        usePdf: false,
        content: `<p><strong>Quản lý buồng hoa:</strong> Bảo vệ buồng hoa non khỏi sâu đục buồng. Thụ phấn bổ sung trong điều kiện thời tiết bất lợi. Tỉa bớt trái dị dạng.</p><p><strong>Dinh dưỡng thời kỳ ra hoa:</strong> Bổ sung vi lượng Bo, Mn; giảm đạm, tăng lân và kali.</p>`,
      },
      {
        id: "var2_s3",
        name: "Thu hoạch & chăm sóc duy trì",
        duration: "nhiều năm",
        usePdf: false,
        content: `<p><strong>Chu kỳ thu hoạch:</strong> 45 ngày/lần. Trái Xiêm lục đạt chất lượng tốt nhất ở tháng thứ 7-8, nước ngọt đạt 8-9% đường. Năng suất 150-160 trái/cây/năm.</p><p><strong>Xuất khẩu:</strong> Tiêu chuẩn GlobalGAP, VietGAP yêu cầu ghi chép nhật ký canh tác.</p>`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // Dừa sáp (id: "3")
  {
    id: "GC_VAR_003",
    name: "Quy trình chuyên canh Dừa sáp Cầu Kè",
    scope: "variety",
    cropId: "Dừa",
    cropName: "Dừa",
    variety: "3",
    totalDays: 1620,
    numStages: 4,
    stages: [
      {
        id: "var3_s1",
        name: "Giai đoạn vườn ươm cây mô (0-6 tháng)",
        duration: "6 tháng",
        usePdf: false,
        content: `<p><strong>Nguồn giống:</strong> Chỉ sử dụng cây giống cấy mô từ cơ sở được chứng nhận (tỷ lệ ra trái sáp thật ≥60%). Ươm cây trong bầu đất 30x50 cm, che 50% nắng.</p><p><strong>Dinh dưỡng:</strong> Phun phân bón lá NPK + vi lượng mỗi 2 tuần.</p>`,
      },
      {
        id: "var3_s2",
        name: "Giai đoạn kiến thiết (6-54 tháng)",
        duration: "48 tháng",
        usePdf: false,
        content: `<p><strong>Trồng:</strong> Hố 80x80x80 cm, bón lót 20 kg phân hữu cơ + 500g super lân + vôi. Khoảng cách 8x8 m (156 cây/ha) để tạo điều kiện thụ phấn chéo tối ưu.</p><p><strong>Lưu ý đặc thù:</strong> Trồng xen một số cây dừa ta/dừa lai làm cây thụ phấn (tỷ lệ 1 cây thụ phấn/5 cây dừa sáp) để tăng tỷ lệ trái sáp.</p>`,
      },
      {
        id: "var3_s3",
        name: "Giai đoạn ra hoa, đậu trái (tháng 48-60)",
        duration: "12 tháng",
        usePdf: false,
        content: `<p><strong>Thụ phấn nhân tạo:</strong> Thu phấn hoa đực của cây dừa sáp thụ phấn sáng sớm (6-9h), bảo quản lạnh. Thụ phấn bổ sung vào buổi sáng khi hoa cái trổ.</p><p><strong>Bảo vệ buồng:</strong> Bao buồng hoa non bằng túi lưới để tránh côn trùng và thụ phấn tự do làm giảm tỷ lệ sáp.</p>`,
      },
      {
        id: "var3_s4",
        name: "Thu hoạch và phân loại",
        duration: "nhiều năm",
        usePdf: false,
        content: `<p><strong>Xác định trái sáp:</strong> Dùng siêu âm hoặc lắc nghe tiếng (trái sáp ít nước, tiếng đục). Thu hoạch khi trái 11-12 tháng tuổi. Tỷ lệ sáp thật đạt 20-60%/buồng.</p><p><strong>Giá trị kinh tế:</strong> Trái sáp 110.000-220.000 VNĐ/trái; trái thường 15.000-20.000 VNĐ/trái. Năng suất 40-80 trái sáp/cây/năm.</p>`,
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

export const initialGrowthCycles_all: GrowthCycle[] = [
  ...initialGrowthCycles,
  ...varietyGrowthCycles,
];

export const cropOptions = [
  { label: "Đậu nành", value: "crop1" },
  { label: "Sầu riêng", value: "crop2" },
  { label: "Lúa", value: "crop3" },
];


export const varietyOptions = [
  { label: "DT84", value: "DT84" },
  { label: "DX11", value: "DX11" },
  { label: "Ri6", value: "Ri6" },
];

export { initialEditorValue };
