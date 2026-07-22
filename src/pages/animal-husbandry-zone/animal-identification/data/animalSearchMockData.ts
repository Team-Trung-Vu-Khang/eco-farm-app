import type { Coordinate } from "../../../region-chart/constants";

export interface Certification {
  id: string;
  name: string;
  issuer: string; // Đơn vị cấp
  issueDate: string;
  expiryDate: string;
  certificateNumber: string;
  status: "valid" | "expired" | "pending";
  documentUrl?: string;
}

export interface CareRecord {
  id: string;
  date: string;
  activity: string; // Hoạt động: cho ăn, tiêm vaccine, kiểm tra thú y, vệ sinh chuồng trại
  description: string;
  performedBy: string;
  materials?: string; // Thức ăn / Thuốc thú y sử dụng
  quantity?: string;
  cost?: number;
  notes?: string;
}

export interface DiseaseRecord {
  id: string;
  date: string;
  diseaseName: string;
  severity: "low" | "medium" | "high";
  affectedArea: string; // Bộ phận bị ảnh hưởng
  symptoms: string;
  treatment: string;
  treatmentDate: string;
  recoveryStatus: "recovered" | "treating" | "severe";
  images?: string[];
  notes?: string;
}

export interface HarvestRecord {
  id: string;
  date: string;
  quantity: number; // kg hoặc con
  quality: "A" | "B" | "C";
  price: number; // VND/kg hoặc VND/con
  totalRevenue: number;
  buyer?: string;
  notes?: string;
}

export interface AnimalDetail {
  id: string;
  code: string;
  name: string;
  image: string;
  plantedDate: string; // Ngày nhận nuôi
  seedType: string; // Con giống / Nguồn gốc
  variety: string; // Giống vật nuôi
  groupCropName: string; // Nhóm vật nuôi
  notes: string;
  status: "healthy" | "diseased" | "harvesting" | "removed";

  // Location information
  regionId: number;
  regionName: string;
  areaId: number;
  areaName: string;
  plotId: string;
  plotName: string;
  coordinate: Coordinate;

  // Growth cycle
  growthStage: string; // Giai đoạn sinh trưởng
  expectedHarvestDate: string; // Ngày dự kiến xuất chuồng
  actualAge: number; // Tuổi (tháng)

  // Certifications
  certifications: Certification[];

  // History
  cultivationHistory: CareRecord[];
  diseaseHistory: DiseaseRecord[];
  harvestHistory: HarvestRecord[];
}

