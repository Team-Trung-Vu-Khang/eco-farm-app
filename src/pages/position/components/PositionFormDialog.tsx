import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Combobox,
  Button,
  FormDialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2, Upload } from "lucide-react";
import { useMasterDataById } from "@/features/master-data";
import { useUploadStorageFile } from "@/features/storage/hooks/useUploadStorageFile";
import {
  POSITION_FORM_STATUSES,
  positionFormSchema,
  type PositionFormInput,
  type PositionFormValues,
} from "../data/position-form.schema";
import { emptyPositionFormData } from "../data/constants";
import type { PositionItem, PositionRecord } from "../types";

interface PositionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: PositionItem | null;
  groupOptions: { label: string; value: string }[];
  onSubmit: (data: PositionFormValues) => void;
  loading?: boolean;
}

function normalizeStatus(
  status: PositionItem["status"] | null | undefined,
): PositionFormValues["status"] {
  if (
    POSITION_FORM_STATUSES.includes(
      status as (typeof POSITION_FORM_STATUSES)[number],
    )
  ) {
    return status as PositionFormValues["status"];
  }

  return "active";
}

type PositionFormSource = PositionItem | PositionRecord | null;

function buildDefaultValues(editItem: PositionFormSource): PositionFormInput {
  if (!editItem) {
    return {
      ...emptyPositionFormData,
      status: "active",
    };
  }

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    positionGroupId:
      editItem.positionGroupId != null ? String(editItem.positionGroupId) : "",
    description: editItem.description ?? "",
    responsibilityDescription: editItem.responsibilityDescription ?? "",
    displayOrder: editItem.displayOrder ?? 1,
    documents: (editItem.documents ?? []).map((document) => ({
      id: document.id,
      type: document.type ?? "editor",
      name: document.name ?? "",
      content: document.content ?? "",
      fileUrl: document.fileUrl ?? "",
      fileName: document.fileName ?? "",
    })),
    status: normalizeStatus(editItem.status),
  };
}

