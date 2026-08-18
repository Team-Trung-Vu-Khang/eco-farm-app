import React from "react";
import {
  Card,
  CardContent,
  Input,
  Label,
  Button,
  Textarea,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trash, Calendar } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { SeasonFormValues } from "../schemas/seasonFormSchema";

interface SeasonStageCardProps {
  index: number;
  onRemove: () => void;
}

export const SeasonStageCard = ({ index, onRemove }: SeasonStageCardProps) => {
  const { control } = useFormContext<SeasonFormValues>();

  return (
    <Card className="relative overflow-hidden border-2 focus-within:border-primary/50 transition-all bg-white">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {index + 1}
            </div>
            <h3 className="font-bold text-lg">Giai đoạn {index + 1}</h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={onRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold">Tên giai đoạn</Label>
            <FormField
              control={control}
              name={`stages.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="VD: Giai đoạn 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Thời gian (ngày)</Label>
            <FormField
              control={control}
              name={`stages.${index}.durationDays`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex items-center h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 group">
                      <Calendar className="w-4 h-4 text-slate-400 mr-2 group-focus-within:text-primary transition-colors shrink-0" />
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        className="w-full outline-none bg-transparent p-0 placeholder:text-slate-300 [&::-webkit-inner-spin-button]:appearance-none"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Mô tả giai đoạn</Label>
          <FormField
            control={control}
            name={`stages.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Mô tả các công việc cần thực hiện trong giai đoạn này..."
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
