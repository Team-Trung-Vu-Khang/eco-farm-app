import { useCurrentUser } from "@/features/auth";
import {
  useSelectedWorkspaceId,
  useWorkspaceById,
  type WorkspaceRecord,
} from "@/features/workspace";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, Search, Sprout } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { Standard } from "../../../stores/useEnterpriseCertificateStore";
import type { EnterpriseCertificateFormValues } from "../data/enterprise-certificate-form.schema";
import {
  FarmerSelectorDialog,
  getOrganizationTypeLabel,
} from "./FarmerSelectorDialog";

interface BasicInfoProps {
  standards: Standard[];
}

const getStandardInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "ST";

export function CertificateBasicInfoFields({ standards }: BasicInfoProps) {
  const { currentUser } = useCurrentUser();
  const [isFarmerDialogOpen, setIsFarmerDialogOpen] = useState(false);
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<EnterpriseCertificateFormValues>();

  const watchedStandardType = useWatch({
    control,
    name: "standardType",
  });

  const selectedStandard = standards.find(
    (standard) => standard.code === watchedStandardType,
  );
  const organizations = selectedStandard?.organizations ?? [];
  const farmerId = useWatch({ control, name: "farmerId" });
  const farmerName = useWatch({ control, name: "farmerName" });
  const farmerCode = useWatch({ control, name: "farmerCode" });
  const farmerType = useWatch({ control, name: "farmerType" });
  const isAdmin = (currentUser?.roleCodes ?? []).some((role) =>
    role.toLowerCase().includes("admin"),
  );
  const shouldShowFarmerSelector = isAdmin;
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { item: currentWorkspace, loading: isLoadingWorkspace } =
    useWorkspaceById(selectedWorkspaceId ?? "", {
      enabled: !!currentUser && !isAdmin,
    });

  const applyFarmer = useCallback(
    (workspace: WorkspaceRecord, shouldDirty: boolean) => {
      const options = { shouldDirty, shouldValidate: true };
      setValue("farmerId", String(workspace.id), options);
      setValue("farmerName", workspace.name, options);
      setValue("farmerCode", workspace.code || String(workspace.id), options);
      setValue(
        "farmerType",
        workspace.organizationType?.type || "farm",
        options,
      );
    },
    [setValue],
  );

  // Non-admin users always issue certificates for their own workspace.
  useEffect(() => {
    if (isAdmin || !currentWorkspace) return;
    if (farmerId === String(currentWorkspace.id)) return;
    applyFarmer(currentWorkspace, false);
  }, [applyFarmer, currentWorkspace, farmerId, isAdmin]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label required={shouldShowFarmerSelector}>Nông hộ được cấp</Label>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Sprout className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  {farmerName ? (
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-slate-900">
                          {farmerName}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          {getOrganizationTypeLabel({ type: farmerType })}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Mã: {farmerCode || farmerId || "Chưa cập nhật"}
                      </p>
                    </>
                  ) : !isAdmin && isLoadingWorkspace ? (
                    <p className="text-sm text-muted-foreground">
                      Đang tải thông tin nông hộ...
                    </p>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">
                        Chưa chọn nông hộ
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Admin chọn nông hộ để tạo chứng nhận thay cho đơn vị
                        đó.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {shouldShowFarmerSelector ? (
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0 gap-2"
                  onClick={() => setIsFarmerDialogOpen(true)}
                >
                  <Search className="h-4 w-4" />
                  {farmerName ? "Đổi nông hộ" : "Chọn nông hộ"}
                </Button>
              ) : (
                <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Thông tin nông hộ hiện tại
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {shouldShowFarmerSelector && !farmerId ? (
          <p className="text-xs text-red-600">Vui lòng chọn nông hộ.</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code" required>
            Mã chứng nhận
          </Label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="code"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: CN-2024-001"
                className="bg-white"
                aria-invalid={!!errors.code}
              />
            )}
          />
          {errors.code ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên chứng nhận
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="name"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: Chứng nhận VietGAP..."
                className="bg-white"
                aria-invalid={!!errors.name}
              />
            )}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="standardType" required>
            Loại tiêu chuẩn
          </Label>
          <Controller
            control={control}
            name="standardType"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  const nextStandard = standards.find(
                    (standard) => standard.code === value,
                  );
                  const nextOrganizations = nextStandard?.organizations ?? [];

                  setValue(
                    "organization",
                    nextOrganizations.length === 1 ? nextOrganizations[0] : "",
                    { shouldDirty: true, shouldValidate: true },
                  );
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn loại tiêu chuẩn" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  {standards.map((standard) => (
                    <SelectItem
                      key={standard.code}
                      value={standard.code}
                      className="py-2"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-7 w-7 shrink-0 rounded-md border border-slate-200">
                          {standard.stampUrl ? (
                            <AvatarImage
                              src={standard.stampUrl}
                              alt={standard.name}
                            />
                          ) : null}
                          <AvatarFallback className="rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {getStandardInitials(standard.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{standard.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.standardType ? (
            <p className="text-xs text-red-600">
              {errors.standardType.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization" required>
            Tổ chức cấp
          </Label>
          <Controller
            control={control}
            name="organization"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={organizations.length === 0}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue
                    placeholder={
                      organizations.length === 0
                        ? "Chọn tiêu chuẩn trước"
                        : "Chọn tổ chức cấp..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.organization ? (
            <p className="text-xs text-red-600">
              {errors.organization.message}
            </p>
          ) : null}
        </div>
      </div>

      <FarmerSelectorDialog
        open={isFarmerDialogOpen}
        onOpenChange={setIsFarmerDialogOpen}
        selectedId={farmerId}
        onConfirm={(workspace) => applyFarmer(workspace, true)}
      />
    </div>
  );
}
