import {
  Badge,
  type Column,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface StaticDataItem {
  id: string;
  label: string;
  description: string;
}

const columns: Column<StaticDataItem>[] = [
  {
    key: "id",
    label: "Mã",
    render: (value) => (
      <Badge variant="outline" className="bg-background font-mono">
        {String(value ?? "")}
      </Badge>
    ),
  },
  { key: "label", label: "Tên" },
  {
    key: "description",
    label: "Mô tả",
    render: (value: string) => (
      <div className="whitespace-pre-line text-sm">{value}</div>
    ),
  },
];

const data: StaticDataItem[] = [
  {
    id: "consumables",
    label: "Vật tư / Dụng cụ tiêu hao (Consumables)",
    description:
      "Bản chất: Giá trị thấp, thời gian sử dụng ngắn (dưới 1 năm), dễ hỏng hóc hoặc mất mát.\n\nLogic hệ thống: Khi xuất kho để sử dụng (ví dụ: xuất 50 cái bầu ươm, 10 cuộn lưới lan, 5 chai thuốc thử test nước), hệ thống sẽ tính thẳng giá trị của chúng vào Chi phí trực tiếp của lứa nuôi/vụ mùa đó.",
  },
  {
    id: "fixed_assets",
    label:
      "Tài sản cố định / Công cụ dụng cụ lâu bền (Fixed Assets / Durable Tools)",
    description:
      "Bản chất: Giá trị cao (hàng chục đến hàng trăm triệu), thời gian sử dụng qua nhiều năm, nhiều chu kỳ sản xuất.\n\nLogic hệ thống: Máy cày, máy sục khí hay trạm quan trắc IoT không thể tính toàn bộ giá mua vào chi phí của một lứa duy nhất. Hệ thống cần có module Khấu hao (Depreciation). Thuật toán sẽ tự động chia đều khấu hao vào giá thành mỗi vụ. Cần lưu trữ lịch sử bảo trì, bảo dưỡng định kỳ.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const MaterialFinancialAspectPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Phân loại theo Khía cạnh Tài chính & Quản lý Tài sản
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý dụng cụ - máy móc theo khía cạnh tài chính
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchable={false}
        totalElements={data.length}
        totalPages={1}
        currentIndex={1}
        pageSize={data.length}
        onEdit={onEdit}
      />
    </div>
  );
};

export default MaterialFinancialAspectPage;
