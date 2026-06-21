import { initialEditorValue } from "@/pages/docs/mocks";
import type { GrowthCycle } from "../types/types";

const now = Date.now();

export const initialGrowthCycles: GrowthCycle[] = [
  // 1. QUY TRÌNH CHUNG CHO SẦU RIÊNG GIAI ĐOẠN KINH DOANH (THUẬN VỤ)
  {
    id: "GC001",
    name: "Quy trình Sầu riêng kinh doanh (Thuận vụ)",
    scope: "crop",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    totalDays: 365,
    numStages: 4,
    stages: [
      {
        id: "s1_1",
        name: "Phục hồi sau thu hoạch & Làm cơi đọt",
        duration: "90 ngày",
        usePdf: false,
        content: `
          <p><strong>Cắt tỉa và vệ sinh:</strong> Cắt tỉa cành bị sâu bệnh, cành ốm yếu, cành mọc đan chéo hoặc cành bơi trên cuống trái để giúp cây thông thoáng. Phun thuốc phòng nấm gốc đồng hoặc rải vôi để diệt mầm bệnh.</p>
          <p><strong>Phục hồi rễ và bón phân:</strong> Bón lót 25-90 kg phân hữu cơ hoai mục hoặc 5-12 kg hữu cơ vi sinh kết hợp nấm đối kháng Trichoderma để ngừa bệnh thối rễ, xì mủ do Phytophthora. Tưới kích rễ bằng Humic/Fulvic kết hợp đạm cá.</p>
          <p><strong>Quản lý cơi đọt:</strong> Để cây đủ sức nuôi trái, cần lấy ít nhất 2 cơi đọt hoàn chỉnh. Khi cây nhú mũi giáo, cần phun thuốc phòng ngừa rầy xanh, rầy phấn trắng và nhện đỏ để bảo vệ dàn lá non.</p>`,
      },
      {
        id: "s1_2",
        name: "Tạo khô hạn & Xử lý ra hoa (Nhú mắt cua)",
        duration: "45 ngày",
        usePdf: false,
        content: `
          <p><strong>Bón lân tạo mầm:</strong> Khi cơi đọt cuối chuyển sang lá lụa xanh đậm, rải phân lân gốc (khoảng 3-4 kg lân/cây) ở phạm vi 2/3 tán.</p>
          <p><strong>Tạo khô hạn (Xiết nước):</strong> Dọn sạch cỏ dưới tán để đất nhanh khô. Tiến hành xiết nước hoàn toàn từ 10-14 ngày.</p>
          <p><strong>Phun tạo mầm:</strong> Phun phân bón lá có hàm lượng Lân và Kali cao (ví dụ: NPK 10-60-10, MKP 0-52-34) ướt đều mặt dưới lá và dạ cành. Phun 2 lần cách nhau 7-10 ngày.</p>`,
      },
      {
        id: "s1_3",
        name: "Rước mắt cua đến Xổ nhụy",
        duration: "55 ngày",
        usePdf: false,
        content: `
          <p><strong>Nhấp nước và kéo mắt cua:</strong> Khi mắt cua nhú dài 2-3 cm và sáng rõ, tưới nhấp nước trở lại (lượng nước 20-30% bình thường) rồi tăng dần. Phun Amino, trung vi lượng để rước mắt cua.</p>
          <p><strong>Tỉa hoa:</strong> Loại bỏ hoa mọc sát thân chính, hoa ở đầu cành, tỉa bớt hoa trong chùm chỉ để khoảng 10 hoa khỏe mạnh, không sâu bệnh.</p>
          <p><strong>Chăm sóc trước xổ nhụy:</strong> Trước khi hoa nở 3-5 ngày, phun Canxi-Bo để tăng sức sống hạt phấn, chống rụng hoa. Giai đoạn xổ nhụy giảm 2/3 lượng nước tưới, chỉ giữ đủ ẩm.</p>`,
      },
      {
        id: "s1_4",
        name: "Đậu quả, nuôi quả và thu hoạch",
        duration: "110 ngày",
        usePdf: false,
        content: `
          <p><strong>Giai đoạn tim đèn (sau xổ nhụy):</strong> Giữ ẩm vừa phải (1 ngày tưới, 1 ngày nghỉ). Nếu gặp mưa trái mùa cần phun siêu Lân/MKP để chống sốc rụng trái non.</p>
          <p><strong>Tỉa trái non (3 đợt):</strong> Đợt 1 (10-25 ngày sau xổ nhụy) loại bỏ trái dị dạng. Đợt 2 (40-45 ngày) tỉa trái méo. Đợt 3 (60 ngày) giữ lại số lượng trái phù hợp với sức cây.</p>
          <p><strong>Dinh dưỡng nuôi trái:</strong> Khi trái nhỏ bón NPK ba số bằng nhau (15-15-15 hoặc 18-18-18). Khi trái lớn vô cơm, chuyển sang NPK Kali cao và Kali Sulphate (Kali trắng). Tuyệt đối không dùng Kali đỏ (chứa Clorua) vì sẽ làm sượng trái, cháy múi.</p>
          <p><strong>Quản lý đọt:</strong> Nếu cây đi đọt non lúc mang trái, phải "dìu đọt" bằng Lân, Canxi, Magie cao để lá nhanh già, hoặc dùng MKP chặn đọt để tránh cạnh tranh dinh dưỡng làm rụng trái, giật hộc.</p>
          <p><strong>Trước thu hoạch:</strong> Cắt nước hoàn toàn trước thu hoạch 15-20 ngày để cơm ráo và ngọt.</p>`,
      },
    ],
    createdAt: now - 30 * 86400000,
    updatedAt: now - 5 * 86400000,
  },

  // 2. QUY TRÌNH SẦU RIÊNG KIẾN THIẾT CƠ BẢN (NĂM 1-3)
  {
    id: "GC002",
    name: "Quy trình Sầu riêng kiến thiết (Năm 1-3)",
    scope: "crop",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    totalDays: 365,
    numStages: 3,
    stages: [
      {
        id: "s2_1",
        name: "Kích thích rễ non & Phục hồi sau trồng",
        duration: "120 ngày",
        usePdf: false,
        content: `
          <p><strong>Bảo vệ cây non:</strong> Cây con mới xuống đất cần được che bóng 30-40% bằng lưới đen hoặc trồng xen cây ngắn ngày để hạn chế bức xạ nhiệt.</p>
          <p><strong>Quản lý nước:</strong> Tưới 1 lần/ngày trong tuần đầu, sau giảm xuống 3-4 lần/tuần. Tuyệt đối không để gốc đọng nước gây thối rễ do nấm Phytophthora. Dùng rơm rạ, cỏ khô tủ gốc giữ ẩm vào mùa khô.</p>
          <p><strong>Kích rễ:</strong> Dùng Acid Plus (Humic, Fulvic, Axit Amin) tưới gốc định kỳ 20-30 ngày/lần để kích thích rễ non phát triển mạnh.</p>`,
      },
      {
        id: "s2_2",
        name: "Thúc đẩy cơi đọt & Quản lý sâu rầy",
        duration: "155 ngày",
        usePdf: false,
        content: `
          <p><strong>Dinh dưỡng:</strong> Bón định kỳ NPK giàu Đạm (20-10-10+TE hoặc 30-10-10+TE). Năm 1 bón 0.1-0.2kg/lần cách nhau 1.5-2 tháng. Hàng năm bón lót thêm 20-30 kg phân chuồng hoai mục vào đầu mùa mưa.</p>
          <p><strong>Phát triển cơi đọt:</strong> Khi cây nhú mũi giáo, sử dụng các chất điều hòa sinh trưởng (GA3, Nitrophenolate) phun qua lá để kích thích bung đọt đồng loạt.</p>
          <p><strong>Phòng trừ dịch hại:</strong> Rất quan trọng phải phun thuốc phòng rầy xanh, rệp và nhện đỏ ngay khi cây vừa nhú mũi giáo để bảo vệ cơi đọt không bị rụng.</p>`,
      },
      {
        id: "s2_3",
        name: "Tỉa cành tạo tán hình tháp",
        duration: "90 ngày",
        usePdf: false,
        content: `
          <p><strong>Bấm ngọn:</strong> Khi cây cao 60-80 cm, tiến hành bấm ngọn để kích thích phát triển cành cấp 1.</p>
          <p><strong>Định hình khung tán:</strong> Giữ cành cấp 1 đầu tiên cách mặt đất khoảng 80-100 cm. Chọn giữ 3-4 cành khỏe mọc đều các hướng, cách nhau 40-50 cm.</p>
          <p><strong>Tỉa cành vô hiệu:</strong> Từ 6 tháng tuổi trở đi, cắt bỏ các cành mọc sát đất, cành tăm bên trong thân, cành mọc vượt đứng để cây thông thoáng. Có thể dùng dây kéo cành để phân tán đều đặn.</p>`,
      },
    ],
    createdAt: now - 60 * 86400000,
    updatedAt: now - 10 * 86400000,
  },

  // 3. QUY TRÌNH ĐẶC THÙ: SẦU RIÊNG RI6 NGHỊCH VỤ ĐBSCL
  {
    id: "GC003",
    name: "Quy trình Sầu riêng Ri6 (Nghịch vụ ĐBSCL)",
    scope: "variety",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    variety: "1",
    totalDays: 250,
    numStages: 4,
    stages: [
      {
        id: "r1_1",
        name: "Dằn lân, tạo mầm & Phủ bạt xiết nước",
        duration: "40 ngày",
        usePdf: false,
        content: `
          <p><strong>Điều kiện:</strong> Cây phải trên 5-6 năm tuổi, khỏe mạnh, có đủ 2-3 cơi lá hoàn chỉnh.</p>
          <p><strong>Bón lân & Phun tạo mầm:</strong> Khi cơi đọt cuối chuyển lụa, bón 3-4kg Lân gốc. Phun tạo mầm lá (10-60-10 + MKP) 2-3 lần.</p>
          <p><strong>Phủ bạt & Xiết nước:</strong> Khi mắt cua nhú lác đác, đậy bạt nilon kín mô đất, rút cạn nước trong mương vườn (sâu 60-80cm) để tạo khô hạn nhân tạo triệt để.</p>
          <p><strong>Xử lý Paclobutrazol:</strong> Phun Paclobutrazol (chỉ 1 lần duy nhất) vào dạ dưới cành và mặt dưới lá để ức chế sinh trưởng. Việc đậy bạt trước khi phun giúp thuốc không rơi xuống đất gây ngộ độc rễ.</p>`,
      },
      {
        id: "r1_2",
        name: "Dỡ bạt, nhấp nước & Kéo mắt cua",
        duration: "15 ngày",
        usePdf: false,
        content: `
          <p><strong>Dỡ bạt:</strong> Khi quan sát thấy 70-80% mắt cua trên cây sáng rõ, tiến hành dỡ bạt nilon.</p>
          <p><strong>Nhấp nước trở lại:</strong> Bắt đầu tưới nhấp nhẹ (khoảng 20-30% lượng bình thường) để cây từ từ hút nước, sau đó tăng dần. Tuyệt đối không tưới quá sớm khi mắt cua chưa sáng vì sẽ gây nghẽn hoa hoặc ra bông phướn (bông lá).</p>
          <p><strong>Kéo bông:</strong> Phun các chất dinh dưỡng Amino, trung vi lượng để rước mắt cua vươn dài, mập mạp.</p>`,
      },
      {
        id: "r1_3",
        name: "Phát triển nụ hoa đến Xổ nhụy (Đặc thù Ri6)",
        duration: "55 ngày",
        usePdf: false,
        content: `
          <p><strong>Đặc tính thời gian:</strong> Từ lúc mắt cua sáng rõ đến khi xổ nhụy của giống Ri6 kéo dài khoảng 55-57 ngày.</p>
          <p><strong>Nuôi nụ hoa:</strong> Tỉa bớt nụ hoa ngoài ngọn cành, sát thân chính, chỉ giữ nụ hoa ở vị trí thích hợp. Phun Canxi-Bo trước khi xổ nhụy 3-5 ngày.</p>
          <p><strong>Quản lý cơi đọt:</strong> Trong vụ nghịch, nếu mưa nhiều cây rất dễ đi đọt. Bắt buộc phải phun chặn đọt bằng MKP hoặc "dìu đọt" để lá nhanh chuyển lụa, tránh trùng với thời điểm xổ nhụy.</p>`,
      },
      {
        id: "r1_4",
        name: "Nuôi trái & Thu hoạch (Đặc thù Ri6)",
        duration: "95 ngày",
        usePdf: false,
        content: `
          <p><strong>Đặc tính thu hoạch:</strong> Ri6 là giống chín sớm. Thời gian từ lúc xổ nhụy đến thu hoạch chỉ từ 90 - 105 ngày.</p>
          <p><strong>Nuôi trái vô cơm:</strong> Vì thời gian thu hoạch ngắn, lịch bón phân nuôi trái cho Ri6 phải được đẩy sớm hơn giống Monthong từ 10-15 ngày. Bắt đầu vô phân Kali trắng (K2SO4) từ ngày thứ 45-50 để cơm lên màu vàng đậm, ráo, béo.</p>
          <p><strong>Phòng cháy múi:</strong> Chú ý cung cấp đủ vi lượng, đặc biệt là Bo và Magie, giữ ẩm ổn định để tránh hiện tượng nứt gai, cháy múi đặc trưng ở giống Ri6.</p>`,
      },
    ],
    createdAt: now - 90 * 86400000,
    updatedAt: now - 15 * 86400000,
  },

  // 4. QUY TRÌNH ĐẶC THÙ: SẦU RIÊNG MONTHONG (DONA)
  {
    id: "GC004",
    name: "Quy trình Sầu riêng Monthong (Dona)",
    scope: "variety",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    variety: "2",
    totalDays: 270,
    numStages: 4,
    stages: [
      {
        id: "m1_1",
        name: "Bón phân tạo mầm hoa & Xiết nước",
        duration: "40 ngày",
        usePdf: false,
        content: `
          <p><strong>Tạo khô hạn:</strong> Giống Monthong yêu cầu thời gian xiết nước (khô hạn) dài hơn Ri6 để bung mắt cua, thường từ 30-35 ngày.</p>
          <p><strong>Phun tạo mầm:</strong> Bón lân dưới gốc và xịt tạo mầm Lân, Kali cao (MKP) liên tục 2-3 đợt lên dạ cành. Chú ý dọn sạch rác, cỏ gốc để gốc đón nắng, nhanh khô.</p>`,
      },
      {
        id: "m1_2",
        name: "Kéo mắt cua & Dưỡng nụ",
        duration: "15 ngày",
        usePdf: false,
        content: `
          <p><strong>Tiêu chí tưới lại:</strong> Khác với Ri6, đối với giống Monthong, phải chờ đến khi 70-80% mắt cua ra dài từ 2-3 cm mới bắt đầu nhấp nước trở lại.</p>
          <p><strong>Kéo hoa:</strong> Tưới nhấp từ ngoài tán vào trong, phun thuốc kéo mắt cua bổ sung Amino acid, trung vi lượng giúp chùm hoa mập mạp.</p>`,
      },
      {
        id: "m1_3",
        name: "Mắt cua phát triển đến Xổ nhụy (Đặc thù Monthong)",
        duration: "45 ngày",
        usePdf: false,
        content: `
          <p><strong>Đặc tính thời gian:</strong> Quá trình từ mắt cua đến xổ nhụy của giống Monthong ngắn hơn Ri6, chỉ mất khoảng 45-50 ngày.</p>
          <p><strong>Quản lý nước:</strong> Rất nhạy cảm lúc xổ nhụy. Phải giảm 2/3 lượng nước tưới thông thường để hạt phấn khỏe, đậu trái tốt.</p>`,
      },
      {
        id: "m1_4",
        name: "Nuôi trái vô cơm & Thu hoạch (Đặc thù Monthong)",
        duration: "120 ngày",
        usePdf: false,
        content: `
          <p><strong>Đặc tính thời gian:</strong> Thời gian neo trái trên cây rất dài, từ 115 - 135 ngày tùy khí hậu (vùng cao nguyên thường lâu hơn).</p>
          <p><strong>Nuôi trái:</strong> Trong 60 ngày đầu chủ yếu bón NPK ba số đều (15-15-15). Từ ngày thứ 60 trở đi (bắt đầu vô cơm) mới tiến hành bón NPK Kali cao (12-12-17) và Kali Sunphat.</p>
          <p><strong>Chống rụng:</strong> Monthong cực kỳ nhạy cảm và dễ rụng trái sinh lý kéo dài (có thể tới 40-45 ngày). Bắt buộc phải khống chế không cho cây đi đọt bằng MKP hoặc Paclobutrazol hàm lượng nhẹ, hoặc chủ động chặn đọt.</p>`,
      },
    ],
    createdAt: now - 120 * 86400000,
    updatedAt: now - 20 * 86400000,
  },

  // 5. QUY TRÌNH ĐẶC THÙ: SẦU RIÊNG MUSANG KING
  {
    id: "GC005",
    name: "Quy trình Sầu riêng Musang King",
    scope: "variety",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    variety: "3",
    totalDays: 270,
    numStages: 4,
    stages: [
      {
        id: "mk1_1",
        name: "Phục hồi cây & Dưỡng cơi đọt non",
        duration: "60 ngày",
        usePdf: false,
        content: `
          <p><strong>Phục hồi:</strong> Cắt tỉa cành thông thoáng vì giống này phân cành nhiều. Bón phân hữu cơ vi sinh, tưới Humic kích rễ.</p>
          <p><strong>Dưỡng cơi đọt:</strong> Cung cấp NPK đạm cao kéo đọt. Musang King phát triển tốc độ gấp 1.5 lần giống Thái nên cần lượng dinh dưỡng dồi dào, kiểm soát nhện đỏ và rầy xanh chặt chẽ.</p>`,
      },
      {
        id: "mk1_2",
        name: "Xử lý ra hoa (Khô hạn sinh lý)",
        duration: "40 ngày",
        usePdf: false,
        content: `
          <p><strong>Kích mầm hoa:</strong> Áp dụng chế độ xiết nước tạo khô hạn. Kết hợp bón lân dưới tán và phun tạo mầm hoa bằng Lân và Kali nồng độ cao.</p>
          <p>Giống Musang King chưa hoàn toàn thuần thục với khí hậu nội địa nên khâu xiết nước cần làm kỹ, tránh để mưa làm đứt quãng quá trình phân hóa mầm.</p>`,
      },
      {
        id: "mk1_3",
        name: "Mắt cua đến Xổ nhụy & Bắt buộc Dìu đọt",
        duration: "55 ngày",
        usePdf: false,
        content: `
          <p><strong>Chăm sóc hoa:</strong> Phun Canxi-Bo trước khi xổ nhụy để ống phấn khỏe.</p>
          <p><strong>Quản lý đọt:</strong> Cây Musang King cực kỳ nhạy cảm với việc cạnh tranh dinh dưỡng. Nếu cây ra đọt non, <strong>tuyệt đối ưu tiên phương pháp "Dìu đọt"</strong> (phun Lân, Magie cao ép lá nhanh già) thay vì chặn đọt bằng hóa chất mạnh để tránh suy cây và rụng hoa hàng loạt.</p>`,
      },
      {
        id: "mk1_4",
        name: "Nuôi trái & Chờ trái rụng tự nhiên (Đặc thù Musang King)",
        duration: "115 ngày",
        usePdf: false,
        content: `
          <p><strong>Tỉa quả khắt khe:</strong> Cây bói (năm 4-5) chỉ được phép giữ 5-7 quả ở sát thân chính để tránh gãy cành, suy kiệt cây.</p>
          <p><strong>Nuôi trái:</strong> Bón phân NPK cân bằng, vô cơm bổ sung Kali Sulphate. Cần buộc dây cố định trái vào cành vào tháng cuối trước khi thu hoạch.</p>
          <p><strong>Thu hoạch:</strong> Trái Musang King <strong>phải để chín rụng tự nhiên</strong> (khoảng 100 - 120 ngày sau đậu quả), tuyệt đối không cắt sớm trên cây như các giống khác để bảo toàn độ dẻo mịn và hương vị đắng ngọt đặc trưng.</p>`,
      },
    ],
    createdAt: now - 150 * 86400000,
    updatedAt: now - 25 * 86400000,
  },
  // 6. QUY TRÌNH CHĂN NUÔI HEO THỊT
  {
    id: "GC006",
    name: "Quy trình Heo thịt tăng trọng",
    cycleType: "animal",
    scope: "variety",
    cropId: "heo",
    cropName: "Heo",
    variety: "heo-thit",
    totalDays: 180,
    numStages: 4,
    stages: [
      {
        id: "p1_1",
        name: "Úm heo con & Ổn định đàn",
        duration: "28 ngày",
        usePdf: false,
        content: `
          <p><strong>Chuồng trại:</strong> Giữ nhiệt độ 28-32 độ C, nền khô ráo, đủ ánh sáng và kín gió lùa.</p>
          <p><strong>Dinh dưỡng:</strong> Dùng cám khởi động chất lượng cao, chia nhiều bữa nhỏ trong ngày.</p>`,
      },
      {
        id: "p1_2",
        name: "Tăng trọng giai đoạn 1",
        duration: "52 ngày",
        usePdf: false,
        content: `
          <p><strong>Quản lý tăng trọng:</strong> Tăng dần khẩu phần, theo dõi FCR và trọng lượng định kỳ.</p>
          <p><strong>Chăm sóc sức khỏe:</strong> Tiêm phòng, tẩy ký sinh và bổ sung điện giải khi thời tiết thay đổi.</p>`,
      },
      {
        id: "p1_3",
        name: "Tăng trọng giai đoạn 2",
        duration: "60 ngày",
        usePdf: false,
        content: `
          <p><strong>Điều chỉnh dinh dưỡng:</strong> Tăng năng lượng khẩu phần, giảm stress nhiệt, đảm bảo nước sạch liên tục.</p>
          <p><strong>Phòng bệnh:</strong> Kiểm soát hô hấp và tiêu chảy, vệ sinh chuồng trại hàng ngày.</p>`,
      },
      {
        id: "p1_4",
        name: "Vỗ béo & Xuất chuồng",
        duration: "40 ngày",
        usePdf: false,
        content: `
          <p><strong>Hoàn thiện trọng lượng:</strong> Đưa heo đạt khối lượng mục tiêu trước khi xuất bán.</p>
          <p><strong>Trước xuất chuồng:</strong> Giảm stress vận chuyển, ngưng thuốc theo thời gian cách ly phù hợp.</p>`,
      },
    ],
    createdAt: now - 10 * 86400000,
    updatedAt: now - 2 * 86400000,
  },
  // 7. QUY TRÌNH CHĂN NUÔI GÀ THỊT
  {
    id: "GC007",
    name: "Quy trình Gà thịt công nghiệp",
    cycleType: "animal",
    scope: "variety",
    cropId: "ga",
    cropName: "Gà",
    variety: "ga-thit",
    totalDays: 70,
    numStages: 4,
    stages: [
      {
        id: "g1_1",
        name: "Úm gà con",
        duration: "14 ngày",
        usePdf: false,
        content: `
          <p><strong>Nhiệt độ:</strong> Duy trì nhiệt phù hợp, tăng cường chiếu sáng và hạn chế gió lùa.</p>
          <p><strong>Nước & thức ăn:</strong> Cho uống nước sạch sớm, dùng cám úm chuyên dụng.</p>`,
      },
      {
        id: "g1_2",
        name: "Tăng trưởng nhanh",
        duration: "21 ngày",
        usePdf: false,
        content: `
          <p><strong>Dinh dưỡng:</strong> Điều chỉnh khẩu phần theo tuổi, đảm bảo đủ đạm và năng lượng.</p>
          <p><strong>Mật độ nuôi:</strong> Giữ mật độ hợp lý để gà phát triển đồng đều.</p>`,
      },
      {
        id: "g1_3",
        name: "Hoàn thiện thể trạng",
        duration: "20 ngày",
        usePdf: false,
        content: `
          <p><strong>Quản lý đàn:</strong> Theo dõi đồng đều trọng lượng, tách loại những con phát triển chậm.</p>
          <p><strong>An toàn sinh học:</strong> Siết chặt ra vào chuồng, khử trùng định kỳ.</p>`,
      },
      {
        id: "g1_4",
        name: "Xuất bán",
        duration: "15 ngày",
        usePdf: false,
        content: `
          <p><strong>Chuẩn bị bán:</strong> Ngừng thức ăn trước vận chuyển theo quy trình phù hợp, giữ đàn ổn định.</p>
          <p><strong>Vận chuyển:</strong> Tránh stress nhiệt và dồn ép đàn.</p>`,
      },
    ],
    createdAt: now - 8 * 86400000,
    updatedAt: now - 1 * 86400000,
  },
  // 8. QUY TRÌNH CHĂN NUÔI HEO THỊT THEO LOẠI
  {
    id: "GC008",
    name: "Quy trình Heo thịt theo loại",
    cycleType: "animal",
    scope: "crop",
    cropId: "heo",
    cropName: "Heo",
    totalDays: 180,
    numStages: 4,
    stages: [
      {
        id: "hp1_1",
        name: "Úm heo con",
        duration: "28 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Ổn định đàn, giảm stress, bảo đảm heo con ăn uống tốt trong giai đoạn đầu.</p>`,
      },
      {
        id: "hp1_2",
        name: "Tăng trọng ban đầu",
        duration: "52 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Tăng khối lượng ổn định, theo dõi sức khỏe và lịch vaccine định kỳ.</p>`,
      },
      {
        id: "hp1_3",
        name: "Tăng trọng hoàn thiện",
        duration: "60 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Tăng năng lượng khẩu phần, kiểm soát stress nhiệt và tiêu hóa.</p>`,
      },
      {
        id: "hp1_4",
        name: "Vỗ béo & Xuất chuồng",
        duration: "40 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Đạt trọng lượng xuất bán, giảm stress vận chuyển và ngừng thuốc đúng cách ly.</p>`,
      },
    ],
    createdAt: now - 6 * 86400000,
    updatedAt: now - 1 * 86400000,
  },
  // 9. QUY TRÌNH CHĂN NUÔI GÀ THỊT THEO LOẠI
  {
    id: "GC009",
    name: "Quy trình Gà thịt theo loại",
    cycleType: "animal",
    scope: "crop",
    cropId: "ga",
    cropName: "Gà",
    totalDays: 70,
    numStages: 4,
    stages: [
      {
        id: "gp1_1",
        name: "Úm gà con",
        duration: "14 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Giữ nhiệt ổn định, cung cấp nước sạch và thức ăn dễ tiêu.</p>`,
      },
      {
        id: "gp1_2",
        name: "Tăng trưởng sớm",
        duration: "21 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Tăng trọng đều, đảm bảo mật độ nuôi và thông thoáng chuồng trại.</p>`,
      },
      {
        id: "gp1_3",
        name: "Tăng trưởng hoàn thiện",
        duration: "20 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Tối ưu khẩu phần, kiểm soát hô hấp và tiêu chảy.</p>`,
      },
      {
        id: "gp1_4",
        name: "Xuất bán",
        duration: "15 ngày",
        usePdf: false,
        content: `
          <p><strong>Mục tiêu:</strong> Hoàn thiện trọng lượng, hạn chế stress trước xuất bán.</p>`,
      },
    ],
    createdAt: now - 5 * 86400000,
    updatedAt: now - 1 * 86400000,
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
