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
  Badge,
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
import { fertilizerTypes, commonHashtags, suppliers, units } from "./constants";
import useFertilizerStore from "../../stores/useFertilizerStore";
import {
  ChevronLeft,
  Upload,
  Plus,
  CheckCircle2,
  Building2,
  Tags,
  Image as ImageIcon,
  Leaf,
  X,
} from "lucide-react";

interface FertilizerFormData {
  // Step 1
  code: string;
  name: string;
  type: string;
  nutrientContent: string;
  description: string;
  hashtags: string[];
  imageUrl?: string;

  // Step 2 (Optional, but per prompt "Select list of suppliers...")
  // We'll allow selecting ONE supplier for simplicity in this flow, or enable multi-selection logic if needed.
  // The prompt says "Chọn danh sách nhà cung cấp, mỗi nhà cung cấp có số lượng...".
  // This implies a 1-to-many relationship form. Let's build a small array for it.
  supplierDetails: {
    supplierId: string;
    quantity: string;
    unit: string;
    packaging: string;
  }[];
}

const FertilizerCreatePage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/fertilizer/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  // Zustand store
  const getFertilizerById = useFertilizerStore(
    (state) => state.getFertilizerById,
  );
  const addFertilizer = useFertilizerStore((state) => state.addFertilizer);
  const updateFertilizer = useFertilizerStore(
    (state) => state.updateFertilizer,
  );

  const [formData, setFormData] = useState<FertilizerFormData>({
    code: "",
    name: "",
    type: "",
    nutrientContent: "",
    description: "",
    hashtags: [],
    supplierDetails: [],
  });

  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Temporary state for adding a supplier line item
  const [tempSupplier, setTempSupplier] = useState({
    supplierId: "",
    quantity: "",
    unit: "",
    packaging: "",
  });

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getFertilizerById(Number(params.id));
      if (item) {
        setFormData({
          code: item.code,
          name: item.name,
          type: item.type,
          nutrientContent: item.nutrientContent,
          description: item.description,
          hashtags: ["HieuQuaCao", "TangTruongNhanh"], // Mock data
          supplierDetails: [
            {
              supplierId: "sup1",
              quantity: "100",
              unit: "Bao",
              packaging: "Bao 50kg",
            },
          ],
        });
      }
    }
  }, [isEdit, params?.id, getFertilizerById]);

  const updateField = (field: keyof FertilizerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddHashtag = () => {
    if (paramHashtag && !formData.hashtags.includes(paramHashtag)) {
      updateField("hashtags", [...formData.hashtags, paramHashtag]);
      setParamHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    updateField(
      "hashtags",
      formData.hashtags.filter((t) => t !== tag),
    );
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
    setTempSupplier({ supplierId: "", quantity: "", unit: "", packaging: "" });
  };

  const removeSupplierItem = (index: number) => {
    const newDetails = [...formData.supplierDetails];
    newDetails.splice(index, 1);
    updateField("supplierDetails", newDetails);
  };

  const handleConfirmSubmit = () => {
    if (isEdit && params?.id) {
      // Update existing fertilizer
      updateFertilizer(Number(params.id), {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        nutrientContent: formData.nutrientContent,
        description: formData.description,
        status: "active",
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin phân bón",
      });
    } else {
      // Add new fertilizer
      addFertilizer({
        code: formData.code,
        name: formData.name,
        type: formData.type,
        nutrientContent: formData.nutrientContent,
        description: formData.description,
        status: "active",
      });
      toast({
        title: "Thành công",
        description: "Đã thêm mới phân bón",
      });
    }
    setConfirmOpen(false);
    setLocation("/fertilizer");
  };

  // --- Step 1: Basic Information ---
  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã phân bón <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: PB001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên phân bón <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nhập tên phân bón..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại phân bón</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => updateField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại phân" />
                </SelectTrigger>
                <SelectContent>
                  {fertilizerTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Hàm lượng dinh dưỡng</Label>
              <Input
                value={formData.nutrientContent}
                onChange={(e) => updateField("nutrientContent", e.target.value)}
                placeholder="VD: N-P-K (20-20-15)..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mô tả chi tiết</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả công dụng, đặc điểm..."
              rows={4}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Phân loại & Hashtags
          </h3>
          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => setParamHashtag(e.target.value)}
                placeholder="Nhập hashtag..."
                onKeyDown={(e) => e.key === "Enter" && handleAddHashtag()}
              />
              <Button
                type="button"
                onClick={handleAddHashtag}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {commonHashtags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    formData.hashtags.includes(tag)
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() =>
                    formData.hashtags.includes(tag)
                      ? removeHashtag(tag)
                      : updateField("hashtags", [...formData.hashtags, tag])
                  }
                >
                  #{tag}
                </Badge>
              ))}
              {formData.hashtags
                .filter((t) => !commonHashtags.includes(t))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
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
            <p className="font-medium text-slate-900">Tải lên ảnh sản phẩm</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Step 2: Suppliers ---
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Danh sách nhà cung cấp
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Thêm các nhà cung cấp phân bón này kèm thông tin quy cách
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
                      {s.name} ({s.type === "enterprise" ? "DN" : "NH"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quy cách đóng gói</Label>
              <Input
                placeholder="VD: Bao 50kg"
                value={tempSupplier.packaging}
                onChange={(e) =>
                  setTempSupplier({
                    ...tempSupplier,
                    packaging: e.target.value,
                  })
                }
                className="bg-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số lượng (tồn kho)</Label>
              <Input
                type="number"
                placeholder="0"
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
              Chưa có nhà cung cấp nào được chọn
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
                          {item.quantity} {item.unit} • {item.packaging}
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

  // --- Step 3: Confirmation ---
  const renderStep3 = () => {
    return (
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
                Thông tin phân bón
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
                  <span className="text-muted-foreground">Dinh dưỡng:</span>{" "}
                  <span className="font-medium">
                    {formData.nutrientContent}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-1">
                    Mô tả:
                  </span>
                  <span className="font-medium bg-slate-50 p-2 block rounded border border-slate-100">
                    {formData.description || "Không có mô tả"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Tags:</span>{" "}
                  <div className="inline-flex gap-1 flex-wrap mt-1">
                    {formData.hashtags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-slate-800 border-b pb-2">
                Thông tin cung ứng ({formData.supplierDetails.length})
              </h4>
              <div className="space-y-2">
                {formData.supplierDetails.map((item, idx) => {
                  const supInfo = suppliers.find(
                    (s) => s.id === item.supplierId,
                  );
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 text-sm"
                    >
                      <span className="font-medium text-slate-900">
                        {idx + 1}. {supInfo?.name}
                      </span>
                      <span className="text-muted-foreground">
                        {item.quantity} {item.unit} / {item.packaging}
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
  };

  const steps = [
    {
      id: "info",
      title: "Thông tin cơ bản",
      content: renderStep1(),
    },
    {
      id: "supply",
      title: "Nhà cung cấp",
      content: renderStep2(),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: renderStep3(),
    },
  ];

  return (
    <AdminLayout
      title={isEdit ? "Cập nhật phân bón" : "Thêm mới phân bón"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo thông tin chất bón, phân bón mới"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/fertilizer")}
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
          onCancel={() => setLocation("/fertilizer")}
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
                  ? "Bạn có chắc chắn muốn cập nhật thông tin phân bón này?"
                  : "Bạn có chắc chắn muốn thêm phân bón mới vào hệ thống?"}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã phân bón:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên phân bón:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại:</span>
                  <span className="font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hàm lượng:</span>
                  <span className="font-medium">
                    {formData.nutrientContent}
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

export default FertilizerCreatePage;
