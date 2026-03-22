import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Cooperative } from "../types/types";
import { vietQrBankData } from "../../../constants/banks";

export const INITIAL_DATA: Cooperative[] = [
  {
    id: 2,
    code: "HTX001",
    name: "Hợp tác xã Nông nghiệp Xanh EcoFarm",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    type: "cooperative",
    classification: ["production", "trading"],
    taxCode: "",
    address: "Ấp 1, Xã Tân Phú, Huyện Củ Chi",
    phone: "0912345678",
    email: "nguyenvana@gmail.com",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    code: "HTX002",
    name: "Hợp tác xã Nông sản Sạch Bình Dương",
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
    code: "HTX003",
    name: "Hợp tác xã Nông sản Sạch Bình Dương 3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn_8OFT04S0wG7vHTRJMrpWD-pki8RPR_wSw&s",
    type: "cooperative",
    classification: ["processing", "service"],
    taxCode: "0987654321",
    address: "456 Đường XYZ, TP. Thủ Dầu Một, Bình Dương",
    phone: "0923456789",
    email: "htxnongsansach@gmail.com",
    status: "active",
    createdAt: "2024-01-15",
  },
];

export const COOPERATIVE_COLUMNS: Column<Cooperative>[] = [
  { key: "code", label: "Mã" },
  {
    key: "image",
    label: "Hình ảnh",
    render: (value) =>
      value ? (
        <img
          src={value as string}
          alt="enterprise"
          className="w-10 h-10 object-cover rounded-md border"
        />
      ) : null,
  },
  { key: "name", label: "Tên đơn vị" },
  {
    key: "classification",
    label: "Phân loại",
    render: (value) => {
      const labels: Record<string, string> = {
        production: "Sản xuất",
        processing: "Chế biến",
        trading: "Thương mại",
        service: "Dịch vụ",
      };
      return (value as string[]).map((item: string) => {
        return (
          <Badge key={item} variant="secondary" className="mr-1">
            {labels[item]}
          </Badge>
        );
      });
    },
  },
  { key: "phone", label: "Điện thoại" },
  { key: "email", label: "Email" },
  { key: "address", label: "Địa chỉ" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
];

export const COOPERATIVE_FILTERS = [
  {
    key: "classification",
    label: "Phân loại",
    options: [
      { label: "Sản xuất", value: "production" },
      { label: "Chế biến", value: "processing" },
      { label: "Thương mại", value: "trading" },
      { label: "Dịch vụ", value: "service" },
    ],
  },
];

export const CLASSIFICATION_OPTIONS = [
  { value: "production", label: "Sản xuất" },
  { value: "processing", label: "Chế biến" },
  { value: "trading", label: "Thương mại" },
  { value: "service", label: "Dịch vụ" },
  { value: "other", label: "Khác" },
];

export const BANK_OPTIONS = vietQrBankData.map((bank) => ({
  id: bank.id,
  bin: bank.bin,
  label: bank.name,
  image: bank.logo,
  value: bank.bin,
}));
