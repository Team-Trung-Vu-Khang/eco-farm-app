import { useState } from "react";
import { useLocation } from "wouter";
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
  Button,
  RadioGroup,
  RadioGroupItem,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  Editor,
} from "@tankhang1/eco-shared-ui";
import {
  ChevronLeft,
  Upload,
  FileText,
  X,
  Building2,
  Package,
  CheckCircle2,
  Search,
  FileSignature,
  ShoppingCart,
  Plus,
  Trash2,
  FilePlus,
  FileStack,
} from "lucide-react";
import {
  contractTypes,
  mockContracts,
  commodityTypes,
  mockEquipment,
  mockPesticides,
  mockFertilizers,
  mockMaterials,
  packagingSpecs,
  units,
  mockEnterprises,
  currencies,
} from "./constants";

interface CommodityItem {
  id: string;
  commodityType: string;
  commodityId: string;
  commodityName: string;
  commodityCode: string;
  specType: "general" | "detailed";
  packagingSpec: string;
  quantity: string;
  unit: string;
}

interface ContractFormData {
  code: string;
  name: string;
  nature: string; // Formerly 'type'
  value: string;
  currency: string;
  signDate: string;
  isAppendix: boolean;
  parentContractId: string;
  contentType: "file" | "editor";
  contentFile?: File | null;
  contentText: string;
  commodities: CommodityItem[];
  partyAId: string;
  partyBId: string;
}

const allCommodities = [
  ...mockEquipment.map((c) => ({ ...c, type: "equipment" })),
  ...mockPesticides.map((c) => ({ ...c, type: "pesticide" })),
  ...mockFertilizers.map((c) => ({ ...c, type: "fertilizer" })),
  ...mockMaterials.map((c) => ({ ...c, type: "material" })),
];

