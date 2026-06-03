import type {
  TreatmentMethod,
  TreatmentPlan,
  TreatmentPlanFormData,
} from "../types/treatment";

export const mockTreatmentMethods: TreatmentMethod[] = [
  {
    id: 1,
    name: "Cày xới sâu",
    type: "physical",
    description: "Phá vỡ tầng đất cứng, cải thiện thoát nước",
    icon: "🚜",
    benefits: [
      "Phá vỡ tầng đất cứng hiệu quả",
      "Cải thiện thoát nước và thông khí",
      "Tăng khả năng thấm nước",
      "Tạo điều kiện cho rễ cây phát triển sâu",
    ],
    limitations: [
      "Chi phí nhiên liệu cao",
      "Cần máy móc chuyên dụng",
      "Không phù hợp với đất quá ẩm",
      "Có thể làm xáo trộn cấu trúc đất",
    ],
    costEffectiveness: "medium",
    difficulty: "moderate",
  },
  {
    id: 2,
    name: "Bón vôi khử chua",
    type: "chemical",
    description: "Trung hòa độ chua, cải thiện pH đất",
    icon: "⚗️",
    benefits: [
      "Trung hòa độ chua nhanh chóng",
      "Cung cấp canxi cho đất",
      "Cải thiện hoạt động vi sinh vật",
      "Tăng hiệu quả hấp thu dinh dưỡng",
    ],
    limitations: [
      "Cần tính toán liều lượng chính xác",
      "Hiệu quả phụ thuộc vào loại vôi",
      "Cần thời gian để phản ứng hoàn toàn",
      "Có thể gây kiềm hóa nếu dùng quá liều",
    ],
    costEffectiveness: "high",
    difficulty: "moderate",
  },
  {
    id: 3,
    name: "Bón phân hữu cơ",
    type: "biological",
    description: "Tăng chất hữu cơ, cải thiện cấu trúc đất",
    icon: "🌱",
    benefits: [
      "Cải thiện cấu trúc đất bền vững",
      "Tăng khả năng giữ nước và dinh dưỡng",
      "Kích thích hoạt động vi sinh vật có lợi",
      "Cung cấp dinh dưỡng từ từ, lâu dài",
    ],
    limitations: [
      "Cần thời gian phân hủy",
      "Chi phí vận chuyển cao nếu số lượng lớn",
      "Chất lượng phân hữu cơ không đồng đều",
      "Hiệu quả chậm hơn phân hóa học",
    ],
    costEffectiveness: "high",
    difficulty: "easy",
  },
  {
    id: 4,
    name: "Trồng cây phân xanh",
    type: "biological",
    description: "Cải thiện độ phì nhiêu, bổ sung đạm",
    icon: "🌿",
    benefits: [
      "Bổ sung đạm sinh học miễn phí",
      "Cải thiện cấu trúc đất tự nhiên",
      "Kiểm soát cỏ dại",
      "Bảo vệ đất khỏi xói mòn",
    ],
    limitations: [
      "Cần thời gian trồng và cày vùi (45-60 ngày)",
      "Chiếm đất trong thời gian trồng",
      "Cần nước tưới",
      "Hiệu quả phụ thuộc vào loại cây",
    ],
    costEffectiveness: "high",
    difficulty: "easy",
  },
  {
    id: 5,
    name: "Rửa mặn",
    type: "physical",
    description: "Loại bỏ muối tích tụ trong đất",
    icon: "💧",
    benefits: [
      "Loại bỏ muối hiệu quả",
      "Cải thiện EC đất nhanh",
      "Tạo điều kiện cho cây trồng phát triển",
      "Phục hồi đất nhiễm mặn",
    ],
    limitations: [
      "Cần nguồn nước ngọt dồi dào",
      "Chi phí nước cao",
      "Cần hệ thống thoát nước tốt",
      "Có thể rửa trôi dinh dưỡng",
    ],
    costEffectiveness: "medium",
    difficulty: "moderate",
  },
  {
    id: 6,
    name: "Bón thạch cao",
    type: "chemical",
    description: "Cải thiện đất kiềm, tăng canxi",
    icon: "⚪",
    benefits: [
      "Cải thiện đất kiềm và đất mặn",
      "Cung cấp canxi và lưu huỳnh",
      "Cải thiện cấu trúc đất sét",
      "Tăng khả năng thấm nước",
    ],
    limitations: [
      "Cần tính toán liều lượng chính xác",
      "Hiệu quả chậm hơn vôi",
      "Chi phí cao hơn vôi",
      "Cần nước để hòa tan",
    ],
    costEffectiveness: "medium",
    difficulty: "moderate",
  },
];

