import { useState, useMemo } from "react";
import { Plus, Heart, Bug, Droplets, Search } from "lucide-react";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";
import { TreatmentCard } from "./components/TreatmentCard";
import { TreatmentSearchBar } from "./components/TreatmentSearchBar";
import { MaterialDetailModal } from "./components/MaterialDetailModal";
import { initialTreatments, materialsDatabase } from "./data/treatment.data";
import type { Treatment, SearchFilters } from "./types/treatment.types";

export default function TreatmentPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Treatment[]>(initialTreatments);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Treatment | null>(null);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    keyword: "",
    cropType: "",
    crop: "",
    variety: "",
    disease: "",
    severity: "",
    status: "",
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Keyword search
      if (searchFilters.keyword) {
        const keyword = searchFilters.keyword.toLowerCase();
        const matchKeyword =
          item.code.toLowerCase().includes(keyword) ||
          item.name.toLowerCase().includes(keyword) ||
          item.disease.toLowerCase().includes(keyword);
        if (!matchKeyword) return false;
      }

      // Advanced filters
      if (searchFilters.cropType && item.cropType !== searchFilters.cropType)
        return false;
      if (searchFilters.crop && item.crop !== searchFilters.crop) return false;
      if (searchFilters.variety && item.variety !== searchFilters.variety)
        return false;
      if (searchFilters.disease && item.disease !== searchFilters.disease)
        return false;
      if (searchFilters.severity && item.severity !== searchFilters.severity)
        return false;
      if (searchFilters.status && item.status !== searchFilters.status)
        return false;

      return true;
    });
  }, [data, searchFilters]);

  const handleEdit = (item: Treatment) => {
    toast({
      title: "Chỉnh sửa",
      description: `Đang chỉnh sửa: ${item.name}`,
    });
  };

  const handleDelete = (item: Treatment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa phác đồ" });
    }
    setDeleteOpen(false);
  };

  const handleViewMaterial = (pesticideId: string) => {
    setSelectedMaterialId(pesticideId);
    setMaterialModalOpen(true);
  };

  const activeCount = data.filter((t) => t.status === "active").length;
  const severeCount = data.filter((t) => t.severity === "severe").length;
  const moderateCount = data.filter((t) => t.severity === "moderate").length;

  const selectedMaterial = selectedMaterialId
    ? materialsDatabase[selectedMaterialId]
    : null;

  return (
    <AdminLayout
      title="Phác đồ điều trị"
      description="Tìm kiếm và tra cứu phác đồ điều trị bệnh và sâu hại cho cây trồng"
      actions={
        <Button onClick={() => toast({ title: "Thêm phác đồ" })}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phác đồ
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Đang áp dụng</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <Bug className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{severeCount}</p>
                <p className="text-sm text-muted-foreground">Nghiêm trọng</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">
                  {moderateCount}
                </p>
                <p className="text-sm text-muted-foreground">Trung bình</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <TreatmentSearchBar
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
        />

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Tìm thấy{" "}
              <span className="font-medium">{filteredData.length}</span> kết quả
            </p>
          </div>

          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Không tìm thấy phác đồ phù hợp
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredData.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewMaterial={handleViewMaterial}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      <MaterialDetailModal
        material={selectedMaterial}
        open={materialModalOpen}
        onOpenChange={setMaterialModalOpen}
      />
    </AdminLayout>
  );
}
