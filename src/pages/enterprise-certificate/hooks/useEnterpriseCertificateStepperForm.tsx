import { farmCertificateApi } from "@/features/farm-certificate";
import { regionApi } from "@/features/farm/api/farm.api";
import { useMasterData } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import type {
  Area,
} from "../../../stores/useEnterpriseCertificateStore";
import {
  defaultEnterpriseCertificateFormValues,
  enterpriseCertificateFormSchema,
  type EnterpriseCertificateFormInput,
  type EnterpriseCertificateFormValues,
} from "../data/enterprise-certificate-form.schema";
import {
  buildFarmCertificatePayload,
  mapFarmCertificateRecordToFormData,
  mapFarmCertificateRecordToView,
  mapStandardRecordToOption,
  mapRegionRecordToArea,
} from "../utils";

export function useEnterpriseCertificateStepperForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const workspaceId = useSelectedWorkspaceId();
  const [, setLocation] = useLocation();
  const [, editParams] = useRoute("/enterprise-certificate/:id/edit");

  const editId = editParams?.id ? Number(editParams.id) : null;
  const isEdit = Boolean(editId);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const debouncedRegionSearch = useDebounce(regionSearch, 300);

  const standardsQuery = useMasterData("certificate-standards", {
    params: {
      page: 0,
      size: 100,
    },
    enabled: true,
  });

  const regionsQuery = useInfiniteQuery({
    queryKey: ["enterprise-certificate", "regions", debouncedRegionSearch] as const,
    queryFn: ({ pageParam }) =>
      regionApi.list({
        keyword: debouncedRegionSearch.trim() || undefined,
        page: pageParam,
        size: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const regions = useMemo(
    () => regionsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [regionsQuery.data],
  );

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

  const areas = useMemo<Area[]>(
    () => regions.map(mapRegionRecordToArea),
    [regions],
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
          areas,
          workspaceId: workspaceId ?? "",
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
          areas,
          workspaceId: workspaceId ?? "",
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
    setShowLoadingDialog(true);
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
    } finally {
      setShowLoadingDialog(false);
    }
  });

  const handleCancel = () => {
    setLocation("/enterprise-certificate");
  };

  const resolveErrorMessage = (...messages: Array<string | null | undefined>) =>
    messages.find((message) => Boolean(message)) ?? null;

  return {
    isEdit,
    editItem: detailQuery.data
      ? mapFarmCertificateRecordToView(detailQuery.data)
      : null,
    methods,
    standards,
    regions,
    onRegionSearchChange: setRegionSearch,
    loadMoreRegions: regionsQuery.fetchNextPage,
    hasMoreRegions: regionsQuery.hasNextPage,
    isLoadingMoreRegions: regionsQuery.isFetchingNextPage,
    areas,
    showConfirmDialog,
    setShowConfirmDialog,
    showLoadingDialog,
    loading:
      standardsQuery.loading ||
      regionsQuery.isLoading ||
      detailQuery.isLoading,
    error: resolveErrorMessage(
      standardsQuery.error,
      regionsQuery.error?.message,
      detailQuery.error?.message,
    ),
    handleComplete,
    submitForm,
    handleCancel,
    handleSubmit,
    watch: methods.watch,
  };
}