export const initialTreatmentPlans: TreatmentPlan[] = [
  {
    id: 10,
    code: "PD-COCO-SOIL-PHENMAN-001",
    name: "Phác đồ cấp cứu và phục hồi đất dừa nhiễm phèn, mặn",
    zone: "Vùng Đồng bằng sông Cửu Long (Bến Tre, Tiền Giang, Trà Vinh)",
    objectives: [
      "Rửa trôi muối Natri (Na+) và hạ phèn (Al3+, Fe2+) trong đất",
      "Nâng độ pH vùng rễ từ mức chua (<= 4.5) lên mức an toàn (5.5 - 6.5)",
      "Tái tạo hệ rễ cám bị thui chột do sốc mặn và yếm khí",
    ],
    duration: "1.5 - 2 tháng",
    startDate: "2026-05-15",
    endDate: "2026-07-15",
    intensity: "deep",
    priority: "high",
    selectedMethods: [5 - 7],
    coverImage: "https://images.unsplash.com/photo-1592982537447-coco-soil-1",
    soilAnalysis: {
      pH: { current: 4.2, target: 6.0 },
      organicMatter: { current: 1.5, target: 3.5, unit: "%" },
      nitrogen: { current: 0.08, target: 0.15, unit: "%" },
      phosphorus: { current: 12, target: 30, unit: "ppm" },
      potassium: { current: 60, target: 150, unit: "ppm" },
      ec: { current: 3.5, target: 1.0, unit: "dS/m" },
      texture: "Đất thịt sét, nén dẽ yếm khí",
      color: "Xám đen, có đốm phèn vàng (Jarosite)",
      drainage: "poor",
    },
    expectedResults: [
      {
        metric: "Độ mặn (EC)",
        before: "> 3.0 dS/m",
        after: "< 1.0 dS/m",
        timeframe: "15 ngày",
      },
      {
        metric: "Sự phục hồi rễ dừa",
        before: "Rễ thui đen, bó cứng",
        after: "Ra rễ cám non trắng",
        timeframe: "4 - 5 tuần",
      },
    ],
    riskFactors: [
      "Bón đạm Urê quá sớm khi đất chưa hết mặn sẽ gây sốc sinh lý rụng trái non",
      "Sử dụng phân có gốc Sunfat (SA, Kali sunfat) sinh ra khí H2S làm thối rễ",
    ],
    successIndicators: [
      "Nước trong mương vườn trong, hết mùi chua phèn",
      "Cây dừa bung đọt non mới, hiện tượng nứt trái và rụng quả non chấm dứt",
    ],
    videoTutorials: [],
    relatedDocuments: [],
    procedures: [
      {
        id: 1001,
        stepNumber: 1,
        name: "Rửa mặn, thau chua mương vườn",
        description:
          "Lợi dụng nguồn nước ngọt để rửa trôi muối tích tụ trên bề mặt liếp.",
        detailedInstructions:
          "Tận dụng nước mưa đầu mùa hoặc nước sông khi độ mặn dưới 3‰ bơm vào đầy mương. Tưới đẫm lên mặt liếp dừa để hòa tan muối NaCl bám trên keo đất đẩy xuống mương, sau đó mở cống đáy xả cạn nước ra ngoài rạch để xổ mặn.",
        dosage: "Tưới ngập đẫm mặt liếp",
        timing: "Ngay khi có nước ngọt",
        technique: "Rửa trôi vật lý (Leaching)",
        materials: ["Nước ngọt ngọt/nước mưa"],
        equipment: ["Máy bơm nước", "Hệ thống cống đáy"],
        estimatedDays: 5,
        warnings: [
          "Tuyệt đối không lấy nước vào mương nếu độ mặn ngoài sông > 3‰.",
        ],
        tips: [
          "Cần thực hiện xổ nước mương lặp lại 2-3 lần để rửa sạch lượng phèn mặn ngầm tươm ra.",
        ],
        startDay: 1,
        endDay: 5,
        stageMaterials: [],
      },
      {
        id: 1002,
        stepNumber: 2,
        name: "Bón vôi Dolomite giải độc và bù Canxi",
        description:
          "Cung cấp Canxi để đẩy Natri ra khỏi keo đất, hạn chế dừa nứt trái.",
        detailedInstructions:
          "Rải vôi Dolomite hoặc vôi nông nghiệp với lượng 30 - 50 kg/1.000m2 (300 - 500 kg/ha). Ion Ca2+ sẽ hoán vị thế chỗ ion Na+ độc hại, đồng thời nâng cao pH đất giúp rễ cây không bị ngộ độc.",
        dosage: "300 - 500 kg/ha",
        timing: "Sau khi rửa mặn 3-5 ngày",
        technique: "Bón rải đều mặt liếp",
        materials: ["Vôi Dolomite / Vôi nông nghiệp"],
        equipment: ["Cuốc xới nhẹ"],
        estimatedDays: 2,
        warnings: [
          "Không bón trộn vôi cùng phân vô cơ để tránh thất thoát đạm.",
        ],
        tips: [
          "Dolomite cung cấp thêm Magie giúp lá dừa nhanh lấy lại màu xanh quang hợp.",
        ],
        startDay: 8,
        endDay: 9,
        stageMaterials: [],
      },
      {
        id: 1003,
        stepNumber: 3,
        name: "Tái tạo rễ cám bằng Lân và Humic",
        description:
          "Kích thích bộ rễ phát triển lại sau khi môi trường đất đã an toàn.",
        detailedInstructions:
          "Khoảng 2-3 tuần sau khi rải vôi, bón các loại phân giàu Lân (Lân nung chảy) và Axit Humic (Super Humic). Sự kết hợp này kích thích dừa ra rễ cám mới cực nhanh. Tuyệt đối không dùng phân chứa gốc Sunfat (SA, K2SO4) trong giai đoạn đất yếm khí.",
        dosage: "1-2 kg Lân nung chảy + 50g Super Humic / cây",
        timing: "Sau bón vôi 15 - 20 ngày",
        technique: "Bón quanh vùng hình chiếu tán lá",
        materials: ["Lân nung chảy", "Super Humic"],
        equipment: ["Dụng cụ bón gốc"],
        estimatedDays: 3,
        warnings: [
          "Gốc Sunfat trong môi trường yếm khí sẽ chuyển thành H2S gây thối rễ non.",
        ],
        tips: [
          "Có thể kết hợp áp dụng kinh nghiệm dân gian: đặt 100-200g muối ăn (NaCl) lên bẹ dừa để cung cấp vi lượng Clo kích thích đậu trái.",
        ],
        startDay: 25,
        endDay: 28,
        stageMaterials: [],
      },
      {
        id: 1004,
        stepNumber: 4,
        name: "Bồi bùn mương và Bón phân hữu cơ vi sinh",
        description:
          "Bổ sung lớp phù sa mới và chất mùn để tăng cường độ phì nhiêu bền vững.",
        detailedInstructions:
          "Sau khi mương đã sạch mặn phèn, lấy lớp bùn đáy mương tráng một lớp mỏng 2-4 cm lên mặt liếp. Cùng lúc bổ sung 20-30kg phân chuồng hoai mục ủ nấm Trichoderma để tái lập hệ vi sinh.",
        dosage: "Bùn dày 2-4cm + 20-30 kg phân hữu cơ/cây",
        timing: "Giữa mùa khô đến đầu mùa mưa",
        technique: "Bồi bùn và rải hữu cơ",
        materials: ["Bùn đáy mương", "Phân chuồng ủ Trichoderma"],
        equipment: ["Xẻng", "Gàu hất bùn"],
        estimatedDays: 7,
        warnings: [
          "Tuyệt đối không bồi bùn dày quá 5 cm sẽ làm tạo màng sét yếm khí gây ngạt rễ.",
        ],
        tips: [
          "Đợi lớp bùn nứt nẻ chân chim mới được bón thêm các loại phân vô cơ NPK thúc trái.",
        ],
        startDay: 35,
        endDay: 42,
        stageMaterials: [],
      },
    ],
    seasonalPhases: [],
    status: "in_progress",
    area: 2.5,
    budget: 12000000,
    budgetRange: "10-20 triệu",
    technician: "Kỹ sư Thổ nhưỡng Nông nghiệp",
    soilIssue:
      "Đất suy kiệt, nhiễm phèn mặn, rễ tổn thương, cấu trúc lèn chặt yếm khí",
    cropType: "Dừa kinh doanh",
    soilProblems: ["salinity", "acidity", "soil_compaction"],
    targetSeverity: "recovery",
    primaryMethodId: 5,
    supportingMethodIds: [5, 6],
    goalTags: ["#ruaman", "#haphèn", "#phuchoiredau"],
    responsibleUnit: "khuyen_nong",
  },

  {
    id: 11,
    code: "PD-COCO-SOIL-DATCAT-002",
    name: "Phác đồ tăng mùn và chống rửa trôi cho đất cát dừa miền Trung",
    zone: "Vùng Duyên hải Nam Trung Bộ (Bình Định, Phú Yên)",
    objectives: [
      "Cải thiện khả năng giữ nước và lưu giữ phân bón của nền đất cát thô",
      "Bổ sung mạnh chất hữu cơ để tăng dung tích hấp thu (CEC)",
      "Thiết lập thảm che phủ để giảm bức xạ nhiệt và xói mòn",
    ],
    duration: "Bảo dưỡng dài hạn (6 - 12 tháng)",
    startDate: "2026-09-01",
    endDate: "2027-02-28",
    intensity: "medium",
    priority: "medium",
    selectedMethods: [6, 8],
    coverImage: "https://images.unsplash.com/photo-1592982537447-coco-soil-2",
    soilAnalysis: {
      pH: { current: 5.5, target: 6.5 },
      organicMatter: { current: 0.8, target: 2.5, unit: "%" },
      nitrogen: { current: 0.05, target: 0.12, unit: "%" },
      phosphorus: { current: 8, target: 20, unit: "ppm" },
      potassium: { current: 40, target: 120, unit: "ppm" },
      ec: { current: 0.2, target: 0.8, unit: "dS/m" },
      texture: "Đất cát thô (35% - 85% cát), rời rạc",
      color: "Vàng xám bạc màu",
      drainage: "moderate",
    },
    expectedResults: [
      {
        metric: "Tỷ lệ hữu cơ (Mùn)",
        before: "< 1.0 %",
        after: "> 2.0 %",
        timeframe: "6 tháng",
      },
      {
        metric: "Khả năng giữ ẩm đất",
        before: "Khô hoàn toàn sau 1 ngày nắng",
        after: "Duy trì ẩm độ 40-50% sau 3 ngày",
        timeframe: "2 tháng",
      },
    ],
    riskFactors: [
      "Bón phân vô cơ tan nhanh (Urê) dễ bị trực di, rửa trôi thẳng xuống mạch nước ngầm",
      "Gió bão và cát sụt làm đứt rễ non hoặc lấp đọt dừa mới trồng",
    ],
    successIndicators: [
      "Mặt đất được liên kết tốt hơn, xuất hiện nấm vi sinh và giun đất",
      "Lá dừa xanh mượt dài ngày, tỷ lệ đậu trái dừa tăng lên",
    ],
    videoTutorials: [],
    relatedDocuments: [],
    procedures: [
      {
        id: 1101,
        stepNumber: 1,
        name: "Quản lý thảm phủ và tủ gốc giữ ẩm",
        description: "Chống nắng nóng áp sát gốc và chống bốc hơi nước mặt.",
        detailedInstructions:
          "Dùng rơm rạ, tàu dừa khô phủ kín xung quanh hố/gốc dừa. Tuyệt đối không diệt sạch cỏ bằng hóa chất, nên trồng xen các loại cỏ họ đậu (Kudzu) hoặc cây ngắn ngày (lạc, đậu) để cố định đạm sinh học, làm 'bơm sinh học' tự nhiên bảo vệ đất cát khỏi xói mòn gió.",
        dosage: "Che phủ bán kính 1.5 - 2.0m",
        timing: "Thường xuyên, tăng cường đầu mùa khô",
        technique: "Tủ gốc sinh học",
        materials: ["Tàu dừa khô", "Rơm rạ", "Hạt giống cỏ họ đậu"],
        equipment: ["Dụng cụ làm cỏ thủ công"],
        estimatedDays: 3,
        warnings: [
          "Không phủ vật liệu quá sát cổ rễ dừa (cách 20cm) để tránh nấm cổ rễ.",
        ],
        tips: [
          "Ở giai đoạn kiến thiết, cần đổ thêm lớp đất sỏi đệm đáy hố và đóng cọc cố định dừa non tránh cát lún.",
        ],
        startDay: 1,
        endDay: 3,
        stageMaterials: [],
      },
      {
        id: 1102,
        stepNumber: 2,
        name: "Bổ sung lượng lớn Mùn hữu cơ và Xơ dừa",
        description:
          "Tăng CEC, hình thành keo đất liên kết các hạt cát rời rạc.",
        detailedInstructions:
          "Bón phân chuồng hoai mục (30 - 40 kg/cây/năm) phối trộn với mụn dừa (đã xử lý EC chất chát) tỷ lệ 30-50% vào lớp đất mặt ở độ sâu 15 - 20 cm. Bổ sung vi sinh vật cố định đạm và phân giải lân để đẩy nhanh tốc độ hoai mục.",
        dosage: "30-40 kg Hữu cơ + 5-10 kg Mụn dừa/cây",
        timing: "Đầu mùa mưa",
        technique: "Trộn xới sâu 15-20cm",
        materials: [
          "Phân bò/gà hoai",
          "Mụn dừa xử lý EC",
          "Vi sinh vật có lợi",
        ],
        equipment: ["Cuốc", "Xẻng"],
        estimatedDays: 10,
        warnings: [
          "Mụn dừa chưa qua xử lý chát (Tanin, Lignin) sẽ làm rễ dừa bị ngộ độc và đen đầu rễ.",
        ],
        tips: [
          "Đất cát nghèo Canxi, cần bón lót thêm 200 - 400 kg vôi Dolomite/ha/năm để duy trì pH.",
        ],
        startDay: 10,
        endDay: 20,
        stageMaterials: [],
      },
      {
        id: 1103,
        stepNumber: 3,
        name: "Áp dụng phân bón vô cơ nhả chậm và Tưới nhỏ giọt",
        description: "Tránh rửa trôi trực di dinh dưỡng xuống tầng nước ngầm.",
        detailedInstructions:
          "Cấm bón phân hóa học lượng lớn 1 lần trên nền cát. Phân chia định lượng NPK làm 4 - 6 lần bón nhỏ trong năm. Ưu tiên dùng các dòng phân nhả chậm, phân bọc công nghệ (ví dụ NPK 20-10-0+10,5Ca+7S) giúp cây hấp thụ từ từ. Thiết lập hệ thống tưới nhỏ giọt tận gốc để duy trì vùng ẩm liên tục.",
        dosage: "Chia nhỏ liều lượng bón nhiều lần",
        timing: "Định kỳ 2 tháng/lần",
        technique: "Bón hốc quanh tán + Tưới nhỏ giọt",
        materials: ["Phân NPK nhả chậm", "Phân trung vi lượng"],
        equipment: ["Hệ thống tưới nhỏ giọt"],
        estimatedDays: 5,
        warnings: [
          "Phân đạm Urê hạt bón mặt đất cát không tưới sẽ bay hơi, tưới dội ngay sẽ rửa trôi tụt tầng.",
        ],
        tips: [
          "Phân NPK có bổ sung Silic và Canxi giúp lá dừa cứng cáp chống chịu gió biển mạnh.",
        ],
        startDay: 30,
        endDay: 35,
        stageMaterials: [],
      },
    ],
    seasonalPhases: [],
    status: "in_progress",
    area: 5.0,
    budget: 25000000,
    budgetRange: "20-30 triệu",
    technician: "Chuyên gia Thổ nhưỡng Nông nghiệp",
    soilIssue: "Đất bạc màu, không giữ ẩm, dung tích hấp thu (CEC) rất thấp",
    cropType: "Dừa Ta / Dừa Dâu",
    soilProblems: ["low_organic", "excessive_drainage", "nutrient_leaching"],
    targetSeverity: "improve",
    primaryMethodId: 3,
    supportingMethodIds: [8, 9],
    goalTags: ["#chongruatroi", "#tangmuun", "#giuamdatcat"],
    responsibleUnit: "khuyen_nong",
  },
];