export function PositionFormDialog({
  open,
  onOpenChange,
  editItem,
  groupOptions,
  onSubmit,
  loading = false,
}: PositionFormDialogProps) {
  const { toast } = useToast();
  const positionDetailQuery = useMasterDataById(
    "positions",
    editItem?.id ?? 0,
    {
      enabled: open && !!editItem,
    },
  );

  const resolvedEditItem =
    (positionDetailQuery.data as PositionRecord | null) ?? editItem;

  const resolvedDefaultValues = useMemo(
    () => buildDefaultValues(resolvedEditItem),
    [resolvedEditItem],
  );

  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PositionFormInput, unknown, PositionFormValues>({
    defaultValues: resolvedDefaultValues,
    resolver: zodResolver(positionFormSchema),
  });

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: "documents",
  });

  const [uploadingDocumentIndex, setUploadingDocumentIndex] = useState<
    number | null
  >(null);

  const uploadDocumentWithErrorToast = useUploadStorageFile({
    onError: (error) => {
      toast({
        title: "Không thể tải tài liệu",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (open) {
      reset(resolvedDefaultValues);
      clearErrors();
      setUploadingDocumentIndex(null);
    }
  }, [clearErrors, open, reset, resolvedDefaultValues]);

  const handleDocumentFileSelect = async (
    index: number,
    file: File | undefined,
  ) => {
    if (!file) return;

    try {
      setUploadingDocumentIndex(index);
      const uploaded = await uploadDocumentWithErrorToast.uploadStorageFile({
        file,
        folder: "positions-documents",
      });

      const currentName = getValues(`documents.${index}.name`) ?? "";

      setValue(`documents.${index}.fileUrl`, uploaded.fileUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`documents.${index}.fileName`, uploaded.fileName, {
        shouldDirty: true,
        shouldValidate: true,
      });
      if (!currentName.trim()) {
        setValue(`documents.${index}.name`, uploaded.fileName, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      clearErrors(`documents.${index}.fileUrl`);
      clearErrors(`documents.${index}.fileName`);
    } finally {
      setUploadingDocumentIndex(null);
    }
  };

  const handleOpenDocument = (fileUrl: string) => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDialogSubmit = handleRHFSubmit((values) => {
    onSubmit({
      ...values,
      status: editItem ? values.status : "active",
    });
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
      onSubmit={handleDialogSubmit}
      size="xl"
      loading={loading || isSubmitting}
    >
      <div className="space-y-4 max-h-[70dvh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã chức vụ</Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Input
                  id="code"
                  disabled={!!editItem}
                  clearable={!editItem}
                  placeholder="VD: POS-GD"
                  aria-invalid={!!errors.code}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("code");
                    field.onChange(e.target.value.toUpperCase());
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
            {errors.code ? (
              <p className="text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên chức vụ
            </Label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="name"
                  placeholder="VD: Giám Đốc"
                  aria-invalid={!!errors.name}
                  value={field.value}
                  onChange={(e) => {
                    clearErrors("name");
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              )}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="positionGroupId" required>
            Nhóm chức vụ
          </Label>
          <Controller
            control={control}
            name="positionGroupId"
            render={({ field }) => (
              <Combobox
                options={groupOptions}
                value={field.value}
                onChange={(value) => {
                  clearErrors("positionGroupId");
                  field.onChange(value);
                }}
                placeholder="Chọn nhóm chức vụ"
                searchPlaceholder="Tìm nhóm chức vụ..."
                emptyText="Không tìm thấy nhóm chức vụ"
              />
            )}
          />
          {errors.positionGroupId ? (
            <p className="text-xs text-red-600">
              {errors.positionGroupId.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsibilityDescription">Mô tả trách nhiệm</Label>
          <Controller
            control={control}
            name="responsibilityDescription"
            render={({ field }) => (
              <Textarea
                id="responsibilityDescription"
                placeholder="Mô tả ngắn về trách nhiệm của chức vụ..."
                rows={4}
                aria-invalid={!!errors.responsibilityDescription}
                value={field.value}
                onChange={(e) => {
                  clearErrors("responsibilityDescription");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.responsibilityDescription ? (
            <p className="text-xs text-red-600">
              {errors.responsibilityDescription.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả chức vụ</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Mô tả trách nhiệm và quyền hạn của chức vụ..."
                rows={4}
                aria-invalid={!!errors.description}
                value={field.value}
                onChange={(e) => {
                  clearErrors("description");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          ) : null}
        </div>
        <div className="space-y-3 rounded-xl border bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label className="text-sm font-medium">Tài liệu</Label>
              <p className="text-xs text-slate-500">Thêm tài liệu đính kèm.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendDocument({
                  type: "editor",
                  name: "",
                  content: "",
                  fileUrl: "",
                  fileName: "",
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm tài liệu
            </Button>
          </div>

          {documentFields.length > 0 ? (
            <div className="space-y-3">
              {documentFields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-700">
                      Tài liệu {index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-red-600"
                      onClick={() => removeDocument(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Controller
                    control={control}
                    name={`documents.${index}.type` as const}
                    render={({ field: typeField }) => {
                      const isEditor = typeField.value === "editor";

                      return (
                        <div className="space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label
                                htmlFor={`documents.${index}.type`}
                                required
                              >
                                Loại tài liệu
                              </Label>
                              <Select
                                value={typeField.value}
                                onValueChange={(value) => {
                                  clearErrors(`documents.${index}.type`);
                                  typeField.onChange(value);
                                  if (value === "editor") {
                                    setValue(`documents.${index}.fileUrl`, "", {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                    setValue(
                                      `documents.${index}.fileName`,
                                      "",
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  } else {
                                    setValue(`documents.${index}.content`, "", {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger
                                  id={`documents.${index}.type`}
                                  aria-invalid={
                                    !!errors.documents?.[index]?.type
                                  }
                                >
                                  <SelectValue placeholder="Chọn loại tài liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.documents?.[index]?.type ? (
                                <p className="text-xs text-red-600">
                                  {errors.documents[index]?.type?.message}
                                </p>
                              ) : null}
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor={`documents.${index}.name`}
                                required
                              >
                                Tên tài liệu
                              </Label>
                              <Input
                                id={`documents.${index}.name`}
                                placeholder="VD: Kỹ thuật canh tác"
                                aria-invalid={!!errors.documents?.[index]?.name}
                                {...register(
                                  `documents.${index}.name` as const,
                                )}
                              />
                              {errors.documents?.[index]?.name ? (
                                <p className="text-xs text-red-600">
                                  {errors.documents[index]?.name?.message}
                                </p>
                              ) : null}
                            </div>

                            {isEditor ? (
                              <div className="space-y-2 md:col-span-2">
                                <Label
                                  htmlFor={`documents.${index}.content`}
                                  required
                                >
                                  Nội dung
                                </Label>
                                <Textarea
                                  id={`documents.${index}.content`}
                                  rows={3}
                                  placeholder="Nội dung tài liệu..."
                                  aria-invalid={
                                    !!errors.documents?.[index]?.content
                                  }
                                  {...register(
                                    `documents.${index}.content` as const,
                                  )}
                                />
                                {errors.documents?.[index]?.content ? (
                                  <p className="text-xs text-red-600">
                                    {errors.documents[index]?.content?.message}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}

                            {!isEditor ? (
                              <div className="space-y-2 md:col-span-2">
                                <Label
                                  htmlFor={`documents.${index}.upload`}
                                  required
                                >
                                  File PDF
                                </Label>
                                <div className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
                                  <input
                                    id={`documents.${index}.upload`}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      void handleDocumentFileSelect(
                                        index,
                                        e.target.files?.[0],
                                      );
                                      e.target.value = "";
                                    }}
                                  />
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium text-slate-700">
                                        {field.fileName || "Chưa tải file PDF"}
                                      </p>
                                      <p className="truncate text-xs text-slate-500">
                                        {field.fileUrl ||
                                          "Chọn file PDF để tải lên storage"}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {field.fileUrl ? (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          onClick={() =>
                                            handleOpenDocument(
                                              field.fileUrl ?? "",
                                            )
                                          }
                                        >
                                          Xem
                                        </Button>
                                      ) : null}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          const input =
                                            globalThis.document.getElementById(
                                              `documents.${index}.upload`,
                                            ) as HTMLInputElement | null;
                                          input?.click();
                                        }}
                                        disabled={
                                          uploadingDocumentIndex === index
                                        }
                                      >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {uploadingDocumentIndex === index
                                          ? "Đang tải..."
                                          : field.fileUrl
                                            ? "Đổi PDF"
                                            : "Tải PDF"}
                                      </Button>
                                    </div>
                                  </div>
                                  {errors.documents?.[index]?.fileUrl ? (
                                    <p className="text-xs text-red-600">
                                      {
                                        errors.documents[index]?.fileUrl
                                          ?.message
                                      }
                                    </p>
                                  ) : null}
                                  {errors.documents?.[index]?.fileName ? (
                                    <p className="text-xs text-red-600">
                                      {
                                        errors.documents[index]?.fileName
                                          ?.message
                                      }
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
              Chưa có tài liệu nào. Bấm "Thêm tài liệu" để tạo mục mới.
            </div>
          )}
        </div>
        {(resolvedEditItem?.documents?.length ?? 0) > 0 ? (
          <div className="rounded-lg border bg-slate-50 p-3 text-sm text-slate-600">
            Đã đính kèm {resolvedEditItem?.documents?.length ?? 0} tài liệu
            trong bản ghi này.
          </div>
        ) : null}

        {editItem ? (
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    clearErrors("status");
                    field.onChange(
                      normalizeStatus(value as PositionItem["status"]),
                    );
                  }}
                >
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </FormDialog>
  );
}
