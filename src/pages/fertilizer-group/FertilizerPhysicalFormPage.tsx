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
    id: "soil_application",
    label: "Phân bón gốc (Dạng hạt, bột)",
    description: "Rải trực tiếp xuống đất để rễ hấp thụ.",
  },
  {
    id: "foliar_application",
    label: "Phân bón lá (Dạng lỏng, hòa tan)",
    description: "Xịt trực tiếp lên lá để cây hấp thụ tức thời.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const FertilizerPhysicalFormPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Phân loại theo Hình thái vật lý
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý phân loại phân bón theo hình thái vật lý
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

export default FertilizerPhysicalFormPage;
