import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Heart,
  Bug,
  Droplets,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  DeleteDialog,
  useToast,
} from "@tankhang1/eco-shared-ui";
import { TreatmentListItem } from "./components/TreatmentListItem";
import { TreatmentDetail } from "./components/TreatmentDetail";
import { TreatmentSearchBar } from "./components/TreatmentSearchBar";
import { MaterialDetailModal } from "./components/MaterialDetailModal";
import { initialTreatments, materialsDatabase } from "./data/treatment.data";
import type { Treatment, SearchFilters } from "./types/treatment.types";
import { TreatmentForm } from "./components/TreatmentForm";

export default function TreatmentPage() {
  const { toast } = useToast();
  const [data, setData] = useState<Treatment[]>(initialTreatments);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Treatment | null>(null);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null,
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Treatment | null>(null);

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

  // Handle default selection
  useEffect(() => {
    if (filteredData.length > 0) {
      if (
        selectedId === null ||
        !filteredData.find((i) => i.id === selectedId)
      ) {
        setSelectedId(filteredData[0].id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredData, selectedId]);

  const selectedTreatment = useMemo(
    () => data.find((t) => t.id === selectedId),
    [data, selectedId],
  );

  const handleEdit = (item: Treatment) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleSubmit = (formData: Partial<Treatment>) => {
    if (editingItem) {
      // Update existing
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: `Đã cập nhật phác đồ: ${formData.name}`,
      });
    } else {
      // Create new
      const newItem: Treatment = {
        ...formData,
        id: Math.max(...data.map((d) => d.id), 0) + 1,
        steps: [],
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
        severity: "moderate",
        safetyRating: "medium",
        ...formData, // Spread again to ensure user overrides take precedence if any defaults
      } as Treatment;

      setData((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
      toast({
        title: "Thành công",
        description: `Đã tạo mới phác đồ: ${newItem.name}`,
      });
    }
    setFormOpen(false);
  };

  const handleDelete = (item: Treatment) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      if (selectedId === deleteItem.id) {
        setSelectedId(null);
      }
      toast({ title: "Thành công", description: "Đã xóa phác đồ" });
    }
    setDeleteOpen(false);
  };

  const handleViewMaterial = (materialId: string) => {
    setSelectedMaterialId(materialId);
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
      description="Hệ thống quản lý quy trình kỹ thuật & sâu bệnh"
      actions={
        <Button
          onClick={handleCreate}
          className="bg-green-600 hover:bg-green-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phác đồ mới
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Statistics - Compact Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-white border-green-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100/50 text-green-600 ring-1 ring-green-200">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {activeCount}
                </p>
                <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                  Đang áp dụng
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-white border-red-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100/50 text-red-600 ring-1 ring-red-200">
                <Bug className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {severeCount}
                </p>
                <p className="text-xs font-medium text-red-700 uppercase tracking-wide">
                  Nghiêm trọng
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-amber-50 to-white border-amber-100 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-100/50 text-amber-600 ring-1 ring-amber-200">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-gray-900">
                  {moderateCount}
                </p>
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                  Mức độ trung bình
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          {/* Left Sidebar - Option 2: Integrated "Mailbox" Style */}
          <div className="lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transform transition-all">
            {/* Sticky Header Zone */}
            <div className="p-3 border-b border-gray-100 bg-white z-10 space-y-3 shrink-0">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-gray-800 text-base">
                  Danh sách phác đồ
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <TreatmentSearchBar
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
              />

              {/* Scrollable Smart Filters (Chips) */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scoll-smooth">
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      status: "",
                      severity: "",
                    }))
                  }
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border
                    ${
                      !searchFilters.status && !searchFilters.severity
                        ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  Tất cả
                </button>
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({ ...prev, status: "active" }))
                  }
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5
                    ${
                      searchFilters.status === "active"
                        ? "bg-green-600 border-green-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-green-200 hover:text-green-600 hover:bg-green-50"
                    }
                  `}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${searchFilters.status === "active" ? "bg-white" : "bg-green-500"}`}
                  />
                  Đang chạy
                </button>
                <button
                  onClick={() =>
                    setSearchFilters((prev) => ({
                      ...prev,
                      severity: "severe",
                      status: "",
                    }))
                  }
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5
                    ${
                      searchFilters.severity === "severe"
                        ? "bg-red-600 border-red-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50"
                    }
                  `}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${searchFilters.severity === "severe" ? "bg-white" : "bg-red-500"}`}
                  />
                  Khẩn cấp
                </button>
              </div>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2 space-y-2 custom-scrollbar">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <span>Kết quả ({filteredData.length})</span>
                <span className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
                  Mới nhất <ArrowUpDown className="w-3 h-3" />
                </span>
              </div>

              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TreatmentListItem
                    key={item.id}
                    treatment={item}
                    isSelected={selectedId === item.id}
                    onClick={() => setSelectedId(item.id)}
                  />
                ))
              ) : (
                <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                  <Search className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">
                    Không tìm thấy phác đồ nào
                  </p>
                  <Button
                    variant="link"
                    className="text-green-600 mt-2"
                    onClick={() =>
                      setSearchFilters({
                        keyword: "",
                        cropType: "",
                        crop: "",
                        variety: "",
                        disease: "",
                        severity: "",
                        status: "",
                      })
                    }
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-9 h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            {selectedTreatment ? (
              <TreatmentDetail
                treatment={selectedTreatment}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewMaterial={handleViewMaterial}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 text-gray-400">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Bug className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">
                  Chưa chọn phác đồ
                </h3>
                <p>Vui lòng chọn một phác đồ từ danh sách bên trái</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TreatmentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editingItem}
        onSubmit={handleSubmit}
      />

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
