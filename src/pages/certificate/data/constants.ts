import type {
  Certificate,
  CertificationOrganization,
  OrganizationFormData,
  StandardFormData,
} from "../types/types";

export const initialOrganizations: CertificationOrganization[] = [
  {
    id: 1,
    code: "ORG001",
    name: "Bộ Nông nghiệp và Phát triển Nông thôn",
    address: "2 Ngọc Hà, Ba Đình, Hà Nội",
    phone: "024 3843 3141",
    email: "mard@mard.gov.vn",
    website: "https://www.mard.gov.vn",
    description: "Cơ quan quản lý nhà nước về nông nghiệp",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    code: "ORG002",
    name: "Cục Trồng trọt",
    address: "2 Ngọc Hà, Ba Đình, Hà Nội",
    phone: "024 3733 9775",
    email: "cuctrongtrot@mard.gov.vn",
    website: "https://www.cuctrongtrot.gov.vn",
    description: "Cơ quan chuyên môn thuộc Bộ NN&PTNT",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    code: "ORG003",
    name: "Tổ chức GlobalGAP",
    address: "Germany",
    phone: "+49 221 57993 0",
    email: "info@globalgap.org",
    website: "https://www.globalgap.org",
    description: "Tổ chức tiêu chuẩn nông nghiệp toàn cầu",
    status: "active",
    createdAt: "2024-01-03",
  },
];

export const initialStandards: Certificate[] = [
  {
    id: 1,
    code: "CH001",
    name: "Global GAP",
    organizationIds: [3],
    content: "Chứng nhận thực hành nông nghiệp tốt toàn cầu",
    contentType: "editor",
    stampUrl: "https://lifarm.vn/wp-content/uploads/2025/03/globalgap-1.png",
    stampType: "url",
    description: "Tiêu chuẩn về thực hành nông nghiệp tốt",
    status: "active",
    createdAt: "2024-01-10",
  },
];

export const emptyStandardFormData: StandardFormData = {
  code: "",
  name: "",
  organizationIds: [],
  content: "",
  contentType: "editor",
  fileUrl: "",
  stampUrl: "",
  stampType: "url",
  stampFileUrl: "",
  description: "",
  status: "active",
};

export const emptyOrganizationFormData: OrganizationFormData = {
  code: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  status: "active",
};
