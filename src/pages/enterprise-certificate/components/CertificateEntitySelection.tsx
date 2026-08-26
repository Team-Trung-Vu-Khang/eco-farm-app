import type { FarmRegionResponse } from "@/features/farm/types/farm.type";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, MapPin, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";
import { CertificateRegionScopeMap } from "./CertificateRegionScopeMap";

const ENTITY_TYPE_LABELS = {
  workspace: "Cấp phép theo đơn vị - tổ chức",
  region: "Cấp phép theo vùng canh tác cụ thể",
} as const;

interface EntitySelectionProps {
  regions?: FarmRegionResponse[];
  onRegionSearchChange?: (keyword: string) => void;
  onLoadMoreRegions?: () => void;
  hasMoreRegions?: boolean;
  isLoadingMoreRegions?: boolean;
}

interface SelectorItem {
  id: string;
  code: string;
  name: string;
  subtitle?: string;
  details?: string;
}

interface SearchSelectorProps {
  label: string;
  required?: boolean;
  placeholder: string;
  dialogTitle: string;
  searchPlaceholder: string;
  selectedIds: string[];
  items: SelectorItem[];
  emptyStateText: string;
  onConfirm: (ids: string[]) => void;
  disabled?: boolean;
  onSearchChange?: (keyword: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

function SearchSelector({
  label,
  required = false,
  placeholder,
  dialogTitle,
  searchPlaceholder,
  selectedIds,
  items,
  emptyStateText,
  onConfirm,
  disabled = false,
  onSearchChange,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
}: SearchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState(selectedIds);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const selectedItems = items.filter((item) => selectedIds.includes(item.id));
  const primarySelectedItem =
    selectedItems[0] ?? items.find((item) => item.id === selectedIds[0]);

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.subtitle?.toLowerCase().includes(keyword) ||
        item.details?.toLowerCase().includes(keyword),
    );
  }, [items, searchTerm]);

  const isValidTempSelection = tempSelectedIds.length > 0;

  const handleOpen = () => {
    if (disabled) return;
    setTempSelectedIds(selectedIds);
    setSearchTerm("");
    onSearchChange?.("");
    setIsOpen(true);
  };

  const handleCancel = () => {
    setTempSelectedIds(selectedIds);
    setSearchTerm("");
    onSearchChange?.("");
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (!isValidTempSelection) return;
    onConfirm(tempSelectedIds);
    setIsOpen(false);
  };

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore || !hasMore || !onLoadMore) return;
      observerRef.current?.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, isLoadingMore, onLoadMore],
  );

  return (
    <>
      <div className="space-y-2">
        <Label required={required}>{label}</Label>
        <div
          className={[
            "group flex min-h-16 cursor-pointer items-center rounded-2xl border p-4 transition-all",
            primarySelectedItem
              ? "border-slate-200 bg-white/90 shadow-sm"
              : "border-dashed border-slate-300 bg-white/70",
            disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:border-primary/40",
          ].join(" ")}
          onClick={handleOpen}
        >
          {primarySelectedItem ? (
            <div className="flex w-full items-start gap-3">
              <Avatar className="h-12 w-12 shrink-0 border border-white shadow-sm">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                  <MapPin className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full px-2.5 py-0 text-[10px] font-mono"
                  >
                    {primarySelectedItem.code}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="h-5 rounded-full px-2.5 py-0 text-[10px]"
                  >
                    Vùng canh tác
                  </Badge>
                  {selectedItems.length > 1 ? (
                    <Badge
                      variant="secondary"
                      className="h-5 rounded-full px-2.5 py-0 text-[10px]"
                    >
                      +{selectedItems.length - 1}
                    </Badge>
                  ) : null}
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-semibold leading-tight text-slate-900">
                    {primarySelectedItem.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {primarySelectedItem.subtitle ||
                      primarySelectedItem.details ||
                      "Chưa có thông tin bổ sung"}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2 flex-nowrap">
                    <div className="min-w-0 truncate text-[11px] font-semibold text-slate-500">
                      Vùng đã chọn
                    </div>
                  </div>
                  <div className="max-h-24 overflow-y-auto pr-1">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItems.map((item) => (
                        <Badge
                          key={item.id}
                          variant={
                            item.id === primarySelectedItem.id
                              ? "secondary"
                              : "outline"
                          }
                          className="rounded-full px-2 py-0 text-[10px]"
                          title={item.name}
                        >
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                <span>Nhấn để thay đổi</span>
                <Search className="h-4 w-4 shrink-0" />
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center gap-3 text-muted-foreground">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-5 w-5 opacity-60" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700">
                  {placeholder}
                </div>
                <div className="text-xs text-muted-foreground">
                  Bấm để tìm và chọn từ danh sách
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 z-10 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
                value={searchTerm}
                onChange={(event) => {
                  const keyword = event.target.value;
                  setSearchTerm(keyword);
                  onSearchChange?.(keyword);
                }}
              />
            </div>

            <ScrollArea className="h-[24rem] rounded-2xl border border-slate-200 bg-slate-50/40">
              <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={[
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-all hover:shadow-md",
                      tempSelectedIds.includes(item.id)
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-slate-200 bg-white/90 hover:border-primary/40",
                    ].join(" ")}
                    onClick={() =>
                      setTempSelectedIds((current) =>
                        current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                  >
                    <Avatar className="mt-0.5 h-12 w-12 shrink-0 border border-white shadow-sm">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                        <MapPin className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="line-clamp-2 text-sm font-semibold leading-tight text-slate-900">
                        {item.name}
                      </div>
                      <div className="mb-1 flex flex-wrap gap-1.5">
                        <Badge
                          variant="secondary"
                          className="h-4 rounded-full px-1.5 py-0 font-mono text-[10px]"
                        >
                          {item.code}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="h-4 rounded-full px-1.5 py-0 text-[10px]"
                        >
                          Vùng canh tác
                        </Badge>
                      </div>
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        {item.subtitle && <div>{item.subtitle}</div>}
                        {item.details && <div>{item.details}</div>}
                      </div>
                    </div>
                    <div className="mt-1">
                      <div
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                          tempSelectedIds.includes(item.id)
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {tempSelectedIds.includes(item.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <div className="text-sm">{emptyStateText}</div>
                  </div>
                )}
                {hasMore ? (
                  <div
                    ref={loadMoreRef}
                    className="col-span-full flex justify-center py-3 text-xs text-slate-500"
                  >
                    {isLoadingMore ? "Đang tải thêm..." : "Cuộn để tải thêm"}
                  </div>
                ) : null}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleConfirm} disabled={!isValidTempSelection}>
                Chọn
                {tempSelectedIds.length > 0
                  ? ` (${tempSelectedIds.length})`
                  : ""}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CertificateEntitySelection({
  regions = [],
  onRegionSearchChange,
  onLoadMoreRegions,
  hasMoreRegions,
  isLoadingMoreRegions,
}: EntitySelectionProps) {
  const workspaceId = useSelectedWorkspaceId();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<EnterpriseCertificateFormValues>();

  const entityType = useWatch({ control, name: "entityType" });
  const targetIds = useWatch({ control, name: "targetIds" });
  const safeRegions = useMemo(
    () => (Array.isArray(regions) ? regions : []),
    [regions],
  );

  useEffect(() => {
    if (entityType !== "workspace") return;

    const nextWorkspaceId =
      workspaceId === null || workspaceId === undefined
        ? ""
        : String(workspaceId);

    if (getValues("entityId") !== nextWorkspaceId) {
      setValue("entityId", nextWorkspaceId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (getValues("entityName") !== "Workspace hiện tại") {
      setValue("entityName", "Workspace hiện tại", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if ((getValues("targetIds") ?? []).length > 0) {
      setValue("targetIds", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if ((getValues("targetNames") ?? []).length > 0) {
      setValue("targetNames", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [entityType, getValues, setValue, workspaceId]);

  const regionItems = useMemo(
    () =>
      safeRegions.map((region) => ({
        id: String(region.id),
        code: region.code || String(region.id),
        name: region.name || region.code || String(region.id),
        subtitle:
          typeof region.acreage === "number"
            ? `${region.acreage} ha`
            : region.province || region.district || region.ward || undefined,
        details: region.address,
      })),
    [safeRegions],
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="entityType" required>
          Phạm vi cấp chứng nhận
        </Label>
        <Controller
          control={control}
          name="entityType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(val) => {
                const nextType = val as "workspace" | "region";
                field.onChange(nextType);
                if (nextType === "workspace") {
                  setValue(
                    "entityId",
                    workspaceId === null || workspaceId === undefined
                      ? ""
                      : String(workspaceId),
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                  setValue("entityName", "Workspace hiện tại", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                } else {
                  setValue("entityId", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("entityName", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("targetIds", [], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue("targetNames", [], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn phạm vi..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workspace">
                  {ENTITY_TYPE_LABELS.workspace}
                </SelectItem>
                <SelectItem value="region">
                  {ENTITY_TYPE_LABELS.region}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.entityType ? (
          <p className="text-xs text-red-600">{errors.entityType.message}</p>
        ) : null}
      </div>

      {entityType !== "workspace" ? (
        <SearchSelector
          label="Chọn vùng canh tác"
          required
          placeholder="Chọn vùng canh tác"
          dialogTitle="Chọn vùng canh tác"
          searchPlaceholder="Tìm theo tên hoặc mã vùng canh tác..."
          selectedIds={targetIds}
          items={regionItems}
          emptyStateText="Không tìm thấy vùng canh tác phù hợp"
          onSearchChange={onRegionSearchChange}
          onLoadMore={onLoadMoreRegions}
          hasMore={hasMoreRegions}
          isLoadingMore={isLoadingMoreRegions}
          onConfirm={(ids) => {
            const selectedRegions = safeRegions.filter(
              (region) =>
                ids.includes(String(region.id)) ||
                ids.includes(region.code || String(region.id)),
            );
            if (selectedRegions.length === 0) return;

            const nextTargetIds = selectedRegions.map((region) =>
              String(region.id),
            );
            const nextTargetNames = selectedRegions.map(
              (region) => region.name || region.code || String(region.id),
            );

            setValue("targetIds", nextTargetIds, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("targetNames", nextTargetNames, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("entityId", nextTargetIds[0], {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("entityName", nextTargetNames.join(", "), {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      ) : null}

      {entityType === "region" ? (
        <CertificateRegionScopeMap
          regions={safeRegions}
          selectedIds={targetIds}
        />
      ) : null}
    </div>
  );
}
