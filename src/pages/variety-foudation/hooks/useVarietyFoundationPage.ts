import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useCropVarieties,
  useCropVarietyMutations,
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
  const [, setLocation] = useLocation();
  const { items, loading, error, refetch } = useCropVarieties();
  const { deleteCropVariety } = useCropVarietyMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<VarietyFoundation | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Parse items from API into UI VarietyFoundation interface
  const varieties: VarietyFoundation[] = items.map((item) => {
    let metadata: any = {};
    if (item.metadataJson) {
      try {
        metadata =
          typeof item.metadataJson === "string"
            ? JSON.parse(item.metadataJson)
            : item.metadataJson;
      } catch (e) {
        console.error("Failed to parse metadataJson", e);
      }
    }

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
      illustration: metadata.illustrationUrl || null,
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
    handleEdit: (item: VarietyFoundation) =>
      setLocation(`/variety-foudation/${item.id}/edit`),
  };
}
