import { create } from "zustand";

export interface EnterpriseCertificate {
  id: number;
  code: string;
  name: string;
  standardType: string; // Loại tiêu chuẩn (VietGAP, GlobalGAP...)
  agricultureCertificate?: {
    id: number | string;
    code: string;
    name: string;
  };
  organization: string; // Tổ chức cấp
  issuedDate: string; // Thời gian cấp
  expiryDate: string; // Thời gian hết hạn
  status: "valid" | "expired" | "expiring_soon" | "revoked"; // Tự động tính
  entityType: "workspace" | "region"; // Workspace hoặc Vùng trồng
  entityId: string; // ID của doanh nghiệp hoặc vùng trồng
  entityName: string; // Tên doanh nghiệp hoặc vùng trồng
  targetIds?: string[]; // Danh sách ID vùng canh tác
  targetNames?: string[]; // Danh sách tên vùng canh tác
  targetRegions?: {
    id: number | string;
    code: string;
    name: string;
  }[];
  content: string; // Nội dung chứng nhận
  contentType: "editor" | "file";
  fileUrl?: string;
  attachments: string[]; // Danh sách file đính kèm
  createdAt: string;
}

export interface Standard {
  code: string;
  name: string;
  organizations: string[];
  imageUrl?: string;
}

export interface Enterprise {
  id: string;
  code: string;
  name: string;
}

export interface Area {
  id: string;
  code: string;
  name: string;
  enterpriseId: string;
}

interface EnterpriseCertificateStore {
  certificates: EnterpriseCertificate[];
  standards: Standard[];
  enterprises: Enterprise[];
  areas: Area[];

  // Certificate CRUD operations
  getCertificateById: (id: number) => EnterpriseCertificate | undefined;
  addCertificate: (certificate: EnterpriseCertificate) => void;
  updateCertificate: (
    id: number,
    updates: Partial<Omit<EnterpriseCertificate, "id" | "createdAt">>,
  ) => void;
  deleteCertificate: (id: number) => void;

  // Helper functions
  calculateStatus: (
    expiryDate: string,
  ) => "valid" | "expired" | "expiring_soon";
  getOrganizationsByStandard: (standardCode: string) => string[];
  getAreasByEnterprise: (enterpriseId: string) => Area[];
}

