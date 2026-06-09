/* eslint-disable react-refresh/only-export-components */
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import { vietQrBankData } from "../../../constants/banks";

const formatContactTooltip = (cooperative: Enterprise) => {
  const contacts = cooperative.contacts?.length
    ? cooperative.contacts
    : cooperative.phone || cooperative.email
      ? [
          {
            name: cooperative.representative || cooperative.name,
            phone: cooperative.phone,
            email: cooperative.email,
          },
        ]
      : [];

  return contacts
    .map((contact, index) => {
      const parts = [
        `${index + 1}. ${contact.name || "Liên hệ"}`,
        contact.phone ? `SĐT: ${contact.phone}` : null,
        contact.email ? `Email: ${contact.email}` : null,
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
};

export const INITIAL_DATA: Enterprise[] = [
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
    contacts: [
      {
        name: "Nguyễn Văn A",
        phone: "0912345678",
        email: "nguyenvana@gmail.com",
      },
      {
        name: "Bộ phận kinh doanh",
        phone: "0912345679",
        email: "kinhdoanh@ecofarm.vn",
      },
    ],
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
    contacts: [
      {
        name: "Trần Thị B",
        phone: "0923456789",
        email: "htxnongsansach@gmail.com",
      },
    ],
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
    contacts: [
      {
        name: "Lê Văn C",
        phone: "0923456789",
        email: "htxnongsansach@gmail.com",
      },
    ],
  },
];

export const COOPERATIVE_COLUMNS: Column<Enterprise>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => (
      <Badge
        variant="outline"
        className="rounded-full bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700"
      >
        {value as string}
      </Badge>
    ),
  },
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
        other: "Khác",
      };
      return (
        <div className="flex flex-wrap gap-1.5">
          {(value as string[]).map((item: string) => (
            <Badge
              key={item}
              variant="secondary"
              className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
            >
              {labels[item] || item}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    key: "phone",
    label: "Điện thoại",
    render: (_value, row) => {
      const contacts = row.contacts?.length
        ? row.contacts
        : row.phone || row.email
          ? [
              {
                name: row.representative || row.name,
                phone: row.phone,
                email: row.email,
              },
            ]
          : [];

      const primaryContact = contacts[0];
      const extraCount = Math.max(0, contacts.length - 1);

      return (
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
          <div className="font-medium truncate">{primaryContact?.phone || "-"}</div>
          {extraCount > 0 && (
            <div className="text-xs text-muted-foreground">
              +{extraCount} liên hệ khác
            </div>
          )}
        </div>
      );
    },
  },
  {
    key: "email",
    label: "Email",
    render: (_value, row) => {
      const contacts = row.contacts?.length
        ? row.contacts
        : row.phone || row.email
          ? [
              {
                name: row.representative || row.name,
                phone: row.phone,
                email: row.email,
              },
            ]
          : [];

      const primaryContact = contacts[0];
      const extraCount = Math.max(0, contacts.length - 1);

      return (
        <div className="max-w-[240px] space-y-1" title={formatContactTooltip(row)}>
          <div className="font-medium truncate">{primaryContact?.email || "-"}</div>
          {extraCount > 0 && (
            <div className="text-xs text-muted-foreground">
              +{extraCount} liên hệ khác
            </div>
          )}
        </div>
      );
    },
  },
  { key: "address", label: "Địa chỉ" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge
        variant={value === "active" ? "default" : "outline"}
        className="rounded-full px-2.5 py-1"
      >
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
      { label: "Khác", value: "other" },
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
