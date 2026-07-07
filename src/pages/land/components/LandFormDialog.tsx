import { useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDialog,
  Input,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  INVALID_IMAGE_PLACEHOLDER,
  type LandFormData,
} from "../data/land.constants";

const formSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, { message: "Tên loại đất là bắt buộc" }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

interface LandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: LandFormData;
  onSubmit: (data: LandFormData) => void;
  onFileSelect: (file: File | null) => void;
  isSubmitting?: boolean;
}

export default function LandFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  onFileSelect,
  isSubmitting = false,
}: LandFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: initialData.code || undefined,
        name: initialData.name || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [open, initialData, form]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      form.setValue("imageUrl", URL.createObjectURL(file), {
        shouldValidate: true,
      });
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      code: values.code,
      name: values.name,
      description: values.description || "",
      imageUrl: values.imageUrl || "",
    });
  };

  return (
    <FormDialog
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa loại đất" : "Thêm loại đất mới"}
      onSubmit={form.handleSubmit(handleSubmit)}
      loading={isSubmitting}
    >
      <Form {...form}>
        <div className="w-full space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã loại đất</FormLabel>
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
                  Tên loại đất
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Đất phù sa"
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hình ảnh</FormLabel>
                <div className="flex flex-col gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    data-testid="input-image"
                  />
                  <div className="text-sm text-gray-500">
                    Hoặc nhập URL hình ảnh:
                  </div>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                </div>

                {field.value && (
                  <div className="relative mt-2 h-40 w-full">
                    <img
                      src={field.value}
                      alt="Preview"
                      className="h-full w-full rounded-md border object-cover"
                      onError={(e) => {
                        e.currentTarget.src = INVALID_IMAGE_PLACEHOLDER;
                      }}
                    />
                  </div>
                )}
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
                    placeholder="Mô tả chi tiết về loại đất"
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
