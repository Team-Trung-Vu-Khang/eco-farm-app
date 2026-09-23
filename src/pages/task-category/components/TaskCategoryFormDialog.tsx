import { useEffect, useState, type KeyboardEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Badge,
  FormDialog,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { X } from "lucide-react";
// TODO: Tạm ẩn chọn "Nhóm công việc", mặc định luôn là "Trồng trọt" (crop)
// import {
//   taskCategoryDomainLabel,
//   taskCategoryDomainOptions,
// } from "../data/constants";
import type { TaskCategoryFormData } from "../types/types";
import { normalizeHashtag } from "../utils/hashtags";

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
  const [hashtagInput, setHashtagInput] = useState("");
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
    setHashtagInput("");
  }, [open, initialData, form]);

  const addHashtag = (hashtags: string[], onChange: (v: string[]) => void) => {
    const tag = normalizeHashtag(hashtagInput);
    if (tag && !hashtags.includes(tag)) onChange([...hashtags, tag]);
    setHashtagInput("");
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Gộp luôn hashtag đang gõ dở nhưng chưa nhấn Enter
    const pending = normalizeHashtag(hashtagInput);
    const hashtags =
      pending && !values.hashtags.includes(pending)
        ? [...values.hashtags, pending]
        : values.hashtags;
    onSubmit({
      name: values.name,
      description: values.description || "",
      domain: values.domain,
      hashtags,
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Hashtags</label>
              <Input
                placeholder="Nhập hashtag rồi nhấn Enter"
                data-testid="input-hashtag"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addHashtag(field.value, field.onChange);
                  } else if (
                    e.key === "Backspace" &&
                    !hashtagInput &&
                    field.value.length
                  ) {
                    field.onChange(field.value.slice(0, -1));
                  }
                }}
              />
              {field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      #{tag}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer"
                        onClick={() =>
                          field.onChange(field.value.filter((t) => t !== tag))
                        }
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
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
