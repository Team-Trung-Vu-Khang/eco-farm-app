import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Sprout,
  TrendingUp,
  Target,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  MapPin,
  Clock,
  Beaker,
  ListChecks,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  FileText,
  Play,
  Download,
  BarChart3,
  Thermometer,
  Droplet,
  Wind,
} from "lucide-react";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  DeleteDialog,
  useToast,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  FormDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

// Phác đồ cải tạo đất (Treatment Plan)
export interface TreatmentPlan {
  id: number;
  code: string;
  name: string;
  zone: string;
  objectives: string[];
  duration: string;
  startDate: string;
  endDate: string;
  intensity: "light" | "medium" | "deep";
  priority: "low" | "medium" | "high" | "urgent";
  selectedMethods: number[];
  procedures: TreatmentProcedure[];
  seasonalPhases: SeasonalPhase[];
  status: "planning" | "in_progress" | "completed" | "cancelled";
  area: number;
  budget: number;
  technician: string;
  soilIssue: string;
  cropType: string;

  // Enhanced fields
  coverImage?: string;
  soilAnalysis?: SoilAnalysis;
  expectedResults?: ExpectedResult[];
  riskFactors?: string[];
  successIndicators?: string[];
  relatedDocuments?: Document[];
  videoTutorials?: VideoTutorial[];
}

interface SoilAnalysis {
  pH: { current: number; target: number };
  organicMatter: { current: number; target: number; unit: string };
  nitrogen: { current: number; target: number; unit: string };
  phosphorus: { current: number; target: number; unit: string };
  potassium: { current: number; target: number; unit: string };
  ec: { current: number; target: number; unit: string }; // Electrical Conductivity
  texture: string;
  color: string;
  drainage: "poor" | "moderate" | "good";
}

interface ExpectedResult {
  metric: string;
  before: string;
  after: string;
  timeframe: string;
}

interface Document {
  id: number;
  name: string;
  type: "pdf" | "doc" | "image";
  url: string;
  size: string;
}

interface VideoTutorial {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  description: string;
}

export interface TreatmentMethod {
  id: number;
  name: string;
  type: "physical" | "chemical" | "biological" | "integrated";
  description: string;
  icon: string;
  benefits: string[];
  limitations: string[];
  costEffectiveness: "low" | "medium" | "high";
  difficulty: "easy" | "moderate" | "difficult";
}

export interface TreatmentProcedure {
  id: number;
  stepNumber: number;
  name: string;
  description: string;
  detailedInstructions?: string;
  dosage?: string;
  timing: string;
  technique: string;
  materials: string[];
  equipment: string[];
  estimatedDays: number;

  // Enhanced fields
  images?: string[];
  videoUrl?: string;
  warnings?: string[];
  tips?: string[];
  expectedOutcome?: string;
  qualityCheckpoints?: string[];
  weatherRequirements?: string;
  laborRequired?: number;
  estimatedCost?: number;
}

interface SeasonalPhase {
  id: number;
  phaseName: string;
  seasonType: "pre_season" | "in_season" | "post_season" | "off_season";
  startDate: string;
  endDate: string;
  activities: string[];
  notes: string;
  weatherConditions?: string;
  criticalTasks?: string[];
}