export const createEmptyTreatmentPlanForm = (): TreatmentPlanFormData => ({
  code: "",
  name: "",
  zone: "",
  objectives: [],
  duration: "",
  startDate: "",
  endDate: "",
  intensity: "medium",
  priority: "medium",
  selectedMethods: [],
  primaryMethodId: undefined,
  supportingMethodIds: [],
  procedures: [],
  seasonalPhases: [],
  status: "planning",
  area: 0,
  budget: 0,
  budgetRange: "",
  technician: "",
  soilIssue: "",
  cropType: "",
  soilProblems: [],
  targetSeverity: "improve",
  cropGroupTags: [],
  applicableObjects: [],
  applicableCrops: [],
  terrainTypes: [],
  responsibleUnit: "",
  authors: [
    {
      id: 1,
      name: "",
      qualification: "",
      organization: "",
    },
  ],
  goalTags: [],
  currentSurvey: "",
  importantNotes: "",
  expectedOutcomeSummary: "",
  inspectionParameters: [],
  qualityChecklist: [],
  materialItems: [],
  attachments: [],
});

export const treatmentPlanIntensityOptions = [
  { label: "Nhẹ", value: "light" },
  { label: "Trung bình", value: "medium" },
  { label: "Sâu", value: "deep" },
] as const;

