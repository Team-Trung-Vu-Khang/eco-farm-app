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
    id: "land_prep",
    label: "Làm đất / Cải tạo ao",
    description: "Máy phay đất, máy ủi, máy múc bùn đáy ao.",
  },
  {
    id: "planting",
    label: "Gieo trồng / Xuống giống",
    description: "Máy cấy lúa, hệ thống ống xả giống.",
  },
  {
    id: "care_monitoring",
    label: "Chăm sóc & Theo dõi",
    description:
      "Hệ thống tưới nhỏ giọt, giàn quạt sục khí (tạo oxy hòa tan), thiết bị đo sáng, phễu đo mưa.",
  },
  {
    id: "harvesting",
    label: "Thu hoạch",
    description: "Máy gặt đập liên hợp, tời kéo lưới, bơm hút cá.",
  },
  {
    id: "post_harvest",
    label: "Sơ chế & Bảo quản (Sau thu hoạch)",
    description:
      "Kho lạnh, hệ thống máy sấy, băng chuyền phân loại kích cỡ, máy đóng gói hút chân không.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const MaterialValueChainPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Chuỗi Giá trị Sản xuất</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý dụng cụ - máy móc theo chuỗi giá trị
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

export default MaterialValueChainPage;
