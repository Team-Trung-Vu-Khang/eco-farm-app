import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
  Card,
  CardContent,
  Label,
  MultiSelect,
} from "@tankhang1/eco-shared-ui";
import {
  Download,
  Filter,
  Hash,
  RefreshCw,
  Search,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  cropOptions,
  initialData,
  originOptions,
  supplierOptions,
} from "./mocks";
import type { SeedFilter, Variety } from "./types";

const columns: Column<Variety>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | File | null) => (
      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
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
    label: "Tên giống",
    render: (value: string) => (
      <span className="font-bold text-foreground text-sm">{value}</span>
    ),
  },
  {
    key: "supplier",
    label: "Nhà cung cấp",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "origin",
    label: "Xuất xứ",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "germinationRate",
    label: "Tỷ lệ nảy mầm",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
  {
    key: "uniformity",
    label: "Độ đồng đều",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
];

const SeedPage = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Variety[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Variety | null>(null);

  const [filters, setFilters] = useState<SeedFilter>({
    crops: [],
    suppliers: [],
    origins: [],
  });

  const handleReset = () => {
    setFilters({
      crops: [],
      suppliers: [],
      origins: [],
    });
    setData(initialData);
    toast({
      title: "Đã đặt lại",
      description: "Bộ lọc đã được đưa về mặc định",
    });
  };

  const handleSearch = () => {
    let filtered = initialData.filter((item) => {
      const matchesCrop =
        filters.crops.length === 0 || filters.crops.includes(item.crop);
      const matchesSupplier =
        filters.suppliers.length === 0 ||
        filters.suppliers.includes(item.supplier);
      const matchesOrigin =
        filters.origins.length === 0 || filters.origins.includes(item.origin);

      return matchesCrop && matchesSupplier && matchesOrigin;
    });

    setData(filtered);
    toast({
      title: "Đã cập nhật",
      description: `Tìm thấy ${filtered.length} kết quả`,
    });
  };

  const handleDelete = (item: Variety) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleEdit = (item: Variety) => {
    setLocation(`/seed/${item.id}/edit`);
  };

  const handleView = (item: Variety) => {
    setLocation(`/seed/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý hạt giống cây"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất File
          </Button>
          <Link href="/seed/create">
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all active:scale-95">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b bg-zinc-50/50 py-4 px-6">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600" />
                Tìm kiếm hạt giống cây
              </h3>
              <p className="text-xs text-muted-foreground">
                Lọc theo loại cây, nhà cung cấp hoặc xuất xứ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9 px-4 font-semibold"
                onClick={handleReset}
              >
                <RefreshCw className="w-4 h-4" />
                Làm mới
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 h-9 font-semibold"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                Tìm kiếm
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Loại cây
                </Label>
                <MultiSelect
                  options={cropOptions}
                  value={filters.crops}
                  placeholder="Chọn loại cây"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm loại cây..."
                  onChange={(v) => setFilters({ ...filters, crops: v })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Nhà cung cấp
                </Label>
                <MultiSelect
                  options={supplierOptions}
                  value={filters.suppliers}
                  placeholder="Chọn nhà cung cấp"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm nhà cung cấp..."
                  onChange={(v) => setFilters({ ...filters, suppliers: v })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Xuất xứ
                </Label>
                <MultiSelect
                  options={originOptions}
                  value={filters.origins}
                  placeholder="Chọn quốc gia"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm quốc gia..."
                  onChange={(v) => setFilters({ ...filters, origins: v })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
            <Filter className="w-3 h-3" />
            Tìm thấy {data.length} kết quả
          </p>
          <DataTable
            columns={columns}
            data={data}
            selectable
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Tìm kiếm..."
          />
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa giống cây này?`}
      />
    </AdminLayout>
  );
};

export default SeedPage;
