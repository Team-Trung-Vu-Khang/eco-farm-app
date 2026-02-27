export interface District {
  code: string;
  name: string;
}

export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export const PROVINCES: Province[] = [
  {
    code: "HN",
    name: "Hà Nội",
    districts: [
      { code: "HN_BD", name: "Ba Đình" },
      { code: "HN_HK", name: "Hoàn Kiếm" },
      { code: "HN_CG", name: "Cầu Giấy" },
      { code: "HN_TL", name: "Tây Hồ" },
    ],
  },
  {
    code: "HCM",
    name: "TP. Hồ Chí Minh",
    districts: [
      { code: "HCM_Q1", name: "Quận 1" },
      { code: "HCM_Q3", name: "Quận 3" },
      { code: "HCM_BT", name: "Bình Thạnh" },
      { code: "HCM_TD", name: "Thủ Đức" },
    ],
  },
  {
    code: "DN",
    name: "Đà Nẵng",
    districts: [
      { code: "DN_HC", name: "Hải Châu" },
      { code: "DN_ST", name: "Sơn Trà" },
      { code: "DN_TK", name: "Thanh Khê" },
      { code: "DN_NH", name: "Ngũ Hành Sơn" },
    ],
  },
  {
    code: "HP",
    name: "Hải Phòng",
    districts: [
      { code: "HP_NQ", name: "Ngô Quyền" },
      { code: "HP_LC", name: "Lê Chân" },
      { code: "HP_HB", name: "Hồng Bàng" },
      { code: "HP_AD", name: "An Dương" },
    ],
  },
  {
    code: "CT",
    name: "Cần Thơ",
    districts: [
      { code: "CT_NK", name: "Ninh Kiều" },
      { code: "CT_BM", name: "Bình Thủy" },
      { code: "CT_CR", name: "Cái Răng" },
      { code: "CT_OT", name: "Ô Môn" },
    ],
  },
  {
    code: "QN",
    name: "Quảng Ninh",
    districts: [
      { code: "QN_HL", name: "Hạ Long" },
      { code: "QN_CP", name: "Cẩm Phả" },
      { code: "QN_UB", name: "Uông Bí" },
      { code: "QN_VD", name: "Vân Đồn" },
    ],
  },
  {
    code: "BD",
    name: "Bình Dương",
    districts: [
      { code: "BD_TDM", name: "Thủ Dầu Một" },
      { code: "BD_TA", name: "Thuận An" },
      { code: "BD_DI", name: "Dĩ An" },
      { code: "BD_BC", name: "Bến Cát" },
    ],
  },
  {
    code: "LA",
    name: "Long An",
    districts: [
      { code: "LA_TA", name: "Tân An" },
      { code: "LA_BT", name: "Bến Lức" },
      { code: "LA_CT", name: "Cần Đước" },
      { code: "LA_DC", name: "Đức Hòa" },
    ],
  },
  {
    code: "TH",
    name: "Thanh Hóa",
    districts: [
      { code: "TH_TP", name: "TP. Thanh Hóa" },
      { code: "TH_SS", name: "Sầm Sơn" },
      { code: "TH_NC", name: "Nông Cống" },
      { code: "TH_HL", name: "Hậu Lộc" },
    ],
  },
  {
    code: "DL",
    name: "Đắk Lắk",
    districts: [
      { code: "DL_BMT", name: "Buôn Ma Thuột" },
      { code: "DL_KN", name: "Krông Năng" },
      { code: "DL_EH", name: "Ea H'leo" },
      { code: "DL_CMG", name: "Cư M'gar" },
    ],
  },
];