export const mockMethods: TreatmentMethod[] = [
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
    id: 1,
    code: "PD-001",
    name: "Phác đồ cải tạo đất bạc màu - Trồng rau",
    zone: "Vùng C - Đồng Nai",
    objectives: ["Tăng hữu cơ", "Giảm chai đất"],
    duration: "2 năm",
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    intensity: "medium",
    priority: "high",
    selectedMethods: [1, 3],
    coverImage:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    soilAnalysis: {
      pH: { current: 5.2, target: 6.5 },
      organicMatter: { current: 1.2, target: 3.5, unit: "%" },
      nitrogen: { current: 0.08, target: 0.15, unit: "%" },
      phosphorus: { current: 12, target: 25, unit: "ppm" },
      potassium: { current: 85, target: 150, unit: "ppm" },
      ec: { current: 0.3, target: 0.8, unit: "dS/m" },
      texture: "Thịt pha cát",
      color: "Xám nhạt",
      drainage: "moderate",
    },
    expectedResults: [
      {
        metric: "Hàm lượng hữu cơ",
        before: "1.2%",
        after: "3.5%",
        timeframe: "18-24 tháng",
      },
      {
        metric: "pH đất",
        before: "5.2",
        after: "6.0-6.5",
        timeframe: "6-12 tháng",
      },
      {
        metric: "Năng suất rau",
        before: "8 tấn/ha",
        after: "15-18 tấn/ha",
        timeframe: "Sau vụ đầu",
      },
      {
        metric: "Độ xốp đất",
        before: "Thấp",
        after: "Tốt",
        timeframe: "12 tháng",
      },
    ],
    riskFactors: [
      "Mưa lớn trong giai đoạn phơi đất có thể làm chậm tiến độ",
      "Chất lượng phân hữu cơ kém ảnh hưởng hiệu quả",
      "Thiếu nước tưới trong mùa khô",
    ],
    successIndicators: [
      "Đất có màu sẫm hơn, tơi xốp",
      "Rễ cây phát triển sâu hơn 20cm",
      "Giảm sâu bệnh đất",
      "Tăng hoạt động giun đất",
    ],
    videoTutorials: [
      {
        id: 1,
        title: "Hướng dẫn cày xới sâu cải tạo đất bạc màu",
        duration: "12:45",
        thumbnail:
          "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
        url: "#",
        description:
          "Video chi tiết về kỹ thuật cày xới sâu, độ sâu phù hợp và thời điểm thực hiện",
      },
      {
        id: 2,
        title: "Cách bón phân hữu cơ hiệu quả",
        duration: "8:30",
        thumbnail:
          "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
        url: "#",
        description:
          "Hướng dẫn lựa chọn, bảo quản và bón phân hữu cơ đúng kỹ thuật",
      },
    ],
    relatedDocuments: [
      {
        id: 1,
        name: "Quy trình cải tạo đất bạc màu.pdf",
        type: "pdf",
        url: "#",
        size: "2.4 MB",
      },
      {
        id: 2,
        name: "Bảng theo dõi chỉ số đất.xlsx",
        type: "doc",
        url: "#",
        size: "156 KB",
      },
    ],
    procedures: [
      {
        id: 1,
        stepNumber: 1,
        name: "Thu hoạch và dọn tàn dư",
        description: "Dọn sạch tàn dư cây trồng cũ, loại bỏ rễ cây",
        detailedInstructions:
          "Thu hoạch toàn bộ cây trồng còn lại. Dùng máy cắt cỏ hoặc máy gặt để cắt gốc cây sát mặt đất. Thu gom tàn dư vào bao hoặc xe chở đi. Đối với rễ cây lớn, dùng cuốc hoặc máy xới để nhổ bỏ. Vận chuyển tàn dư ra khỏi ruộng để tránh lây lan sâu bệnh.",
        timing: "Ngày 1-2",
        technique: "Thu gom thủ công hoặc máy móc",
        materials: [],
        equipment: ["Máy cắt cỏ", "Xe vận chuyển"],
        estimatedDays: 2,
        images: [
          "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600",
          "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600",
        ],
        videoUrl: "#",
        warnings: [
          "Không đốt tàn dư trên ruộng để tránh phá hủy vi sinh vật có lợi",
          "Kiểm tra kỹ để không bỏ sót rễ cây lớn",
        ],
        tips: [
          "Nên thực hiện vào ngày nắng để dễ thu gom",
          "Tàn dư có thể ủ compost tái sử dụng",
          "Sử dụng máy móc giúp tiết kiệm 50% thời gian",
        ],
        expectedOutcome: "Ruộng sạch hoàn toàn, không còn tàn dư cây trồng cũ",
        qualityCheckpoints: [
          "Không còn thấy tàn dư trên mặt đất",
          "Rễ cây lớn đã được nhổ bỏ",
          "Mặt ruộng phẳng, sẵn sàng cho bước tiếp theo",
        ],
        weatherRequirements: "Nắng ráo, tránh mưa",
        laborRequired: 4,
        estimatedCost: 2.5,
      },
      {
        id: 2,
        stepNumber: 2,
        name: "Bón phân hữu cơ hoai",
        description: "Rải đều 2-3 tấn phân hữu cơ/ha trên bề mặt đất",
        detailedInstructions:
          "Chọn phân hữu cơ đã hoai hoàn toàn (màu đen, mùi thơm đất). Kiểm tra độ ẩm phân khoảng 40-50%. Rải đều phân trên toàn bộ diện tích với liều lượng 2-3 tấn/ha. Nếu dùng máy rải, điều chỉnh tốc độ để phân rải đều. Nếu rải thủ công, chia ruộng thành các ô nhỏ để đảm bảo đồng đều.",
        dosage: "2-3 tấn/ha",
        timing: "Ngày 3-4",
        technique: "Rải đều bằng tay hoặc máy rải",
        materials: ["Phân hữu cơ hoai"],
        equipment: ["Máy rải phân"],
        estimatedDays: 2,
        images: [
          "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
          "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600",
        ],
        videoUrl: "#",
        warnings: [
          "Không dùng phân chưa hoai hoàn toàn - gây cháy rễ",
          "Tránh bón quá liều - gây thừa đạm",
          "Đeo găng tay và khẩu trang khi thao tác",
        ],
        tips: [
          "Phân hữu cơ tốt có màu đen, tơi xốp, mùi thơm đất",
          "Nên trộn thêm 10-20kg vôi bột/tấn phân để khử mùi",
          "Bón vào buổi chiều mát để giảm bay hơi",
        ],
        expectedOutcome: "Lớp phân hữu cơ phủ đều trên mặt ruộng, độ dày 2-3cm",
        qualityCheckpoints: [
          "Phân được rải đều, không có chỗ dày chỗ mỏng",
          "Phân có màu đen, không có mùi hôi",
          "Độ ẩm phân vừa phải, không quá khô hoặc ướt",
        ],
        weatherRequirements: "Trời mát, tránh nắng gắt và mưa",
        laborRequired: 6,
        estimatedCost: 15.0,
      },
      {
        id: 3,
        stepNumber: 3,
        name: "Xới sâu đất",
        description: "Cày xới sâu 20-25cm để phá vỡ tầng đất cứng",
        timing: "Ngày 5-6",
        technique: "Sử dụng máy cày sâu",
        materials: [],
        equipment: ["Máy cày sâu", "Máy xới"],
        estimatedDays: 2,
      },
      {
        id: 4,
        stepNumber: 4,
        name: "Bổ sung vi sinh",
        description: "Tưới dung dịch vi sinh vào đất",
        dosage: "5-10 lít/ha",
        timing: "Ngày 7",
        technique: "Pha loãng và tưới đều",
        materials: ["Chế phẩm vi sinh"],
        equipment: ["Bình phun", "Hệ thống tưới"],
        estimatedDays: 1,
      },
      {
        id: 5,
        stepNumber: 5,
        name: "Che phủ đất",
        description: "Phủ rơm rạ hoặc màng để giữ ẩm và ủ đất",
        timing: "Ngày 8-17",
        technique: "Phủ đều toàn bộ diện tích",
        materials: ["Rơm rạ", "Màng phủ"],
        equipment: [],
        estimatedDays: 10,
      },
      // {
      //   id: 6,
      //   stepNumber: 6,
      //   name: "Gieo vụ mới",
      //   description: "Bắt đầu gieo trồng cây mới sau khi đất đã được cải tạo",
      //   timing: "Ngày 18",
      //   technique: "Theo quy trình gieo trồng tiêu chuẩn",
      //   materials: ["Hạt giống"],
      //   equipment: ["Máy gieo hạt"],
      //   estimatedDays: 1,
      // },
    ],
    seasonalPhases: [],
    status: "in_progress",
    area: 4.0,
    budget: 120,
    technician: "Lê Văn C",
    soilIssue: "Đất bạc màu, nghèo dinh dưỡng",
    cropType: "Rau màu",
  },
  {
    id: 2,
    code: "PD-002",
    name: "Phác đồ xử lý đất phèn - Lúa",
    zone: "Vùng B - Long An",
    objectives: ["Hạ phèn bền vững", "Cải thiện pH"],
    duration: "3-5 năm",
    startDate: "2025-02-01",
    endDate: "2029-12-31",
    intensity: "deep",
    priority: "urgent",
    selectedMethods: [2, 5, 3],
    procedures: [
      {
        id: 1,
        stepNumber: 1,
        name: "Thoát nước - rửa phèn",
        description: "Tạo hệ thống thoát nước, ngập nước ngọt để rửa phèn",
        timing: "Ngày 1-5",
        technique: "Ngập nước 15-20cm, duy trì 3-5 ngày",
        materials: ["Nước ngọt"],
        equipment: ["Máy bơm", "Hệ thống tưới"],
        estimatedDays: 5,
      },
      {
        id: 2,
        stepNumber: 2,
        name: "Bón vôi khử chua",
        description: "Rải vôi bột CaCO3 để trung hòa độ chua",
        dosage: "500-1000 kg/ha",
        timing: "Ngày 6-7",
        technique: "Rải đều trên bề mặt",
        materials: ["Vôi bột CaCO3"],
        equipment: ["Máy rải vôi"],
        estimatedDays: 2,
      },
      {
        id: 3,
        stepNumber: 3,
        name: "Cày lật đất",
        description: "Cày lật đất để trộn đều vôi",
        timing: "Ngày 8-9",
        technique: "Cày sâu 25-30cm",
        materials: [],
        equipment: ["Máy cày"],
        estimatedDays: 2,
      },
      {
        id: 4,
        stepNumber: 4,
        name: "Phơi ải đất",
        description: "Phơi đất để oxy hóa các chất độc hại",
        timing: "Ngày 10-16",
        technique: "Để đất tiếp xúc với không khí",
        materials: [],
        equipment: [],
        estimatedDays: 7,
      },
      {
        id: 5,
        stepNumber: 5,
        name: "Cày vùi rơm rạ + vi sinh",
        description: "Bón rơm rạ và vi sinh, sau đó cày vùi",
        dosage: "3-5 tấn rơm/ha + 10 lít vi sinh/ha",
        timing: "Ngày 17-18",
        technique: "Rải đều rồi cày vùi",
        materials: ["Rơm rạ", "Chế phẩm vi sinh"],
        equipment: ["Máy cày"],
        estimatedDays: 2,
      },
    ],
    seasonalPhases: [],
    status: "planning",
    area: 5.5,
    budget: 250,
    technician: "Trần Thị B",
    soilIssue: "Đất chua phèn (pH < 4.0)",
    cropType: "Lúa",
  },
  {
    id: 3,
    code: "PD-003",
    name: "Cải tạo đất nhiễm mặn - Cà Mau",
    zone: "Vùng A - Cà Mau",
    objectives: ["Giảm mặn", "Cải thiện cấu trúc"],
    duration: "1 năm",
    startDate: "2025-03-01",
    endDate: "2026-02-28",
    intensity: "medium",
    priority: "high",
    selectedMethods: [5, 6],
    procedures: [],
    seasonalPhases: [],
    status: "planning",
    area: 3.2,
    budget: 95,
    technician: "Nguyễn Văn A",
    soilIssue: "Nhiễm mặn (EC > 4dS/m)",
    cropType: "Tôm - Lúa",
  },
  {
    id: 4,
    code: "PD-SOIL-HCDF-2026",
    name: "Phác đồ Phục hồi Hệ nền Đất & Kích kháng rễ Sầu riêng (ICU)",
    zone: "Khu vực thực nghiệm - Hàm Rồng, Gia Lai",
    objectives: [
      "Cứu rễ - Cứu oxy",
      "Điều chỉnh cấu trúc - pH nền",
      "Thiết lập quần thể vi sinh đối kháng",
    ],
    duration: "12 tháng",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    intensity: "deep",
    priority: "high",
    selectedMethods: [1, 2, 3],
    coverImage:
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
    soilAnalysis: {
      pH: { current: 4.8, target: 6.0 },
      organicMatter: { current: 1.5, target: 4.0, unit: "%" },
      nitrogen: { current: 0.05, target: 0.15, unit: "%" },
      phosphorus: { current: 10, target: 25, unit: "ppm" },
      potassium: { current: 70, target: 150, unit: "ppm" },
      ec: { current: 0.2, target: 0.8, unit: "dS/m" },
      texture: "Đất đỏ Bazan nén chặt",
      color: "Nâu đỏ xám (yếm khí)",
      drainage: "poor",
    },
    expectedResults: [
      {
        metric: "Độ pH đất vùng rễ",
        before: "4.8",
        after: "5.5 - 6.0",
        timeframe: "1.5 - 3 tháng",
      },
      {
        metric: "Mật độ vi sinh có lợi (Bacillus)",
        before: "Thấp",
        after: "10^7 CFU/g đất",
        timeframe: "6 tuần",
      },
    ],
    riskFactors: [
      "Sử dụng thuốc bảo vệ thực vật gốc Đồng làm chết vi sinh HCDF",
      "Mưa lớn gây tái úng cục bộ tại các điểm trũng",
    ],
    successIndicators: [
      "Vết xì mủ trên thân khô hoàn toàn, không chảy dịch mới",
      "Hệ rễ tơ bắt đầu nhú mầm trắng, lá ngừng rụng",
    ],
    videoTutorials: [
      {
        id: 1,
        title: "Kỹ thuật khơi rãnh thoát nước và xới nhẹ cứu oxy",
        duration: "08:30",
        thumbnail:
          "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400",
        url: "#",
        description:
          "Hướng dẫn phá váng bề mặt và tạo hành lang thoát nước rút trong 6-12h",
      },
    ],
    relatedDocuments: [
      {
        id: 1,
        name: "Phác đồ ICU sầu riêng Hàm Rồng.pdf",
        type: "pdf",
        url: "#",
        size: "3.5 MB",
      },
    ],
    procedures: [
      {
        id: 1,
        stepNumber: 1,
        name: "Cấp tốc (0–7 ngày) – “Cứu rễ, cứu oxy”",
        description:
          "Thoát nước khẩn cấp và đưa đất từ trạng thái yếm khí sang hiếu khí",
        detailedInstructions:
          "Khơi mương, rãnh phụ tại các điểm đọng nước; ưu tiên nước rút trong 6–12h sau mưa. Ngừng mọi hoạt động tưới dư và bón đạm mạnh. Xới nhẹ lớp mặt (tránh phạm rễ lớn) để tăng thông thoáng. Thu gom toàn bộ tàn dư thối, quả rụng đem tiêu hủy để dọn nguồn bệnh.",
        dosage: "N/A",
        timing: "Ngay khi phát hiện úng/vàng lá",
        technique: "Khơi rãnh thủ công + Xới nhẹ mặt đất",
        materials: ["Vật liệu phủ thoáng (Rơm/Mùn)"],
        equipment: ["Cuốc, xẻng khơi rãnh"],
        estimatedDays: 7,
        images: [],
        videoUrl: "#",
        warnings: [
          "Không dùng xe cơ giới nặng đi vào vườn khi đất đang ướt",
          "Tuyệt đối không bón thêm phân hóa học giai đoạn này",
        ],
        tips: [
          "Nên xới đất vào buổi sáng khi đất bắt đầu se mặt",
          "Ưu tiên xử lý các cây Cấp 3 và Cấp 4 trước",
        ],
        expectedOutcome: "Đất vùng rễ khô ráo, không còn mùi chua yếm khí",
        qualityCheckpoints: [
          "Nước thoát sạch sau mưa 12h",
          "Lớp bề mặt đất tơi xốp, không bị đóng váng",
        ],
        weatherRequirements: "Trời tạnh ráo hoặc sau mưa lớn",
        laborRequired: 10,
        estimatedCost: 20.0,
      },
      {
        id: 2,
        stepNumber: 2,
        name: "Ngắn hạn (2–6 tuần) – “Điều chỉnh cấu trúc - pH nền”",
        description: "Sửa cấu trúc vật lý đất và cân bằng lại độ pH vùng rễ",
        detailedInstructions:
          "Tiến hành bón vôi hoặc Dolomite để khử chua dựa trên kết quả test pH thực tế. Rải Ozym (100g/gốc) kết hợp với phân hữu cơ hoai mục để phân hủy tàn dư rễ thối. Đưa Bzym+ (10^15 CFU/mL) nồng độ cao vào đất để thiết lập quần thể vi sinh ưu thế bảo vệ rễ.",
        dosage: "100g Ozym + 500ml Bzym+/gốc",
        timing: "Tuần thứ 2 đến tuần thứ 6",
        technique: "Bón lấp nông vùng tán",
        materials: ["Ozym", "Bzym+", "Vôi", "Phân hữu cơ hoai"],
        equipment: ["Hệ thống tưới tự động (đã lọc cặn)", "Ca đong"],
        estimatedDays: 30,
        images: [],
        videoUrl: "#",
        warnings: [
          "Tách thời điểm bón vôi với phân vi sinh ít nhất 5 ngày",
          "Cách ly hoàn toàn thuốc gốc Đồng ít nhất 7 ngày",
        ],
        tips: [
          "Vi sinh Bacillus hoạt động tốt nhất khi đất đủ ẩm",
          "Nâng pH đất từ từ sẽ giúp rễ không bị sốc nhiệt",
        ],
        expectedOutcome: "pH đất tăng 0.5 - 1.0 độ, mật độ nấm hại giảm rõ rệt",
        qualityCheckpoints: [
          "Vết xì mủ trên thân bắt đầu se lại và khô",
          "Kiểm tra mật độ Bacillus đạt ngưỡng an toàn",
        ],
        weatherRequirements: "Trời mát, đất đủ độ ẩm",
        laborRequired: 8,
        estimatedCost: 45.0,
      },
    ],
    seasonalPhases: [],
    status: "in_progress",
    area: 380.0,
    budget: 5000,
    technician: "Lê Thanh Hà",
    soilIssue: "Đất nén chặt, úng bí, nhiễm nấm Phytophthora cấp tính",
    cropType: "Sầu riêng kinh doanh",
  },
];

