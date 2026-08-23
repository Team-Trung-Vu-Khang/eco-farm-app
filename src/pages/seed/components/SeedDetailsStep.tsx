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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, CloudUpload, Phone, Search, User } from "lucide-react";
import { originSelectOptions } from "../utils/utils";
import { useFormContext, useWatch } from "react-hook-form";
import type { CreateSeedFormValues } from "../schemas/createSeedSchema";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { MAX_IMAGE_SIZE } from "../utils/utils";

interface SeedDetailsStepProps {
  showExpiryDate?: boolean;
  showYieldField?: boolean;
  showSupplierMeta?: boolean;
}

export function SeedDetailsStep({
  showExpiryDate = false,
  showYieldField = true,
  showSupplierMeta = false,
}: SeedDetailsStepProps) {
  const { control, setValue, getValues } =
    useFormContext<CreateSeedFormValues>();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  const { items: organizations, loading: isLoadingSuppliers } =
    useOrganizations(
      { keyword: searchQuery, onlyOwner: true },
      parsedWorkspaceId ?? "missing",
      { enabled: parsedWorkspaceId !== undefined },
    );

  const mappedSuppliers = useMemo(() => {
    return organizations.map((org) => ({
      id: String(org.id),
      name: org.name,
      representative: org.representative || "N/A",
      phone: org.contacts?.[0]?.phone || "N/A",
      imageUrl: org.imageUrl,
    }));
  }, [organizations]);

  const watchedIllustration = useWatch({ control, name: "illustration" });
  const watchedBaseIllustration = useWatch({
    control,
    name: "baseIllustrationUrl",
  });

  const illustrationPreview = useMemo(() => {
    if (watchedIllustration) {
      return URL.createObjectURL(watchedIllustration as File);
    }
    return watchedBaseIllustration || "";
  }, [watchedIllustration, watchedBaseIllustration]);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Lỗi", description: "Vui lòng chọn file ảnh." });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ title: "Lỗi", description: "Ảnh quá lớn (tối đa 5MB)." });
      return;
    }
    setValue("illustration", file, { shouldValidate: true });
  };

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
                  <Search className="absolute z-10 left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-500" />
                  <Input
                    placeholder="Tìm kiếm nhà cung cấp..."
                    value={localSearchQuery}
                    onChange={(event) =>
                      setLocalSearchQuery(event.target.value)
                    }
                    className="h-10 bg-slate-50 pl-10 transition-all focus:bg-white focus:ring-green-500"
                  />
                  {isLoadingSuppliers && (
                    <div className="absolute z-10 right-8 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-green-500" />
                    </div>
                  )}
                </div>

                <FormField
                  control={control}
                  name="supplierOrganizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="custom-scrollbar grid max-h-[280px] grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-2 pr-1">
                          {mappedSuppliers.length > 0 ? (
                            mappedSuppliers.map((supplier) => (
                              <div
                                key={supplier.id}
                                onClick={() => {
                                  field.onChange(supplier.id);
                                  setValue("supplierName", supplier.name);
                                }}
                                className={cn(
                                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all",
                                  field.value === supplier.id
                                    ? "border-blue-500 bg-blue-50/50 shadow-sm"
                                    : "border-transparent hover:border-slate-200 hover:bg-white hover:shadow-sm",
                                )}
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold shadow-sm transition-colors overflow-hidden">
                                  {supplier.imageUrl ? (
                                    <img
                                      src={supplier.imageUrl}
                                      alt={supplier.name}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    supplier.name.charAt(0)
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between">
                                    <p
                                      className={cn(
                                        "truncate text-sm font-bold",
                                        field.value === supplier.id
                                          ? "text-blue-700"
                                          : "text-slate-700",
                                      )}
                                    >
                                      {supplier.name}
                                    </p>
                                    {field.value === supplier.id && (
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
                            ))
                          ) : (
                            <div className="flex h-32 flex-col items-center justify-center text-center">
                              <p className="text-sm font-medium text-slate-400">
                                Không tìm thấy nhà cung cấp nào
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="origin"
                render={({ field }) => (
                  <FormItem className="space-y-2 pt-2">
                    <FormLabel className="text-sm font-medium text-slate-600">
                      Xuất xứ
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                <FormField
                  control={control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-600">
                        Hạn sử dụng <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? new Date(
                                  field.value.getTime() -
                                    field.value.getTimezoneOffset() * 60000,
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(event) =>
                            field.onChange(
                              event.target.valueAsDate || undefined,
                            )
                          }
                          className="h-10 border-slate-200 focus:ring-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {showYieldField && (
                <FormField
                  control={control}
                  name="yield"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-600">
                        Năng suất (dự kiến)
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="VD: 25-30"
                            className="pr-16 border-slate-200 focus:ring-green-500"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(event.target.value)
                            }
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-50 px-2 py-1 text-xs font-bold text-slate-400">
                          tấn/ha
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="uniformity"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-600">
                        Độ sạch (%)
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            placeholder="99"
                            className="pr-8 border-slate-200 focus:ring-green-500"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(parseInt(event.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          %
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="germinationRate"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-600">
                        Nảy mầm (%)
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            max={100}
                            min={0}
                            placeholder="85"
                            className="pr-8 border-slate-200 focus:ring-green-500"
                            value={field.value || ""}
                            onChange={(event) =>
                              field.onChange(parseInt(event.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          %
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <FormField
            control={control}
            name="illustration"
            render={() => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-semibold text-slate-700">
                  Hình ảnh bao bì{showSupplierMeta ? " / Minh họa" : ""}
                </FormLabel>
                <FormControl>
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
                            type="button"
                            variant="secondary"
                            size="sm"
                            className={cn(
                              !showSupplierMeta && "pointer-events-none",
                            )}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
