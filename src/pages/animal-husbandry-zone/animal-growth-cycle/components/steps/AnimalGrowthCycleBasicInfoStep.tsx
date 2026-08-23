import { Badge, Button, FormControl, FormField, FormItem, FormMessage, Input, Label, RadioGroup, RadioGroupItem } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Fish, PawPrint, Plus, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import type { ProductionSubjectResponse, ProductionSubjectVariantResponse } from "../../../../../features/foundation/types/foundation.type";
import type { AnimalGrowthCycleFormValues } from "../../schemas/animalGrowthCycleSchema";
import { productionSubjectGroupApi } from "../../../../../features/foundation/api/foundation.api";
import type { PageResponse, ProductionSubjectGroupResponse } from "../../../../../features/foundation/types/foundation.type";
import { GrowthCycleMultiSelectDialog, type GrowthCycleMultiSelectOption } from "../../../../growth-cycle/components/GrowthCycleMultiSelectDialog";

interface Props { varieties: ProductionSubjectVariantResponse[]; crops: ProductionSubjectResponse[]; }

function ScopeOption({ checked, icon, inputId, title, value, description, onClick }: { checked: boolean; icon: ReactNode; inputId: string; title: string; value: string; description: string; onClick: () => void }) {
  return <div className={`relative flex flex-row items-center gap-4 rounded-2xl border-2 p-4 transition-all ${checked ? "border-primary bg-primary/5 shadow-md" : "border-muted hover:border-primary/50 hover:bg-muted/50"}`} onClick={onClick}>
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${checked ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}>{icon}</div>
    <div className="flex-1 space-y-1"><div className="flex items-center space-x-2"><RadioGroupItem value={value} id={inputId} /><Label htmlFor={inputId} className="cursor-pointer text-base font-bold">{title}</Label></div><p className="text-xs leading-snug text-muted-foreground">{description}</p></div>
  </div>;
}