const ContractCreatePage = () => {
  const [, setLocation] = useLocation();
  const [searchParentContract, setSearchParentContract] = useState("");
  const [searchPartyA, setSearchPartyA] = useState("");
  const [searchPartyB, setSearchPartyB] = useState("");

  const [formData, setFormData] = useState<ContractFormData>({
    code: "",
    name: "",
    nature: "",
    value: "",
    currency: "VND",
    signDate: new Date().toISOString().split("T")[0],
    isAppendix: false,
    parentContractId: "",
    contentType: "file",
    contentFile: null,
    contentText: "",
    commodities: [],
    partyAId: "",
    partyBId: "",
  });

  // Commodity Selection State
  const [pendingCommodityIds, setPendingCommodityIds] = useState<string[]>([]);
  const [isCommodityDialogOpen, setIsCommodityDialogOpen] = useState(false);
  const [tempSelectedCommodities, setTempSelectedCommodities] = useState<any[]>(
    [],
  );

  const [popupSearch, setPopupSearch] = useState("");
  const [popupType, setPopupType] = useState("all");

  const [currentCommodity, setCurrentCommodity] = useState({
    commodityType: "",
    commodityId: "",
    specType: "general" as "general" | "detailed",
    packagingSpec: "",
    quantity: "",
    unit: "",
  });

  const updateField = (field: keyof ContractFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField("contentFile", file);
    }
  };

  const getCommodityList = (type: string) => {
    if (type === "all") return allCommodities;
    return allCommodities.filter((c) => c.type === type);
  };

  const getCommodityListBySearch = (type: string, search: string) => {
    return getCommodityList(type).filter(
      (item) =>
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const handleToggleCommoditySelection = (item: any) => {
    setTempSelectedCommodities((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.filter((c) => c.id !== item.id);
      return [...prev, item];
    });
  };

  const handleConfirmPopupSelection = () => {
    const newIds = tempSelectedCommodities.map((c) => c.id.toString());
    // Only add IDs that are not already in pending or defined
    const filteredNewIds = newIds.filter(
      (id) =>
        !pendingCommodityIds.includes(id) &&
        !formData.commodities.some((c) => c.commodityId === id),
    );
    setPendingCommodityIds((prev) => [...prev, ...filteredNewIds]);
    setIsCommodityDialogOpen(false);
    setTempSelectedCommodities([]);
  };

  const handleRemoveCommodity = (id: string) => {
    updateField(
      "commodities",
      formData.commodities.filter((c) => c.id !== id),
    );
  };

  const getSelectedPartyA = () => {
    return mockEnterprises.find((e) => e.id.toString() === formData.partyAId);
  };

  const getSelectedPartyB = () => {
    return mockEnterprises.find((e) => e.id.toString() === formData.partyBId);
  };

  const getSelectedParentContract = () => {
    return mockContracts.find(
      (c) => c.id.toString() === formData.parentContractId,
    );
  };

  // --- Step 1: Basic Information ---
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <FileSignature className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
          <p className="text-sm text-muted-foreground">
            Nhập thông tin cơ bản của hợp đồng
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-2xl text-center">
              <Label
                htmlFor="contractType"
                className="mb-4 block text-base font-semibold"
              >
                Loại hợp đồng <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                className="grid grid-cols-2 gap-4"
                value={formData.isAppendix ? "appendix" : "new"}
                onValueChange={(v) =>
                  updateField("isAppendix", v === "appendix")
                }
              >
                <div
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer text-left ${
                    !formData.isAppendix
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                  }`}
                  onClick={() => updateField("isAppendix", false)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      !formData.isAppendix
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FilePlus className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem
                        value="new"
                        id="type-new"
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          !formData.isAppendix
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {!formData.isAppendix && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        Hợp đồng mới
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Thiết lập các điều khoản gốc cho một thỏa thuận mới hoàn
                      toàn.
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer text-left ${
                    formData.isAppendix
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-gray-200 hover:border-gray-300 bg-white shadow-sm"
                  }`}
                  onClick={() => updateField("isAppendix", true)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      formData.isAppendix
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <FileStack className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <RadioGroupItem
                        value="appendix"
                        id="type-appendix"
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          formData.isAppendix
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.isAppendix && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        Phụ lục hợp đồng
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Bổ sung hoặc thay đổi điều khoản dựa trên một hợp đồng đã
                      có.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">
                Mã hợp đồng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: HD001"
                value={formData.code}
                onChange={(e) => updateField("code", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="signDate">
                Ngày ký kết <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signDate"
                type="date"
                value={formData.signDate}
                onChange={(e) => updateField("signDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">
              Tên hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Hợp đồng mua bán phân bón"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="nature">
              Tính chất hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.nature}
              onValueChange={(v) => updateField("nature", v)}
            >
              <SelectTrigger id="nature">
                <SelectValue placeholder="Chọn tính chất hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="value">
                Giá trị hợp đồng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                placeholder="Nhập giá trị hợp đồng"
                value={formData.value}
                onChange={(e) => updateField("value", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Đơn vị</Label>
              <Select
                value={formData.currency}
                onValueChange={(v) => updateField("currency", v)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="VNĐ" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.id} value={curr.id}>
                      {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // --- Step 2: Contract Type & Content ---
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Nội dung hợp đồng</h3>
          <p className="text-sm text-muted-foreground">
            Tải lên hoặc soạn thảo nội dung hợp đồng
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Main Contract Selection (if appendix) */}
          {formData.isAppendix && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileSignature className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Hợp đồng gốc</h4>
                    <p className="text-xs text-muted-foreground">
                      {formData.parentContractId
                        ? `Đã chọn: ${getSelectedParentContract()?.name} (${getSelectedParentContract()?.code})`
                        : "Vui lòng chọn hợp đồng gốc cho phụ lục này"}
                    </p>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      {formData.parentContractId ? "Thay đổi" : "Chọn hợp đồng"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Chọn hợp đồng chính</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm theo mã hoặc tính chất hợp đồng..."
                          className="pl-10"
                          value={searchParentContract}
                          onChange={(e) =>
                            setSearchParentContract(e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                        {mockContracts
                          .filter((c) => {
                            const search = searchParentContract.toLowerCase();
                            const natureName =
                              contractTypes
                                .find((t) => t.id === c.type)
                                ?.name.toLowerCase() || "";
                            return (
                              c.code.toLowerCase().includes(search) ||
                              natureName.includes(search) ||
                              c.name.toLowerCase().includes(search)
                            );
                          })
                          .map((contract) => (
                            <div
                              key={contract.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-slate-50 relative ${
                                formData.parentContractId ===
                                contract.id.toString()
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => {
                                updateField(
                                  "parentContractId",
                                  contract.id.toString(),
                                );
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">
                                      {contract.code}
                                    </span>
                                    <h5 className="font-semibold text-sm">
                                      {contract.name}
                                    </h5>
                                  </div>
                                  <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
                                    <div>📅 Ngày ký: {contract.signDate}</div>
                                    <div>
                                      📋{" "}
                                      {
                                        contractTypes.find(
                                          (t) => t.id === contract.type,
                                        )?.name
                                      }
                                    </div>
                                  </div>
                                </div>
                                {formData.parentContractId ===
                                  contract.id.toString() && (
                                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        {mockContracts.filter((c) => {
                          const search = searchParentContract.toLowerCase();
                          const natureName =
                            contractTypes
                              .find((t) => t.id === c.type)
                              ?.name.toLowerCase() || "";
                          return (
                            c.code.toLowerCase().includes(search) ||
                            natureName.includes(search) ||
                            c.name.toLowerCase().includes(search)
                          );
                        }).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">
                              Không tìm thấy hợp đồng phù hợp
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">Huỷ</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button disabled={!formData.parentContractId}>
                            Xác nhận
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          {/* Content Type Selection */}
          <div>
            <Label className="mb-3 block">
              Nội dung hợp đồng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.contentType}
              onValueChange={(v: "file" | "editor") =>
                updateField("contentType", v)
              }
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file" className="flex-1 cursor-pointer">
                  <div className="font-medium">Tải lên file</div>
                  <div className="text-xs text-muted-foreground">
                    Tải lên file PDF, Word, hoặc hình ảnh
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="editor" id="editor" />
                <Label htmlFor="editor" className="flex-1 cursor-pointer">
                  <div className="font-medium">Nhập văn bản</div>
                  <div className="text-xs text-muted-foreground">
                    Nhập nội dung trực tiếp vào ô văn bản
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* File Upload */}
          {formData.contentType === "file" && (
            <div>
              <Label htmlFor="contentFile">File hợp đồng</Label>
              <div className="mt-2">
                <label
                  htmlFor="contentFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click để tải lên</span>{" "}
                      hoặc kéo thả
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, PNG, JPG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="contentFile"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                  />
                </label>
                {formData.contentFile && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-slate-100 rounded">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm flex-1">
                      {formData.contentFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateField("contentFile", null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text Editor */}
          {formData.contentType === "editor" && (
            <div className="mt-2">
              <Label htmlFor="contentText">Nội dung hợp đồng</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <Editor
                  contentEditableClassname="h-[500px]"
                  initialText={formData.contentText}
                  onChange={(state) => {
                    // Update contentText when editor changes
                    state.read(() => {
                      // Internal state access if needed
                    });
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // --- Step 3: Commodity Information ---
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Thông tin hàng hóa</h3>
            <p className="text-sm text-muted-foreground">
              Thêm các hàng hóa vào hợp đồng
            </p>
          </div>
        </div>

        <Dialog
          open={isCommodityDialogOpen}
          onOpenChange={setIsCommodityDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setTempSelectedCommodities([]);
                setPopupType("all");
                setPopupSearch("");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Chọn hàng hoá
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 border-b">
              <DialogTitle>Chọn hàng hóa từ danh mục</DialogTitle>
            </DialogHeader>

            <div className="p-4 border-b bg-slate-50 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã hoặc tên hàng hoá..."
                  className="pl-10"
                  value={popupSearch}
                  onChange={(e) => setPopupSearch(e.target.value)}
                />
              </div>
              <Select value={popupType} onValueChange={setPopupType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {commodityTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getCommodityListBySearch(popupType, popupSearch).map(
                  (item) => {
                    const isSelectedInTemp = tempSelectedCommodities.some(
                      (c) => c.id === item.id,
                    );

                    const isAlreadyAdded =
                      pendingCommodityIds.includes(item.id.toString()) ||
                      formData.commodities.some(
                        (c) => c.commodityId === item.id.toString(),
                      );

                    return (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all border-2 ${
                          isAlreadyAdded
                            ? "opacity-50 cursor-not-allowed bg-slate-50 border-transparent"
                            : isSelectedInTemp
                              ? "border-primary bg-primary/5 shadow-sm scale-[0.98]"
                              : "hover:border-primary/50 border-gray-100"
                        }`}
                        onClick={() => {
                          if (!isAlreadyAdded)
                            handleToggleCommoditySelection(item);
                        }}
                      >
                        <CardContent className="p-4 relative">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelectedInTemp
                                  ? "bg-primary text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              <h5 className="font-bold text-sm truncate mb-0.5">
                                {item.name}
                              </h5>
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold text-slate-600">
                                  {item.code}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1 h-4"
                                >
                                  {
                                    commodityTypes.find(
                                      (t) => t.id === item.type,
                                    )?.name
                                  }
                                </Badge>
                              </div>
                              <div className="text-[10px] text-muted-foreground space-y-0.5">
                                {"category" in item && (
                                  <div>• {item.category}</div>
                                )}
                                {"group" in item && <div>• {item.group}</div>}
                                {"brand" in item && <div>• {item.brand}</div>}
                              </div>
                            </div>
                          </div>
                          {isSelectedInTemp && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                          )}
                          {isAlreadyAdded && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-slate-200 text-slate-600 border-transparent">
                                Đã chọn
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  },
                )}
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-slate-50">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm font-medium">
                  {tempSelectedCommodities.length > 0 && (
                    <span className="text-primary">
                      Đã chọn {tempSelectedCommodities.length} hàng hoá
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                  </DialogClose>
                  <Button
                    onClick={handleConfirmPopupSelection}
                    disabled={tempSelectedCommodities.length === 0}
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm flex items-center gap-2">
              Chờ định nghĩa ({pendingCommodityIds.length})
            </h4>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {pendingCommodityIds.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-xs text-muted-foreground italic">
                  Chưa có hàng hoá chờ định nghĩa
                </p>
              </div>
            ) : (
              pendingCommodityIds.map((id) => {
                const item = allCommodities.find((c) => c.id.toString() === id);
                if (!item) return null;

                const isCurrent = currentCommodity.commodityId === id;

                return (
                  <Card
                    key={id}
                    className={`transition-all cursor-pointer ${
                      isCurrent
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 transform"
                        : "hover:border-primary/50 scale-[0.98]"
                    }`}
                    onClick={() => {
                      setCurrentCommodity({
                        ...currentCommodity,
                        commodityId: id,
                        commodityType: item.type,
                      });
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <h5 className="font-bold text-sm truncate">
                            {item.name}
                          </h5>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {item.code}
                          </p>
                        </div>
                        {isCurrent ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingCommodityIds((prev) =>
                                prev.filter((pid) => pid !== id),
                              );
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Spec Form & Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Spec Form Section */}
          <div className="min-h-[300px]">
            {currentCommodity.commodityId ? (
              <Card className="border-primary/30 shadow-md">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileSignature className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold">Định nghĩa quy cách</h4>
                        <p className="text-xs text-muted-foreground">
                          {
                            allCommodities.find(
                              (c) =>
                                c.id.toString() ===
                                currentCommodity.commodityId,
                            )?.name
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentCommodity({
                          ...currentCommodity,
                          commodityId: "",
                        })
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Specification Type */}
                  <div>
                    <Label className="mb-3 block text-sm font-semibold">
                      HÌnh thức định nghĩa{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      className="grid grid-cols-2 gap-4"
                      value={currentCommodity.specType}
                      onValueChange={(v: "general" | "detailed") =>
                        setCurrentCommodity({
                          ...currentCommodity,
                          specType: v,
                        })
                      }
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer bg-white">
                        <RadioGroupItem value="general" id="general" />
                        <Label
                          htmlFor="general"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-bold text-sm">Tổng quát</div>
                          <div className="text-[11px] text-muted-foreground">
                            Chỉ chọn theo quy cách đóng gói mẫu
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-xl hover:border-primary/50 transition-all cursor-pointer bg-white">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label
                          htmlFor="detailed"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-bold text-sm">Chi tiết</div>
                          <div className="text-[11px] text-muted-foreground">
                            Nhập số lượng và đơn vị đo lường cụ thể
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border">
                    {currentCommodity.specType === "general" ? (
                      <div className="space-y-4">
                        <Label htmlFor="packagingSpec">
                          Chọn quy cách đóng gói{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={currentCommodity.packagingSpec}
                          onValueChange={(v) =>
                            setCurrentCommodity({
                              ...currentCommodity,
                              packagingSpec: v,
                            })
                          }
                        >
                          <SelectTrigger
                            id="packagingSpec"
                            className="bg-white"
                          >
                            <SelectValue placeholder="Chọn quy cách..." />
                          </SelectTrigger>
                          <SelectContent>
                            {packagingSpecs.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id}>
                                {spec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label htmlFor="quantity">
                            Số lượng <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="Nhập số lượng..."
                            className="bg-white"
                            value={currentCommodity.quantity}
                            onChange={(e) =>
                              setCurrentCommodity({
                                ...currentCommodity,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="unit">
                            Đơn vị <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={currentCommodity.unit}
                            onValueChange={(v) =>
                              setCurrentCommodity({
                                ...currentCommodity,
                                unit: v,
                              })
                            }
                          >
                            <SelectTrigger id="unit" className="bg-white">
                              <SelectValue placeholder="Chọn đơn vị..." />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setCurrentCommodity({
                          ...currentCommodity,
                          commodityId: "",
                        })
                      }
                    >
                      Bỏ qua
                    </Button>
                    <Button
                      className="px-8 shadow-md"
                      disabled={
                        currentCommodity.specType === "general"
                          ? !currentCommodity.packagingSpec
                          : !currentCommodity.quantity || !currentCommodity.unit
                      }
                      onClick={() => {
                        const baseItem = allCommodities.find(
                          (c) =>
                            c.id.toString() === currentCommodity.commodityId,
                        );
                        if (!baseItem) return;

                        const newItem: CommodityItem = {
                          id: Date.now().toString(),
                          commodityType: currentCommodity.commodityType,
                          commodityId: currentCommodity.commodityId,
                          commodityName: baseItem.name,
                          commodityCode: baseItem.code,
                          specType: currentCommodity.specType,
                          packagingSpec: currentCommodity.packagingSpec,
                          quantity: currentCommodity.quantity,
                          unit: currentCommodity.unit,
                        };

                        updateField("commodities", [
                          ...formData.commodities,
                          newItem,
                        ]);
                        setPendingCommodityIds((prev) =>
                          prev.filter(
                            (pid) => pid !== currentCommodity.commodityId,
                          ),
                        );
                        setCurrentCommodity({
                          commodityType: "",
                          commodityId: "",
                          specType: "general",
                          packagingSpec: "",
                          quantity: "",
                          unit: "",
                        });
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Xác nhận định nghĩa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-slate-50 opacity-60 px-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <FileSignature className="w-8 h-8 text-slate-300" />
                </div>
                <h5 className="font-bold text-slate-500 mb-1">
                  Chưa chọn hàng hoá để định nghĩa
                </h5>
                <p className="text-xs text-slate-400 max-w-[300px]">
                  Vui lòng chọn một hàng hoá từ danh sách bên trái để bắt đầu
                  thiết lập quy cách.
                </p>
              </div>
            )}
          </div>

          {/* Table Result Section */}
          {formData.commodities.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Hàng hoá trong hợp đồng
                  </h4>
                  <Badge variant="outline">
                    Tổng: {formData.commodities.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {formData.commodities.map((commodity, index) => (
                    <div
                      key={commodity.id}
                      className="p-4 border rounded-xl bg-white hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-xs font-bold text-muted-foreground w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-sm">
                            {commodity.commodityName}
                          </h5>
                          <div className="flex items-center gap-3 mt-1 underline-offset-4">
                            <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {commodity.commodityCode}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Quy cách:{" "}
                              <span className="font-medium text-slate-900">
                                {commodity.specType === "general"
                                  ? packagingSpecs.find(
                                      (p) => p.id === commodity.packagingSpec,
                                    )?.name
                                  : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 transition-all"
                        onClick={() => handleRemoveCommodity(commodity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // --- Step 4: Parties Information ---
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Thông tin các bên</h3>
          <p className="text-sm text-muted-foreground">
            Chọn thông tin bên A và bên B
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Party A */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Bên A
              </Badge>
              <span className="text-sm font-medium">
                Bên cung cấp / Bên cho thuê
              </span>
            </div>

            <div>
              <Label>
                Đơn vị sở hữu <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    className="pl-10"
                    value={searchPartyA}
                    onChange={(e) => setSearchPartyA(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {mockEnterprises
                    .filter(
                      (e) =>
                        e.code
                          .toLowerCase()
                          .includes(searchPartyA.toLowerCase()) ||
                        e.name
                          .toLowerCase()
                          .includes(searchPartyA.toLowerCase()),
                    )
                    .map((enterprise) => (
                      <Card
                        key={enterprise.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.partyAId === enterprise.id.toString()
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() =>
                          updateField("partyAId", enterprise.id.toString())
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-primary shrink-0" />
                                <h4 className="font-semibold text-sm truncate">
                                  {enterprise.name}
                                </h4>
                              </div>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="font-mono bg-slate-100 px-2 py-0.5 rounded inline-block">
                                  {enterprise.code}
                                </div>
                                <div>MST: {enterprise.taxCode}</div>
                                <div>👤 {enterprise.representative}</div>
                                <div>📞 {enterprise.phone}</div>
                              </div>
                            </div>
                            {formData.partyAId === enterprise.id.toString() && (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Party B */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Bên B
              </Badge>
              <span className="text-sm font-medium">Bên nhận / Bên thuê</span>
            </div>

            <div>
              <Label>
                Đơn vị sở hữu <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    className="pl-10"
                    value={searchPartyB}
                    onChange={(e) => setSearchPartyB(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {mockEnterprises
                    .filter(
                      (e) =>
                        e.code
                          .toLowerCase()
                          .includes(searchPartyB.toLowerCase()) ||
                        e.name
                          .toLowerCase()
                          .includes(searchPartyB.toLowerCase()),
                    )
                    .map((enterprise) => (
                      <Card
                        key={enterprise.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.partyBId === enterprise.id.toString()
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() =>
                          updateField("partyBId", enterprise.id.toString())
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className="w-4 h-4 text-primary shrink-0" />
                                <h4 className="font-semibold text-sm truncate">
                                  {enterprise.name}
                                </h4>
                              </div>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <div className="font-mono bg-slate-100 px-2 py-0.5 rounded inline-block">
                                  {enterprise.code}
                                </div>
                                <div>MST: {enterprise.taxCode}</div>
                                <div>👤 {enterprise.representative}</div>
                                <div>📞 {enterprise.phone}</div>
                              </div>
                            </div>
                            {formData.partyBId === enterprise.id.toString() && (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // --- Step 5: Confirmation ---
  const renderStep5 = () => {
    const selectedNature = contractTypes.find((t) => t.id === formData.nature);
    const selectedPartyA = getSelectedPartyA();
    const selectedPartyB = getSelectedPartyB();
    const selectedParentContract = getSelectedParentContract();
    const selectedCurrency = currencies.find((c) => c.id === formData.currency);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/10 p-3 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Xác nhận thông tin</h3>
            <p className="text-sm text-muted-foreground">
              Kiểm tra lại thông tin trước khi lưu
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-primary" />
                Thông tin cơ bản
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Mã hợp đồng:</span>
                  <div className="font-medium mt-1">{formData.code || "—"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày ký kết:</span>
                  <div className="font-medium mt-1">
                    {formData.signDate || "—"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Tên hợp đồng:</span>
                  <div className="font-medium mt-1">{formData.name || "—"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Tính chất hợp đồng:
                  </span>
                  <div className="font-medium mt-1">
                    {selectedNature?.name || "—"}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Giá trị hợp đồng:
                  </span>
                  <div className="font-medium mt-1">
                    {formData.value
                      ? `${Number(formData.value).toLocaleString()} ${selectedCurrency?.name || "VNĐ"}`
                      : "—"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Type & Content */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Loại và nội dung
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Loại hợp đồng:</span>
                  <div className="font-medium mt-1">
                    {formData.isAppendix ? "Phụ lục hợp đồng" : "Hợp đồng mới"}
                  </div>
                </div>
                {formData.isAppendix && selectedParentContract && (
                  <div>
                    <span className="text-muted-foreground">Hợp đồng gốc:</span>
                    <div className="font-medium mt-1">
                      {selectedParentContract.name} (
                      {selectedParentContract.code})
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Nội dung:</span>
                  <div className="font-medium mt-1">
                    {formData.contentType === "file"
                      ? formData.contentFile
                        ? `File: ${formData.contentFile.name}`
                        : "Chưa tải lên file"
                      : formData.contentText
                        ? "Đã nhập văn bản"
                        : "Chưa nhập văn bản"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commodity Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Danh sách hàng hóa ({formData.commodities.length})
              </h4>
              {formData.commodities.length > 0 ? (
                <div className="space-y-3">
                  {formData.commodities.map((commodity, index) => (
                    <div
                      key={commodity.id}
                      className="p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="font-semibold text-primary">
                          {index + 1}.
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">
                            {commodity.commodityName}
                          </div>
                          <div className="text-muted-foreground">
                            Mã: {commodity.commodityCode} • Loại:{" "}
                            {
                              commodityTypes.find(
                                (t) => t.id === commodity.commodityType,
                              )?.name
                            }
                          </div>
                          <div className="text-muted-foreground">
                            Quy cách:{" "}
                            {commodity.specType === "general"
                              ? packagingSpecs.find(
                                  (p) => p.id === commodity.packagingSpec,
                                )?.name
                              : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Chưa thêm hàng hóa nào
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parties Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Thông tin các bên
              </h4>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      Bên A
                    </Badge>
                  </div>
                  {selectedPartyA ? (
                    <div className="space-y-1">
                      <div className="font-medium">{selectedPartyA.name}</div>
                      <div className="text-muted-foreground">
                        Mã: {selectedPartyA.code}
                      </div>
                      <div className="text-muted-foreground">
                        MST: {selectedPartyA.taxCode}
                      </div>
                      <div className="text-muted-foreground">
                        Đại diện: {selectedPartyA.representative}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Chưa chọn</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Bên B
                    </Badge>
                  </div>
                  {selectedPartyB ? (
                    <div className="space-y-1">
                      <div className="font-medium">{selectedPartyB.name}</div>
                      <div className="text-muted-foreground">
                        Mã: {selectedPartyB.code}
                      </div>
                      <div className="text-muted-foreground">
                        MST: {selectedPartyB.taxCode}
                      </div>
                      <div className="text-muted-foreground">
                        Đại diện: {selectedPartyB.representative}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Chưa chọn</div>
                  )}
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
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Mã, tên, loại hợp đồng",
      content: renderStep1(),
    },
    {
      id: "content",
      title: "Loại và nội dung",
      description: "Hợp đồng mới/phụ lục",
      content: renderStep2(),
    },
    {
      id: "commodity",
      title: "Hàng hóa",
      description: "Danh sách hàng hóa",
      content: renderStep3(),
    },
    {
      id: "parties",
      title: "Các bên",
      description: "Bên A và Bên B",
      content: renderStep4(),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: renderStep5(),
    },
  ];

  const handleComplete = () => {
    console.log("Contract Data:", formData);
    setLocation("/contract");
  };

  return (
    <AdminLayout
      title="Tạo hợp đồng mới"
      description="Tạo hợp đồng mua bán, dịch vụ, thuê, hợp tác"
    >
      <div className="mb-4">
        <Button variant="ghost" onClick={() => setLocation("/contract")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <StepperForm
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => setLocation("/contract")}
        />
      </div>
    </AdminLayout>
  );
};

export default ContractCreatePage;