export default function SoilAmendmentTreatmentPage() {
  const { toast } = useToast();
  const [data, setData] = useState<TreatmentPlan[]>(initialTreatmentPlans);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<TreatmentPlan | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TreatmentPlan | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterIntensity, setFilterIntensity] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const matchKeyword =
          item.code.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.soilIssue.toLowerCase().includes(keyword);
        if (!matchKeyword) return false;
      }

      if (filterStatus && item.status !== filterStatus) return false;
      if (filterIntensity && item.intensity !== filterIntensity) return false;

      return true;
    });
  }, [data, searchKeyword, filterStatus, filterIntensity]);

  useEffect(() => {
    if (filteredData.length > 0) {
      if (
        selectedId === null ||
        !filteredData.find((i) => i.id === selectedId)
      ) {
        setSelectedId(filteredData[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredData, selectedId]);

  const selectedPlan = useMemo(
    () => data.find((t) => t.id === selectedId),
    [data, selectedId],
  );

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: TreatmentPlan) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: TreatmentPlan) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      if (selectedId === deleteItem.id) {
        setSelectedId(null);
      }
      toast({ title: "Thành công", description: "Đã xóa phác đồ" });
    }
    setDeleteOpen(false);
  };

  const handleSubmit = (formData: Partial<TreatmentPlan>) => {
    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật phác đồ" });
    } else {
      const newItem: TreatmentPlan = {
        ...formData,
        id: Math.max(...data.map((d) => d.id), 0) + 1,
        status: "planning",
        procedures: [],
        seasonalPhases: [],
      } as TreatmentPlan;
      setData((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      toast({ title: "Thành công", description: "Đã tạo phác đồ mới" });
    }
    setFormOpen(false);
  };

  const planningCount = data.filter((t) => t.status === "planning").length;
  const inProgressCount = data.filter((t) => t.status === "in_progress").length;
  const completedCount = data.filter((t) => t.status === "completed").length;

  const getIntensityConfig = (intensity: string) => {
    switch (intensity) {
      case "light":
        return { label: "Nhẹ", color: "bg-blue-500" };
      case "medium":
        return { label: "Trung bình", color: "bg-yellow-500" };
      case "deep":
        return { label: "Sâu", color: "bg-red-500" };
      default:
        return { label: "Không xác định", color: "bg-gray-500" };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "planning":
        return { label: "Đang lập", color: "bg-blue-500" };
      case "in_progress":
        return { label: "Đang thực hiện", color: "bg-green-500" };
      case "completed":
        return { label: "Hoàn thành", color: "bg-gray-500" };
      case "cancelled":
        return { label: "Đã hủy", color: "bg-red-500" };
      default:
        return { label: "Không xác định", color: "bg-gray-500" };
    }
  };

  return (
    <AdminLayout
      title="Phác đồ cải tạo đất"
      description="Hệ thống quản lý phác đồ, phương pháp và quy trình cải tạo đất"
      actions={
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phác đồ mới
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-white border-blue-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100/50 text-blue-600 ring-1 ring-blue-200">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {planningCount}
                </p>
                <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                  Đang lập kế hoạch
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-white border-green-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100/50 text-green-600 ring-1 ring-green-200">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {inProgressCount}
                </p>
                <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                  Đang thực hiện
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100/50 text-gray-600 ring-1 ring-gray-200">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {completedCount}
                </p>
                <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Hoàn thành
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          {/* Left Sidebar - List View */}
          <div className="lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transform transition-all">
            {/* Sticky Header */}
            <div className="p-3 border-b border-gray-100 bg-white z-10 space-y-3 shrink-0">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-gray-800 text-base">
                  Danh sách phác đồ
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm phác đồ..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setFilterIntensity("");
                  }}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    !filterStatus && !filterIntensity
                      ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterStatus("in_progress")}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    filterStatus === "in_progress"
                      ? "bg-green-600 border-green-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-green-200 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${filterStatus === "in_progress" ? "bg-white" : "bg-green-500"}`}
                  />
                  Đang chạy
                </button>
                <button
                  onClick={() => setFilterIntensity("deep")}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                    filterIntensity === "deep"
                      ? "bg-red-600 border-red-600 text-white shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${filterIntensity === "deep" ? "bg-white" : "bg-red-500"}`}
                  />
                  Cường độ sâu
                </button>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2 space-y-2 custom-scrollbar">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <span>Kết quả ({filteredData.length})</span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                  Mới nhất <ArrowUpDown className="w-3 h-3" />
                </span>
              </div>

              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const statusConfig = getStatusConfig(item.status);
                  const intensityConfig = getIntensityConfig(item.intensity);
                  const isSelected = selectedId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-white border-green-200 shadow-md ring-1 ring-green-100"
                          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-xs font-medium text-gray-500">
                          {item.code}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${statusConfig.color}`}
                        />
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{item.zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${intensityConfig.color} text-white text-xs px-2 py-0.5`}
                        >
                          {intensityConfig.label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {item.duration}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <Search className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">
                    Không tìm thấy phác đồ nào
                  </p>
                  <Button
                    variant="link"
                    className="text-green-600 mt-2"
                    onClick={() => {
                      setSearchKeyword("");
                      setFilterStatus("");
                      setFilterIntensity("");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Detail View */}
          <div className="lg:col-span-9 h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            {selectedPlan ? (
              <div className="h-full overflow-y-auto">
                {/* Hero Section */}
                <div className="relative h-48 bg-gradient-to-r from-green-600 to-emerald-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {selectedPlan.code}
                      </span>
                      {(() => {
                        const config = getIntensityConfig(
                          selectedPlan.intensity,
                        );
                        return (
                          <Badge className={`${config.color} text-white`}>
                            {config.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedPlan.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {selectedPlan.zone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sprout className="w-4 h-4" />
                        {selectedPlan.cropType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {selectedPlan.duration}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEdit(selectedPlan)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedPlan)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>

                {/* Stats Grid - Hidden as per user request */}

                {/* Tabs */}
                <Tabs defaultValue="procedures" className="p-6">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="procedures">
                      <ListChecks className="w-4 h-4 mr-2" />
                      Quy trình & Các bước
                    </TabsTrigger>
                    <TabsTrigger value="methods">
                      <Beaker className="w-4 h-4 mr-2" />
                      Phương pháp
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="procedures" className="space-y-6">
                    {selectedPlan.procedures.length > 0 ? (
                      <div className="space-y-6">
                        {selectedPlan.procedures.map((procedure) => (
                          <div
                            key={procedure.id}
                            className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                          >
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />

                            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <CardContent className="p-5 space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className="bg-green-600 text-white text-xs font-bold">
                                        Bước {procedure.stepNumber}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {procedure.timing}
                                      </Badge>
                                      {procedure.estimatedDays && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {procedure.estimatedDays} ngày
                                        </Badge>
                                      )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                      {procedure.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {procedure.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Images Gallery */}
                                {procedure.images &&
                                  procedure.images.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        Hình ảnh minh họa
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        {procedure.images.map((img, idx) => (
                                          <div
                                            key={idx}
                                            className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
                                          >
                                            <img
                                              src={img}
                                              alt={`Bước ${procedure.stepNumber} - Ảnh ${idx + 1}`}
                                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Video Tutorial */}
                                {procedure.videoUrl && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Play className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-blue-900">
                                          Video hướng dẫn chi tiết
                                        </p>
                                        <p className="text-xs text-blue-700">
                                          Xem video để hiểu rõ hơn về kỹ thuật
                                          thực hiện
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Video className="w-4 h-4 mr-1" />
                                        Xem
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Detailed Instructions */}
                                {procedure.detailedInstructions && (
                                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-600" />
                                      Hướng dẫn chi tiết
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {procedure.detailedInstructions}
                                    </p>
                                  </div>
                                )}

                                {/* Technical Details Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                  {procedure.dosage && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-amber-900 mb-1">
                                        Liều lượng
                                      </p>
                                      <p className="text-sm font-bold text-amber-700">
                                        {procedure.dosage}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.technique && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-purple-900 mb-1">
                                        Kỹ thuật
                                      </p>
                                      <p className="text-sm font-bold text-purple-700">
                                        {procedure.technique}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.weatherRequirements && (
                                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-sky-900 mb-1 flex items-center gap-1">
                                        <Wind className="w-3 h-3" />
                                        Điều kiện thời tiết
                                      </p>
                                      <p className="text-sm font-bold text-sky-700">
                                        {procedure.weatherRequirements}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.laborRequired && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-indigo-900 mb-1">
                                        Nhân công
                                      </p>
                                      <p className="text-sm font-bold text-indigo-700">
                                        {procedure.laborRequired} người
                                      </p>
                                    </div>
                                  )}
                                  {procedure.estimatedCost && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 col-span-2">
                                      <p className="text-xs font-medium text-green-900 mb-1">
                                        Chi phí ước tính
                                      </p>
                                      <p className="text-lg font-bold text-green-700">
                                        {procedure.estimatedCost} triệu đồng
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Warnings */}
                                {procedure.warnings &&
                                  procedure.warnings.length > 0 && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                      <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <h4 className="text-sm font-bold text-red-900 mb-2">
                                            ⚠️ Lưu ý quan trọng
                                          </h4>
                                          <ul className="space-y-1.5">
                                            {procedure.warnings.map(
                                              (warning, idx) => (
                                                <li
                                                  key={idx}
                                                  className="text-sm text-red-800 flex items-start gap-2"
                                                >
                                                  <span className="text-red-500 font-bold mt-0.5">
                                                    •
                                                  </span>
                                                  <span>{warning}</span>
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {/* Tips */}
                                {procedure.tips &&
                                  procedure.tips.length > 0 && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                      <div className="flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <h4 className="text-sm font-bold text-yellow-900 mb-2">
                                            💡 Mẹo hữu ích
                                          </h4>
                                          <ul className="space-y-1.5">
                                            {procedure.tips.map((tip, idx) => (
                                              <li
                                                key={idx}
                                                className="text-sm text-yellow-800 flex items-start gap-2"
                                              >
                                                <span className="text-yellow-500 font-bold mt-0.5">
                                                  ✓
                                                </span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {/* Expected Outcome */}
                                {procedure.expectedOutcome && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs font-medium text-green-900 mb-1">
                                          Kết quả mong đợi
                                        </p>
                                        <p className="text-sm text-green-700">
                                          {procedure.expectedOutcome}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Quality Checkpoints */}
                                {procedure.qualityCheckpoints &&
                                  procedure.qualityCheckpoints.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Điểm kiểm tra chất lượng
                                      </h4>
                                      <div className="space-y-2">
                                        {procedure.qualityCheckpoints.map(
                                          (checkpoint, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-2"
                                            >
                                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                              </div>
                                              <p className="text-sm text-blue-800 flex-1">
                                                {checkpoint}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Materials & Equipment */}
                                <div className="grid grid-cols-2 gap-3">
                                  {procedure.materials &&
                                    procedure.materials.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                          Vật tư cần thiết
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {procedure.materials.map(
                                            (material, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-green-100 text-green-800"
                                              >
                                                {material}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  {procedure.equipment &&
                                    procedure.equipment.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                          Thiết bị
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {procedure.equipment.map(
                                            (equip, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-blue-100 text-blue-800"
                                              >
                                                {equip}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Chưa có quy trình chi tiết</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="methods" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {mockMethods
                        .filter((m) =>
                          selectedPlan.selectedMethods.includes(m.id),
                        )
                        .map((method) => (
                          <Card key={method.id} className="border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{method.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {method.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {method.description}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="mt-2 text-xs"
                                  >
                                    {method.type === "physical" && "Vật lý"}
                                    {method.type === "chemical" && "Hóa học"}
                                    {method.type === "biological" && "Sinh học"}
                                    {method.type === "integrated" && "Tổng hợp"}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 text-gray-400">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Sprout className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">
                  Chưa chọn phác đồ
                </h3>
                <p>Vui lòng chọn một phác đồ từ danh sách bên trái</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
