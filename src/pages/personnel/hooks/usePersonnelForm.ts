import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useFarmDepartmentOptions,
  useFarmPersonnelById,
  useFarmPersonnelMutations,
  useFarmPositionOptions,
  useMasterData,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personnelFormSchema,
  type PersonnelFormValues,
  emptyPersonnelFormValues,
} from "../data/personnel-form.schema";
import type { FarmPersonnelRequest } from "@/features/master-data/types/farm-master-data.type";
import { useFileUpload } from "@/features/storage/hooks/useFileUpload";

export function usePersonnelForm(id?: number) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { uploadFile, isUploading: isUploadingFile } = useFileUpload();
  const uploadedAvatarRef = useRef<Record<string, string>>({});

  const { items: banks } = useMasterData("banks", {
    params: { status: "active", size: 100 },
  });
  const { items: departmentOptions, loading: departmentsLoading } =
    useFarmDepartmentOptions({
      workspaceId: parsedWorkspaceId,
      params: { size: 100 },
    });
  const { items: positionOptions, loading: positionsLoading } =
    useFarmPositionOptions({
      workspaceId: parsedWorkspaceId,
      params: { size: 100 },
    });

  const { data: personnel, isLoading: isPersonnelLoading } =
    useFarmPersonnelById(id || 0, {
      workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
      enabled: !!id,
    });

  const { createPersonnel, updatePersonnel, deletePersonnel } =
    useFarmPersonnelMutations(
      typeof workspaceId === "number" ? workspaceId : undefined,
    );

  const methods = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelFormSchema),
    defaultValues: emptyPersonnelFormValues,
    mode: "onChange",
  });

  const buildOptionValue = (source: string, id: number) => `${source}_${id}`;

  const resolveJobValue = (
    source: string | undefined,
    id: number | undefined,
    name: string | undefined,
    options: Array<{ id: number; name: string; source: string }>,
  ) => {
    if (id && source) {
      return buildOptionValue(source, id);
    }

    if (id) {
      const matchedById = options.find((item) => item.id === id);
      if (matchedById) {
        return buildOptionValue(matchedById.source, matchedById.id);
      }
      return String(id);
    }

    if (name) {
      const matchedByName = options.find(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      );
      if (matchedByName) {
        return buildOptionValue(matchedByName.source, matchedByName.id);
      }
      return name;
    }

    return "";
  };

  useEffect(() => {
    if (personnel) {
      methods.reset({
        fullName: personnel.fullName || "",
        phone: personnel.phone || "",
        email: personnel.email || "",
        province: personnel.province || "",
        ward: personnel.ward || "",
        address: personnel.address || "",
        personalTaxCode: personnel.personalTaxCode || "",
        taxAddress: personnel.taxAddress || "",
        avatarUrl: personnel.avatarUrl || "",
        avatarFile: undefined,
        departmentType:
          personnel.metadataJson?.departmentType ||
          personnel.departmentType ||
          (personnel.department?.source as any) ||
          undefined,
        department: resolveJobValue(
          (personnel.metadataJson?.departmentType ||
            personnel.departmentType ||
            (personnel.department?.source as any)) as string | undefined,
          (personnel.department?.id as number | undefined) ||
            personnel.departmentId,
          personnel.department?.name,
          departmentOptions,
        ),
        positionType:
          personnel.metadataJson?.positionType ||
          personnel.positionType ||
          (personnel.position?.source as any) ||
          undefined,
        position: resolveJobValue(
          (personnel.metadataJson?.positionType ||
            personnel.positionType ||
            (personnel.position?.source as any)) as string | undefined,
          (personnel.position?.id as number | undefined) || personnel.positionId,
          personnel.position?.name,
          positionOptions,
        ),
        teamIds: personnel.teams
          ? personnel.teams.map((t: any) => t.id.toString())
          : personnel.teamId
            ? [personnel.teamId.toString()]
            : [],
        status: (personnel.status as any) || "active",
        bankName:
          personnel.bankAccounts?.[0]?.bank?.code ||
          personnel.bankAccounts?.[0]?.bankCode ||
          personnel.bankAccounts?.[0]?.bankName ||
          "",
        accountNumber: personnel.bankAccounts?.[0]?.accountNumber || "",
        accountHolder: personnel.bankAccounts?.[0]?.accountHolder || "",
        bankBranch: personnel.bankAccounts?.[0]?.branch || "",
      });
    }
  }, [personnel, methods, departmentOptions, positionOptions]);

  const onSubmit = async (values: PersonnelFormValues) => {
    let finalAvatarUrl = values.avatarUrl;

    try {
      // Handle file upload if it's a new local file
      if (values.avatarFile && values.avatarUrl?.startsWith("blob:")) {
        if (uploadedAvatarRef.current[values.avatarUrl]) {
          finalAvatarUrl = uploadedAvatarRef.current[values.avatarUrl];
        } else {
          const uploadRes = await uploadFile.mutateAsync({
            file: values.avatarFile,
            folder: "personnel-avatars",
          });
          finalAvatarUrl = uploadRes.fileUrl;
          uploadedAvatarRef.current[values.avatarUrl] = finalAvatarUrl;
        }
      }

      let bankAccountPayload: any[] = [];
      if (
        values.accountNumber ||
        values.bankName ||
        values.accountHolder ||
        values.bankBranch
      ) {
        const selectedBank = banks.find((b) => b.code === values.bankName);
        bankAccountPayload = [
          {
            id: personnel?.bankAccounts?.[0]?.id,
            bankId: selectedBank?.id,
            bankCode: selectedBank?.code || values.bankName,
            bankName: selectedBank?.name || values.bankName,
            bin:
              (selectedBank?.attributes as any)?.bin ||
              selectedBank?.code ||
              values.bankName,
            logoUrl: (selectedBank as any)?.logoUrl,
            accountNumber: values.accountNumber,
            accountHolder: values.accountHolder,
            branch: values.bankBranch,
          },
        ];
      }

      const payload: FarmPersonnelRequest = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        province: values.province || undefined,
        ward: values.ward || undefined,
        address: values.address || undefined,
        personalTaxCode: values.personalTaxCode || undefined,
        taxAddress: values.taxAddress || undefined,
        avatarUrl: finalAvatarUrl || undefined,
        departmentType: values.departmentType || undefined,
        departmentId: values.department
          ? Number(
              values.department.includes("_")
                ? values.department.split("_")[1]
                : values.department,
            )
          : undefined,
        positionType: values.positionType || undefined,
        positionId: values.position
          ? Number(
              values.position.includes("_")
                ? values.position.split("_")[1]
                : values.position,
            )
          : undefined,
        teamIds:
          values.teamIds && values.teamIds.length > 0
            ? values.teamIds.map((tid) => Number(tid))
            : undefined,
        status: values.status,
        bankAccounts: bankAccountPayload,
        metadataJson: {
          ...(personnel?.metadataJson || {}),
          departmentType: values.departmentType || undefined,
          positionType: values.positionType || undefined,
        },
      };

      if (id) {
        await updatePersonnel.mutateAsync({ id, data: payload });
        toast({
          title: "Cập nhật thành công",
          description: `Đã cập nhật nhân sự "${values.fullName}"`,
        });
      } else {
        await createPersonnel.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: `Đã thêm nhân sự "${values.fullName}"`,
        });
      }
      setLocation("/personnel");
    } catch (error) {
      toast({
        title: "Không thể lưu",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (id) {
      try {
        await deletePersonnel.mutateAsync(id);
        toast({
          title: "Thành công",
          description: "Đã xóa nhân sự khỏi hệ thống",
        });
        setLocation("/personnel");
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa nhân sự",
          variant: "destructive",
        });
      }
    }
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
    handleDelete,
    setLocation,
    personnel,
    isPersonnelLoading,
    isSubmitting:
      createPersonnel.isPending || updatePersonnel.isPending || isUploadingFile,
    isDeleting: deletePersonnel.isPending,
    loading: departmentsLoading || positionsLoading,
  };
}
