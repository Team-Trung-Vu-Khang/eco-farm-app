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
  { key: "description", label: "Mô tả" },
];

const data: StaticDataItem[] = [
  {
    id: "hand_tools",
    label: "Dụng cụ thủ công (Hand Tools)",
    description:
      "Dùng sức người hoàn toàn. Ví dụ: Cuốc, xẻng, dao, bình xịt thuốc đeo lưng, vợt vớt cá.",
  },
  {
    id: "motorized_machinery",
    label: "Máy móc cơ giới (Motorized Machinery)",
    description:
      "Dùng động cơ đốt trong hoặc điện. Ví dụ: Máy cày, máy bơm nước, máy gặt đập, máy cho ăn tự động (auto-feeder).",
  },
  {
    id: "smart_devices",
    label: "Thiết bị Công nghệ cao / Thiết bị thông minh (Smart Devices / IoT)",
    description:
      "Nhóm thiết bị có khả năng thu thập và truyền tải dữ liệu. Ví dụ: Drone phun thuốc tự động, Camera AI giám sát an ninh, hệ thống phao cảm biến IoT đo các chỉ số môi trường nước (pH, DO, nhiệt độ) liên tục 24/7.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const MaterialTechnologyLevelPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Phân loại theo Mức độ Công nghệ
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý dụng cụ - máy móc theo mức độ công nghệ
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

export default MaterialTechnologyLevelPage;
