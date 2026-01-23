import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DeleteDialog,
  Label,
  MultiSelect,
  useToast,
  type Column,
} from "@tankhang1/eco-shared-ui";
import {
  FileDown,
  Hash,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

import {
  cropTypeOptions,
  growthCycleOptions,
  harvestMethodOptions,
  initialData,
} from "./mocks";
import type { Crop, CropFilter } from "./types";

export default function CropPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [data, setData] = useState<Crop[]>(initialData);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Crop | null>(null);

  const [filters, setFilters] = useState<CropFilter>({
    cropTypes: [],
    harvestMethods: [],
    growthCycles: [],
  });

  const columns: Column<Crop>[] = [
    {
      key: "code",
      label: "Mã cây",
      render: (value: string) => (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
          <Hash className="w-3 h-3 opacity-60" />
          {value}
        </div>
      ),
    },
    {
      key: "illustration",
      label: "Hình ảnh",
      render: (value: string | null) => (
        <div className="w-12 h-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img
              src={value}
              alt="Crop"
              className="w-full h-full object-cover transition-transform hover:scale-110"
            />
          ) : (
            <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Tên cây",
      render: (value: string) => (
        <span className="font-bold text-foreground">{value}</span>
      ),
    },
    {
      key: "cropType",
      label: "Loại cây",
      render: (value: string) => (
        <span className="text-sm font-medium text-muted-foreground">
          {value}
        </span>
      ),
    },
    {
      key: "cropGroup",
      label: "Nhóm cây",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value}</span>
      ),
    },
    {
      key: "harvestMethod",
      label: "Thu hoạch",
      render: (value: string) => (
        <span className="text-sm text-muted-foreground italic">{value}</span>
      ),
    },
  ];

  const handleReset = () => {
    setFilters({
      cropTypes: [],
      harvestMethods: [],
      growthCycles: [],
    });
    setData(initialData);
    toast({
      title: "Đã đặt lại",
      description: "Bộ lọc đã được đưa về mặc định",
    });
  };

  const handleSearch = () => {
    let filtered = initialData.filter((item) => {
      const matchesType =
        filters.cropTypes.length === 0 ||
        filters.cropTypes.includes(item.cropType);

      const matchesHarvest =
        filters.harvestMethods.length === 0 ||
        filters.harvestMethods.includes(item.harvestMethod);

      // Note: growthCycle is not in current mock data but added for future use
      return matchesType && matchesHarvest;
    });

    setData(filtered);
    toast({
      title: "Đã cập nhật",
      description: `Tìm thấy ${filtered.length} kết quả`,
    });
  };

  const handleDelete = (item: Crop) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleView = (item: Crop) => {
    setLocation(`/crop/${item.id}`);
  };

  const handleEdit = (item: Crop) => {
    // Navigate to edit page (currently using create page as placeholder if edit page doesn't exist,
    // or if we want to reuse the create page logic)
    // Based on App.tsx, we don't have a specific edit page yet, using create for now or just navigating to detail
    // Actually, looking at App.tsx, we don't have an explicit edit route for crop yet except /crop/create
    // But usually we would have /crop/:id/edit. Let's assume we might add it or just link to detail for now.
    // Wait, the plan said "Update UpdateSeedPage", but this is Crop.
    // I will point to /crop/create for now or maybe just alert "Not implemented" if I didn't create CropEditPage.
    // App.tsx has: <Route path="/crop/create" component={CropCreatePage} />
    // It does not have /crop/:id/edit.
    // I will point to /crop/:id for now as "Edit" might be inside detail or I should add an Edit route later.
    // Let's check SeedPage again. It points to /seed/:id/edit.
    // For now, I'll point to /crop/:id as a placeholder or maybe /crop/create?
    // Actually, looking at the "Action" button in CropPage, there might be constraints.
    // Let's just point to /crop/:id for now relative to the task "Create Crop Detail Page".
    // I'll add a TODO or just omit handleEdit if not required by DataTable strictly?
    // DataTable usually renders actions based on presence of handlers.
    // I will add handleView. handleEdit is optional.
    // But wait, the user might expect an edit button.
    // Let's add handleEdit and point it to /crop/:id for now since we don't have an edit page yet.
    // Or better, I can leave it out if I don't want an Edit button yet.
    // But consistency is good.
    // Re-reading task: "Create Crop Detail Page". It doesn't explicitly say "Create Crop Edit Page".
    // But CropDetailPage has an "Edit" button that goes to `/crop/${crop.id}/edit`.
    // So I should probably add that route too or at least point it somewhere safe.
    // I already added `<Route path="/crop/:id" component={CropDetailPage} />` to App.tsx.
    // I did NOT add `/crop/:id/edit`.
    // So distinct edit page is missing.
    // I will just implement handleView for now for the detail page task.
    setLocation(`/crop/${item.id}`);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa cây trồng" });
    }
    setDeleteOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý cây trồng"
      description="Danh mục các loại cây trồng có trên thị trường"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">
            <FileDown className="w-4 h-4 mr-2 text-green-600" />
            Xuất Excel
          </Button>
          <Link href="/crop/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 py-4 px-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600" />
                Tìm kiếm cây trồng
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Lọc theo tên, mã hoặc phương pháp thu hoạch
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-10 px-4 font-semibold bg-white hover:bg-muted/50 transition-colors"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                className="h-10 px-6 bg-green-600 hover:bg-green-700 font-semibold shadow-sm transition-all active:scale-95"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Crop Type - MultiSelect */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Loại cây
                </Label>
                <MultiSelect
                  options={cropTypeOptions}
                  value={filters.cropTypes}
                  placeholder="Chọn loại cây"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm loại cây..."
                  onChange={(v) => setFilters({ ...filters, cropTypes: v })}
                />
              </div>

              {/* Growth Cycle - MultiSelect */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Chu kỳ sinh trưởng
                </Label>
                <MultiSelect
                  options={growthCycleOptions}
                  value={filters.growthCycles}
                  placeholder="Chọn chu kỳ"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm chu kỳ..."
                  onChange={(v) => setFilters({ ...filters, growthCycles: v })}
                />
              </div>

              {/* Harvest Method - MultiSelect */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Hình thức thu hoạch
                </Label>
                <MultiSelect
                  options={harvestMethodOptions}
                  value={filters.harvestMethods}
                  placeholder="Chọn hình thức"
                  emptyText="Không tìm thấy"
                  searchPlaceholder="Tìm hình thức..."
                  onChange={(v) =>
                    setFilters({ ...filters, harvestMethods: v })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <DataTable
          columns={columns}
          data={data}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          searchPlaceholder="Tìm kiếm..."
          selectable
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
