import type { GrowthCycle } from "@/pages/growth-cycle/types/types";

const now = Date.now();

export const aquacultureGrowthCycles: GrowthCycle[] = [
  {
    id: "AQGC001",
    name: "Chu kỳ tôm thẻ chân trắng thương phẩm",
    cycleType: "animal",
    scope: "variety",
    cropId: "201",
    cropName: "Tôm thẻ chân trắng",
    variety: "2011",
    totalDays: 120,
    numStages: 4,
    stages: [
      {
        id: "aq1_1",
        name: "Chuẩn bị ao và thả giống",
        duration: "15 ngày",
        usePdf: false,
        content:
          "<p>Chuẩn bị ao nuôi, xử lý nước và thuần hóa tôm giống trước khi thả.</p>",
      },
      {
        id: "aq1_2",
        name: "Ương và ổn định đàn",
        duration: "25 ngày",
        usePdf: false,
        content:
          "<p>Duy trì độ mặn, nhiệt độ và kiểm soát sức khỏe đàn tôm trong giai đoạn đầu.</p>",
      },
      {
        id: "aq1_3",
        name: "Tăng trưởng",
        duration: "45 ngày",
        usePdf: false,
        content:
          "<p>Tăng cường quản lý thức ăn, oxy hòa tan và chất lượng nước.</p>",
      },
      {
        id: "aq1_4",
        name: "Về đích và thu hoạch",
        duration: "35 ngày",
        usePdf: false,
        content:
          "<p>Hoàn thiện trọng lượng, kiểm tra cỡ thu hoạch và lên kế hoạch xuất bán.</p>",
      },
    ],
    createdAt: now - 12 * 86400000,
    updatedAt: now - 3 * 86400000,
  },
  {
    id: "AQGC002",
    name: "Chu kỳ tôm sú bố mẹ",
    cycleType: "animal",
    scope: "crop",
    cropId: "202",
    cropName: "Tôm sú",
    totalDays: 150,
    numStages: 4,
    stages: [
      {
        id: "aq2_1",
        name: "Ổn định đàn bố mẹ",
        duration: "30 ngày",
        usePdf: false,
        content:
          "<p>Chọn lọc đàn bố mẹ, kiểm tra sức khỏe và ổn định môi trường nuôi.</p>",
      },
      {
        id: "aq2_2",
        name: "Dưỡng thành thục",
        duration: "35 ngày",
        usePdf: false,
        content:
          "<p>Điều chỉnh dinh dưỡng và quản lý ánh sáng để hỗ trợ thành thục sinh dục.</p>",
      },
      {
        id: "aq2_3",
        name: "Kích thích sinh sản",
        duration: "25 ngày",
        usePdf: false,
        content:
          "<p>Theo dõi các chỉ tiêu sinh sản và kiểm soát môi trường bể bố mẹ.</p>",
      },
      {
        id: "aq2_4",
        name: "Nuôi phục hồi sau sinh sản",
        duration: "60 ngày",
        usePdf: false,
        content:
          "<p>Hồi phục sức khỏe đàn, tái tạo thể trạng và chuẩn bị cho chu kỳ tiếp theo.</p>",
      },
    ],
    createdAt: now - 20 * 86400000,
    updatedAt: now - 4 * 86400000,
  },
  {
    id: "AQGC003",
    name: "Chu kỳ cá tra nuôi thương phẩm",
    cycleType: "animal",
    scope: "variety",
    cropId: "203",
    cropName: "Cá tra",
    variety: "2031",
    totalDays: 180,
    numStages: 4,
    stages: [
      {
        id: "aq3_1",
        name: "Ương giống",
        duration: "30 ngày",
        usePdf: false,
        content:
          "<p>Ương cá tra giống trong ao nhỏ với mật độ phù hợp, kiểm soát thức ăn và nước.</p>",
      },
      {
        id: "aq3_2",
        name: "Tăng cỡ đầu vụ",
        duration: "45 ngày",
        usePdf: false,
        content:
          "<p>Điều chỉnh khẩu phần để cá phát triển đồng đều, tránh phân đàn.</p>",
      },
      {
        id: "aq3_3",
        name: "Nuôi tăng trưởng",
        duration: "60 ngày",
        usePdf: false,
        content:
          "<p>Duy trì oxy, thay nước và kiểm soát chất lượng đáy ao định kỳ.</p>",
      },
      {
        id: "aq3_4",
        name: "Hoàn thiện cỡ thu hoạch",
        duration: "45 ngày",
        usePdf: false,
        content:
          "<p>Kiểm tra cỡ cá, tỉ lệ sống và lên kế hoạch thu hoạch từng đợt.</p>",
      },
    ],
    createdAt: now - 35 * 86400000,
    updatedAt: now - 7 * 86400000,
  },
  {
    id: "AQGC004",
    name: "Chu kỳ cá mú nuôi lồng bè",
    cycleType: "animal",
    scope: "variety",
    cropId: "205",
    cropName: "Cá mú",
    variety: "2051",
    totalDays: 210,
    numStages: 4,
    stages: [
      {
        id: "aq4_1",
        name: "Thuần hóa và ổn định lồng",
        duration: "30 ngày",
        usePdf: false,
        content:
          "<p>Ổn định hệ lồng bè, thuần hóa giống và theo dõi phản ứng môi trường.</p>",
      },
      {
        id: "aq4_2",
        name: "Nuôi tăng trưởng đầu kỳ",
        duration: "50 ngày",
        usePdf: false,
        content:
          "<p>Kiểm soát thức ăn, dòng chảy và sức khỏe cá trong giai đoạn đầu.</p>",
      },
      {
        id: "aq4_3",
        name: "Nuôi thương phẩm",
        duration: "70 ngày",
        usePdf: false,
        content:
          "<p>Tăng cường theo dõi trọng lượng, màu sắc và tỉ lệ ăn mồi.</p>",
      },
      {
        id: "aq4_4",
        name: "Vỗ béo và xuất bán",
        duration: "60 ngày",
        usePdf: false,
        content:
          "<p>Hoàn thiện cỡ bán, chuẩn bị phương án thu hoạch và vận chuyển.</p>",
      },
    ],
    createdAt: now - 48 * 86400000,
    updatedAt: now - 8 * 86400000,
  },
];