export const treatmentPlanPriorityOptions = [
  { label: "Thấp", value: "low" },
  { label: "Trung bình", value: "medium" },
  { label: "Cao", value: "high" },
  { label: "Khẩn cấp", value: "urgent" },
] as const;

export const soilProblemOptions = [
  { label: "Đất chai cứng", value: "soil_compaction" },
  { label: "Đất bạc màu", value: "low_organic" },
  { label: "Đất nhiễm mặn", value: "salinity" },
  { label: "Đất phèn", value: "acid_sulfate" },
  { label: "Mất cân bằng pH", value: "imbalanced_ph" },
  { label: "Thoát nước kém", value: "poor_drainage" },
  { label: "Bệnh hại trong đất", value: "soil_borne_disease" },
] as const;

export const targetSeverityOptions = [
  { label: "Theo dõi", value: "monitor" },
  { label: "Cải thiện", value: "improve" },
  { label: "Can thiệp mạnh", value: "intensive" },
  { label: "Phục hồi khẩn", value: "recovery" },
] as const;

export const responsibleUnitOptions = [
  { label: "Tổ vận hành nông trường", value: "field-ops" },
  { label: "Phòng lab đất", value: "soil-lab" },
  { label: "Nhóm kỹ thuật chi nhánh", value: "branch-team" },
  { label: "Hội đồng chuyên gia", value: "expert-council" },
] as const;

