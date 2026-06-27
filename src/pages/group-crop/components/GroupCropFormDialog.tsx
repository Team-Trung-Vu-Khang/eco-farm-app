import { useEffect } from "react";
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
import type { GroupCropFormData } from "../hooks/useGroupCropPage";

const formSchema = z.object({
  code: z.string().min(1, { message: "Mã nhóm cây là bắt buộc" }),
  name: z.string().min(1, { message: "Tên nhóm cây là bắt buộc" }),
  biological: z.string().optional(),
  description: z.string().optional(),
});

interface GroupCropFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: GroupCropFormData;
  onSubmit: (data: GroupCropFormData) => void;
  isPending?: boolean;
}

export const GroupCropFormDialog = ({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  isPending,
}: GroupCropFormDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      biological: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: initialData.code || "",
        name: initialData.name || "",
        biological: initialData.biological || "",
        description: initialData.description || "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      code: values.code,
      name: values.name,
      biological: values.biological || "",
      description: values.description || "",
    });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Chỉnh sửa nhóm cây trồng" : "Thêm mới nhóm cây trồng"}
      size="xl"
      onSubmit={form.handleSubmit(handleSubmit)}
      loading={isPending}
    >
      <Form {...form}>
        <div className="space-y-6 pt-2 pb-4">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Mã nhóm cây <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: CC001"
                      className="focus-visible:ring-green-500"
                      disabled={isEdit}
                      clearable={!isEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biological"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Đặc tính sinh học
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Cây lâu năm"
                      className="focus-visible:ring-green-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Tên nhóm cây <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Cây có múi"
                    className="focus-visible:ring-green-500"
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
                <FormLabel className="font-semibold">Ghi chú</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập ghi chú chi tiết về nhóm cây..."
                    rows={4}
                    className="resize-none focus-visible:ring-green-500"
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
};
