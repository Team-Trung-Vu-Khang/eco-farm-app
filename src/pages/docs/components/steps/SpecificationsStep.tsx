import { type ChangeEvent } from "react";
import {
  Button,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash } from "lucide-react";
import type { CreateDocsForm, CreateDocsSpecification } from "../../types";

interface SpecificationsStepProps {
  formData: CreateDocsForm;
  setFormData: (data: any) => void;
  onAddSpecs: () => void;
}

export function SpecificationsStep({
  formData,
  setFormData,
  onAddSpecs,
}: SpecificationsStepProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid gap-4">
        {formData?.specifications?.map((spec, index) => {
          const handleChangeSpecValue =
            (key: keyof CreateDocsSpecification) =>
            (e: ChangeEvent<HTMLInputElement>) => {
              const specClone = Array.from(formData?.specifications ?? []);
              specClone[index] = {
                ...specClone[index],
                [key]: e.target.value,
              };
              setFormData((prev: CreateDocsForm) => ({
                ...prev,
                specifications: specClone,
              }));
            };

          const handleRemoveSpec = () => {
            setFormData((prev: CreateDocsForm) => ({
              ...prev,
              specifications: prev?.specifications?.filter(
                (_, _index) => _index !== index
              ),
            }));
          };

          return (
            <div
              key={`spec-${index}`}
              className="group relative p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="space-y-1.5 flex-1 w-full">
                  <Label
                    htmlFor={`${spec.specName}-${index}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Thông số
                  </Label>
                  <Input
                    value={spec.specName}
                    placeholder="VD: Độ pH, Mật độ..."
                    id={`${spec.specName}-${index}`}
                    onChange={handleChangeSpecValue("specName")}
                    className="bg-background focus:bg-background h-10 shadow-none border-0 ring-1 ring-inset ring-input focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <Label
                    htmlFor={`${spec.specValue}-${index}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Giá trị / Định mức
                  </Label>
                  <Input
                    value={spec.specValue}
                    placeholder="VD: 5.5 - 6.5, 6x6m..."
                    id={`${spec.specValue}-${index}`}
                    onChange={handleChangeSpecValue("specValue")}
                    className="bg-background focus:bg-background h-10 shadow-none border-0 ring-1 ring-inset ring-input focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="h-full pt-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveSpec}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={onAddSpecs}
        className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all rounded-xl font-medium"
      >
        <Plus className="h-4 w-4" />
        Thêm thông số kỹ thuật
      </Button>
    </div>
  );
}
