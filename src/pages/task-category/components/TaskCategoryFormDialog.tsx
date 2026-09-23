import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormDialog,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
// TODO: Tạm ẩn chọn "Nhóm công việc", mặc định luôn là "Trồng trọt" (crop)
// import {
//   taskCategoryDomainLabel,
//   taskCategoryDomainOptions,
// } from "../data/constants";
import type { TaskCategoryFormData } from "../types/types";
import { taskCategoryTagFields } from "../data/constants";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên công việc là bắt buộc" }),
  description: z.string().optional(),
  domain: z.enum(["crop", "animal", "aquaculture"]),
  hashtags: z.array(z.string()),
  status: z.enum(["active", "inactive"]).optional(),
});

interface TaskCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: TaskCategoryFormData;
  onSubmit: (data: TaskCategoryFormData) => void;
  isSubmitting?: boolean;
}

export function TaskCategoryFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  isSubmitting,
}: TaskCategoryFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      domain: "crop",
      hashtags: [],
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        domain: initialData.domain || "crop",
        hashtags: initialData.hashtags || [],
        status: initialData.status || "active",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      description: values.description || "",
      domain: values.domain,
      hashtags: values.hashtags,
      status: values.status,
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
      onSubmit={form.handleSubmit(handleSubmit)}
      loading={isSubmitting}
    >
      <div className="space-y-4 pt-2">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tên công việc <span className="text-destructive">*</span>
              </label>
              <Input placeholder="VD: Làm đất" data-testid="input-name" {...field} />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        {/* TODO: Tạm ẩn field "Nhóm công việc" vì hiện chỉ có lĩnh vực Trồng trọt.
            Giá trị `domain` vẫn được giữ trong form state với default "crop".
        <Controller
          control={form.control}
          name="domain"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nhóm công việc <span className="text-destructive">*</span>
              </label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger data-testid="select-domain">
                  <SelectValue placeholder="Chọn nhóm công việc" />
                </SelectTrigger>
                <SelectContent>
                  {taskCategoryDomainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {taskCategoryDomainLabel[option.value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        */}

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea
                placeholder="Mô tả chi tiết về công việc"
                rows={3}
                data-testid="input-description"
                {...field}
              />
              {fieldState.error && (
                <p className="text-sm text-destructive">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <>
              {taskCategoryTagFields.map((tagField) => (
                <div key={tagField.key} className="space-y-2">
                  <label className="text-sm font-medium">{tagField.label}</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {tagField.options.map((option) => {
                      const isActive = field.value.includes(option.tag);
                      return (
                        <button
                          key={option.tag}
                          type="button"
                          data-testid={`tag-${option.tag}`}
                          onClick={() =>
                            field.onChange(
                              isActive
                                ? field.value.filter((t) => t !== option.tag)
                                : [...field.value, option.tag],
                            )
                          }
                          className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-all ${
                            isActive
                              ? option.activeClass
                              : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                              isActive
                                ? option.iconClass
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <option.icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-semibold uppercase">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        />

        {isEdit && (
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        )}
      </div>
    </FormDialog>
  );
}
