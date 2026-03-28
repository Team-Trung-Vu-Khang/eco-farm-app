import {
  Card,
  CardContent,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Editor,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Boxes, Plus, ShieldCheck, Trash } from "lucide-react";
import { initialEditorValue } from "../../docs/mocks";
import {
  materialOptions,
  phiOptions,
} from "../data/createTreatment.constants";
import type { CreateTreatmentFormData } from "../types/createTreatment.types";

interface CreateTreatmentMaterialsStepProps {
  formData: CreateTreatmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreateTreatmentFormData>>;
  onAddMaterial: () => void;
  onRemoveMaterial: (id: string) => void;
}

export function CreateTreatmentMaterialsStep({
  formData,
  setFormData,
  onAddMaterial,
  onRemoveMaterial,
}: CreateTreatmentMaterialsStepProps) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Danh mục thuốc / Vật tư</h3>
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={onAddMaterial}
          >
            <Plus className="w-4 h-4" />
            Thêm vật tư
          </Button>
        </div>

        <div className="space-y-4">
          {formData.materials.map((material, idx) => (
            <Card key={material.id} className="relative border-none bg-slate-50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <Boxes className="w-3 h-3" />
                    Vật tư #{idx + 1}
                  </div>
                  {formData.materials.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400"
                      onClick={() => onRemoveMaterial(material.id)}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={material.name}
                    onValueChange={(value) => {
                      const newMaterials = [...formData.materials];
                      newMaterials[idx].name = value;
                      setFormData({ ...formData, materials: newMaterials });
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn thuốc/vật tư" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Liều lượng (VD: 20ml/25L)"
                    className="bg-white"
                    value={material.dosage}
                    onChange={(event) => {
                      const newMaterials = [...formData.materials];
                      newMaterials[idx].dosage = event.target.value;
                      setFormData({ ...formData, materials: newMaterials });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <Card className="border-2">
          <CardContent className="p-6 space-y-6">
            <h4 className="font-bold">Cấu hình an toàn</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Thời gian cách ly (PHI)
                </Label>
                <Select
                  value={formData.phi}
                  onValueChange={(value) => setFormData({ ...formData, phi: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phiOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-4 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <Label className="text-sm font-bold">
                      Lưu ý an toàn / Cảnh báo
                    </Label>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                      Hướng dẫn bảo hộ & PHI
                    </p>
                  </div>
                </div>
                <Card className="overflow-hidden shadow-sm border-2 focus-within:border-amber-500/50 transition-all">
                  <Editor
                    maxLength={5000}
                    contentEditableClassname="h-[120px] p-4 focus:outline-none"
                    editorSerializedState={initialEditorValue}
                  />
                </Card>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Chi phí ước tính / Ha
                </Label>
                <div className="relative">
                  <Input
                    placeholder="0"
                    className="pr-12 font-bold"
                    value={formData.estimatedCost}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        estimatedCost: event.target.value,
                      })
                    }
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    VNĐ
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
