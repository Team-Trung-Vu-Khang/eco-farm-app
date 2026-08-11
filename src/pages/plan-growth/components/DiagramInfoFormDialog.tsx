import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Badge,
  Form,
  FormControl,
  FormDialog,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
import useRegionStore from "@/stores/useRegionStore";
import GeographicalSelector from "./GeographicalSelector";
import { summarizeSelections } from "../utils/location";
import type { GeographicalSelection } from "../types";

export interface DiagramInfoFormData {
  name: string;
  description: string;
  selections: GeographicalSelection[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên sơ đồ là bắt buộc" }),
  description: z.string().optional(),
});

interface DiagramInfoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: DiagramInfoFormData;
  onSubmit: (data: DiagramInfoFormData) => void;
  isSubmitting?: boolean;
}

export function DiagramInfoFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  isSubmitting,
}: DiagramInfoFormDialogProps) {
  const { regions } = useRegionStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [selections, setSelections] = useState<GeographicalSelection[]>([]);
  const [regionsTouched, setRegionsTouched] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
      });
      setSelections(initialData.selections || []);
      setRegionsTouched(false);
    }
  }, [open, initialData, form]);

  const selectionSummary = useMemo(
    () => summarizeSelections(selections, regions || []),
    [regions, selections],
  );

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (selections.length === 0) {
      setRegionsTouched(true);
      return;
    }

    onSubmit({
      name: values.name,
      description: values.description || "",
      selections,
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa sơ đồ quy trình" : "Tạo sơ đồ quy trình"}
      submitLabel="Lưu phác đồ"
      onSubmit={form.handleSubmit(handleSubmit)}
      loading={isSubmitting}
      size="lg"
    >
      <Form {...form}>
        <div className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên sơ đồ
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Sơ đồ canh tác lúa vụ Hè Thu"
                    data-testid="input-diagram-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả sơ bộ</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả sơ bộ về sơ đồ quy trình"
                    rows={3}
                    data-testid="input-diagram-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground font-black uppercase tracking-widest">
                Vùng sản xuất <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-semibold">
                Chọn 1-n khu vực/lô từ sơ đồ ban đầu
              </span>
            </div>
            <GeographicalSelector
              regions={regions || []}
              enterpriseId=""
              existingSelections={selections}
              onConfirm={(newSelections) => {
                setSelections(newSelections);
                setRegionsTouched(true);
              }}
            />
            {regionsTouched && selections.length === 0 && (
              <p className="text-xs text-destructive">
                Vui lòng chọn ít nhất một vùng sản xuất
              </p>
            )}

            {selectionSummary.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-white/50 border border-emerald-100/50 space-y-3">
                <div className="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Phạm vi đã chọn ({selections.length} mục)
                </div>
                <div className="space-y-3">
                  {selectionSummary.map((group) => (
                    <div key={group.regionId} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        {group.regionName}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-2.5">
                        {group.items.map((item, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className={cn(
                              "text-[10px] py-0 px-2 h-5 font-medium border-emerald-100 shadow-sm",
                              item.type === "region"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.type === "area"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-white text-slate-600 border-slate-200",
                            )}
                          >
                            <span className="opacity-70 mr-1 uppercase text-[8px] font-black">
                              {item.type === "region"
                                ? "Vùng"
                                : item.type === "area"
                                  ? "Khu"
                                  : "Lô"}
                            </span>
                            {item.name}
                            {item.parentName && (
                              <span className="ml-1 opacity-50 font-normal italic">
                                ({item.parentName})
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </FormDialog>
  );
}
