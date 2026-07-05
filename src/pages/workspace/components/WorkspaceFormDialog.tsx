import { useEffect, useMemo } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  FormDialog,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  WorkspaceCreateRequest,
  WorkspaceRecord,
  WorkspaceStatus,
} from "@/features/workspace";
import { useCrops } from "@/features/foundation";
import { useMasterData } from "@/features/master-data";
import type { MasterDataRecord } from "@/features/master-data";

type WorkspaceFormValues = {
  organizationTypeId: string;
  code: string;
  name: string;
  brandName: string;
  totalAcreage: string;
  mainCropId: string;
  businessLineIds: string[];
  status: WorkspaceStatus;
};

interface WorkspaceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: WorkspaceRecord | null;
  loading?: boolean;
  onSubmit: (payload: WorkspaceCreateRequest) => Promise<void> | void;
}

const toFormValues = (item: WorkspaceRecord | null): WorkspaceFormValues => ({
  organizationTypeId: String(item?.organizationType?.id ?? ""),
  code: item?.code ?? "",
  name: item?.name ?? "",
  brandName: item?.brandName ?? "",
  totalAcreage:
    item?.totalAcreage !== undefined && item?.totalAcreage !== null
      ? String(item.totalAcreage)
      : "",
  mainCropId: item?.mainCrop?.id !== undefined ? String(item.mainCrop.id) : "",
  businessLineIds: item?.businessLines?.length
    ? item.businessLines.map((line) => String(line.id))
    : [],
  status: item?.status ?? "active",
});

const parseNumber = (value: string, fallback = 0) => {
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseNullableNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

export function WorkspaceFormDialog({
  open,
  onOpenChange,
  editItem,
  loading,
  onSubmit,
}: WorkspaceFormDialogProps) {
  const defaultValues = useMemo(() => toFormValues(editItem), [editItem]);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    defaultValues,
  });

  const organizationTypesQuery = useMasterData("organization-types", {
    params: { page: 0, size: 100 },
  });
  const cropsQuery = useCrops({
    params: { page: 0, size: 100 },
  });
  const businessLinesQuery = useMasterData("business-lines", {
    params: { page: 0, size: 100, status: "active" },
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  const organizationTypeOptions = organizationTypesQuery.items.map((item) => ({
    value: String(item.id),
    label: [item.code, item.name].filter(Boolean).join(" - ") || String(item.id),
  }));

  const cropOptions = cropsQuery.items.map((item) => ({
    value: String(item.id),
    label: [item.code, item.name].filter(Boolean).join(" - ") || String(item.id),
  }));
  const businessLineRecords = useMemo(
    () => businessLinesQuery.items as MasterDataRecord<"business-lines">[],
    [businessLinesQuery.items],
  );

  const submitForm: SubmitHandler<WorkspaceFormValues> = async (values) => {
    const selectedBusinessLines: WorkspaceCreateRequest["businessLines"] =
      values.businessLineIds.length > 0
        ? values.businessLineIds.flatMap((id) => {
            const record = businessLineRecords.find(
              (item) => String(item.id) === id,
            );

            if (!record) return [];

            return [
              {
                id: record.id,
                code: record.code ?? "",
                name: record.name ?? "",
              },
            ];
          })
        : editItem?.businessLines ?? [];

    const payload: WorkspaceCreateRequest = {
      organizationTypeId:
        parseNullableNumber(values.organizationTypeId) ??
        values.organizationTypeId.trim(),
      code: values.code.trim(),
      name: values.name.trim(),
      brandName: values.brandName.trim(),
      taxCode: editItem?.taxCode ?? "",
      taxAuthority: editItem?.taxAuthority ?? "",
      taxAddress: editItem?.taxAddress ?? "",
      issueDate: editItem?.issueDate ?? "",
      businessLines: selectedBusinessLines,
      totalAcreage: parseNumber(values.totalAcreage, 0),
      mainCropId: parseNullableNumber(values.mainCropId),
      representative: editItem?.representative ?? "",
      foundedDate: editItem?.foundedDate ?? "",
      website: editItem?.website ?? "",
      province: editItem?.province ?? "",
      district: editItem?.district ?? "",
      ward: editItem?.ward ?? "",
      address: editItem?.address ?? "",
      latitude: editItem?.latitude ?? 0,
      longitude: editItem?.longitude ?? 0,
      imageUrl: editItem?.imageUrl ?? "",
      description: editItem?.description ?? "",
      status: editItem ? values.status : "active",
      metadataJson: editItem?.metadataJson ?? null,
    };

    await onSubmit(payload);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa workspace" : "Thêm workspace mới"}
      size="lg"
      loading={loading}
      onSubmit={handleSubmit(submitForm)}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="organizationTypeId" required>
            Loại đơn vị
          </Label>
          <Controller
            control={control}
            name="organizationTypeId"
            rules={{ required: "Vui lòng chọn loại đơn vị" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="organizationTypeId">
                  <SelectValue placeholder="Chọn loại đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.organizationTypeId ? (
            <p className="text-xs text-red-600">
              {errors.organizationTypeId.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã
            </Label>
            <Input
              id="code"
              placeholder="VD: WS001"
              aria-invalid={!!errors.code}
              {...register("code", { required: "Mã workspace là bắt buộc" })}
            />
            {errors.code ? (
              <p className="text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên
            </Label>
            <Input
              id="name"
              placeholder="Tên workspace"
              aria-invalid={!!errors.name}
              {...register("name", { required: "Tên workspace là bắt buộc" })}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brandName" required>
              Brand name
            </Label>
            <Input
              id="brandName"
              placeholder="Tên thương hiệu"
              aria-invalid={!!errors.brandName}
              {...register("brandName", {
                required: "Brand name là bắt buộc",
              })}
            />
            {errors.brandName ? (
              <p className="text-xs text-red-600">{errors.brandName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAcreage">Tổng diện tích</Label>
            <Input
              id="totalAcreage"
              type="number"
              step="any"
              placeholder="VD: 125.5"
              {...register("totalAcreage")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainCropId" required>
            Cây trồng chính
          </Label>
          <Controller
            control={control}
            name="mainCropId"
            rules={{ required: "Vui lòng chọn cây trồng chính" }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="mainCropId">
                  <SelectValue placeholder="Chọn cây trồng chính" />
                </SelectTrigger>
                <SelectContent>
                  {cropOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mainCropId ? (
            <p className="text-xs text-red-600">{errors.mainCropId.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessLineIds" required>
            Ngành nghề
          </Label>
          <p className="text-xs text-muted-foreground">
            Chọn một hoặc nhiều ngành nghề phù hợp.
          </p>
          <Controller
            control={control}
            name="businessLineIds"
            render={({ field }) => (
              <MultiSelect
                options={businessLineRecords.map((item) => ({
                  value: String(item.id),
                  label:
                    [item.code, item.name].filter(Boolean).join(" - ") ||
                    String(item.id),
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder="Chọn ngành nghề"
                emptyText="Không tìm thấy ngành nghề"
                searchPlaceholder="Tìm ngành nghề..."
              />
            )}
          />
        </div>

        {editItem ? (
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        ) : null}
      </div>
    </FormDialog>
  );
}
