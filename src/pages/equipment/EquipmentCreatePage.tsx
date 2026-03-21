import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  StepperForm,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  equipmentTypes,
  maintenanceIntervals,
  suppliers,
  units,
} from "./constants";
import useEquipmentStore from "../../stores/useEquipmentStore";
import {
  ChevronLeft,
  Upload,
  Plus,
  CheckCircle2,
  Building2,
  Image as ImageIcon,
  Wrench,
  FileText,
  X,
} from "lucide-react";

interface EquipmentFormData {
  // Step 1: Info
  code: string;
  name: string;
  type: string;
  status: string;
  maintainanceInterval: string;
  description: string;
  imageUrl?: string;

  // Step 2: Documents
  technicalDocType: "file" | "editor";
  technicalDocContent: string;

  // Step 3: Supplier
  supplierDetails: {
    supplierId: string;
    quantity: string;
    unit: string;
    warranty: string; // Warranty period
  }[];
}

const EquipmentCreatePage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/equipment/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  // Zustand store
  const getEquipmentById = useEquipmentStore((state) => state.getEquipmentById);
  const addEquipment = useEquipmentStore((state) => state.addEquipment);
  const updateEquipment = useEquipmentStore((state) => state.updateEquipment);

  const [formData, setFormData] = useState<EquipmentFormData>({
    code: "",
    name: "",
    type: "",
    status: "active",
    maintainanceInterval: "",
    description: "",
    technicalDocType: "file",
    technicalDocContent: "",
    supplierDetails: [],
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tempSupplier, setTempSupplier] = useState({
    supplierId: "",
    quantity: "",
    unit: "",
    warranty: "",
  });

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getEquipmentById(Number(params.id));
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          type: item.type,
          status: item.status,
          maintainanceInterval: item.maintainanceInterval,
          description: item.description,
          technicalDocType: "file",
          technicalDocContent: "",
          supplierDetails: [
            {
              supplierId: "sup1",
              quantity: "1",
              unit: "Chiếc",
              warranty: "12 tháng",
            },
          ],
        });
      }
    }
  }, [isEdit, params?.id, getEquipmentById]);

  const updateField = (field: keyof EquipmentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSupplierItem = () => {
    if (
      !tempSupplier.supplierId ||
      !tempSupplier.quantity ||
      !tempSupplier.unit
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn nhà cung cấp, số lượng và đơn vị",
        variant: "destructive",
      });
      return;
    }
    updateField("supplierDetails", [...formData.supplierDetails, tempSupplier]);
    setTempSupplier({ supplierId: "", quantity: "", unit: "", warranty: "" });
  };

  const removeSupplierItem = (index: number) => {
    const newDetails = [...formData.supplierDetails];
    newDetails.splice(index, 1);
    updateField("supplierDetails", newDetails);
  };

  const handleConfirmSubmit = () => {
    if (isEdit && params?.id) {
      // Update existing equipment
      updateEquipment(Number(params.id), {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        status: formData.status as "active" | "maintenance" | "inactive",
        description: formData.description,
        maintainanceInterval: formData.maintainanceInterval,
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thiết bị",
      });
    } else {
      // Add new equipment
      addEquipment({
        code: formData.code,
        name: formData.name,
        type: formData.type,
        status: formData.status as "active" | "maintenance" | "inactive",
        description: formData.description,
        maintainanceInterval: formData.maintainanceInterval,
      });
      toast({
        title: "Thành công",
        description: "Đã thêm mới thiết bị",
      });
    }
    setConfirmOpen(false);
    setLocation("/equipment");
  };

  // --- Step 1: Basic Information ---
  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã thiết bị <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: TB001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên thiết bị <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nhập tên thiết bị..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại thiết bị</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => updateField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chu kỳ bảo dưỡng</Label>
              <Select
                value={formData.maintainanceInterval}
                onValueChange={(v) => updateField("maintainanceInterval", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chu kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {maintenanceIntervals.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả kỹ thuật</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Thông số kỹ thuật, công suất, v.v..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-medium text-slate-900">Tải lên ảnh thiết bị</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Step 2: Technical Documents ---
  // Requested Feature
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Tài liệu kỹ thuật / HDSD
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "file")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "file"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Tải file lên
            </button>
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "editor")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "editor"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Nhập nội dung
            </button>
          </div>
        </div>

        {formData.technicalDocType === "file" ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <FileText className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">
              Tải lên tài liệu kỹ thuật
            </h4>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Hỗ trợ PDF, DOCX, bản vẽ kỹ thuật... Dung lượng tối đa 50MB.
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Chọn tài liệu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Nội dung hướng dẫn / Thông số</Label>
            <Textarea
              className="min-h-[400px] font-mono"
              placeholder="# Hướng dẫn vận hành..."
              value={formData.technicalDocContent}
              onChange={(e) =>
                updateField("technicalDocContent", e.target.value)
              }
            />
          </div>
        )}
      </div>
    </div>
  );

  // --- Step 3: Suppliers ---
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Nhà cung cấp & Bảo hành
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Thông tin nơi mua và chính sách bảo hành
          </p>
        </div>

        {/* Add Form */}
        <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Chọn nhà cung cấp</Label>
              <Select
                value={tempSupplier.supplierId}
                onValueChange={(v) =>
                  setTempSupplier({ ...tempSupplier, supplierId: v })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn đối tác..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Thời gian bảo hành</Label>
              <Input
                placeholder="VD: 12 tháng, 2 năm..."
                value={tempSupplier.warranty}
                onChange={(e) =>
                  setTempSupplier({ ...tempSupplier, warranty: e.target.value })
                }
                className="bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lượng</Label>
              <Input
                type="number"
                placeholder="1"
                value={tempSupplier.quantity}
                onChange={(e) =>
                  setTempSupplier({ ...tempSupplier, quantity: e.target.value })
                }
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Đơn vị tính</Label>
              <Select
                value={tempSupplier.unit}
                onValueChange={(v) =>
                  setTempSupplier({ ...tempSupplier, unit: v })
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Đơn vị..." />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={addSupplierItem}
            className="w-full md:w-auto"
            type="button"
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm vào danh sách
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2">
          <Label>Danh sách đã chọn ({formData.supplierDetails.length})</Label>
          {formData.supplierDetails.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
              Chưa có thông tin nhà cung cấp
            </div>
          ) : (
            <div className="space-y-2">
              {formData.supplierDetails.map((item, idx) => {
                const supInfo = suppliers.find((s) => s.id === item.supplierId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {supInfo?.name || item.supplierId}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} • BH: {item.warranty}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSupplierItem(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Step 4: Confirmation ---
  const renderStep4 = () => (
    <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-green-900">
          Xác nhận thông tin
        </h3>
        <p className="text-green-700 mt-2">
          Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Thông tin thiết bị
            </h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mã:</span>{" "}
                <span className="font-medium">{formData.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tên:</span>{" "}
                <span className="font-medium">{formData.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Loại:</span>{" "}
                <span className="font-medium">{formData.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bảo dưỡng:</span>{" "}
                <span className="font-medium">
                  {formData.maintainanceInterval}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground block mb-1">Mô tả:</span>
                <span className="font-medium bg-slate-50 p-2 block rounded border border-slate-100">
                  {formData.description || "Không có mô tả"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Nhà cung cấp ({formData.supplierDetails.length})
            </h4>
            <div className="space-y-2">
              {formData.supplierDetails.map((item, idx) => {
                const supInfo = suppliers.find((s) => s.id === item.supplierId);
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 text-sm"
                  >
                    <span className="font-medium text-slate-900">
                      {idx + 1}. {supInfo?.name}
                    </span>
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unit} (BH: {item.warranty})
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const steps = [
    {
      id: "info",
      title: "Thông tin cơ bản",
      content: renderStep1(),
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      content: renderStep2(),
    },
    {
      id: "supply",
      title: "Nguồn cung & Bảo hành",
      content: renderStep3(),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: renderStep4(),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật thiết bị" : "Thêm mới thiết bị"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Quản lý máy móc, công cụ và lịch bảo dưỡng"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/equipment")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        <StepperForm
          steps={steps}
          completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
          onComplete={() => {
            // Mở confirm dialog thay vì submit trực tiếp
            setConfirmOpen(true);
          }}
          onCancel={() => setLocation("/equipment")}
        />
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                {isEdit
                  ? "Bạn có chắc chắn muốn cập nhật thông tin thiết bị này?"
                  : "Bạn có chắc chắn muốn thêm thiết bị mới vào hệ thống?"}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã thiết bị:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên thiết bị:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại:</span>
                  <span className="font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bảo dưỡng:</span>
                  <span className="font-medium">
                    {formData.maintainanceInterval}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default EquipmentCreatePage;
