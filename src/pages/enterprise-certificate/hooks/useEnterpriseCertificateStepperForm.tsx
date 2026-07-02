import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { branchApi } from "@/features/branch";
import { farmCertificateApi } from "@/features/farm-certificate";
import { useMasterData } from "@/features/master-data";
import { organizationApi } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { Area, Enterprise } from "../../../stores/useEnterpriseCertificateStore";
import {
  buildFarmCertificatePayload,
  mapBranchRecordToArea,
  mapFarmCertificateRecordToFormData,
  mapFarmCertificateRecordToView,
  mapOrganizationRecordToEnterprise,
  mapStandardRecordToOption,
} from "../utils";
import {
  defaultEnterpriseCertificateFormValues,
  enterpriseCertificateFormSchema,
  type EnterpriseCertificateFormInput,
  type EnterpriseCertificateFormValues,
} from "../data/enterprise-certificate-form.schema";

export function useEnterpriseCertificateStepperForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const [, setLocation] = useLocation();
  const [, editParams] = useRoute("/enterprise-certificate/:id/edit");

  const editId = editParams?.id ? Number(editParams.id) : null;
  const isEdit = Boolean(editId);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const standardsQuery = useMasterData("certificate-standards", {
    params: {
      page: 0,
      size: 100,
    },
    enabled: true,
  });

  const organizationsQuery = useQuery({
    queryKey: ["enterprise-certificate", "organizations", workspaceId] as const,
    queryFn: async () => {
      if (workspaceId === null || workspaceId === undefined) {
        throw new Error("Missing workspace id");
      }

      return organizationApi.list(
        {
          page: 0,
          size: 100,
        },
        workspaceId,
      );
    },
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const areasQuery = useQuery({
    queryKey: ["enterprise-certificate", "branches", workspaceId] as const,
    queryFn: async () => {
      if (workspaceId === null || workspaceId === undefined) {
        throw new Error("Missing workspace id");
      }

      return branchApi.list(
        {
          page: 0,
          size: 100,
        },
        workspaceId,
      );
    },
    enabled: workspaceId !== null && workspaceId !== undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const detailQuery = useQuery({
    queryKey: ["enterprise-certificate", "detail", editId] as const,
    queryFn: () => {
      if (editId === null) {
        throw new Error("Missing certificate id");
      }

      return farmCertificateApi.getById(editId);
    },
    enabled: isEdit,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const standardRecords = useMemo(
    () => standardsQuery.items,
    [standardsQuery.items],
  );

  const standards = useMemo(
    () => standardRecords.map(mapStandardRecordToOption),
    [standardRecords],
  );

  const enterprises = useMemo<Enterprise[]>(
    () =>
      organizationsQuery.data?.content.map(mapOrganizationRecordToEnterprise) ??
      [],
    [organizationsQuery.data?.content],
  );

  const areas = useMemo<Area[]>(
    () => areasQuery.data?.content.map(mapBranchRecordToArea) ?? [],
    [areasQuery.data?.content],
  );

  const methods = useForm<
    EnterpriseCertificateFormInput,
    unknown,
    EnterpriseCertificateFormValues
  >({
    defaultValues: defaultEnterpriseCertificateFormValues,
    resolver: zodResolver(enterpriseCertificateFormSchema),
    mode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (!isEdit || !detailQuery.data) return;

    const mapped = mapFarmCertificateRecordToFormData(detailQuery.data);
    reset({
      ...defaultEnterpriseCertificateFormValues,
      ...mapped,
      attachments: mapped.attachments ?? [],
    });
  }, [detailQuery.data, isEdit, reset]);

  const createMutation = useMutation({
    mutationFn: (values: EnterpriseCertificateFormValues) =>
      farmCertificateApi.create(
        buildFarmCertificatePayload(values, {
          standards: standardRecords,
          enterprises,
          areas,
        }),
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["enterprise-certificate", "certificates"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number | string;
      values: EnterpriseCertificateFormValues;
    }) =>
      farmCertificateApi.update(
        id,
        buildFarmCertificatePayload(values, {
          standards: standardRecords,
          enterprises,
          areas,
        }),
      ),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["enterprise-certificate", "certificates"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["enterprise-certificate", "detail", variables.id],
      });
    },
  });

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = handleSubmit(async (values) => {
    try {
      if (isEdit && editId !== null) {
        await updateMutation.mutateAsync({
          id: editId,
          values,
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật chứng nhận",
        });
      } else {
        await createMutation.mutateAsync(values);
        toast({
          title: "Thành công",
          description: "Đã thêm chứng nhận mới",
        });
      }

      setShowConfirmDialog(false);
      setLocation("/enterprise-certificate");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";

      toast({
        title: isEdit ? "Không thể cập nhật" : "Không thể thêm",
        description: message,
        variant: "destructive",
      });
    }
  });

  const handleCancel = () => {
    setLocation("/enterprise-certificate");
  };

  const resolveErrorMessage = (...messages: Array<string | null | undefined>) =>
    messages.find((message) => Boolean(message)) ?? null;

  return {
    isEdit,
    editItem: detailQuery.data ? mapFarmCertificateRecordToView(detailQuery.data) : null,
    methods,
    standards,
    enterprises,
    areas,
    showConfirmDialog,
    setShowConfirmDialog,
    loading:
      standardsQuery.loading ||
      organizationsQuery.isLoading ||
      areasQuery.isLoading ||
      detailQuery.isLoading,
    error: resolveErrorMessage(
      standardsQuery.error,
      organizationsQuery.error?.message,
      areasQuery.error?.message,
      detailQuery.error?.message,
    ),
    handleComplete,
    submitForm,
    handleCancel,
    handleSubmit,
    watch: methods.watch,
  };
}
