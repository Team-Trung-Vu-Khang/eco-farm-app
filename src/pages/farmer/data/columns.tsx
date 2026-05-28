import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Enterprise } from "../../enterprise/data/constants";

export const farmerColumns: Column<Enterprise>[] = [
  { key: "code", label: "Mã" },
  {
    key: "image",
    label: "Hình ảnh",
    render: (value) =>
      value ? (
        <img
          src={value as string}
          alt="farmer"
          className="w-10 h-10 object-cover rounded-md border"
        />
      ) : null,
  },
  { key: "name", label: "Tên nông hộ" },
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
      return (value as string[])?.map((item: string) => (
        <Badge key={item} variant="secondary" className="mr-1">
          {labels[item] || item}
        </Badge>
      ));
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
