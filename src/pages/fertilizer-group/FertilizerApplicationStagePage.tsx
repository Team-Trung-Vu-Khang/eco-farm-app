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
    id: "basal_application",
    label: "Bón lót (Basal application)",
    description:
      "Bón trước khi gieo hạt hoặc ngay sau khi thu hoạch vụ trước (thường dùng phân hữu cơ, phân lân). Mục đích: Tạo nền tảng dinh dưỡng sẵn trong đất cho Pha Sinh trưởng sinh dưỡng.",
  },
  {
    id: "top_dressing",
    label: "Bón thúc (Top dressing)",
    description:
      "Bón bổ sung vào những thời điểm cây cần năng lượng cao nhất (thường dùng NPK vô cơ). Ví dụ: Thúc ra hoa, thúc lớn trái ở Pha Sinh trưởng sinh thực.",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const FertilizerApplicationStagePage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Phân loại theo Giai đoạn tác động
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý phân loại phân bón theo giai đoạn tác động
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

export default FertilizerApplicationStagePage;
