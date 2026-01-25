import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tankhang1/eco-shared-ui";
import { FileText, Hash, Leaf, Sprout } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { initialData } from "./mocks";
import type { Variety } from "./types";
import VarietyDetailPage from "./VarietyDetailPage";

const columns: Column<Variety>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | File | null) => (
      <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="w-full h-full object-cover"
          />
        ) : (
          <Sprout className="w-8 h-8 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "crop",
    label: "Cây trồng",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="font-medium text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "varietyCode",
    label: "Mã giống",
    render: (value: string) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "varietyName",
    label: "Tên giống cây",
    render: (value: string) => (
      <span className="font-semibold text-foreground">{value}</span>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value: string) => (
      <p className="text-xs text-muted-foreground line-clamp-3 max-w-[300px]">
        {value}
      </p>
    ),
  },
  {
    key: "documents",
    label: "Tài liệu",
    render: (value: Variety["documents"]) => (
      <div className="flex flex-col gap-1">
        {value.length > 0 ? (
          value.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 w-fit"
            >
              <FileText className="w-3 h-3" />
              {doc.name}
            </a>
          ))
        ) : (
          <span className="text-[11px] text-muted-foreground/50">
            Chưa có tài liệu
          </span>
        )}
      </div>
    ),
  },
];

const VarietyPage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Variety[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filters = [
    {
      key: "crop",
      label: "Cây trồng",
      options: [
        { label: "Sầu riêng", value: "Sầu riêng" },
        { label: "Xoài", value: "Xoài" },
        { label: "Cà phê", value: "Cà phê" },
        { label: "Bưởi", value: "Bưởi" },
        { label: "Lúa", value: "Lúa" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng kinh doanh", value: "inactive" },
      ],
    },
  ];

  const handleDelete = (item: Variety) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
    }
    setDeleteOpen(false);
  };

  const handleView = (item: Variety) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  return (
    <AdminLayout
      title="Quản lý giống cây"
      description="Xem và quản lý danh sách các loại giống cây trồng"
      actions={
        <div className="flex gap-2">
          <Link href="/variety/create">
            <Button className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={data}
        selectable
        onView={handleView}
        onEdit={(item) => setLocation(`/variety/${item.id}/edit`)}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây..."
        filters={filters}
      />

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedId && <VarietyDetailPage id={selectedId} />}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa giống cây này?`}
      />
    </AdminLayout>
  );
};

export default VarietyPage;
