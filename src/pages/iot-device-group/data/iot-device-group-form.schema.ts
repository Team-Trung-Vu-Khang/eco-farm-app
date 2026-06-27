import { z } from "zod";

export const IOT_DEVICE_GROUP_FORM_STATUSES = [
  "active",
  "inactive",
  "archived",
] as const;

export const iotDeviceGroupFormSchema = z.object({
  code: z.string().trim().min(1, "Vui lòng nhập mã nhóm."),
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm."),
  description: z.string().trim().default(""),
  status: z.enum(IOT_DEVICE_GROUP_FORM_STATUSES, {
    message: "Vui lòng chọn trạng thái.",
  }),
});

export type IoTDeviceGroupFormInput = z.input<typeof iotDeviceGroupFormSchema>;
export type IoTDeviceGroupFormValues =
  z.output<typeof iotDeviceGroupFormSchema>;
