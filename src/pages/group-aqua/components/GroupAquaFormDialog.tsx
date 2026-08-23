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
import type { GroupAquaFormData } from "../hooks/useGroupAquaPage";

const formSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, { message: "Tên nhóm thủy sản là bắt buộc" }),
  biological: z.string().optional(),
  description: z.string().optional(),
});

interface GroupAquaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialData: GroupAquaFormData;
  onSubmit: (data: GroupAquaFormData) => void;
  isPending?: boolean;
}

export const GroupAquaFormDialog = ({
  open,
  onOpenChange,
  isEdit,
  initialData,
  onSubmit,
  isPending,
}: GroupAquaFormDialogProps) => {
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
      title={isEdit ? "Chỉnh sửa nhóm thủy sản" : "Thêm mới nhóm thủy sản"}
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
                  <FormLabel className="font-semibold">Mã nhóm thủy sản</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        isEdit ? field.value : "Tự động sinh nếu để trống"
                      }
                      disabled={isEdit}
                      clearable={!isEdit}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Tên nhóm thủy sản <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Cá da trơn"
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
            name="biological"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Đặc tính sinh học
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Thủy sản nước ngọt"
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
                    placeholder="Nhập ghi chú chi tiết về nhóm thủy sản..."
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