export const applicableObjectOptions = [
  { label: "Đất trồng liên vụ", value: "dat-trong-lien-vu" },
  { label: "Vườn sau thu hoạch", value: "vuon-sau-thu-hoach" },
  { label: "Khu đất chuyển đổi cơ cấu", value: "khu-dat-chuyen-doi" },
  { label: "Khu vực có bệnh nền", value: "khu-vuc-co-benh-nen" },
] as const;

export const cropGroupOptions = [
  { label: "Lúa", value: "lua" },
  { label: "Rau ăn lá", value: "rau-an-la" },
  { label: "Rau gia vị", value: "rau-gia-vi" },
  { label: "Cây ăn trái", value: "cay-an-trai" },
  { label: "Cây công nghiệp", value: "cay-cong-nghiep" },
  { label: "Cây dược liệu", value: "cay-duoc-lieu" },
] as const;

export const terrainOptions = [
  { label: "Đất bằng", value: "dat-bang" },
  { label: "Đất thấp trũng", value: "dat-thap-trung" },
  { label: "Đất gò cao", value: "dat-go-cao" },
  { label: "Đất phù sa pha cát", value: "dat-phu-sa-pha-cat" },
  { label: "Đất đỏ bazan", value: "dat-do-bazan" },
] as const;

export const budgetRangeOptions = [
  { label: "50 - 100 triệu", value: "50-100" },
  { label: "100 - 150 triệu", value: "100-150" },
  { label: "150 - 300 triệu", value: "150-300" },
  { label: "300 - 500 triệu", value: "300-500" },
  { label: "Trên 1 tỷ", value: "trên-1000" },
] as const;

export const inspectionParameterOptions = [
  { label: "pH đất", value: "ph" },
  { label: "EC / độ mặn", value: "ec" },
  { label: "Hữu cơ", value: "organic_matter" },
  { label: "Độ ẩm đất", value: "moisture" },
  { label: "Mật độ rễ", value: "root_growth" },
  { label: "Tỷ lệ sống cây", value: "survival_rate" },
  { label: "Mức độ bệnh đất", value: "soil_disease" },
] as const;

export const treatmentMaterialCategoryOptions = [
  { label: "Máy móc", value: "machine" },
  { label: "Thiết bị", value: "equipment" },
  { label: "Phân bón", value: "fertilizer" },
  { label: "Vi sinh", value: "bio" },
  { label: "Khác", value: "other" },
] as const;
