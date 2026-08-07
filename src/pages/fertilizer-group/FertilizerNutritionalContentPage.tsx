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
    id: "macronutrients",
    label: "Nhóm Đa lượng (Macronutrients)",
    description:
      "Chứa các nguyên tố cây cần số lượng lớn: Đạm (N), Lân (P), Kali (K). Hệ thống thường chia nhỏ: Phân Đơn (chỉ có 1 chất như Ure, Super Lân) và Phân Hỗn hợp (NPK 20-20-15).",
  },
  {
    id: "secondary_nutrients",
    label: "Nhóm Trung lượng (Secondary nutrients)",
    description:
      "Cây cần mức trung bình: Canxi (Ca), Magie (Mg), Lưu huỳnh (S). Nhóm này rất quan trọng để chống nứt trái, rụng trái.",
  },
  {
    id: "micronutrients",
    label: "Nhóm Vi lượng (Micronutrients)",
    description:
      "Cây chỉ cần lượng cực nhỏ nhưng thiếu là sinh bệnh (như vitamin ở người): Đồng (Cu), Kẽm (Zn), Sắt (Fe), Bo (B)...",
  },
];

interface Props {
  onEdit?: (item: any) => void;
}

const FertilizerNutritionalContentPage = ({ onEdit }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Thành phần dinh dưỡng</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý phân loại phân bón theo thành phần dinh dưỡng
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

export default FertilizerNutritionalContentPage;
