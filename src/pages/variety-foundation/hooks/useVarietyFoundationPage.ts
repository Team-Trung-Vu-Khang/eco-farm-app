import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useLocation } from "wouter";
import {
  useCropVarieties,
  useCropVarietyMutations,
  useCrops,
} from "../../../features/foundation";
import type { VarietyFoundation } from "../types/types";

function formatDaysToDuration(days: number | undefined): string {
  if (!days) return "";
  let remaining = days;
  const years = Math.floor(remaining / 365);
  remaining %= 365;
  const months = Math.floor(remaining / 30);
  remaining %= 30;

  const parts = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (remaining > 0) parts.push(`${remaining} ngày`);

  if (parts.length === 0) return "";
  return parts.join(" ");
}

export function useVarietyFoundationPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pageSize, setPageSize] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [cropId, setCropId] = useState<string>("all");

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentIndex(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "status") {
      setStatus(value);
      setCurrentIndex(1);
    } else if (key === "crop") {
      setCropId(value);
      setCurrentIndex(1);
    }
  };

  // Fetch real crops to build "Cây trồng" filter options
  const { items: cropsList } = useCrops({
    params: {
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const filters = [
    {
      key: "crop",
      label: "Cây trồng",
      options: [
        ...cropsList.map((c) => ({
          label: c.name,
          value: String(c.id),
        })),
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Hoạt động", value: "active" },
        { label: "Ngừng hoạt động", value: "inactive" },
        { label: "Đã lưu trữ", value: "archived" },
      ],
    },
  ];

  const [, setLocation] = useLocation();
  const { items, response, loading, error } = useCropVarieties({
    params: {
      keyword: debouncedSearch.trim() || undefined,
      status: status === "all" ? undefined : status,
      cropId: cropId === "all" ? undefined : Number(cropId),
      page: Math.max(currentIndex - 1, 0),
      size: pageSize,
    },
  });
  const { deleteCropVariety } = useCropVarietyMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<VarietyFoundation | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Parse items from API into UI VarietyFoundation interface
  const varieties: VarietyFoundation[] = items.map((item) => {
    const metadata = item.metadataJson || {};

    const docs = item.documents || [];
    const pdfDoc = docs.find((d) => d.type === "pdf");
    const editorDoc = docs.find((d) => d.type === "editor");

    let contentType: "pdf" | "editor" = "editor";
    if (pdfDoc) contentType = "pdf";

    return {
      id: String(item.id),
      varietyFoundationCode: item.code || "",
      varietyFoundationName: item.name || "",
      crop: String(item.cropName), // or map crop name if available
      description: item.description || "",
      origin: item.origin || "",
      growthDuration: formatDaysToDuration(item.growthDurationDays),
      averageYield:
        item.avgYieldFrom || item.avgYieldTo
          ? `${item.avgYieldFrom || 0}-${item.avgYieldTo || 0}`
          : "",
      status: item.status as "active" | "inactive",
      updatedAt: new Date().toISOString(), // Or from item if available
      illustration: (item as any).imageUrl || metadata.illustrationUrl || null,
      scientificName: metadata.scientificName || "",
      documents: docs
        .filter((d) => d.type === "pdf")
        .map((d) => ({ name: d.name || "Tài liệu PDF", url: d.fileUrl || "" })),
      contentType,
      editorContent: editorDoc?.content || "",
      // pdfFile is rarely preserved from API, typically just a URL in documents
    };
  });

  const selectedVarietyFoundation = selectedId
    ? varieties.find((v) => v.id === selectedId) || null
    : null;

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: error,
      });
    }
  }, [error, toast]);

  const handleDelete = (item: VarietyFoundation) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      deleteCropVariety.mutate(Number(deleteItem.id), {
        onSuccess: () => {
          toast({ title: "Thành công", description: "Đã xóa giống cây trồng" });
          setDeleteOpen(false);
          setDeleteItem(null);
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: err.message,
          });
          setDeleteOpen(false);
        },
      });
    }
  };

  const handleView = (item: VarietyFoundation) => {
    setSelectedId(item.id);
    setDetailOpen(true);
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);

    if (!open) {
      setSelectedId(null);
    }
  };

  return {
    varieties,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    loading,
    deleteOpen,
    setDeleteOpen,
    selectedId,
    selectedVarietyFoundation,
    detailOpen,
    setDetailOpen: handleDetailOpenChange,
    handleDelete,
    handleConfirmDelete,
    handleView,
    filters,
    handleFilterChange,
    handleEdit: (item: VarietyFoundation) =>
      setLocation(`/variety-foundation/${item.id}/edit`),
  };
}
