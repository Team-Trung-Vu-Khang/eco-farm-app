import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  FormDialog,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Eye, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useFileUpload } from "@/features/storage";
import type { Certificate, CertificationOrganization } from "../types/types";
import {
  STANDARD_DOCUMENT_TYPES,
  STANDARD_FORM_STATUSES,
  standardFormSchema,
  type StandardDocumentFormInput,
  type StandardFormInput,
  type StandardFormValues,
} from "../data/standard-form.schema";

interface StandardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: Certificate | null;
  organizations: CertificationOrganization[];
  onSubmit: (data: StandardFormValues) => Promise<void> | void;
  loading?: boolean;
}

function createEmptyDocument(): StandardDocumentFormInput {
  return {
    type: "editor" as const,
    name: "",
    content: "",
    fileUrl: "",
    fileName: "",
  };
}

function getFileNameFromUrl(url: string) {
  if (!url) return "";
  try {
    const lastSegment = url.split("/").filter(Boolean).pop();
    return lastSegment ? decodeURIComponent(lastSegment) : "";
  } catch {
    return "";
  }
}

function OrganizationSelectorPopover({
  open,
  onOpenChange,
  organizations,
  selectedOrganizationIds,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizations: CertificationOrganization[];
  selectedOrganizationIds: number[];
  onConfirm: (ids: number[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>(
    selectedOrganizationIds,
  );

  useEffect(() => {
    if (open) {
      setTempSelectedIds(selectedOrganizationIds);
      setSearchTerm("");
    }
  }, [open, selectedOrganizationIds]);

  const filteredOrganizations = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return organizations;

    return organizations.filter((org) => {
      const searchable = `${org.name} ${org.code} ${org.description ?? ""}`
        .toLowerCase()
        .trim();
      return searchable.includes(query);
    });
  }, [organizations, searchTerm]);

  const selectedOrganizations = organizations.filter((org) =>
    tempSelectedIds.includes(org.id),
  );

  const toggleOrganization = (orgId: number) => {
    setTempSelectedIds((current) =>
      current.includes(orgId)
        ? current.filter((id) => id !== orgId)
        : [...current, orgId],
    );
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-input bg-white px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-primary/40 hover:bg-slate-50"
        >
          <span className="min-w-0 truncate text-slate-700">
            {selectedOrganizations.length === 0
              ? "Chưa chọn tổ chức"
              : selectedOrganizations.length === 1
                ? selectedOrganizations[0].name
                : `${selectedOrganizations[0].name} +${
                    selectedOrganizations.length - 1
                  }`}
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500">
            {selectedOrganizations.length} đã chọn
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-50 w-[min(92vw,44rem)] rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
      >
        <div className="border-b bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn tổ chức cấp chứng nhận
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Tìm kiếm và chọn một hoặc nhiều tổ chức phù hợp để cấp chứng nhận.
          </p>
        </div>

        <div className="border-b bg-white px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên tổ chức, mã tổ chức..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredOrganizations.length} kết quả</span>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
              <Check className="h-3 w-3" />
              Đã chọn {selectedOrganizations.length} tổ chức
            </span>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh] min-h-0 flex-1">
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {filteredOrganizations.map((org) => {
              const selected = tempSelectedIds.includes(org.id);

              return (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => toggleOrganization(org.id)}
                  className={[
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    selected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 bg-white",
                    ].join(" ")}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        {org.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {org.description || "Không có mô tả"}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {org.code}
                      </Badge>
                      {org.phone ? (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {org.phone}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredOrganizations.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy tổ chức phù hợp
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 border-t bg-white px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm(tempSelectedIds);
              onOpenChange(false);
            }}
          >
            Xác nhận
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function buildDefaultValues(editItem: Certificate | null): StandardFormInput {
  if (!editItem) {
    return {
      code: "",
      name: "",
      stampUrl: "",
      validityMonths: 12,
      organizationIds: [],
      description: "",
      status: "active",
      documents: [createEmptyDocument()],
    };
  }

  const editDocuments = editItem.documents ?? [];
  const documents: StandardFormInput["documents"] =
    editDocuments.length > 0
      ? editDocuments.map((document) => ({
          type:
            document.type === "pdf" || document.type === "editor"
              ? document.type
              : ("editor" as const),
          name: document.name ?? "",
          content: document.content ?? "",
          fileUrl: document.fileUrl ?? "",
          fileName: document.fileName ?? "",
        }))
      : [
          {
            type: editItem.contentType === "file" ? "pdf" : ("editor" as const),
            name: "Tài liệu",
            content: editItem.content ?? "",
            fileUrl: editItem.fileUrl ?? "",
            fileName:
              editItem.contentType === "file"
                ? getFileNameFromUrl(editItem.fileUrl ?? "")
                : "",
          },
        ];

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    stampUrl: editItem.stampUrl ?? "",
    validityMonths: editItem.validityMonths ?? 12,
    organizationIds: editItem.organizationIds ?? [],
    description: editItem.description ?? "",
    status: editItem.status === "inactive" ? "inactive" : ("active" as const),
    documents,
  };
}

export function StandardFormDialog({
  open,
  onOpenChange,
  editItem,
  organizations,
  onSubmit,
  loading = false,
}: StandardFormDialogProps) {
  const defaultValues = useMemo(() => buildDefaultValues(editItem), [editItem]);
  const { uploadFile } = useFileUpload();
  const uploadCache = useRef<Map<File, { fileUrl: string; fileName?: string }>>(
    new Map(),
  );
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [documentFiles, setDocumentFiles] = useState<
    Record<string, File | null>
  >({});
  const [isOrganizationSelectorOpen, setIsOrganizationSelectorOpen] =
    useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StandardFormInput, unknown, StandardFormValues>({
    defaultValues,
    resolver: zodResolver(standardFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedStampUrl = watch("stampUrl");
  const watchedDocuments = watch("documents");

  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setStampFile(null);
      setDocumentFiles({});
      setIsOrganizationSelectorOpen(false);
    }
  }, [defaultValues, open, reset]);

  const uploadSelectedFile = async (file: File, folder: string) => {
    const cached = uploadCache.current.get(file);
    if (cached) {
      return cached;
    }

    const response = await uploadFile.mutateAsync({ file, folder });
    const uploaded = {
      fileUrl: response.fileUrl,
      fileName: response.fileName || file.name,
    };
    uploadCache.current.set(file, uploaded);
    return uploaded;
  };

  const handleStampChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStampFile(file);
    setValue("stampUrl", URL.createObjectURL(file), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleStampRemove = () => {
    setStampFile(null);
    setValue("stampUrl", "", { shouldDirty: true, shouldValidate: true });
  };

  const handleDocumentFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fieldId = fields[index]?.id;
    if (!fieldId) return;

    setDocumentFiles((current) => ({
      ...current,
      [fieldId]: file,
    }));

    setValue(`documents.${index}.fileUrl`, URL.createObjectURL(file), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`documents.${index}.fileName`, file.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleDocumentTypeChange = (
    index: number,
    value: (typeof STANDARD_DOCUMENT_TYPES)[number],
  ) => {
    const fieldId = fields[index]?.id;
    if (fieldId && value === "editor") {
      setDocumentFiles((current) => {
        const next = { ...current };
        delete next[fieldId];
        return next;
      });
      setValue(`documents.${index}.fileUrl`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue(`documents.${index}.fileName`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (value === "pdf") {
      setValue(`documents.${index}.content`, "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setValue(`documents.${index}.type`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const selectedOrganizationIds = (watch("organizationIds") ?? []) as number[];
  const selectedOrganizations = organizations.filter((org) =>
    selectedOrganizationIds.includes(org.id),
  );
  const handleFormSubmit = handleSubmit(async (values) => {
    const finalValues: StandardFormValues = {
      ...values,
      stampUrl: values.stampUrl,
      documents: [...values.documents],
    };

    if (stampFile) {
      const uploaded = await uploadSelectedFile(
        stampFile,
        "certificate-standards",
      );
      finalValues.stampUrl = uploaded.fileUrl;
    }

    finalValues.documents = await Promise.all(
      values.documents.map(async (document, index) => {
        const fieldId = fields[index]?.id;
        const pendingFile = fieldId ? documentFiles[fieldId] : null;

        if (document.type === "pdf" && pendingFile) {
          const uploaded = await uploadSelectedFile(
            pendingFile,
            "certificate-standards",
          );
          return {
            ...document,
            fileUrl: uploaded.fileUrl,
            fileName: uploaded.fileName || document.fileName,
          };
        }

        return document;
      }),
    );

    await onSubmit(finalValues);
  });

  return (
    <>
      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={
          editItem ? "Chỉnh sửa loại tiêu chuẩn" : "Thêm loại tiêu chuẩn mới"
        }
        onSubmit={handleFormSubmit}
        loading={loading || isSubmitting}
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="w-full space-y-3">
              <Label>Dấu mộc</Label>
              {watchedStampUrl ? (
                <div className="relative overflow-hidden rounded-xl border bg-slate-50 p-4">
                  <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white p-4">
                    <img
                      src={watchedStampUrl}
                      alt="Stamp Preview"
                      className="max-h-[180px] w-full object-contain"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="truncate text-xs text-slate-500">
                      {stampFile?.name ||
                        editItem?.stampUrl ||
                        "Chưa đổi dấu mộc"}
                    </span>
                    <button
                      type="button"
                      onClick={handleStampRemove}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                      aria-label="Xóa dấu mộc"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition-colors hover:border-slate-300 hover:bg-slate-100">
                  <Upload className="mb-3 h-10 w-10 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">
                    Click để tải ảnh dấu mộc lên
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    PNG, JPG, WEBP
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStampChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code" required>
                    Mã số
                  </Label>
                  <Input
                    id="code"
                    placeholder="VD: CH001"
                    aria-invalid={!!errors.code}
                    {...register("code")}
                  />
                  {errors.code ? (
                    <p className="text-xs text-red-600">
                      {errors.code.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" required>
                    Tên tiêu chuẩn
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: VietGAP"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="validityMonths" required>
                    Thời hạn (tháng)
                  </Label>
                  <Input
                    id="validityMonths"
                    type="number"
                    min={0}
                    aria-invalid={!!errors.validityMonths}
                    {...register("validityMonths")}
                  />
                  {errors.validityMonths ? (
                    <p className="text-xs text-red-600">
                      {errors.validityMonths.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" required>
                    Trạng thái
                  </Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value) =>
                      setValue(
                        "status",
                        value as StandardFormValues["status"],
                        {
                          shouldDirty: true,
                          shouldValidate: true,
                        },
                      )
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {STANDARD_FORM_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "active"
                            ? "Hoạt động"
                            : "Ngừng hoạt động"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status ? (
                    <p className="text-xs text-red-600">
                      {errors.status.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tổ chức cấp</Label>
                <OrganizationSelectorPopover
                  open={isOrganizationSelectorOpen}
                  onOpenChange={setIsOrganizationSelectorOpen}
                  organizations={organizations}
                  selectedOrganizationIds={selectedOrganizationIds}
                  onConfirm={(ids: number[]) =>
                    setValue("organizationIds", ids, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
                <div className="flex flex-wrap gap-2">
                  {selectedOrganizations.length > 0 ? (
                    selectedOrganizations.map((org) => (
                      <Badge
                        key={org.id}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700"
                      >
                        {org.code}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">
                      Click để mở popup chọn tổ chức.
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Định nghĩa / Mô tả</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Mô tả thêm..."
                  aria-invalid={!!errors.description}
                  {...register("description")}
                />
                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-base">Tài liệu</Label>
                <p className="text-sm text-slate-500">
                  Thêm tài liệu đính kèm theo kiểu editor hoặc pdf.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append(createEmptyDocument())}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm tài liệu
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                const doc = watchedDocuments?.[index];
                const isPdf = doc?.type === "pdf";
                const filePreview = doc?.fileUrl || "";
                const fileName = doc?.fileName || "";
                const hasViewableFile = !!filePreview && isPdf;
                const docError = errors.documents?.[index];

                return (
                  <div
                    key={field.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-700">
                        Tài liệu {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                        aria-label={`Xóa tài liệu ${index + 1}`}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label required>Loại tài liệu</Label>
                        <Select
                          value={doc?.type ?? "editor"}
                          onValueChange={(value) =>
                            handleDocumentTypeChange(
                              index,
                              value as (typeof STANDARD_DOCUMENT_TYPES)[number],
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                        {docError?.type ? (
                          <p className="text-xs text-red-600">
                            {docError.type.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <Label required>Tên tài liệu</Label>
                        <Input
                          placeholder="Ví dụ: Kỹ thuật canh tác"
                          aria-invalid={!!docError?.name}
                          {...register(`documents.${index}.name` as const)}
                        />
                        {docError?.name ? (
                          <p className="text-xs text-red-600">
                            {docError.name.message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {isPdf ? (
                      <div className="mt-4 space-y-2">
                        <Label required>File PDF</Label>
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-3">
                          {fileName || filePreview ? (
                            <div className="flex flex-col gap-3">
                              <div className="min-w-0 space-y-1">
                                <div className="break-words font-medium">
                                  {fileName || getFileNameFromUrl(filePreview)}
                                </div>
                                <div className="break-all text-xs text-slate-500">
                                  {filePreview}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {hasViewableFile ? (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="shrink-0"
                                    onClick={() =>
                                      window.open(filePreview, "_blank")
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem
                                  </Button>
                                ) : null}
                                <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Tải PDF
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(event) =>
                                      handleDocumentFileChange(index, event)
                                    }
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
                              <Upload className="mb-2 h-5 w-5 text-slate-400" />
                              <span className="text-sm font-medium text-slate-600">
                                Chọn file PDF để tải lên storage
                              </span>
                              <span className="mt-1 text-xs text-slate-400">
                                PDF tối đa tuỳ cấu hình storage
                              </span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={(event) =>
                                  handleDocumentFileChange(index, event)
                                }
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                        {docError?.fileUrl ? (
                          <p className="text-xs text-red-600">
                            {docError.fileUrl.message}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <Label required>Nội dung tài liệu</Label>
                        <Textarea
                          rows={4}
                          placeholder="Nhập nội dung tài liệu..."
                          aria-invalid={!!docError?.content}
                          {...register(`documents.${index}.content` as const)}
                        />
                        {docError?.content ? (
                          <p className="text-xs text-red-600">
                            {docError.content.message}
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {errors.documents ? (
              <p className="text-xs text-red-600">{errors.documents.message}</p>
            ) : null}
          </div>
        </div>
      </FormDialog>
    </>
  );
}
