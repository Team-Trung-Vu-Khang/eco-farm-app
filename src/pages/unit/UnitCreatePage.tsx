import React from "react";
import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import { useUnitFormPage } from "./hooks/useUnitFormPage";

const UnitCreatePage = () => {
  const {
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
    goBack,
  } = useUnitFormPage();

  // Map materials to options for Combobox
  const materialOptions = React.useMemo(() => {
    return materials.map((m) => ({
      value: String(m.id),
      label: `${m.name} (${m.code})`,
    }));
  }, [materials]);

  // Filter options to prevent selecting the same material in both fields
  const sourceMaterialOptions = React.useMemo(() => {
    return materialOptions.filter((opt) => opt.value !== targetMaterialId);
  }, [materialOptions, targetMaterialId]);

  const targetMaterialOptions = React.useMemo(() => {
    return materialOptions.filter((opt) => opt.value !== sourceMaterialId);
  }, [materialOptions, sourceMaterialId]);

  // Map material ID to name for preview table
  const getMaterialName = (id: number) => {
    const mat = materials.find((m) => m.id === id);
    return mat ? mat.name : `Vật tư #${id}`;
  };

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật đơn vị quy đổi" : "Thêm mới đơn vị quy đổi"}
      description={
        isEdit
          ? "Chỉnh sửa quy tắc quy đổi giữa hai vật tư"
          : "Định nghĩa quy tắc quy đổi giữa hai vật tư (Vật tư quy đổi = Số lượng * Vật tư)"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inputs Section */}
          <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-base font-semibold text-slate-800">
                {isEdit ? "Chỉnh sửa quy tắc quy đổi" : "Tạo quy tắc quy đổi"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Source Material */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">
                    Vật tư quy đổi <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={sourceMaterialOptions}
                    value={sourceMaterialId}
                    onChange={setSourceMaterialId}
                    placeholder="Chọn vật tư nguồn..."
                  />
                </div>

                {/* Equals sign */}
                <div className="flex items-center justify-center py-2 md:pb-3 shrink-0">
                  <span className="text-slate-400 font-bold text-xl px-2">
                    =
                  </span>
                </div>

                {/* Conversion Factor */}
                <div className="w-full md:max-w-[120px] md:w-[120px] shrink-0 space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">
                    Số lượng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.000001"
                    value={conversionFactor}
                    onChange={(e) => setConversionFactor(e.target.value)}
                    required
                    placeholder="Hệ số..."
                    className="w-full"
                  />
                </div>

                {/* Target Material */}
                <div className="flex-1 min-w-0 space-y-2">
                  <Label className="text-xs font-semibold text-slate-500">
                    Vật tư <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    options={targetMaterialOptions}
                    value={targetMaterialId}
                    onChange={setTargetMaterialId}
                    placeholder="Chọn vật tư đích..."
                  />
                </div>

                {/* Add button (only in Create mode) */}
                {!isEdit && (
                  <Button
                    type="button"
                    onClick={handleAddPreview}
                    className="w-full md:w-auto shrink-0 gap-1 bg-primary hover:bg-primary/95 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section (only in Create mode) */}
          {!isEdit && (
            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-800">
                  Xem trước danh sách thêm mới ({previewList.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {previewList.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-400">
                    Chưa có quy tắc quy đổi nào được thêm. Hãy chọn vật tư và số
                    lượng bên trên rồi bấm "Thêm".
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm text-slate-600">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                          <th className="py-3 px-6 w-16">STT</th>
                          <th className="py-3 px-6">Vật tư quy đổi</th>
                          <th className="py-3 px-6 w-12 text-center">=</th>
                          <th className="py-3 px-6 w-32">Số lượng</th>
                          <th className="py-3 px-6">Vật tư</th>
                          <th className="py-3 px-6 w-20 text-center">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewList.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors duration-150"
                          >
                            <td className="py-3.5 px-6 font-medium text-slate-400">
                              {index + 1}
                            </td>
                            <td className="py-3.5 px-6 font-medium text-slate-800">
                              {getMaterialName(item.sourceMaterialId)}
                            </td>
                            <td className="py-3.5 px-6 text-center font-bold text-slate-400">
                              =
                            </td>
                            <td className="py-3.5 px-6 font-semibold text-slate-800">
                              {item.conversionFactor.toLocaleString("vi-VN")}
                            </td>
                            <td className="py-3.5 px-6 text-slate-600">
                              {getMaterialName(item.targetMaterialId)}
                            </td>
                            <td className="py-3.5 px-6 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePreview(index)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={goBack}>
              Hủy bỏ
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              {isEdit ? "Lưu thay đổi" : "Lưu lại"}
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default UnitCreatePage;
