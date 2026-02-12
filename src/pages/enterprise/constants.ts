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
    code: "THACO-AGRI",
    name: "Công ty Cổ phần Nông nghiệp Trường Hải",
    brandName: "THACO AGRI",
    image:
      "https://data.vieclamtphcm.vn/static-bucket/2023/5/30/cong-ty-co-phan-nong-nghiep-truong-hai-vieclamtphcm.vn.png",
    type: "enterprise",
    classification: ["production", "processing", "trading"],
    taxCode: "4001174655",
    address:
      "Khu Công nghiệp Chu Lai, Xã Tam Hiệp, Huyện Núi Thành, Tỉnh Quảng Nam",
    phone: "0235 356 7161",
    email: "info@thacoagri.vn",
    website: "https://thacoagri.vn",
    representative: "Trần Bá Dương",
    foundedDate: "2019-01-01",
    province: "Tỉnh Quảng Nam",
    district: "Huyện Núi Thành",
    ward: "Xã Tam Hiệp",
    taxAddress:
      "Khu Công nghiệp Chu Lai, Xã Tam Hiệp, Huyện Núi Thành, Tỉnh Quảng Nam",
    taxAuthority: "Cục Thuế Tỉnh Quảng Nam",
    issueDate: "2019-02-14",
    description:
      "THACO AGRI thực hiện chiến lược đầu tư sản xuất nông nghiệp (trồng trọt, chăn nuôi) tích hợp/tuần hoàn, hữu cơ quy mô lớn trên nền tảng công nghiệp và số hóa trên toàn bộ diện tích 85.000 hecta tại 3 nước Việt Nam, Lào và Campuchia.",
    status: "active",
    createdAt: "2024-01-10",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
        branch: "CN Quảng Nam",
        accountNumber: "1012345678",
        accountHolder: "CTCP NONG NGHIEP TRUONG HAI",
        note: "Tài khoản thanh toán chính",
      },
    ],
    branches: [
      {
        name: "Văn phòng Gia Lai",
        address: "15 Trường Chinh, TP. Pleiku, Tỉnh Gia Lai",
        phone: "0269 3888 999",
        email: "gialai@thacoagri.vn",
        taxCode: "4001174655-001",
        taxAddress: "15 Trường Chinh, TP. Pleiku, Tỉnh Gia Lai",
        note: "Văn phòng điều hành khu vực Tây Nguyên",
      },
    ],
    documents: [],
  },
  {
    id: 2,
    code: "BAF-VN",
    name: "Công ty Cổ phần Nông nghiệp BAF Việt Nam",
    brandName: "BAF",
    image: "https://baf.vn/wp-content/uploads/2024/08/Logo-BAF.png",
    type: "enterprise",
    classification: ["production", "processing", "trading"],
    taxCode: "0107795944",
    address:
      "Tầng 9, Tòa nhà Vista Tower, 628C Xa lộ Hà Nội, Phường An Phú, TP. Thủ Đức, TP.HCM",
    phone: "028 39 11 00 99",
    email: "info@baf.vn",
    website: "https://baf.vn",
    representative: "Bùi Hương Giang",
    foundedDate: "2017-01-01",
    province: "Thành phố Hồ Chí Minh",
    district: "Thành phố Thủ Đức",
    ward: "Phường An Phú",
    taxAddress:
      "Tầng 9, Tòa nhà Vista Tower, 628C Xa lộ Hà Nội, Phường An Phú, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    taxAuthority: "Cục Thuế Thành phố Hồ Chí Minh",
    issueDate: "2017-04-06",
    description:
      "BAF Việt Nam hoạt động trong lĩnh vực chăn nuôi heo, sản xuất thức ăn chăn nuôi, chế biến thịt heo sạch với chuỗi giá trị khép kín từ trang trại đến bàn ăn.",
    status: "active",
    createdAt: "2024-01-12",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
        branch: "CN TP.HCM",
        accountNumber: "1100123456",
        accountHolder: "CTCP NONG NGHIEP BAF VIET NAM",
        note: "Tài khoản giao dịch",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 3,
    code: "DABACO",
    name: "Công ty Cổ phần Tập đoàn Dabaco Việt Nam",
    brandName: "DABACO",
    image:
      "https://res.cloudinary.com/sonvn/image/upload/v1563725886/isud9tcpzsri10mlnwj7.png",
    type: "enterprise",
    classification: ["production", "processing", "trading", "service"],
    taxCode: "2300105790",
    address:
      "Số 35 đường Lý Thái Tổ, Phường Võ Cường, Thành phố Bắc Ninh, Tỉnh Bắc Ninh",
    phone: "0222 3828 466",
    email: "info@dabaco.com.vn",
    website: "http://www.dabaco.com.vn",
    representative: "Nguyễn Như So",
    foundedDate: "1996-01-01",
    province: "Tỉnh Bắc Ninh",
    district: "Thành phố Bắc Ninh",
    ward: "Phường Võ Cường",
    taxAddress:
      "Số 35 đường Lý Thái Tổ, Phường Võ Cường, Thành phố Bắc Ninh, Tỉnh Bắc Ninh",
    taxAuthority: "Cục Thuế Tỉnh Bắc Ninh",
    issueDate: "1996-03-29",
    description:
      "Tập đoàn Dabaco là doanh nghiệp hàng đầu trong lĩnh vực chăn nuôi, sản xuất thức ăn chăn nuôi, giống vật nuôi, trứng gà, dầu thực vật và thực phẩm chế biến.",
    status: "active",
    createdAt: "2024-01-15",
    bankAccounts: [
      {
        bankName:
          "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
        branch: "CN Bắc Ninh",
        accountNumber: "2600123456",
        accountHolder: "CTCP TAP DOAN DABACO VIET NAM",
        note: "Tài khoản chính",
      },
    ],
    branches: [
      {
        name: "Nhà máy Chế biến Thức ăn Chăn nuôi Dabaco",
        address: "KCN Khắc Niệm, TP. Bắc Ninh, Tỉnh Bắc Ninh",
        phone: "0222 3828 555",
        email: "feed@dabaco.com.vn",
        taxCode: "2300105790-001",
        taxAddress: "KCN Khắc Niệm, TP. Bắc Ninh, Tỉnh Bắc Ninh",
        note: "Nhà máy sản xuất",
      },
    ],
    documents: [],
  },
  {
    id: 4,
    code: "TAR",
    name: "Công ty Cổ phần Nông nghiệp Công nghệ cao Trung An",
    brandName: "Trung An",
    image:
      "https://trunganrice.com/wp-content/uploads/2021/07/Logo-Trung-An-Mo%CC%9B%CC%81i_300621.png",
    type: "enterprise",
    classification: ["production", "processing", "trading"],
    taxCode: "1800241736",
    address:
      "649A, Quốc Lộ 91, Phường Trung Kiên, Quận Thốt Nốt, Thành phố Cần Thơ",
    phone: "0292 3857 937",
    email: "trunganrice@gmail.com",
    website: "https://trunganrice.com",
    representative: "Phạm Thái Bình",
    foundedDate: "1996-08-16",
    province: "Thành phố Cần Thơ",
    district: "Quận Thốt Nốt",
    ward: "Phường Trung Kiên",
    taxAddress:
      "649A, Quốc Lộ 91, Phường Trung Kiên, Quận Thốt Nốt, Thành phố Cần Thơ",
    taxAuthority: "Cục Thuế Thành phố Cần Thơ",
    issueDate: "1996-08-16",
    description:
      "Trung An chuyên sản xuất, chế biến và xuất khẩu gạo chất lượng cao, ứng dụng công nghệ cao vào sản xuất nông nghiệp sạch, an toàn.",
    status: "active",
    createdAt: "2024-01-18",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
        branch: "CN Cần Thơ",
        accountNumber: "6900123456",
        accountHolder: "CTCP NONG NGHIEP CNC TRUNG AN",
        note: "Tài khoản xuất nhập khẩu",
      },
    ],
    branches: [],
    documents: [],
  },
];
