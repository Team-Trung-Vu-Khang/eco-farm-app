import {
  Badge,
  Button,
  Input,
  Label,
  RemoteAutoCompleteSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  FlaskConical,
  Image as ImageIcon,
  Plus,
  ShieldAlert,
  Tags,
  Upload,
  X,
} from "lucide-react";
import { useMasterData } from "@/features/master-data";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";
import { MOCK_MEDICINE_DATA } from "../../shared-medicine-group/data/mocks";
import { commonHashtags } from "../data/constants";
import type { PesticideDomain, PesticideFormData } from "../types";

type MedicineGroupItem = {
  id?: string | number;
  code?: string;
  name: string;
  description?: string | null;
};

interface PesticideBasicInfoStepProps {
  domain?: PesticideDomain;
  formData: PesticideFormData;
  paramHashtag: string;
  onParamHashtagChange: (value: string) => void;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
  onAddHashtag: () => void;
  onRemoveHashtag: (tag: string) => void;
}

export default function PesticideBasicInfoStep({
  domain,
  formData,
  paramHashtag,
  onParamHashtagChange,
  onFormFieldChange,
  onAddHashtag,
  onRemoveHashtag,
}: PesticideBasicInfoStepProps) {
  const isEdit = window.location.pathname.includes("/edit");

  const isCultivation = domain === "cultivation" || !domain;
  const isAnimal = domain === "animal";
  const isAquaculture = domain === "aquaculture";
  const [groupSearch, setGroupSearch] = useState("");
  const debouncedGroupSearch = useDebounce(groupSearch, 300);

  const groupDomainCode = isCultivation
    ? "CROP"
    : isAnimal
      ? "LIVESTOCK"
      : "AQUACULTURE";
  const groupClassification = isCultivation ? "target_group" : "usage";

  const { items: loadedPesticideOrigins } = useMasterData("medicine-groups", {
    params: { domainCode: "CROP", classification: "origin", size: 100 },
    enabled: isCultivation,
  });
  const { items: loadedPesticideToxicityClasses } = useMasterData(
    "medicine-groups",
    {
      params: { domainCode: "CROP", classification: "toxicity", size: 100 },
      enabled: isCultivation,
    },
  );
  const { items: loadedPesticideModesOfAction } = useMasterData(
    "medicine-groups",
    {
      params: {
        domainCode: "CROP",
        classification: "mode_of_action",
        size: 100,
      },
      enabled: isCultivation,
    },
  );
  const { items: loadedPesticideFormulations } = useMasterData(
    "medicine-groups",
    {
      params: { domainCode: "CROP", classification: "dosage_form", size: 100 },
      enabled: isCultivation,
    },
  );

  const { items: loadedLivestockAdministrationRoutes } = useMasterData(
    "medicine-groups",
    {
      params: {
        domainCode: "LIVESTOCK",
        classification: "usage_method",
        size: 100,
      },
      enabled: isAnimal,
    },
  );
  const { items: loadedLivestockControlLevels } = useMasterData(
    "medicine-groups",
    {
      params: {
        domainCode: "LIVESTOCK",
        classification: "control_level",
        size: 100,
      },
      enabled: isAnimal,
    },
  );

  const { items: loadedAquacultureControlResidues } = useMasterData(
    "medicine-groups",
    {
      params: {
        domainCode: "AQUACULTURE",
        classification: "control_residue_level",
        size: 100,
      },
      enabled: isAquaculture,
    },
  );
  const { items: remoteGroupItems, loading: isLoadingGroupItems } =
    useMasterData("medicine-groups", {
      params: {
        domainCode: groupDomainCode,
        classification: groupClassification,
        keyword: debouncedGroupSearch.trim() || undefined,
        status: "active",
        page: 0,
        size: 20,
      },
    });

  const getItems = (loaded: MedicineGroupItem[] | undefined, catalog: string) => {
    if (loaded && loaded.length > 0) {
      return loaded;
    }
    return MOCK_MEDICINE_DATA[catalog] || [];
  };

  const pesticideOrigins = getItems(
    loadedPesticideOrigins,
    "pesticide-origins",
  );
  const pesticideToxicityClasses = getItems(
    loadedPesticideToxicityClasses,
    "pesticide-toxicity-classes",
  );
  const pesticideModesOfAction = getItems(
    loadedPesticideModesOfAction,
    "pesticide-modes-of-action",
  );
  const pesticideFormulations = getItems(
    loadedPesticideFormulations,
    "pesticide-formulations",
  );

  const livestockAdministrationRoutes = getItems(
    loadedLivestockAdministrationRoutes,
    "livestock-medicine-administration-routes",
  );
  const livestockControlLevels = getItems(
    loadedLivestockControlLevels,
    "livestock-medicine-control-levels",
  );

  const aquacultureControlResidues = getItems(
    loadedAquacultureControlResidues,
    "aquaculture-medicine-control-residues",
  );
  const groupOptions = remoteGroupItems.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-6">
        {/* Card: Thông tin chung */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Thông tin định danh
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Mã sản phẩm / Mã SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                disabled={isEdit}
                clearable={!isEdit}
                value={formData.code}
                placeholder="VD: BVTV001"
                onChange={(e) => onFormFieldChange("code", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Rất quan trọng để truy xuất nguồn gốc
              </p>
            </div>
            <div className="space-y-2">
              <Label>
                Tên thương mại <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormFieldChange("name", e.target.value)}
                placeholder="VD: Regent 800WG, Baytril 10%"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số đăng ký lưu hành</Label>
              <Input
                value={formData.registrationNumber}
                onChange={(e) =>
                  onFormFieldChange("registrationNumber", e.target.value)
                }
                placeholder="VD: BVTV-2024-001"
              />
              <p className="text-xs text-muted-foreground">
                Số đăng ký theo danh mục Bộ NN&PTNT
              </p>
            </div>
            <div className="space-y-2">
              <Label>Hàm lượng / Nồng độ</Label>
              <Input
                value={formData.concentration}
                onChange={(e) =>
                  onFormFieldChange("concentration", e.target.value)
                }
                placeholder="VD: 25%, 500mg/ml, 10g/L"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              {isCultivation ? "Công dụng thuốc" : "Công dụng"}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <RemoteAutoCompleteSelect
              value={formData.group}
              options={groupOptions}
              onChange={(value) => onFormFieldChange("group", value)}
              onSearch={setGroupSearch}
              placeholder="Chọn loại thuốc từ danh mục..."
              searchPlaceholder="Tìm công dụng thuốc..."
              emptyText="Không tìm thấy công dụng thuốc"
              loading={isLoadingGroupItems}
            />
          </div>

          <div className="space-y-2">
            <Label>Tên hoạt chất</Label>
            <Textarea
              value={formData.activeIngredient}
              onChange={(e) =>
                onFormFieldChange("activeIngredient", e.target.value)
              }
              placeholder="VD: Fipronil 800g/kg, Enrofloxacin 10%"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Tên gốc khoa học của hoạt chất
            </p>
          </div>
        </div>

        {/* Card: Phân loại kỹ thuật */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Phân loại kỹ thuật
          </h3>

          {isCultivation && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dạng bào chế */}
                <div className="space-y-2">
                  <Label>Dạng bào chế</Label>
                  <Select
                    value={formData.form}
                    onValueChange={(v) => onFormFieldChange("form", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn dạng bào chế..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pesticideFormulations.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Nguồn gốc */}
                <div className="space-y-2">
                  <Label>Nguồn gốc</Label>
                  <Select
                    value={formData.origin}
                    onValueChange={(v) => onFormFieldChange("origin", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn nguồn gốc..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pesticideOrigins.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cơ chế tác động */}
                <div className="space-y-2">
                  <Label>Cơ chế tác động (Cách xâm nhập)</Label>
                  <Select
                    value={formData.actionType}
                    onValueChange={(v) => onFormFieldChange("actionType", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn cơ chế tác động..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pesticideModesOfAction.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Độc tính WHO */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Nhóm độc / Mức độ độc hại (WHO)
                  </Label>
                  <Select
                    value={formData.toxicityLevel}
                    onValueChange={(v) => onFormFieldChange("toxicityLevel", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn nhóm độc WHO..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pesticideToxicityClasses.map((item) => {
                        const val = item.name.split(" - ")[0];
                        return (
                          <SelectItem key={item.id || item.code} value={val}>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nhóm MoA */}
              <div className="space-y-2">
                <Label>Nhóm cơ chế tác động (MoA)</Label>
                <Input
                  value={formData.moaGroup}
                  onChange={(e) =>
                    onFormFieldChange("moaGroup", e.target.value)
                  }
                  placeholder="VD: IRAC Nhóm 4A, FRAC Nhóm 3, WHO..."
                />
                <p className="text-xs text-muted-foreground">
                  Theo IRAC / FRAC / WHO (nếu có)
                </p>
              </div>
            </>
          )}

          {isAnimal && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phân loại sử dụng / Đường dùng */}
                <div className="space-y-2">
                  <Label>Phân loại sử dụng (Đường dùng)</Label>
                  <Select
                    value={formData.actionType}
                    onValueChange={(v) => onFormFieldChange("actionType", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn phân loại sử dụng..." />
                    </SelectTrigger>
                    <SelectContent>
                      {livestockAdministrationRoutes.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mức độ kiểm soát */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Mức độ kiểm soát
                  </Label>
                  <Select
                    value={formData.toxicityLevel}
                    onValueChange={(v) => onFormFieldChange("toxicityLevel", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn mức độ kiểm soát..." />
                    </SelectTrigger>
                    <SelectContent>
                      {livestockControlLevels.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dạng bào chế */}
              <div className="space-y-2">
                <Label>Dạng bào chế (nếu có)</Label>
                <Input
                  value={formData.form}
                  onChange={(e) => onFormFieldChange("form", e.target.value)}
                  placeholder="VD: Dung dịch tiêm, Bột hòa tan,..."
                />
              </div>
            </>
          )}

          {isAquaculture && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mức độ kiểm soát & dư lượng */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    Mức độ kiểm soát & dư lượng
                  </Label>
                  <Select
                    value={formData.toxicityLevel}
                    onValueChange={(v) => onFormFieldChange("toxicityLevel", v)}
                  >
                    <SelectTrigger className="text-left h-auto py-2">
                      <SelectValue placeholder="Chọn mức độ kiểm soát..." />
                    </SelectTrigger>
                    <SelectContent>
                      {aquacultureControlResidues.map((item) => (
                        <SelectItem
                          key={item.id || item.code}
                          value={item.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cách dùng / Xâm nhập */}
                <div className="space-y-2">
                  <Label>Cách dùng / Xâm nhập</Label>
                  <Input
                    value={formData.actionType}
                    onChange={(e) =>
                      onFormFieldChange("actionType", e.target.value)
                    }
                    placeholder="VD: Trộn thức ăn, Rắc xuống ao,..."
                  />
                </div>
              </div>

              {/* Dạng bào chế */}
              <div className="space-y-2">
                <Label>Dạng bào chế (nếu có)</Label>
                <Input
                  value={formData.form}
                  onChange={(e) => onFormFieldChange("form", e.target.value)}
                  placeholder="VD: Dạng lỏng, Dạng hạt,..."
                />
              </div>
            </>
          )}
        </div>

        {/* Card: Hashtags */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Tags className="w-5 h-5 text-primary" />
            Hashtags & Ghi chú
          </h3>
          <div className="space-y-3">
            <Label>Thêm Hashtag</Label>
            <div className="flex gap-2">
              <Input
                value={paramHashtag}
                onChange={(e) => onParamHashtagChange(e.target.value)}
                placeholder="Nhập hashtag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddHashtag();
                  }
                }}
              />
              <Button type="button" onClick={onAddHashtag} variant="outline">
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
                      ? onRemoveHashtag(tag)
                      : onFormFieldChange("hashtags", [
                          ...formData.hashtags,
                          tag,
                        ])
                  }
                >
                  #{tag}
                </Badge>
              ))}
              {formData.hashtags
                .filter((tag) => !commonHashtags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => onRemoveHashtag(tag)}
                    />
                  </Badge>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ghi chú thêm</Label>
            <Textarea
              value={formData.note}
              onChange={(e) => onFormFieldChange("note", e.target.value)}
              placeholder="Ghi chú nội bộ..."
            />
          </div>
        </div>
      </div>

      {/* Right column: Image upload */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Hình ảnh bao bì
          </h3>
          {formData.imageUrl ? (
            <div className="relative group w-full max-w-[240px] mx-auto">
              <img
                src={formData.imageUrl}
                alt="product"
                className="w-full rounded-xl border object-cover aspect-square"
              />
              <button
                type="button"
                onClick={() => {
                  onFormFieldChange("imageUrl", "");
                  onFormFieldChange("imageFile", null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer min-h-[200px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-900">Tải lên ảnh sản phẩm</p>
              <p className="text-sm text-muted-foreground mt-1">
                Kéo thả hoặc click để chọn file
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG tối đa 5MB
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = URL.createObjectURL(file);
                  onFormFieldChange("imageUrl", url);
                  onFormFieldChange("imageFile", file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
