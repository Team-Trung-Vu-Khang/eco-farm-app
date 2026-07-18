import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";

export type LegalFileGroupId =
  | "landProof"
  | "boundaryProof"
  | "soilSuitability";

export type LegalIdentificationStatus = "draft" | "in_review" | "approved";

export interface LegalIdentificationFileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  fileUrl?: string;
  previewUrl?: string;
}

export interface LegalIdentificationRecord {
  id: number;
  code: string;
  name: string;
  scopeSelections: GeographicalSelection[];
  regionName?: string;
  areaName?: string;
  address: string;
  ownerName?: string;
  note?: string;
  status: LegalIdentificationStatus;
  documents: Record<LegalFileGroupId, LegalIdentificationFileMeta[]>;
  createdAt: string;
  updatedAt: string;
}

export interface LegalFileGroupConfig {
  id: LegalFileGroupId;
  title: string;
  description: string;
  requirements: string[];
}

export const LEGAL_FILE_GROUPS: LegalFileGroupConfig[] = [
  {
    id: "landProof",
    title: "Giấy tờ pháp lý chứng minh quyền sử dụng đất",
    description: "Tập hợp giấy tờ gốc hoặc bản sao chứng thực theo từng loại.",
    requirements: [
      "Căn cước chủ đất",
      "Giấy chứng nhận quyền sử dụng đất",
      "Hợp đồng chuyển nhượng đã công chứng/chứng thực",
      "Biên bản bàn giao đất/thực địa nếu có",
      "Biên bản xác định ranh giới, mốc giới thửa đất",
    ],
  },
  {
    id: "boundaryProof",
    title: "Thông tin đo đạc và ranh giới",
    description: "Dùng để chứng minh ranh giới rõ ràng, khớp với thực địa.",
    requirements: [
      "Bản trích đo địa chính hoặc bản đồ hiện trạng thửa đất",
      "Biên bản đo đạc thực tế: diện tích, tọa độ đỉnh thửa, mô tả ranh giới",
    ],
  },
  {
    id: "soilSuitability",
    title: "Thông tin chứng minh đất phù hợp mục đích sử dụng",
    description: "Bổ sung hồ sơ thổ nhưỡng, nguồn nước và phương án sử dụng.",
    requirements: [
      "Kết quả kiểm tra thổ nhưỡng và nguồn nước",
      "Phương án sử dụng đất nếu trồng quy mô lớn",
    ],
  },
];

export const LEGAL_STATUS_LABELS: Record<LegalIdentificationStatus, string> = {
  draft: "Nháp",
  in_review: "Đang duyệt",
  approved: "Đã duyệt",
};

export const LEGAL_STATUS_CLASSNAMES: Record<LegalIdentificationStatus, string> =
  {
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    in_review: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

function createFileMeta(
  name: string,
  size: number,
  type: string,
): LegalIdentificationFileMeta {
  return {
    id: `${name}-${size}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    size,
    type,
    uploadedAt: new Date().toISOString(),
  };
}

export function createEmptyLegalDocuments(): Record<
  LegalFileGroupId,
  LegalIdentificationFileMeta[]
> {
  return {
    landProof: [],
    boundaryProof: [],
    soilSuitability: [],
  };
}

export function createSampleLegalIdentificationRecords(): LegalIdentificationRecord[] {
  return [
    {
    id: 1,
    code: "LD-001",
    name: "Hồ sơ pháp lý vùng trồng Khu A",
    scopeSelections: [
      {
        id: "scope-region-1",
        type: "region",
        regionId: "1",
        name: "Vùng trồng EcoFarm 1",
        regionName: "Vùng trồng EcoFarm 1",
      },
    ],
    regionName: "Vùng trồng EcoFarm 1",
    areaName: "Khu vực A",
      address: "Lô 04, xã An Phú, huyện Củ Chi, TP.HCM",
      ownerName: "Nguyễn Văn A",
      note: "Hồ sơ đang chờ rà soát chữ ký giáp ranh.",
      status: "in_review",
      documents: {
        landProof: [
          createFileMeta("so-do-khu-a.pdf", 1542300, "application/pdf"),
          createFileMeta("cccd-chu-dat.jpg", 823410, "image/jpeg"),
        ],
        boundaryProof: [
          createFileMeta(
            "ban-trich-do-dia-chinh.pdf",
            2342100,
            "application/pdf",
          ),
        ],
        soilSuitability: [
          createFileMeta("ket-qua-tho-nhuong.pdf", 1244800, "application/pdf"),
        ],
      },
      createdAt: "2026-06-10T08:20:00.000Z",
      updatedAt: "2026-06-18T10:15:00.000Z",
    },
    {
    id: 2,
    code: "LD-002",
    name: "Hồ sơ pháp lý vùng trồng Khu B",
    scopeSelections: [
      {
        id: "scope-plot-1",
        type: "plot",
        regionId: "2",
        areaId: "21",
        plotId: "211",
        name: "Lô 12",
        regionName: "Vùng trồng EcoFarm 2",
        areaName: "Khu vực B",
      },
    ],
    regionName: "Vùng trồng EcoFarm 2",
    areaName: "Khu vực B",
      address: "Ấp 3, xã Phước Vĩnh An, huyện Củ Chi, TP.HCM",
      ownerName: "HTX Nông nghiệp Xanh",
      status: "approved",
      documents: {
        landProof: [
          createFileMeta("giay-chung-nhan-qsd-dat.pdf", 1894310, "application/pdf"),
          createFileMeta("bien-ban-giao-dat.pdf", 1033412, "application/pdf"),
          createFileMeta("thoa-thuan-ranh-gioi.pdf", 1219000, "application/pdf"),
        ],
        boundaryProof: [
          createFileMeta("ban-do-hien-trang.pdf", 2123001, "application/pdf"),
          createFileMeta("bien-ban-do-dac-thuc-te.docx", 231120, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        ],
        soilSuitability: [
          createFileMeta("kiem-tra-nguon-nuoc.pdf", 934120, "application/pdf"),
          createFileMeta("phuong-an-su-dung-dat.pdf", 1402033, "application/pdf"),
        ],
      },
      createdAt: "2026-05-20T09:10:00.000Z",
      updatedAt: "2026-06-03T14:40:00.000Z",
    },
  ];
}

export function formatLegalFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatLegalDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN");
}