export function AnimalGrowthCycleBasicInfoStep({ varieties, crops }: Props) {
  const { watch, setValue, control } = useFormContext<AnimalGrowthCycleFormValues>();
  const scope = watch("scope");
  const cropIds = watch("cropIds") || [];
  const varietyIds = watch("varietyIds") || [];
  const groupIds = watch("groupIds") || [];
  const [dialogOpen, setDialogOpen] = useState(false);

  const cropOptions: GrowthCycleMultiSelectOption[] = useMemo(() => crops.map((crop) => ({ id: String(crop.id), name: crop.name, group: crop.family || crop.scientificName || "Vật nuôi", image: crop.imageUrl || "", description: crop.origin || `Mã vật nuôi: ${crop.code}`, code: crop.code })), [crops]);
  const varietyOptions: GrowthCycleMultiSelectOption[] = useMemo(() => varieties.map((variety) => ({ id: String(variety.id), name: variety.name, group: variety.origin || "Giống vật nuôi", image: variety.imageUrl || "", description: variety.description || `Mã giống: ${variety.code}`, code: variety.code })), [varieties]);
  const { data: groupResponse } = useQuery<PageResponse<ProductionSubjectGroupResponse>>({ queryKey: ["animal-growth-cycle-groups", "LIVESTOCK"], queryFn: () => productionSubjectGroupApi.list({ domainCode: "LIVESTOCK", page: 0, size: 100, status: "active" }), staleTime: 300_000 });
  const groupOptions: GrowthCycleMultiSelectOption[] = useMemo(() => (groupResponse?.content || []).map((group) => ({ id: String(group.id), name: group.name, group: group.biological || "Nhóm vật nuôi", image: "", description: group.description || `Mã nhóm: ${group.code}`, code: group.code })), [groupResponse?.content]);
  const activeOptions = scope === "group" ? groupOptions : scope === "variety" ? varietyOptions : cropOptions;
  const activeIds = scope === "group" ? groupIds : scope === "variety" ? varietyIds : cropIds;

  return <div className="mx-auto max-w-4xl space-y-8 py-4">
    <div className="space-y-6">
      <FormField control={control} name="name" render={({ field }) => <FormItem className="space-y-2"><Label className="text-sm font-semibold" required>Tên chu kỳ sinh trưởng</Label><FormControl><Input {...field} placeholder="VD: Chu kỳ chăn nuôi Heo thịt..." /></FormControl><FormMessage /></FormItem>} />
      <div className="space-y-3"><Label className="text-base font-semibold">Phạm vi áp dụng</Label><FormField control={control} name="scope" render={({ field }) => <FormItem><FormControl><RadioGroup value={field.value} onValueChange={(value) => { field.onChange(value); setValue("groupIds", [], { shouldValidate: true }); setValue("cropIds", [], { shouldValidate: true }); setValue("varietyIds", [], { shouldValidate: true }); }} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ScopeOption checked={field.value === "group"} icon={<PawPrint className="h-6 w-6" />} inputId="scope-group" title="Theo nhóm vật nuôi" value="group" description="Áp dụng cho tất cả vật nuôi thuộc nhóm được chọn." onClick={() => field.onChange("group")} />
        <ScopeOption checked={field.value === "crop"} icon={<PawPrint className="h-6 w-6" />} inputId="scope-crop" title="Theo vật nuôi" value="crop" description="Áp dụng cho tất cả các giống thuộc vật nuôi được chọn." onClick={() => field.onChange("crop")} />
        <ScopeOption checked={field.value === "variety"} icon={<Fish className="h-6 w-6" />} inputId="scope-variety" title="Theo giống vật nuôi" value="variety" description="Áp dụng cho các giống vật nuôi cụ thể được chọn." onClick={() => field.onChange("variety")} />
      </RadioGroup></FormControl><FormMessage /></FormItem>} /></div>
      <FormField control={control} name={scope === "group" ? "groupIds" : scope === "variety" ? "varietyIds" : "cropIds"} render={() => <FormItem><FormControl><div className="space-y-2"><div className="flex items-center justify-between"><Label className="text-sm font-semibold">{scope === "group" ? "Nhóm vật nuôi" : scope === "variety" ? "Giống vật nuôi" : "Vật nuôi"}</Label><Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] font-bold text-amber-700">{activeIds.length} đã chọn</Badge></div><Button type="button" onClick={() => setDialogOpen(true)} variant="outline" className="w-full cursor-pointer gap-2 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 font-bold text-primary hover:border-primary/40 hover:bg-primary/10"><Plus className="h-5 w-5" />{activeIds.length ? "Chỉnh sửa lựa chọn" : scope === "group" ? "Chọn nhóm vật nuôi" : scope === "variety" ? "Chọn giống vật nuôi" : "Chọn vật nuôi"}</Button>{activeIds.length > 0 && <div className="space-y-2">{activeOptions.filter((option) => activeIds.includes(option.id)).map((option) => <div key={option.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"><div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">{option.image ? <img src={option.image} alt={option.name} className="h-full w-full object-cover" /> : <span className="text-sm font-black text-muted-foreground">{option.name.charAt(0).toUpperCase()}</span>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{option.name}</p><p className="truncate text-xs text-muted-foreground">{option.description || option.group || `Mã: ${option.code || option.id}`}</p></div><button type="button" onClick={() => setValue(scope === "group" ? "groupIds" : scope === "variety" ? "varietyIds" : "cropIds", activeIds.filter((id) => id !== option.id), { shouldValidate: true })} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button></div>)}</div>}</div></FormControl><FormMessage /></FormItem>} />
    </div>
    <GrowthCycleMultiSelectDialog open={dialogOpen} onOpenChange={setDialogOpen} title={scope === "group" ? "Chọn nhóm vật nuôi" : scope === "variety" ? "Chọn giống vật nuôi" : "Chọn vật nuôi"} description={scope === "group" ? "Chọn một hoặc nhiều nhóm vật nuôi áp dụng." : scope === "variety" ? "Chọn một hoặc nhiều giống vật nuôi áp dụng." : "Chọn một hoặc nhiều vật nuôi áp dụng."} searchPlaceholder={scope === "group" ? "Tìm nhóm vật nuôi..." : scope === "variety" ? "Tìm giống vật nuôi..." : "Tìm vật nuôi..."} selectedIds={activeIds} resource={scope === "group" ? "group" : scope === "variety" ? "variety" : "crop"} subjectIds={cropIds} optionsLabel={scope === "group" ? "Nhóm vật nuôi" : scope === "variety" ? "Giống vật nuôi" : "Vật nuôi"} domainCode="LIVESTOCK" onConfirm={(ids) => setValue(scope === "group" ? "groupIds" : scope === "variety" ? "varietyIds" : "cropIds", ids, { shouldValidate: true })} />
  </div>;
}
