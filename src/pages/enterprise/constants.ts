export interface Branch {
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
  bin?: string;
}

export interface Enterprise {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "enterprise" | "farm" | "cooperative";
  classification: ("production" | "processing" | "trading" | "service")[];
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  documents?: {
    name: string;
    type: string;
    size: string;
    url?: string;
    date?: string;
  }[];

  // Additional fields
  brandName?: string;
  representative?: string;
  foundedDate?: string;
  website?: string;
  province?: string;
  district?: string;
  ward?: string;
  taxAddress?: string;
  taxAuthority?: string;
  issueDate?: string;
  description?: string;
  branches?: Branch[];
  bankAccounts?: BankAccount[];
}

export const initialEnterprises: Enterprise[] = [
  {
    id: 1,
    code: "DN001",
    name: "Công ty TNHH Nông nghiệp Xanh",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_8OFT04S0wG7vHTRJMrpWD-pki8RPR_wSw&s",
    type: "enterprise",
    classification: ["production", "processing"],
    taxCode: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@nongnghiepxanh.vn",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "NH001",
    name: "Nông hộ Nguyễn Văn A",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "farm",
    classification: ["production"],
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    code: "DN002",
    name: "HTX Nông sản Sạch Bình Dương",
    image:
      "https://ocop.langson.gov.vn/api/user-blob/82a71ab1-9a6f-6a22-c832-65949c334e71/2024/11/21/logo-trangdinh.jpg",
    type: "cooperative",
    classification: ["trading", "service"],
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    code: "NH002",
    name: "Trang trại Trần Thị B",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    type: "farm",
    classification: ["processing", "trading"],
    taxCode: "",
    address: "Ấp 3, Xã Long An, Huyện Long Thành",
    phone: "0934567890",
    email: "tranthib@gmail.com",
    status: "active",
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    code: "DN003",
    name: "Công ty CP Xuất khẩu Trái cây Việt",
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80",
    type: "enterprise",
    classification: ["trading", "processing"],
    taxCode: "1122334455",
    address: "789 Đường DEF, Quận Bình Thạnh, TP.HCM",
    phone: "0945678901",
    email: "export@traicayviet.com",
    status: "inactive",
    createdAt: "2024-01-20",
  },
];
