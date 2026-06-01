import { initialEditorValue } from "@/pages/docs/mocks";
import type { GrowthCycle } from "../types/types";

const now = Date.now();

export const initialGrowthCycles: GrowthCycle[] = [
  // 1. QUY TRÌNH CANH TÁC LÚA NGẮN NGÀY GIEO SẠ (ĐỒNG BẰNG SÔNG CỬU LONG)
  {
    id: "GC-LUA-01",
    name: "Quy trình sinh trưởng Lúa ngắn ngày gieo sạ (ĐBSCL)",
    scope: "crop",
    cropId: "Lúa",
    cropName: "Lúa",
    totalDays: 100, // Trung bình cho các giống như OM18, OM5451, Đài Thơm 8
    numStages: 4,
    stages: [
      {
        id: "lua1_1",
        name: "Nảy mầm và Cây con non (Từ gieo đến 15 ngày)",
        duration: "15 ngày",
        usePdf: false,
        content: `
          <p><strong>Ngâm ủ:</strong> Ngâm hạt giống 24-36 giờ, ủ 24-36 giờ đến khi nứt nanh. Gieo sạ với mật độ từ 80-120 kg/ha tùy giống.</p>
          <p><strong>Quản lý nước:</strong> 1-7 ngày đầu giữ mức nước từ bão hòa đến 1 cm để hạt nảy mầm tốt. Sau đó duy trì mực nước 1-3 cm.</p>
          <p><strong>Dinh dưỡng:</strong> Bón lót trước khi gieo sạ. Bón thúc đợt 1 khi lúa bén rễ (7-10 ngày sau sạ) bằng phân NPK để hỗ trợ phát triển rễ.</p>
        `,
      },
      {
        id: "lua1_2",
        name: "Sinh trưởng dinh dưỡng - Đẻ nhánh",
        duration: "25 ngày",
        usePdf: false,
        content: `
          <p><strong>Đẻ nhánh:</strong> Cây tập trung phát triển thân lá, gia tăng chồi hữu hiệu. Lúa sẽ đạt số chồi tối đa và chồi hữu hiệu sẽ ổn định trước khi phân hóa đòng.</p>
          <p><strong>Dinh dưỡng:</strong> Bón thúc đợt 2 (20-25 ngày sau sạ) để cây đẻ nhánh tập trung, khỏe mạnh.</p>
          <p><strong>Quản lý nước:</strong> Áp dụng kỹ thuật tưới "ướt khô xen kẽ", giữ mực nước 1-3 cm. Giữa vụ có thể cắt nước vài ngày để xả độc hữu cơ, giúp rễ ăn sâu và hạn chế chồi vô hiệu.</p>
        `,
      },
      {
        id: "lua1_3",
        name: "Sinh trưởng sinh thực - Làm đòng & Trổ bông",
        duration: "30 ngày",
        usePdf: false,
        content: `
          <p><strong>Phân hóa đòng:</strong> Khoảng 40-45 ngày sau sạ, lúa đứng cái, các lóng vươn dài. Bón phân đón đòng khi lá lúa chuyển màu vàng chanh, thắt eo.</p>
          <p><strong>Trổ bông & Thụ phấn:</strong> Đòng thoát khỏi bẹ lá cờ. Hoa lúa nở, tiến hành thụ phấn và thụ tinh tập trung trong khoảng 4-6 ngày.</p>
          <p><strong>Quản lý nước:</strong> Bắt buộc giữ mực nước 3-5 cm liên tục để lúa trổ và thụ phấn dễ dàng, tránh để khô hạn gây lép lửng hạt.</p>
        `,
      },
      {
        id: "lua1_4",
        name: "Thời kỳ Lúa chín và Thu hoạch",
        duration: "30 ngày",
        usePdf: false,
        content: `
          <p><strong>Quá trình chín:</strong> Trải qua 4 thời kỳ: chín sữa (ngậm sữa, cong trái me), chín sáp, chín vàng (đỏ đuôi), và chín hoàn toàn (độ ẩm hạt < 20%). Khối lượng hạt hình thành chủ yếu nhờ quang hợp của bộ lá đòng.</p>
          <p><strong>Quản lý nước:</strong> Rút cạn nước (xiết nước) từ 7-10 ngày trước khi thu hoạch để thóc chín đồng đều và mặt ruộng khô cứng, dễ đưa máy móc cơ giới vào gặt.</p>
          <p><strong>Thu hoạch:</strong> Tiến hành thu hoạch khi 85-90% số hạt trên bông đã chuyển sang màu vàng.</p>
        `,
      },
    ],
    createdAt: now - 30 * 86400000,
    updatedAt: now - 5 * 86400000,
  },

  // 2. QUY TRÌNH CANH TÁC LÚA CẤY DÀI NGÀY (VỤ CHIÊM XUÂN - MIỀN BẮC)
  {
    id: "GC-LUA-02",
    name: "Quy trình sinh trưởng Lúa cấy vụ Chiêm Xuân (Miền Bắc)",
    scope: "crop",
    cropId: "Lúa",
    cropName: "Lúa",
    totalDays: 135, // Kéo dài do ảnh hưởng của rét đậm, rét hại đầu vụ
    numStages: 4,
    stages: [
      {
        id: "lua2_1",
        name: "Ngâm ủ và Gieo mạ chống rét",
        duration: "25 ngày",
        usePdf: false,
        content: `
          <p><strong>Ngâm ủ:</strong> Do thời tiết lạnh, thời gian ngâm kéo dài 36-42 giờ (đối với lúa thuần), sử dụng nước ấm 3 sôi 2 lạnh để kích mầm.</p>
          <p><strong>Gieo mạ:</strong> Gieo trên đất mạ nền hoặc mạ dược. Bắt buộc áp dụng biện pháp che phủ nilon vòng cung và rắc tro bếp để chống rét đậm, rét hại.</p>
          <p><strong>Tiêu chuẩn cấy:</strong> Khi mạ nền đạt 2.5 - 3 lá, hoặc mạ dược đạt 4 - 4.5 lá, cây đanh dảnh, rễ khỏe thì đem cấy ra ruộng.</p>
        `,
      },
      {
        id: "lua2_2",
        name: "Bén rễ hồi xanh và Đẻ nhánh",
        duration: "50 ngày",
        usePdf: false,
        content: `
          <p><strong>Hồi xanh:</strong> Do nhiệt độ thấp (< 20 độ C), thời gian bén rễ hồi xanh rất chậm, có thể kéo dài từ 15-25 ngày. Phải giữ mực nước nông 2-3 cm để "lấy nước làm áo" giữ ấm cho gốc lúa.</p>
          <p><strong>Đẻ nhánh:</strong> Khi thời tiết ấm lên (>17 độ C), lúa bắt đầu đẻ nhánh. Cần bón thúc đợt 1 kết hợp làm cỏ sục bùn để rễ phát triển sâu, giúp cây nở bụi.</p>
        `,
      },
      {
        id: "lua2_3",
        name: "Làm đòng và Trổ bông",
        duration: "30 ngày",
        usePdf: false,
        content: `
          <p><strong>Làm đòng:</strong> Cây lúa vươn lóng. Bón phân đón đòng (tăng cường Kali) giúp đòng to, hạt sáng mẩy và tăng sức chống chịu sâu bệnh (đạo ôn, khô vằn).</p>
          <p><strong>Trổ bông:</strong> Trong vụ Xuân, lúa trổ an toàn nhất là vào quanh tiết Cốc vũ (cuối tháng 4 đến đầu tháng 5) để tránh đợt gió mùa đông bắc muộn gây sương muối và lép hạt. Luôn giữ nước ở mức 5-10 cm.</p>
        `,
      },
      {
        id: "lua2_4",
        name: "Vào chắc và Thu hoạch",
        duration: "30 ngày",
        usePdf: false,
        content: `
          <p><strong>Chín:</strong> Thời tiết cuối vụ Xuân ở miền Bắc thường có nắng tốt, biên độ chênh lệch nhiệt độ ngày đêm lớn. Đây là điều kiện cực kỳ lý tưởng cho việc tích lũy chất khô vào hạt, giúp lúa vụ Xuân đạt năng suất cao nhất trong năm.</p>
          <p><strong>Thu hoạch:</strong> Khi lúa chín vàng trĩu hạt, rút nước và tiến hành gặt để giải phóng đất chuẩn bị cho vụ Hè Thu/vụ Mùa kế tiếp.</p>
        `,
      },
    ],
    createdAt: now - 60 * 86400000,
    updatedAt: now - 10 * 86400000,
  },
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
