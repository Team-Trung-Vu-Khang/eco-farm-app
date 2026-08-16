import { useState, useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { supplyConversionRuleApi, farmSupplyApi } from "@/features/farm-supply";
import type {
  ConversionRuleSupplyType,
  SupplyConversionRuleResponse,
} from "../types/types";
import type { DomainCode, SupplyItemResponse } from "@/features/farm-supply";
import axios from "axios";

export interface PreviewItem {
  fromSupplyItemId: number;
  fromSupplyItemName: string;
  fromSupplyItemCode: string;
  toSupplyItemId: number;
  toSupplyItemName: string;
  toSupplyItemCode: string;
  quantity: number;
}

export function useUnitFormPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/supply-conversion-rules/:id/edit");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEdit = match && Boolean(params?.id);
  const editItemId = isEdit && params?.id ? Number(params.id) : null;

  // ─── Supply type & domain selection (must be chosen before selecting items) ─

  const [supplyType, setSupplyType] =
    useState<ConversionRuleSupplyType>("medicine");
  const [domainCode, setDomainCode] = useState<DomainCode>("CROP");

  // ─── Form fields ──────────────────────────────────────────────────────────

  const [fromSupplyItemId, setFromSupplyItemId] = useState<string>("");
  const [toSupplyItemId, setToSupplyItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [previewList, setPreviewList] = useState<PreviewItem[]>([]);

  // ─── Load supply items for dropdown ───────────────────────────────────────

  const supplyItemsQuery = useQuery({
    queryKey: ["supply-items-for-conversion", supplyType, domainCode],
    queryFn: () =>
      farmSupplyApi.list(supplyType, {
        domainCode,
        status: "active",
        page: 0,
        size: 100,
      }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const supplyItems: SupplyItemResponse[] =
    supplyItemsQuery.data?.content ?? [];

  // ─── Load existing rule when editing ──────────────────────────────────────

  const editQuery = useQuery({
    queryKey: ["supply-conversion-rules", "detail", editItemId],
    queryFn: () => supplyConversionRuleApi.farmGetById(editItemId!),
    enabled: !!editItemId,
    staleTime: 5 * 60 * 1000,
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEdit && editQuery.data) {
      const rule = editQuery.data;
      // Normalize supplyType (GraphQL uppercase → lowercase)
      const normalizedType =
        rule.supplyType.toLowerCase() as ConversionRuleSupplyType;
      setSupplyType(normalizedType);
      setDomainCode(rule.domainCode as DomainCode);
      setFromSupplyItemId(String(rule.fromSupplyItem.id));
      setToSupplyItemId(String(rule.toSupplyItem.id));
      setQuantity(String(rule.quantity));
    }
  }, [isEdit, editQuery.data]);

  // ─── Mutations ────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: {
      fromSupplyItemId: number;
      quantity: number;
      toSupplyItemId: number;
    }) => supplyConversionRuleApi.farmCreate(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["supply-conversion-rules"],
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        fromSupplyItemId: number;
        quantity: number;
        toSupplyItemId: number;
      };
    }) => supplyConversionRuleApi.farmUpdate(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["supply-conversion-rules"],
      });
    },
  });

  // ─── Dropdown options ─────────────────────────────────────────────────────

  const supplyItemOptions = useMemo(
    () =>
      supplyItems.map((item) => ({
        value: String(item.id),
        label: `${item.name} (${item.sku || item.code})`,
      })),
    [supplyItems],
  );

  const fromOptions = useMemo(
    () => supplyItemOptions.filter((opt) => opt.value !== toSupplyItemId),
    [supplyItemOptions, toSupplyItemId],
  );

  const toOptions = useMemo(
    () => supplyItemOptions.filter((opt) => opt.value !== fromSupplyItemId),
    [supplyItemOptions, fromSupplyItemId],
  );

  // ─── Reset dropdowns when supplyType/domainCode changes ───────────────────

  const handleSupplyTypeChange = (value: ConversionRuleSupplyType) => {
    setSupplyType(value);
    setFromSupplyItemId("");
    setToSupplyItemId("");
  };

  const handleDomainCodeChange = (value: DomainCode) => {
    setDomainCode(value);
    setFromSupplyItemId("");
    setToSupplyItemId("");
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const getItemName = (id: number) => {
    const item = supplyItems.find((s) => s.id === id);
    return item?.name ?? `Vật tư #${id}`;
  };

  const getItemCode = (id: number) => {
    const item = supplyItems.find((s) => s.id === id);
    return item?.sku || item?.code || "";
  };

  // ─── Validate ─────────────────────────────────────────────────────────────

  const validateInputs = (): boolean => {
    if (!fromSupplyItemId || !toSupplyItemId || !quantity) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn vật tư và nhập số lượng",
        variant: "destructive",
      });
      return false;
    }

    const fromId = Number(fromSupplyItemId);
    const toId = Number(toSupplyItemId);
    const qty = Number(quantity);

    if (fromId === toId) {
      toast({
        title: "Lỗi quy đổi",
        description: "Không thể quy đổi cùng một loại vật tư",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Số lượng quy đổi phải lớn hơn 0",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // ─── Handle 409 errors ────────────────────────────────────────────────────

  const handle409Error = (e: unknown) => {
    if (axios.isAxiosError(e) && e.response?.status === 409) {
      toast({
        title: "Trùng lặp",
        description:
          "Cặp vật tư này đã có quy tắc quy đổi. Mỗi cặp vật tư chỉ có thể có 1 quy tắc (không phân biệt chiều).",
        variant: "destructive",
      });
      return true;
    }
    return false;
  };

  // ─── Preview list (create mode) ───────────────────────────────────────────

  const handleAddPreview = () => {
    if (!validateInputs()) return;

    const fromId = Number(fromSupplyItemId);
    const toId = Number(toSupplyItemId);
    const qty = Number(quantity);

    // Check duplicate (bi-directional) in preview
    const isDuplicate = previewList.some(
      (item) =>
        (item.fromSupplyItemId === fromId && item.toSupplyItemId === toId) ||
        (item.fromSupplyItemId === toId && item.toSupplyItemId === fromId),
    );
    if (isDuplicate) {
      toast({
        title: "Trùng lặp",
        description:
          "Cặp vật tư này đã có trong danh sách preview (không phân biệt chiều)",
        variant: "destructive",
      });
      return;
    }

    setPreviewList((prev) => [
      ...prev,
      {
        fromSupplyItemId: fromId,
        fromSupplyItemName: getItemName(fromId),
        fromSupplyItemCode: getItemCode(fromId),
        toSupplyItemId: toId,
        toSupplyItemName: getItemName(toId),
        toSupplyItemCode: getItemCode(toId),
        quantity: qty,
      },
    ]);

    // Reset form for next entry
    setFromSupplyItemId("");
    setToSupplyItemId("");
    setQuantity("1");
  };

  const handleRemovePreview = (index: number) => {
    setPreviewList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isEdit) {
      // ── Update mode ──────────────────────────────────────────────────────
      if (!validateInputs()) return;

      const fromId = Number(fromSupplyItemId);
      const toId = Number(toSupplyItemId);
      const qty = Number(quantity);

      try {
        await updateMutation.mutateAsync({
          id: editItemId!,
          data: {
            fromSupplyItemId: fromId,
            quantity: qty,
            toSupplyItemId: toId,
          },
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật quy tắc quy đổi",
        });
        setLocation("/supply-conversion-rules");
      } catch (e: any) {
        if (!handle409Error(e)) {
          toast({
            title: "Lỗi",
            description: e.message || "Cập nhật không thành công",
            variant: "destructive",
          });
        }
      }
    } else {
      // ── Create mode ──────────────────────────────────────────────────────
      if (previewList.length === 0) {
        if (fromSupplyItemId && toSupplyItemId && quantity) {
          toast({
            title: "Nhắc nhở",
            description:
              "Vui lòng bấm nút 'Thêm' để đưa quy tắc quy đổi vào danh sách bên dưới trước khi Lưu.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Trống",
            description: "Chưa có quy tắc quy đổi nào được thêm vào danh sách.",
            variant: "destructive",
          });
        }
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const item of previewList) {
        try {
          await createMutation.mutateAsync({
            fromSupplyItemId: item.fromSupplyItemId,
            quantity: item.quantity,
            toSupplyItemId: item.toSupplyItemId,
          });
          successCount++;
        } catch (e: any) {
          failCount++;
          if (!handle409Error(e)) {
            toast({
              title: "Lỗi",
              description: `Không thể tạo quy tắc ${item.fromSupplyItemName} → ${item.toSupplyItemName}: ${e.message || "Lỗi không xác định"}`,
              variant: "destructive",
            });
          }
        }
      }

      if (successCount > 0) {
        toast({
          title: "Thành công",
          description: `Đã lưu ${successCount} quy tắc quy đổi${failCount > 0 ? ` (${failCount} thất bại)` : ""}`,
        });
        setLocation("/supply-conversion-rules");
      }
    }
  };

  // ─── Return ───────────────────────────────────────────────────────────────

  return {
    isEdit,
    loading: editQuery.isLoading || supplyItemsQuery.isLoading,
    submitting: createMutation.isPending || updateMutation.isPending,

    // Supply type & domain
    supplyType,
    setSupplyType: handleSupplyTypeChange,
    domainCode,
    setDomainCode: handleDomainCodeChange,

    // Dropdown options
    fromOptions,
    toOptions,

    // Form fields
    fromSupplyItemId,
    setFromSupplyItemId,
    toSupplyItemId,
    setToSupplyItemId,
    quantity,
    setQuantity,

    // Preview (create mode)
    previewList,
    handleAddPreview,
    handleRemovePreview,

    // Actions
    handleSubmit,
    goBack: () => setLocation("/supply-conversion-rules"),
  };
}