const useEnterpriseCertificateStore = create<EnterpriseCertificateStore>(
  (set, get) => ({
    // Initial data
    standards: [
      {
        code: "VietGAP",
        name: "VietGAP",
        organizations: [
          "Bộ Nông nghiệp và Phát triển Nông thôn",
          "Cục Trồng trọt",
        ],
        imageUrl:
          "https://cdn.vietnambiz.vn/2020/3/2/vg-15831176957661073999454.jpg",
      },
      {
        code: "GlobalGAP",
        name: "Global GAP",
        organizations: ["Tổ chức GlobalGAP", "FoodPLUS GmbH"],
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0VCMHRpDAs8PTI0U7WmPd-Bnifg92-ai4_Q&s",
      },
      {
        code: "Organic",
        name: "Organic",
        organizations: [
          "Bộ Nông nghiệp và Phát triển Nông thôn",
          "Cục Quản lý Chất lượng Nông lâm sản và Thủy sản",
        ],
        imageUrl:
          "https://cdn.shopify.com/s/files/1/0789/8483/files/Untitled-4.png?875230042906236671",
      },
      {
        code: "HACCP",
        name: "HACCP",
        organizations: ["Cục Quản lý Chất lượng Nông lâm sản và Thủy sản"],
        imageUrl:
          "https://vinachg.vn/wp-content/uploads/2024/08/haccp-la-gi.jpg",
      },
      {
        code: "ISO22000",
        name: "ISO 22000",
        organizations: ["Tổ chức Tiêu chuẩn Quốc tế (ISO)"],
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl2YKlHQjHyVQKQP79v1xTTyH1Mc0Czcv9rQ&s",
      },
    ],

    enterprises: [
      { id: "DN001", code: "DN001", name: "HTX Nông nghiệp Xanh" },
      { id: "DN002", code: "DN002", name: "Trang trại hữu cơ B" },
      { id: "DN003", code: "DN003", name: "Công ty TNHH Nông sản Sạch" },
      { id: "DN004", code: "DN004", name: "HTX Rau Quả An Toàn" },
      { id: "DN005", code: "DN005", name: "Trang trại Eco Farm" },
    ],

    areas: [
      {
        id: "VT001",
        code: "VT001",
        name: "Vùng trồng A - Đồng bằng",
        enterpriseId: "DN001",
      },
      {
        id: "VT002",
        code: "VT002",
        name: "Vùng trồng B - Miền núi",
        enterpriseId: "DN001",
      },
      {
        id: "VT003",
        code: "VT003",
        name: "Vùng trồng C - Ven biển",
        enterpriseId: "DN002",
      },
      {
        id: "VT004",
        code: "VT004",
        name: "Vùng trồng D - Cao nguyên",
        enterpriseId: "DN003",
      },
      {
        id: "VT005",
        code: "VT005",
        name: "Vùng trồng E - Đồng bằng sông Cửu Long",
        enterpriseId: "DN003",
      },
      {
        id: "VT006",
        code: "VT006",
        name: "Vùng trồng F - Tây Nguyên",
        enterpriseId: "DN003",
      },
    ],

    certificates: [
      {
        id: 1,
        code: "CN-2024-001",
        name: "Chứng nhận VietGAP cho HTX Nông nghiệp",
        standardType: "VietGAP",
        organization: "Bộ Nông nghiệp và Phát triển Nông thôn",
        issuedDate: "2024-01-15",
        expiryDate: "2025-01-15",
        status: "valid",
        entityType: "workspace",
        entityId: "DN001",
        entityName: "HTX Nông nghiệp Xanh",
        content: "Chứng nhận đạt tiêu chuẩn VietGAP cho sản xuất rau an toàn",
        contentType: "editor",
        attachments: [],
        createdAt: "2024-01-15",
      },
      {
        id: 2,
        code: "CN-2024-002",
        name: "Chứng nhận GlobalGAP - Vùng trồng A",
        standardType: "GlobalGAP",
        organization: "Tổ chức GlobalGAP",
        issuedDate: "2023-06-20",
        expiryDate: "2024-12-20",
        status: "expiring_soon",
        entityType: "region",
        entityId: "VT001",
        entityName: "Vùng trồng A - Đồng bằng",
        content: "Chứng nhận đạt tiêu chuẩn GlobalGAP",
        contentType: "editor",
        attachments: [],
        createdAt: "2023-06-20",
      },
      {
        id: 3,
        code: "CN-2023-015",
        name: "Chứng nhận Organic - Trang trại B",
        standardType: "Organic",
        organization: "Cục Quản lý Chất lượng",
        issuedDate: "2023-03-10",
        expiryDate: "2024-03-10",
        status: "expired",
        entityType: "workspace",
        entityId: "DN002",
        entityName: "Trang trại hữu cơ B",
        content: "Chứng nhận sản xuất hữu cơ",
        contentType: "editor",
        attachments: [],
        createdAt: "2023-03-10",
      },
    ],

    // CRUD operations
    getCertificateById: (id) => {
      return get().certificates.find((cert) => cert.id === id);
    },

    addCertificate: (certificate) => {
      set((state) => ({
        certificates: [...state.certificates, certificate],
      }));
    },

    updateCertificate: (id, updates) => {
      set((state) => ({
        certificates: state.certificates.map((cert) =>
          cert.id === id ? { ...cert, ...updates } : cert,
        ),
      }));
    },

    deleteCertificate: (id) => {
      set((state) => ({
        certificates: state.certificates.filter((cert) => cert.id !== id),
      }));
    },

    // Helper functions
    calculateStatus: (expiryDate) => {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilExpiry < 0) return "expired";
      if (daysUntilExpiry <= 30) return "expiring_soon";
      return "valid";
    },

    getOrganizationsByStandard: (standardCode) => {
      const standard = get().standards.find((s) => s.code === standardCode);
      return standard?.organizations || [];
    },

    getAreasByEnterprise: (enterpriseId) => {
      return get().areas.filter((area) => area.enterpriseId === enterpriseId);
    },
  }),
);

export default useEnterpriseCertificateStore;
