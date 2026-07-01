import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useFarmPersonnelById,
  useFarmPersonnelMutations,
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

  const { uploadFile, isUploading: isUploadingFile } = useFileUpload();
  const uploadedAvatarRef = useRef<Record<string, string>>({});

  const { items: banks } = useMasterData("banks", {
    params: { status: "active", size: 100 },
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
          (personnel.departmentType as any) ||
          (personnel.department || personnel.departmentId
            ? "OWNER"
            : undefined),
        department: personnel.department?.id
          ? personnel.department.id.toString()
          : personnel.departmentId
            ? personnel.departmentId.toString()
            : "",
        positionType:
          (personnel.positionType as any) ||
          (personnel.position || personnel.positionId ? "OWNER" : undefined),
        position: personnel.position?.id
          ? personnel.position.id.toString()
          : personnel.positionId
            ? personnel.positionId.toString()
            : "",
        team: personnel.team?.id
          ? personnel.team.id.toString()
          : personnel.teamId
            ? personnel.teamId.toString()
            : "",
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
  }, [personnel, methods]);

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
        departmentId: values.department ? Number(values.department) : undefined,
        positionType: values.positionType || undefined,
        positionId: values.position ? Number(values.position) : undefined,
        teamId: values.team ? Number(values.team) : undefined,
        status: values.status,
        bankAccounts: bankAccountPayload,
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
  };
}
