export interface Contact {
  name: string;
  phone: string;
  email: string;
}

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
  logo?: string;
}

export interface Enterprise {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "enterprise" | "farm" | "cooperative";
  classification: (
    | "production"
    | "processing"
    | "trading"
    | "service"
    | "other"
  )[];
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
  latitude?: number;
  longitude?: number;
  taxAddress?: string;
  taxAuthority?: string;
  issueDate?: string;
  description?: string;
  contacts?: Contact[];
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
    latitude: 15.4023,
    longitude: 108.7069,
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
    latitude: 10.8018,
    longitude: 106.7482,
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
    latitude: 21.1861,
    longitude: 106.0763,
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
    latitude: 10.2765,
    longitude: 105.7575,
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
  {
    id: 5,
    code: "ND-NGUYENVANA",
    name: "Nguyễn Văn An",
    brandName: "Trang trại An Phát",
    image: "https://i.pravatar.cc/300?img=12",
    type: "farm",
    classification: ["production"],
    taxCode: "0791234567",
    address: "Ấp 3, Xã Phú Hòa Đông, Huyện Củ Chi, TP.HCM",
    phone: "0909123456",
    email: "nguyenvanan@gmail.com",
    website: "",
    representative: "Nguyễn Văn An",
    foundedDate: "2015-03-10",
    province: "Thành phố Hồ Chí Minh",
    district: "Huyện Củ Chi",
    ward: "Xã Phú Hòa Đông",
    latitude: 10.9819,
    longitude: 106.4892,
    taxAddress: "Ấp 3, Xã Phú Hòa Đông, Huyện Củ Chi, TP.HCM",
    taxAuthority: "Chi cục Thuế Huyện Củ Chi",
    issueDate: "2015-03-15",
    description:
      "Chuyên trồng rau hữu cơ và nuôi gà thả vườn theo mô hình nông nghiệp sạch, cung cấp cho hệ thống siêu thị nội địa.",
    status: "active",
    createdAt: "2024-02-01",
    bankAccounts: [
      {
        bankName:
          "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
        branch: "CN Củ Chi",
        accountNumber: "8823456789",
        accountHolder: "NGUYEN VAN AN",
        note: "Tài khoản nhận thanh toán nông sản",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 6,
    code: "ND-TRANVANTUAN",
    name: "Trần Văn Tuấn",
    brandName: "Trang trại Heo Tuấn Phát",
    image: "https://i.pravatar.cc/300?img=32",
    type: "farm",
    classification: ["production", "processing"],
    taxCode: "0792345678",
    address: "Thôn Tân Lập, Xã Ea Ktur, Huyện Cư Kuin, Tỉnh Đắk Lắk",
    phone: "0912345678",
    email: "tranvantuan@gmail.com",
    website: "",
    representative: "Trần Văn Tuấn",
    foundedDate: "2012-06-20",
    province: "Tỉnh Đắk Lắk",
    district: "Huyện Cư Kuin",
    ward: "Xã Ea Ktur",
    latitude: 12.6086,
    longitude: 108.0289,
    taxAddress: "Thôn Tân Lập, Xã Ea Ktur, Huyện Cư Kuin, Tỉnh Đắk Lắk",
    taxAuthority: "Chi cục Thuế Huyện Cư Kuin",
    issueDate: "2012-06-25",
    description:
      "Trang trại chăn nuôi heo theo mô hình khép kín, áp dụng quy trình VietGAP, cung cấp heo thịt cho các doanh nghiệp chế biến.",
    status: "active",
    createdAt: "2024-02-05",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
        branch: "CN Đắk Lắk",
        accountNumber: "9923456789",
        accountHolder: "TRAN VAN TUAN",
        note: "Tài khoản giao dịch chính",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 7,
    code: "ND-LETHIMAI",
    name: "Lê Thị Mai",
    brandName: "Vườn cây ăn trái Mai Hương",
    image: "https://i.pravatar.cc/300?img=45",
    type: "farm",
    classification: ["production", "trading"],
    taxCode: "1809876543",
    address: "Ấp Mỹ Nhơn, Xã Mỹ Khánh, Huyện Phong Điền, TP. Cần Thơ",
    phone: "0988123456",
    email: "lethimai@gmail.com",
    website: "",
    representative: "Lê Thị Mai",
    foundedDate: "2018-09-12",
    province: "Thành phố Cần Thơ",
    district: "Huyện Phong Điền",
    ward: "Xã Mỹ Khánh",
    latitude: 10.0327,
    longitude: 105.7069,
    taxAddress: "Ấp Mỹ Nhơn, Xã Mỹ Khánh, Huyện Phong Điền, TP. Cần Thơ",
    taxAuthority: "Chi cục Thuế Huyện Phong Điền",
    issueDate: "2018-09-15",
    description:
      "Chuyên trồng sầu riêng, mít Thái và xoài cát theo tiêu chuẩn VietGAP, cung cấp cho thị trường nội địa và xuất khẩu.",
    status: "active",
    createdAt: "2024-02-10",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
        branch: "CN Cần Thơ",
        accountNumber: "7723456789",
        accountHolder: "LE THI MAI",
        note: "Tài khoản thanh toán",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 8,
    code: "ND-PHAMVANBINH",
    name: "Phạm Văn Bình",
    brandName: "Trang trại Thanh Bình",
    image: "https://i.pravatar.cc/300?img=28",
    type: "farm",
    classification: ["production"],
    taxCode: "3004567891",
    address: "Thôn Đông Sơn, Xã Bình Định, Huyện Kiến Xương, Tỉnh Thái Bình",
    phone: "0977123456",
    email: "phamvanbinh@gmail.com",
    website: "",
    representative: "Phạm Văn Bình",
    foundedDate: "2010-04-01",
    province: "Tỉnh Thái Bình",
    district: "Huyện Kiến Xương",
    ward: "Xã Bình Định",
    latitude: 20.3601,
    longitude: 106.3962,
    taxAddress: "Thôn Đông Sơn, Xã Bình Định, Huyện Kiến Xương, Tỉnh Thái Bình",
    taxAuthority: "Chi cục Thuế Huyện Kiến Xương",
    issueDate: "2010-04-05",
    description:
      "Canh tác lúa chất lượng cao và nuôi vịt theo mô hình VAC, cung cấp cho hợp tác xã và thương lái địa phương.",
    status: "active",
    createdAt: "2024-02-15",
    bankAccounts: [
      {
        bankName:
          "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
        branch: "CN Thái Bình",
        accountNumber: "6623456789",
        accountHolder: "PHAM VAN BINH",
        note: "Tài khoản chính",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 9,
    code: "ND-HOANGTHILAN",
    name: "Hoàng Thị Lan",
    brandName: "Trang trại Hoa Lan",
    image: "https://i.pravatar.cc/300?img=52",
    type: "farm",
    classification: ["production", "service"],
    taxCode: "0603456789",
    address: "Thôn Đạ Sar, Xã Đạ Sar, Huyện Lạc Dương, Tỉnh Lâm Đồng",
    phone: "0966123456",
    email: "hoangthilan@gmail.com",
    website: "",
    representative: "Hoàng Thị Lan",
    foundedDate: "2016-11-05",
    province: "Tỉnh Lâm Đồng",
    district: "Huyện Lạc Dương",
    ward: "Xã Đạ Sar",
    latitude: 11.9648,
    longitude: 108.4605,
    taxAddress: "Thôn Đạ Sar, Xã Đạ Sar, Huyện Lạc Dương, Tỉnh Lâm Đồng",
    taxAuthority: "Chi cục Thuế Huyện Lạc Dương",
    issueDate: "2016-11-10",
    description:
      "Chuyên trồng hoa lan và rau củ công nghệ cao trong nhà kính, kết hợp dịch vụ tham quan nông trại.",
    status: "active",
    createdAt: "2024-02-20",
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
        branch: "CN Lâm Đồng",
        accountNumber: "5523456789",
        accountHolder: "HOANG THI LAN",
        note: "Tài khoản nhận thanh toán",
      },
    ],
    branches: [],
    documents: [],
  },
  {
    id: 10,
    code: "HTX001",
    name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
    brandName: "EcoFarm Cooperative",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "cooperative",
    classification: ["production", "trading"],
    taxCode: "0312345678",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi, Thành phố Hồ Chí Minh",
    phone: "0912345678",
    email: "contact@ecofarm-htx.vn",
    website: "https://ecofarm-htx.vn",
    representative: "Nguyễn Văn A",
    foundedDate: "2018-04-15",
    province: "Thành phố Hồ Chí Minh",
    district: "Huyện Củ Chi",
    ward: "Xã Tân Phú",
    latitude: 10.9382,
    longitude: 106.5006,
    taxAddress: "Ấp 1, Xã Tân Phú, Huyện Củ Chi, Thành phố Hồ Chí Minh",
    taxAuthority: "Chi cục Thuế Huyện Củ Chi",
    issueDate: "2018-04-20",
    description:
      "Hợp tác xã liên kết các hộ trồng rau và cây ăn trái theo tiêu chuẩn VietGAP, cung ứng cho siêu thị và chuỗi cửa hàng thực phẩm sạch.",
    status: "active",
    createdAt: "2024-03-01",
    contacts: [
      {
        name: "Nguyễn Văn A",
        phone: "0912345678",
        email: "contact@ecofarm-htx.vn",
      },
    ],
    branches: [],
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
        branch: "CN Củ Chi",
        accountNumber: "1019988776",
        accountHolder: "HOP TAC XA NONG NGHIEP XANH ECOFARM",
        note: "Tài khoản giao dịch chính",
      },
    ],
    documents: [],
  },
  {
    id: 11,
    code: "HTX002",
    name: "Hợp tác xã Nông sản Sạch Bình Dương",
    brandName: "Binh Duong Clean Coop",
    image:
      "https://ocop.langson.gov.vn/api/user-blob/82a71ab1-9a6f-6a22-c832-65949c334e71/2024/11/21/logo-trangdinh.jpg",
    type: "cooperative",
    classification: ["trading", "service"],
    taxCode: "3702987654",
    address: "Phường Phú Lợi, Thành phố Thủ Dầu Một, Tỉnh Bình Dương",
    phone: "0923456789",
    email: "info@htxbinhduong.vn",
    website: "https://htxbinhduong.vn",
    representative: "Trần Thị B",
    foundedDate: "2019-08-12",
    province: "Tỉnh Bình Dương",
    district: "Thành phố Thủ Dầu Một",
    ward: "Phường Phú Lợi",
    latitude: 10.9847,
    longitude: 106.6670,
    taxAddress: "Phường Phú Lợi, Thành phố Thủ Dầu Một, Tỉnh Bình Dương",
    taxAuthority: "Cục Thuế Tỉnh Bình Dương",
    issueDate: "2019-08-20",
    description:
      "Hợp tác xã thu mua, sơ chế và phân phối nông sản sạch cho trường học, bếp ăn tập thể và hệ thống bán lẻ trong khu vực.",
    status: "active",
    createdAt: "2024-03-05",
    contacts: [
      {
        name: "Trần Thị B",
        phone: "0923456789",
        email: "info@htxbinhduong.vn",
      },
    ],
    branches: [],
    bankAccounts: [
      {
        bankName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)",
        branch: "CN Bình Dương",
        accountNumber: "6788900123",
        accountHolder: "HOP TAC XA NONG SAN SACH BINH DUONG",
        note: "Tài khoản thanh toán",
      },
    ],
    documents: [],
  },
  {
    id: 12,
    code: "HTX003",
    name: "Hợp tác xã Chế biến Nông sản Tây Nguyên",
    brandName: "Tay Nguyen Agro Coop",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_8OFT04S0wG7vHTRJMrpWD-pki8RPR_wSw&s",
    type: "cooperative",
    classification: ["processing", "service"],
    taxCode: "6003123456",
    address: "Phường Tân Lập, Thành phố Buôn Ma Thuột, Tỉnh Đắk Lắk",
    phone: "0934567890",
    email: "admin@taynguyen-coop.vn",
    website: "https://taynguyen-coop.vn",
    representative: "Lê Văn C",
    foundedDate: "2020-02-10",
    province: "Tỉnh Đắk Lắk",
    district: "Thành phố Buôn Ma Thuột",
    ward: "Phường Tân Lập",
    latitude: 12.6796,
    longitude: 108.0382,
    taxAddress: "Phường Tân Lập, Thành phố Buôn Ma Thuột, Tỉnh Đắk Lắk",
    taxAuthority: "Cục Thuế Tỉnh Đắk Lắk",
    issueDate: "2020-02-18",
    description:
      "Hợp tác xã tập trung chế biến cà phê, hồ tiêu và nông sản bản địa, hỗ trợ thành viên về truy xuất nguồn gốc và kết nối thị trường.",
    status: "active",
    createdAt: "2024-03-10",
    contacts: [
      {
        name: "Lê Văn C",
        phone: "0934567890",
        email: "admin@taynguyen-coop.vn",
      },
    ],
    branches: [],
    bankAccounts: [
      {
        bankName: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)",
        branch: "CN Đắk Lắk",
        accountNumber: "5500123478",
        accountHolder: "HOP TAC XA CHE BIEN NONG SAN TAY NGUYEN",
        note: "Tài khoản chính",
      },
    ],
    documents: [],
  },
];
