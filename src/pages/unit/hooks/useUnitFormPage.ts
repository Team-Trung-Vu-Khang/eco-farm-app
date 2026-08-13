import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useUnitStore from "../../../stores/useUnitStore";
import useMaterialStore from "../../../stores/useMaterialStore";

export interface PreviewItem {
  sourceMaterialId: number;
  targetMaterialId: number;
  conversionFactor: number;
}

export function useUnitFormPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/unit/:id/edit");
  const { toast } = useToast();

  const getUnitById = useUnitStore((state) => state.getUnitById);
  const addUnits = useUnitStore((state) => state.addUnits);
  const updateUnit = useUnitStore((state) => state.updateUnit);
  const materials = useMaterialStore((state) => state.materials);

  const isEdit = match && Boolean(params?.id);
  const editItemId = isEdit && params?.id ? Number(params.id) : null;
  const editItem = editItemId ? getUnitById(editItemId) : undefined;

  const [sourceMaterialId, setSourceMaterialId] = useState<string>("");
  const [targetMaterialId, setTargetMaterialId] = useState<string>("");
  const [conversionFactor, setConversionFactor] = useState<string>("1");
  const [previewList, setPreviewList] = useState<PreviewItem[]>([]);

  // Pre-fill form if in Edit Mode
  useEffect(() => {
    if (isEdit && editItem) {
      setSourceMaterialId(String(editItem.sourceMaterialId ?? ""));
      setTargetMaterialId(String(editItem.targetMaterialId ?? ""));
      setConversionFactor(String(editItem.conversionFactor ?? "1"));
    }
  }, [isEdit, editItem]);

  const handleAddPreview = () => {
    if (!sourceMaterialId || !targetMaterialId || !conversionFactor) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn vật tư và số lượng",
        variant: "destructive",
      });
      return;
    }
    const fromId = Number(sourceMaterialId);
    const toId = Number(targetMaterialId);
    const qty = Number(conversionFactor);

    if (fromId === toId) {
      toast({
        title: "Lỗi quy đổi",
        description: "Không thể quy đổi cùng một loại vật tư",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Lỗi nhập liệu",
        description: "Số lượng quy đổi phải lớn hơn 0",
        variant: "destructive",
      });
      return;
    }

    // Check duplicate in preview
    const isDuplicate = previewList.some(
      (item) => item.sourceMaterialId === fromId && item.targetMaterialId === toId,
    );
    if (isDuplicate) {
      toast({
        title: "Trùng lặp",
        description: "Quy tắc quy đổi này đã có trong danh sách preview",
        variant: "destructive",
      });
      return;
    }

    setPreviewList((prev) => [
      ...prev,
      { sourceMaterialId: fromId, targetMaterialId: toId, conversionFactor: qty },
    ]);

    // Reset all form inputs for convenient subsequent additions
    setSourceMaterialId("");
    setTargetMaterialId("");
    setConversionFactor("1");
  };

  const handleRemovePreview = (index: number) => {
    setPreviewList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEdit) {
      if (!sourceMaterialId || !targetMaterialId || !conversionFactor) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng chọn vật tư và số lượng",
          variant: "destructive",
        });
        return;
      }
      const fromId = Number(sourceMaterialId);
      const toId = Number(targetMaterialId);
      const qty = Number(conversionFactor);

      if (fromId === toId) {
        toast({
          title: "Lỗi quy đổi",
          description: "Không thể quy đổi cùng một loại vật tư",
          variant: "destructive",
        });
        return;
      }

      if (isNaN(qty) || qty <= 0) {
        toast({
          title: "Lỗi nhập liệu",
          description: "Số lượng quy đổi phải lớn hơn 0",
          variant: "destructive",
        });
        return;
      }

      if (editItemId) {
        updateUnit(editItemId, {
          sourceMaterialId: fromId,
          targetMaterialId: toId,
          conversionFactor: qty,
        });
        toast({
          title: "Thành công",
          description: "Đã cập nhật quy tắc quy đổi",
        });
        setLocation("/unit");
      }
    } else {
      // Create mode
      if (previewList.length === 0) {
        // If they have inputs filled but didn't click add
        if (sourceMaterialId && targetMaterialId && conversionFactor) {
          toast({
            title: "Nhắc nhở",
            description: "Vui lòng bấm nút 'Thêm' để đưa quy tắc quy đổi vào danh sách bên dưới trước khi Lưu.",
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

      // Prepare list of units to save
      const unitsToSave = previewList.map((item) => ({
        sourceMaterialId: item.sourceMaterialId,
        targetMaterialId: item.targetMaterialId,
        conversionFactor: item.conversionFactor,
      }));

      addUnits(unitsToSave);
      toast({
        title: "Thành công",
        description: `Đã lưu thành công ${unitsToSave.length} quy tắc quy đổi`,
      });
      setLocation("/unit");
    }
  };

  return {
    isEdit,
    materials,
    sourceMaterialId,
    setSourceMaterialId,
    targetMaterialId,
    setTargetMaterialId,
    conversionFactor,
    setConversionFactor,
    previewList,
    handleAddPreview,
    handleRemovePreview,
    handleSubmit,
    goBack: () => setLocation("/unit"),
  };
}
