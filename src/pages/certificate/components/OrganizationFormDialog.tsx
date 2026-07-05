import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormDialog,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useForm } from "react-hook-form";
import type { CertificationOrganization } from "../types/types";
import {
  ORGANIZATION_FORM_STATUSES,
  organizationFormSchema,
  type OrganizationFormInput,
  type OrganizationFormValues,
} from "../data/organization-form.schema";

interface OrganizationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: CertificationOrganization | null;
  onSubmit: (data: OrganizationFormValues) => Promise<void> | void;
  loading?: boolean;
}

function buildDefaultValues(
  editItem: CertificationOrganization | null,
): OrganizationFormInput {
  if (!editItem) {
    return {
      code: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      status: "active",
    };
  }

  return {
    code: editItem.code ?? "",
    name: editItem.name ?? "",
    address: editItem.address ?? "",
    phone: editItem.phone ?? "",
    email: editItem.email ?? "",
    website: editItem.website ?? "",
    description: editItem.description ?? "",
    status: ORGANIZATION_FORM_STATUSES.includes(
      editItem.status as (typeof ORGANIZATION_FORM_STATUSES)[number],
    )
      ? (editItem.status as OrganizationFormValues["status"])
      : "active",
  };
}

export function OrganizationFormDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  loading = false,
}: OrganizationFormDialogProps) {
  const defaultValues = useMemo(
    () => buildDefaultValues(editItem),
    [editItem],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormInput, unknown, OrganizationFormValues>({
    defaultValues,
    resolver: zodResolver(organizationFormSchema),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  const handleFormSubmit = handleSubmit(async (values) => onSubmit(values));

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={editItem ? "Chỉnh sửa tổ chức" : "Thêm tổ chức mới"}
      onSubmit={handleFormSubmit}
      loading={loading || isSubmitting}
    >
      <div className="space-y-4">
        <input type="hidden" {...register("status")} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã tổ chức
            </Label>
            <Input
              id="code"
              placeholder="VD: ORG001"
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code ? (
              <p className="text-xs text-red-600">{errors.code.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" required>
              Tên tổ chức
            </Label>
            <Input
              id="name"
              placeholder="VD: Bộ Nông nghiệp..."
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" required>
            Địa chỉ
          </Label>
          <Input
            id="address"
            placeholder="Địa chỉ trụ sở..."
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address ? (
            <p className="text-xs text-red-600">{errors.address.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Điện thoại
            </Label>
            <Input
              id="phone"
              placeholder="024 xxxx xxxx"
              aria-invalid={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" required>
            Website
          </Label>
          <Input
            id="website"
            placeholder="https://..."
            aria-invalid={!!errors.website}
            {...register("website")}
          />
          {errors.website ? (
            <p className="text-xs text-red-600">{errors.website.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Mô tả về tổ chức..."
            rows={3}
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
    </FormDialog>
  );
}
