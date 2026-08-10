import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FormDialog,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { TaskCategoryFormData } from "../types/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "Tên công việc là bắt buộc" }),
  description: z.string().optional(),
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
      status: "active",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: initialData.name || "",
        description: initialData.description || "",
        status: initialData.status || "active",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      description: values.description || "",
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
      <Form {...form}>
        <div className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên công việc
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Làm đất"
                    data-testid="input-name"
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
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mô tả chi tiết về công việc"
                    rows={3}
                    data-testid="input-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEdit ? (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
      </Form>
    </FormDialog>
  );
}
