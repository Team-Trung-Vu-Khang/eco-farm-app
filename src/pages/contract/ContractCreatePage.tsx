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
  Textarea,
  Button,
  RadioGroup,
  RadioGroupItem,
  Badge,
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
  type: string;
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

const ContractCreatePage = () => {
  const [, setLocation] = useLocation();
  const [searchParentContract, setSearchParentContract] = useState("");
  const [searchCommodity, setSearchCommodity] = useState("");
  const [searchPartyA, setSearchPartyA] = useState("");
  const [searchPartyB, setSearchPartyB] = useState("");

  const [formData, setFormData] = useState<ContractFormData>({
    code: "",
    name: "",
    type: "",
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

  const getCommodityList = () => {
    switch (currentCommodity.commodityType) {
      case "equipment":
        return mockEquipment;
      case "pesticide":
        return mockPesticides;
      case "fertilizer":
        return mockFertilizers;
      case "material":
        return mockMaterials;
      default:
        return [];
    }
  };

  const handleAddCommodity = () => {
    if (!currentCommodity.commodityType || !currentCommodity.commodityId)
      return;

    const commodityList = getCommodityList();
    const selectedItem = commodityList.find(
      (item) => item.id.toString() === currentCommodity.commodityId,
    );

    if (!selectedItem) return;

    const newCommodity: CommodityItem = {
      id: Date.now().toString(),
      commodityType: currentCommodity.commodityType,
      commodityId: currentCommodity.commodityId,
      commodityName: selectedItem.name,
      commodityCode: selectedItem.code,
      specType: currentCommodity.specType,
      packagingSpec: currentCommodity.packagingSpec,
      quantity: currentCommodity.quantity,
      unit: currentCommodity.unit,
    };

    updateField("commodities", [...formData.commodities, newCommodity]);

    // Reset current commodity
    setCurrentCommodity({
      commodityType: "",
      commodityId: "",
      specType: "general",
      packagingSpec: "",
      quantity: "",
      unit: "",
    });
    setSearchCommodity("");
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
            <Label htmlFor="type">
              Loại hợp đồng <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(v) => updateField("type", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hợp đồng" />
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
          <h3 className="text-lg font-semibold">Loại và nội dung hợp đồng</h3>
          <p className="text-sm text-muted-foreground">
            Chọn loại hợp đồng và tải lên nội dung
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Contract Type Selection */}
          <div>
            <Label className="mb-3 block">
              Loại hợp đồng <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.isAppendix ? "appendix" : "new"}
              onValueChange={(v) => updateField("isAppendix", v === "appendix")}
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex-1 cursor-pointer">
                  <div className="font-medium">Hợp đồng mới</div>
                  <div className="text-xs text-muted-foreground">
                    Tạo hợp đồng hoàn toàn mới
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="appendix" id="appendix" />
                <Label htmlFor="appendix" className="flex-1 cursor-pointer">
                  <div className="font-medium">Phụ lục hợp đồng</div>
                  <div className="text-xs text-muted-foreground">
                    Tạo phụ lục cho hợp đồng đã có
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Parent Contract Selection (if appendix) - Card Layout */}
          {formData.isAppendix && (
            <div>
              <Label htmlFor="parentContract">
                Hợp đồng gốc <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm hợp đồng..."
                    className="pl-10"
                    value={searchParentContract}
                    onChange={(e) => setSearchParentContract(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {mockContracts
                    .filter(
                      (c) =>
                        c.code
                          .toLowerCase()
                          .includes(searchParentContract.toLowerCase()) ||
                        c.name
                          .toLowerCase()
                          .includes(searchParentContract.toLowerCase()),
                    )
                    .map((contract) => (
                      <Card
                        key={contract.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.parentContractId === contract.id.toString()
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() =>
                          updateField(
                            "parentContractId",
                            contract.id.toString(),
                          )
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-primary shrink-0" />
                                <h4 className="font-semibold text-sm truncate">
                                  {contract.name}
                                </h4>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                                    {contract.code}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  📅 Ngày ký: {contract.signDate}
                                </div>
                                <div className="text-xs text-muted-foreground">
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
                        </CardContent>
                      </Card>
                    ))}
                </div>
                {mockContracts.filter(
                  (c) =>
                    c.code
                      .toLowerCase()
                      .includes(searchParentContract.toLowerCase()) ||
                    c.name
                      .toLowerCase()
                      .includes(searchParentContract.toLowerCase()),
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Không tìm thấy hợp đồng phù hợp</p>
                  </div>
                )}
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
            <div>
              <Label htmlFor="contentText">Nội dung hợp đồng</Label>
              <Textarea
                id="contentText"
                placeholder="Nhập nội dung hợp đồng..."
                className="min-h-[200px] mt-2"
                value={formData.contentText}
                onChange={(e) => updateField("contentText", e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // --- Step 3: Commodity Information ---
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
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
      {/* Add New Commodity Form */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h4 className="font-semibold">Thêm hàng hóa mới</h4>

          {/* Commodity Type Selection - Select Dropdown */}
          <div>
            <Label>
              Loại hàng hóa <span className="text-red-500">*</span>
            </Label>
            <Select
              value={currentCommodity.commodityType}
              onValueChange={(v) => {
                setCurrentCommodity({
                  ...currentCommodity,
                  commodityType: v,
                  commodityId: "",
                });
                setSearchCommodity("");
              }}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Chọn loại hàng hóa" />
              </SelectTrigger>
              <SelectContent>
                {commodityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Commodity Selection */}
          {currentCommodity.commodityType && (
            <div>
              <Label>
                Chọn hàng hóa <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm hàng hóa..."
                    className="pl-10"
                    value={searchCommodity}
                    onChange={(e) => setSearchCommodity(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {getCommodityList()
                    .filter(
                      (item) =>
                        item.code
                          .toLowerCase()
                          .includes(searchCommodity.toLowerCase()) ||
                        item.name
                          .toLowerCase()
                          .includes(searchCommodity.toLowerCase()),
                    )
                    .map((item) => (
                      <Card
                        key={item.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          currentCommodity.commodityId === item.id.toString()
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() =>
                          setCurrentCommodity({
                            ...currentCommodity,
                            commodityId: item.id.toString(),
                          })
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-primary shrink-0" />
                                <h4 className="font-semibold text-sm truncate">
                                  {item.name}
                                </h4>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                                    {item.code}
                                  </span>
                                </div>
                                {"category" in item && (
                                  <div className="text-xs text-muted-foreground">
                                    📦 {item.category}
                                  </div>
                                )}
                                {"group" in item && (
                                  <div className="text-xs text-muted-foreground">
                                    🏷️ {item.group}
                                  </div>
                                )}
                                {"brand" in item && (
                                  <div className="text-xs text-muted-foreground">
                                    🏭 {item.brand}
                                  </div>
                                )}
                                {"type" in item && (
                                  <div className="text-xs text-muted-foreground">
                                    📋 {item.type}
                                  </div>
                                )}
                              </div>
                            </div>
                            {currentCommodity.commodityId ===
                              item.id.toString() && (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                {getCommodityList().filter(
                  (item) =>
                    item.code
                      .toLowerCase()
                      .includes(searchCommodity.toLowerCase()) ||
                    item.name
                      .toLowerCase()
                      .includes(searchCommodity.toLowerCase()),
                ).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Không tìm thấy hàng hóa phù hợp</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specification Type */}
          {currentCommodity.commodityId && (
            <div>
              <Label className="mb-3 block">
                Quy cách <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={currentCommodity.specType}
                onValueChange={(v: "general" | "detailed") =>
                  setCurrentCommodity({ ...currentCommodity, specType: v })
                }
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general" className="flex-1 cursor-pointer">
                    <div className="font-medium">Tổng quát</div>
                    <div className="text-xs text-muted-foreground">
                      Chỉ chọn quy cách đóng gói
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed" className="flex-1 cursor-pointer">
                    <div className="font-medium">Chi tiết</div>
                    <div className="text-xs text-muted-foreground">
                      Nhập số lượng và đơn vị cụ thể
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* General Specification */}
          {currentCommodity.specType === "general" &&
            currentCommodity.commodityId && (
              <div>
                <Label htmlFor="packagingSpec">
                  Quy cách đóng gói <span className="text-red-500">*</span>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quy cách đóng gói" />
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
            )}

          {/* Detailed Specification */}
          {currentCommodity.specType === "detailed" &&
            currentCommodity.commodityId && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">
                    Số lượng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="VD: 100"
                    value={currentCommodity.quantity}
                    onChange={(e) =>
                      setCurrentCommodity({
                        ...currentCommodity,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="unit">
                    Đơn vị <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={currentCommodity.unit}
                    onValueChange={(v) =>
                      setCurrentCommodity({ ...currentCommodity, unit: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đơn vị" />
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

          {/* Add Button */}
          {currentCommodity.commodityId && (
            <Button onClick={handleAddCommodity} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Thêm hàng hóa vào danh sách
            </Button>
          )}
        </CardContent>
      </Card>
      {/* Added Commodities List */}
      {formData.commodities.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Danh sách hàng hóa đã thêm</h4>
            <div className="space-y-3">
              {formData.commodities.map((commodity) => (
                <Card key={commodity.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-primary" />
                          <h5 className="font-semibold">
                            {commodity.commodityName}
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            {
                              commodityTypes.find(
                                (t) => t.id === commodity.commodityType,
                              )?.name
                            }
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            Mã:{" "}
                            <span className="font-mono">
                              {commodity.commodityCode}
                            </span>
                          </div>
                          <div>
                            Quy cách:{" "}
                            {commodity.specType === "general"
                              ? packagingSpecs.find(
                                  (p) => p.id === commodity.packagingSpec,
                                )?.name
                              : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCommodity(commodity.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
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
                Chọn doanh nghiệp/nông hộ{" "}
                <span className="text-red-500">*</span>
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
                Chọn doanh nghiệp/nông hộ{" "}
                <span className="text-red-500">*</span>
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
    const selectedType = contractTypes.find((t) => t.id === formData.type);
    const selectedPartyA = getSelectedPartyA();
    const selectedPartyB = getSelectedPartyB();
    const selectedParentContract = getSelectedParentContract();

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
                  <span className="text-muted-foreground">Loại hợp đồng:</span>
                  <div className="font-medium mt-1">
                    {selectedType?.name || "—"}
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
                  <span className="text-muted-foreground">Loại:</span>
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

      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/contract")}
      />
    </AdminLayout>
  );
};

export default ContractCreatePage;
