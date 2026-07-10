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
import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { Area } from "../../../stores/useEnterpriseCertificateStore";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";
import { useSelectedWorkspaceId } from "@/features/workspace";

const ENTITY_TYPE_LABELS = {
  workspace: "Cấp phép theo đơn vị - tổ chức",
  region: "Cấp phép theo vùng canh tác cụ thể",
} as const;

interface EntitySelectionProps {
  areas?: Area[];
}

interface SelectorItem {
  id: string;
  code: string;
  name: string;
  subtitle?: string;
}

interface SearchSelectorProps {
  label: string;
  required?: boolean;
  placeholder: string;
  dialogTitle: string;
  searchPlaceholder: string;
  selectedId: string;
  items: SelectorItem[];
  emptyStateText: string;
  onConfirm: (id: string) => void;
  disabled?: boolean;
}

function SearchSelector({
  label,
  required = false,
  placeholder,
  dialogTitle,
  searchPlaceholder,
  selectedId,
  items,
  emptyStateText,
  onConfirm,
  disabled = false,
}: SearchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);

  const selectedItem = items.find((item) => item.id === selectedId);

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.subtitle?.toLowerCase().includes(keyword),
    );
  }, [items, searchTerm]);

  const isValidTempSelection = items.some((item) => item.id === tempSelectedId);

  const handleOpen = () => {
    if (disabled) return;
    setTempSelectedId(selectedId);
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleCancel = () => {
    setTempSelectedId(selectedId);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (!tempSelectedId || !isValidTempSelection) return;
    onConfirm(tempSelectedId);
    setIsOpen(false);
  };

  return (
    <>
      <div className="space-y-2">
        <Label required={required}>{label}</Label>
        <div
          className={[
            "group flex min-h-16 cursor-pointer items-center rounded-2xl border p-4 transition-all",
            selectedItem
              ? "border-slate-200 bg-white/90 shadow-sm"
              : "border-dashed border-slate-300 bg-white/70",
            disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:border-primary/40",
          ].join(" ")}
          onClick={handleOpen}
        >
          {selectedItem ? (
            <div className="flex w-full items-start gap-3">
              <Avatar className="h-12 w-12 shrink-0 border border-white shadow-sm">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                  <MapPin className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full px-2.5 py-0 text-[10px] font-mono"
                  >
                    {selectedItem.code}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="h-5 rounded-full px-2.5 py-0 text-[10px]"
                  >
                    Vùng canh tác
                  </Badge>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {selectedItem.name}
                </div>
                <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {selectedItem.subtitle && <div>{selectedItem.subtitle}</div>}
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
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <ScrollArea className="h-[24rem] rounded-2xl border border-slate-200 bg-slate-50/40">
              <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={[
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-all hover:shadow-md",
                      tempSelectedId === item.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-slate-200 bg-white/90 hover:border-primary/40",
                    ].join(" ")}
                    onClick={() => setTempSelectedId(item.id)}
                  >
                    <Avatar className="mt-0.5 h-12 w-12 shrink-0 border border-white shadow-sm">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                        <MapPin className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 line-clamp-2 min-h-10 text-sm font-semibold leading-tight text-slate-900">
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
                      </div>
                    </div>
                    <div className="mt-1">
                      <div
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                          tempSelectedId === item.id
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {tempSelectedId === item.id && (
                          <div className="h-2 w-2 rounded-full bg-white" />
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
              </div>
            </ScrollArea>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleConfirm} disabled={!isValidTempSelection}>
                Chọn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CertificateEntitySelection({
  areas = [],
}: EntitySelectionProps) {
  const workspaceId = useSelectedWorkspaceId();
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<EnterpriseCertificateFormValues>();

  const entityType = useWatch({ control, name: "entityType" });
  const entityId = useWatch({ control, name: "entityId" });
  const entityName = useWatch({ control, name: "entityName" });
  const safeAreas = Array.isArray(areas) ? areas : [];

  useEffect(() => {
    if (entityType !== "workspace") return;

    const nextWorkspaceId =
      workspaceId === null || workspaceId === undefined ? "" : String(workspaceId);

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
  }, [entityType, getValues, setValue, workspaceId]);

  const selectedArea = safeAreas.find(
    (area) => area.id === entityId || area.code === entityId,
  );

  const areaItems = useMemo(
    () =>
      safeAreas.map((area) => ({
        id: area.id,
        code: area.code,
        name: area.name,
        subtitle: `Mã: ${area.code}`,
      })),
    [safeAreas],
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
          selectedId={entityId}
          items={areaItems}
          emptyStateText="Không tìm thấy vùng canh tác phù hợp"
          onConfirm={(id) => {
            const selected = areas.find(
              (area) => area.id === id || area.code === id,
            );
            if (!selected) return;

            setValue("entityId", selected.code, {
              shouldDirty: true,
              shouldValidate: true,
            });
            setValue("entityName", selected.name, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        />
      ) : null}

      {entityType === "region" ? (
        <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 shrink-0 border border-white shadow-sm">
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">Đã chọn:</span>
                <span className="font-medium text-slate-700">
                  {entityName || "Chưa có lựa chọn"}
                </span>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Mã
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {entityId || selectedArea?.code || "Chưa xác định"}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Loại
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {ENTITY_TYPE_LABELS.region}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Phạm vi
                </div>
                <div className="mt-1 font-medium text-slate-700">
                  Áp dụng theo vùng canh tác cụ thể đã chọn
                </div>
              </div>
              {errors.entityId || errors.entityName ? (
                <p className="text-xs text-red-600">
                  {errors.entityId?.message || errors.entityName?.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
