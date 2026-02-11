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
  ScrollArea,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tankhang1/eco-shared-ui";
import {
  pesticideGroups,
  pesticideForms,
  actionTypes,
  origins,
  commonHashtags,
  suppliers,
  units,
} from "./constants";
import usePesticideStore from "../../stores/usePesticideStore";
import {
  ChevronLeft,
  Upload,
  FileText,
  X,
  Plus,
  Package,
  CheckCircle2,
  Building2,
  User,
  Tags,
  Image as ImageIcon,
} from "lucide-react";

interface PesticideFormData {
  // Step 1
  code: string;
  name: string;
  group: string;
  form: string;
  actionType: string;
  origin: string;
  activeIngredient: string;
  usage: string;
  note: string;
  hashtags: string[];
  imageUrl?: string;

  // Step 2
  technicalDocType: "file" | "editor";
  technicalDocFile?: File | null;
  technicalDocContent: string;

  // Step 3
  selectedSupplierId: string;
  quantity: string;
  unit: string;
  packaging: string;
}

const PesticideCreatePage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/pesticide/:id/edit");
  const isEdit = match && !!params?.id;
  const { toast } = useToast();

  // Zustand store
  const getPesticideById = usePesticideStore((state) => state.getPesticideById);
  const addPesticide = usePesticideStore((state) => state.addPesticide);
  const updatePesticide = usePesticideStore((state) => state.updatePesticide);

  const [formData, setFormData] = useState<PesticideFormData>({
    code: "",
    name: "",
    group: "",
    form: "",
    actionType: "",
    origin: "",
    activeIngredient: "",
    usage: "",
    note: "",
    hashtags: [],
    technicalDocType: "file",
    technicalDocContent: "",
    technicalDocFile: null,
    selectedSupplierId: "",
    quantity: "",
    unit: "",
    packaging: "",
  });

  const [paramHashtag, setParamHashtag] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load initial data for Edit
  useEffect(() => {
    if (isEdit && params?.id) {
      const item = getPesticideById(Number(params.id));
      if (item) {
        // Map details to form data
        setFormData({
          code: item.code,
          name: item.name,
          group: item.group,
          form: item.form,
          actionType: item.actionType,
          origin: item.origin,
          activeIngredient: item.activeIngredient,
          usage: "", // Mock: field missing in list data
          note: "", // Mock: field missing in list data
          hashtags: ["HieuQuaCao", "AnToan"], // Mock data
          technicalDocType: "file",
          technicalDocContent: "",
          selectedSupplierId: "sup1", // Mock data
          quantity: "500", // Mock data
          unit: "Chai", // Mock data
          packaging: "Thùng 24 chai", // Mock data
        });
      }
    }
  }, [isEdit, params?.id, getPesticideById]);

  const updateField = (field: keyof PesticideFormData, value: any) => {
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

  const handleConfirmSubmit = () => {
    if (isEdit && params?.id) {
      // Update existing pesticide
      updatePesticide(Number(params.id), {
        code: formData.code,
        name: formData.name,
        group: formData.group,
        form: formData.form,
        actionType: formData.actionType,
        origin: formData.origin,
        activeIngredient: formData.activeIngredient,
        status: "active",
      });
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thành công",
      });
    } else {
      // Add new pesticide
      addPesticide({
        code: formData.code,
        name: formData.name,
        group: formData.group,
        form: formData.form,
        actionType: formData.actionType,
        origin: formData.origin,
        activeIngredient: formData.activeIngredient,
        status: "active",
      });
      toast({
        title: "Thành công",
        description: "Đã thêm mới thuốc bảo vệ thực vật",
      });
    }
    setConfirmOpen(false);
    setLocation("/pesticide");
  };

  // --- Step 1: Basic Information ---
  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã thuốc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
                placeholder="VD: BVTV001"
              />
            </div>
            <div className="space-y-2">
              <Label>
                Tên thuốc <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nhập tên thuốc..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nhóm thuốc</Label>
              <Select
                value={formData.group}
                onValueChange={(v) => updateField("group", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {pesticideGroups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dạng thuốc</Label>
              <Select
                value={formData.form}
                onValueChange={(v) => updateField("form", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dạng" />
                </SelectTrigger>
                <SelectContent>
                  {pesticideForms.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cơ chế tác động</Label>
              <Select
                value={formData.actionType}
                onValueChange={(v) => updateField("actionType", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cơ chế" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nguồn gốc</Label>
              <Select
                value={formData.origin}
                onValueChange={(v) => updateField("origin", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nguồn gốc" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Công thức hoạt chất</Label>
            <Textarea
              value={formData.activeIngredient}
              onChange={(e) => updateField("activeIngredient", e.target.value)}
              placeholder="Nhập thành phần hoạt chất..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Công dụng & Hướng dẫn sử dụng</Label>
            <Textarea
              value={formData.usage}
              onChange={(e) => updateField("usage", e.target.value)}
              placeholder="Mô tả công dụng và hướng dẫn sử dụng..."
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
          <div className="space-y-2">
            <Label>Ghi chú thêm</Label>
            <Textarea
              value={formData.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Ghi chú nội bộ..."
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
            <p className="font-medium text-slate-900">Tải lên ảnh sản phẩm</p>
            <p className="text-sm text-muted-foreground mt-1">
              Kéo thả hoặc click để chọn file
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Step 2: Technical Documents ---
  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Tài liệu kỹ thuật</h3>
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
              Soạn thảo trực tiếp
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
              Hỗ trợ định dạng PDF, DOCX. Dung lượng tối đa 20MB.
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Chọn tài liệu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Nội dung tài liệu</Label>
            <Textarea
              className="min-h-[400px] font-mono"
              placeholder="# Tài liệu kỹ thuật..."
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

  // --- Step 3: Supplier & Packaging ---
  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Chọn nhà cung cấp
          </h3>
          <p className="text-sm text-muted-foreground">
            Lựa chọn đối tác cung cấp sản phẩm này (Doanh nghiệp hoặc Nông hộ)
          </p>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {suppliers.map((sup) => (
                <div
                  key={sup.id}
                  onClick={() => updateField("selectedSupplierId", sup.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    formData.selectedSupplierId === sup.id
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-white border-slate-200 hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      sup.type === "enterprise"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {sup.type === "enterprise" ? (
                      <Building2 className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{sup.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 uppercase">
                      {sup.type === "enterprise" ? "Doanh nghiệp" : "Nông hộ"}
                    </div>
                  </div>
                  {formData.selectedSupplierId === sup.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Quy cách đóng gói
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Số lượng / Dung tích <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="VD: 500"
                  value={formData.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Đơn vị tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => updateField("unit", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đơn vị" />
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
            <div className="space-y-2">
              <Label>Mô tả quy cách</Label>
              <Input
                placeholder="VD: Chai nhựa 500ml, thùng 24 chai"
                value={formData.packaging}
                onChange={(e) => updateField("packaging", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Step 4: Confirmation ---
  const renderStep4 = () => {
    const supplier = suppliers.find(
      (s) => s.id === formData.selectedSupplierId,
    );

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
                Thông tin thuốc
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
                  <span className="text-muted-foreground">Nhóm:</span>{" "}
                  <span className="font-medium">{formData.group}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dạng:</span>{" "}
                  <span className="font-medium">{formData.form}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Hoạt chất:</span>{" "}
                  <span className="font-medium">
                    {formData.activeIngredient}
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
                Nguồn cung & Quy cách
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="col-span-2">
                  <span className="text-muted-foreground">Nhà cung cấp:</span>{" "}
                  <span className="font-medium text-primary">
                    {supplier?.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quy cách:</span>{" "}
                  <span className="font-medium">
                    {formData.quantity} {formData.unit}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mô tả:</span>{" "}
                  <span className="font-medium">{formData.packaging}</span>
                </div>
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
      id: "docs",
      title: "Tài liệu kỹ thuật",
      content: renderStep2(),
    },
    {
      id: "supply",
      title: "Nhà cung cấp",
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
      title={isEdit ? "Cập nhật thuốc BVTV" : "Thêm thuốc bảo vệ thực vật"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin cho ${formData.name}`
          : "Khai báo thông tin thuốc trừ sâu, bệnh mới"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/pesticide")}
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
          onCancel={() => setLocation("/pesticide")}
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
                  ? "Bạn có chắc chắn muốn cập nhật thông tin thuốc BVTV này?"
                  : "Bạn có chắc chắn muốn thêm thuốc BVTV mới vào hệ thống?"}
              </p>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã thuốc:</span>
                  <span className="font-medium">{formData.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên thuốc:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nhóm:</span>
                  <span className="font-medium">{formData.group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nguồn gốc:</span>
                  <span className="font-medium">{formData.origin}</span>
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

export default PesticideCreatePage;
