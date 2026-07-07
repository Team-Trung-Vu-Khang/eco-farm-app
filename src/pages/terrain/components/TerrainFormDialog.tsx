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
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { TerrainFormData } from "../types/types";

const formSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, { message: "Tên địa hình là bắt buộc" }),
  description: z.string().optional(),
});

interface TerrainFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: TerrainFormData;
  onSubmit: (data: TerrainFormData) => void;
  isSubmitting?: boolean;
}

export function TerrainFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  isSubmitting,
}: TerrainFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: initialData.code || undefined,
        name: initialData.name || "",
        description: initialData.description || "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      code: values.code,
      name: values.name,
      description: values.description || "",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa địa hình" : "Thêm địa hình mới"}
      onSubmit={form.handleSubmit(handleSubmit)}
      loading={isSubmitting}
    >
      <Form {...form}>
        <div className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã địa hình</FormLabel>
                <FormControl>
                  <Input
                    placeholder={isEdit ? field.value : "Tự động sinh nếu để trống"}
                    disabled={isEdit}
                    clearable={!isEdit}
                    data-testid="input-code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên địa hình
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Đồng bằng"
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
                    placeholder="Mô tả chi tiết về loại địa hình"
                    rows={3}
                    data-testid="input-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </FormDialog>
  );
}
