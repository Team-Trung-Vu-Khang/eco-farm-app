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
    id: "inorganic",
    label: "Phân Vô cơ (Hóa học)",
    description:
      "Tác dụng cực nhanh, dùng để bứt tốc sinh trưởng (bón thúc). Tuy nhiên, dùng nhiều sẽ làm chai cứng đất.",
  },
  {
    id: "organic",
    label: "Phân Hữu cơ (Organic)",
    description:
      "Nguồn gốc từ phân chuồng, mùn ủ, đạm cá. Tác dụng chậm nhưng giúp cải tạo đất tơi xốp, là yêu cầu bắt buộc cho nông nghiệp bền vững.",
  },
  {
    id: "biological",
    label: "Phân Sinh học / Vi sinh",
    description:
      "Chứa các chủng vi sinh vật sống (như nấm Trichoderma giúp đối kháng mầm bệnh, hoặc vi khuẩn cố định đạm).",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const FertilizerOriginPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo Nguồn gốc</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý phân loại phân bón theo nguồn gốc
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

export default FertilizerOriginPage;
