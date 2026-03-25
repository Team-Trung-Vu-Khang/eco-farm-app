import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, CloudUpload, Phone, Search, User } from "lucide-react";
import { originSelectOptions } from "../utils/utils";
import type { CreateVarietyForm } from "../types/types";
import type { Supplier } from "../data/mocks";

interface SeedDetailsStepProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  filteredSuppliers: Supplier[];
  formData: CreateVarietyForm;
  illustrationPreview: string;
  onPickIllustration: (file?: File | null) => void;
  selectedSupplierId: string;
  setFormData: React.Dispatch<React.SetStateAction<CreateVarietyForm>>;
  setSelectedSupplierId: (value: string) => void;
  setSupplierSearchQuery: (value: string) => void;
  showExpiryDate?: boolean;
  showYieldField?: boolean;
  showSupplierMeta?: boolean;
  supplierSearchQuery: string;
}

export function SeedDetailsStep({
  fileInputRef,
  filteredSuppliers,
  formData,
  illustrationPreview,
  onPickIllustration,
  selectedSupplierId,
  setFormData,
  setSelectedSupplierId,
  setSupplierSearchQuery,
  showExpiryDate = false,
  showYieldField = true,
  showSupplierMeta = false,
  supplierSearchQuery,
}: SeedDetailsStepProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Label className="font-bold text-slate-700">
                  Nguồn gốc & Nhà cung cấp
                </Label>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-600">
                  Nhà cung cấp
                </Label>
                <div className="group relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-500" />
                  <Input
                    placeholder="Tìm kiếm nhà cung cấp..."
                    value={supplierSearchQuery}
                    onChange={(event) =>
                      setSupplierSearchQuery(event.target.value)
                    }
                    className="h-10 bg-slate-50 pl-10 transition-all focus:bg-white focus:ring-green-500"
                  />
                </div>

                <div className="custom-scrollbar grid max-h-[280px] grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-2 pr-1">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      onClick={() => {
                        setSelectedSupplierId(supplier.id);
                        setFormData((currentForm) => ({
                          ...currentForm,
                          supplier: supplier.name,
                        }));
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                        selectedSupplierId === supplier.id
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm transition-colors",
                          selectedSupplierId === supplier.id
                            ? "bg-blue-500 text-white"
                            : "border border-slate-200 bg-white text-slate-500",
                        )}
                      >
                        {supplier.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between">
                          <p
                            className={cn(
                              "truncate text-sm font-bold",
                              selectedSupplierId === supplier.id
                                ? "text-blue-700"
                                : "text-slate-700",
                            )}
                          >
                            {supplier.name}
                          </p>
                          {selectedSupplierId === supplier.id && (
                            <CheckCircle2 className="ml-2 h-4 w-4 shrink-0 text-blue-600" />
                          )}
                        </div>
                        {showSupplierMeta ? (
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5">
                              <User className="h-3 w-3 opacity-70" />
                              {supplier.representative}
                            </span>
                            <span className="flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5">
                              <Phone className="h-3 w-3 opacity-70" />
                              {supplier.phone}
                            </span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500">
                            {supplier.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-sm font-medium text-slate-600">
                  Xuất xứ
                </Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData((currentForm) => ({
                      ...currentForm,
                      origin: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-10 border-slate-200 bg-white focus:ring-green-500">
                    <SelectValue placeholder="Chọn quốc gia" />
                  </SelectTrigger>
                  <SelectContent>
                    {originSelectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Label className="font-bold text-slate-700">
                  Thông số kỹ thuật
                </Label>
              </div>

              {showExpiryDate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">
                    Hạn sử dụng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={
                      formData.expiryDate
                        ? formData.expiryDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(event) =>
                      setFormData((currentForm) => ({
                        ...currentForm,
                        expiryDate: event.target.valueAsDate || undefined,
                      }))
                    }
                    className="h-10 border-slate-200 focus:ring-green-500"
                  />
                </div>
              )}

              {showYieldField && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">
                    Năng suất (dự kiến)
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="VD: 25-30"
                      className="pr-16 border-slate-200 focus:ring-green-500"
                      value={formData.yield}
                      onChange={(event) =>
                        setFormData((currentForm) => ({
                          ...currentForm,
                          yield: event.target.value,
                        }))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-50 px-2 py-1 text-xs font-bold text-slate-400">
                      tấn/ha
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">
                    Độ sạch (%)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="99"
                      className="pr-8 border-slate-200 focus:ring-green-500"
                      value={formData.uniformity}
                      onChange={(event) =>
                        setFormData((currentForm) => ({
                          ...currentForm,
                          uniformity: parseInt(event.target.value) || 0,
                        }))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">
                    Nảy mầm (%)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="85"
                      className="pr-8 border-slate-200 focus:ring-green-500"
                      value={formData.germinationRate}
                      onChange={(event) =>
                        setFormData((currentForm) => ({
                          ...currentForm,
                          germinationRate: parseInt(event.target.value) || 0,
                        }))
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Hình ảnh bao bì{showSupplierMeta ? " / Minh họa" : ""}
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-white transition-all hover:bg-slate-50",
                showSupplierMeta ? "h-48 shadow-sm" : "h-40",
                illustrationPreview
                  ? "border-green-500/30"
                  : "border-slate-200 hover:border-green-500/50",
              )}
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(event) =>
                  onPickIllustration(event.target.files?.[0])
                }
              />
              {illustrationPreview ? (
                <div className="relative h-full w-full">
                  <img
                    src={illustrationPreview}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all backdrop-blur-[1px] group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className={cn(!showSupplierMeta && "pointer-events-none")}
                    >
                      <CloudUpload className="mr-2 h-3.5 w-3.5" />
                      Thay đổi ảnh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-transform group-hover:scale-110 group-hover:bg-green-100 group-hover:text-green-600">
                    <CloudUpload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-500 group-hover:text-green-700">
                    Click để tải ảnh lên
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