export const MOCK_ANIMALS: AnimalDetail[] = [
  {
    id: "animal-001",
    code: "LN-LR-001",
    name: "Lợn ngoại Landrace",
    image: "https://images.unsplash.com/photo-1604848698030-c434ba08eca1?q=80&w=400&auto=format&fit=crop",
    plantedDate: "2023-11-15",
    seedType: "Lợn giống nhập khẩu",
    variety: "Landrace Đan Mạch",
    groupCropName: "Lợn thịt (Pigs)",
    notes: "Lợn giống có tai rủ dài, thân hình thon dài, tỷ lệ nạc cao, đang phát triển rất tốt.",
    status: "healthy",
    regionId: 1,
    regionName: "Vùng Chăn Nuôi Đồng Nai Alpha",
    areaId: 1,
    areaName: "Khu nuôi lợn thịt",
    plotId: "plot-1-1",
    plotName: "Chuồng số 1",
    coordinate: { lat: 11.545, lng: 106.895 },
    growthStage: "Vỗ béo (Fatterning)",
    expectedHarvestDate: "2024-05-15",
    actualAge: 6,
    certifications: [
      {
        id: "cert-001",
        name: "VietGAP chăn nuôi",
        issuer: "Chi cục Thú y Đồng Nai",
        issueDate: "2023-05-10",
        expiryDate: "2025-05-10",
        certificateNumber: "VG-AN-2023-001",
        status: "valid",
      }
    ],
    cultivationHistory: [
      {
        id: "care-001",
        date: "2024-03-20",
        activity: "Tiêm vaccine",
        description: "Tiêm phòng bệnh dịch tả lợn châu Phi định kỳ",
        performedBy: "Nguyễn Văn An",
        materials: "Vaccine dịch tả tả lợn",
        quantity: "2ml/con",
        cost: 30000,
        notes: "Sau tiêm lợn khỏe mạnh ổn định",
      },
      {
        id: "care-002",
        date: "2024-03-10",
        activity: "Cho ăn bổ sung",
        description: "Bổ sung thức ăn giàu đạm và vitamin nhóm B",
        performedBy: "Hệ thống cấp thức ăn tự động",
        materials: "Thức ăn hỗn hợp vi sinh",
        quantity: "3.5kg/ngày",
        notes: "Lượng thức ăn tiêu thụ tốt",
      }
    ],
    diseaseHistory: [],
    harvestHistory: []
  },
  {
    id: "animal-002",
    code: "BS-HF-002",
    name: "Bò sữa Holstein Friesian",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=400&auto=format&fit=crop",
    plantedDate: "2022-08-10",
    seedType: "Bê giống thuần chủng",
    variety: "HF thuần chủng",
    groupCropName: "Bò sữa (Dairy Cows)",
    notes: "Bò sữa lông khoang trắng đen, chu kỳ cho sữa ổn định, sản lượng đạt tiêu chuẩn.",
    status: "healthy",
    regionId: 1,
    regionName: "Vùng Chăn Nuôi Đồng Nai Alpha",
    areaId: 2,
    areaName: "Khu chăn nuôi bò sữa",
    plotId: "plot-1-2",
    plotName: "Chuồng bò sữa số 2",
    coordinate: { lat: 11.548, lng: 106.898 },
    growthStage: "Khai thác sữa (Milking)",
    expectedHarvestDate: "2025-08-10",
    actualAge: 20,
    certifications: [
      {
        id: "cert-002",
        name: "GlobalGAP",
        issuer: "Control Union Certification",
        issueDate: "2023-01-15",
        expiryDate: "2024-01-15",
        certificateNumber: "GG-AN-2023-085",
        status: "expired",
      }
    ],
    cultivationHistory: [
      {
        id: "care-003",
        date: "2024-03-18",
        activity: "Vệ sinh sát trùng",
        description: "Phun xịt khử trùng chuồng trại định kỳ tiêu chuẩn",
        performedBy: "Trần Thị Bé",
        materials: "Cloramin B",
        notes: "Môi trường khô thoáng",
      }
    ],
    diseaseHistory: [
      {
        id: "dis-002",
        date: "2023-12-05",
        diseaseName: "Viêm vú nhẹ",
        severity: "low",
        affectedArea: "Bầu vú",
        symptoms: "Bầu vú sưng nhẹ, lượng sữa giảm",
        treatment: "Vệ sinh bầu vú bằng sát trùng, chườm ấm và vắt kiệt sữa kết hợp kháng sinh thảo dược",
        treatmentDate: "2023-12-06",
        recoveryStatus: "recovered",
        notes: "Đã khỏi hoàn toàn sau 5 ngày",
      }
    ],
    harvestHistory: []
  },
  {
    id: "animal-003",
    code: "G-AC-003",
    name: "Gà đẻ Ai Cập",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop",
    plantedDate: "2024-01-01",
    seedType: "Gà giống Ai Cập 1 ngày tuổi",
    variety: "Gà Ai Cập siêu trứng",
    groupCropName: "Gà đẻ trứng (Laying Hens)",
    notes: "Đàn gà đẻ năng suất cao, tỷ lệ đẻ trứng đạt trên 85%, lòng đỏ trứng sậm màu.",
    status: "healthy",
    regionId: 2,
    regionName: "Hợp tác xã Chăn nuôi Gia cầm Bình Phước",
    areaId: 3,
    areaName: "Khu vực gà đẻ",
    plotId: "plot-2-1",
    plotName: "Nhà màng số 1",
    coordinate: { lat: 11.535, lng: 106.885 },
    growthStage: "Đẻ trứng (Laying)",
    expectedHarvestDate: "2025-01-01",
    actualAge: 3,
    certifications: [
      {
        id: "cert-003",
        name: "An toàn dịch bệnh",
        issuer: "Chi cục Thú y Bình Phước",
        issueDate: "2024-01-10",
        expiryDate: "2026-01-10",
        certificateNumber: "ATDB-BP-2024-099",
        status: "valid",
      }
    ],
    cultivationHistory: [
      {
        id: "care-004",
        date: "2024-03-22",
        activity: "Thu gom trứng",
        description: "Thu gom và phân loại trứng gà tự động",
        performedBy: "Hệ thống băng chuyền",
        notes: "Đạt 450 quả trứng chất lượng cao",
      }
    ],
    diseaseHistory: [],
    harvestHistory: []
  }
];
