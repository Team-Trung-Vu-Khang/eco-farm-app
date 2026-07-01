import { z } from "zod";

export const bankAccountStatusSchema = z.enum([
  "active",
  "inactive",
  "archived",
]);

export const bankCreateFormSchema = z.object({
  bankName: z.string().trim().min(1, "Vui lòng chọn ngân hàng"),
  accountNumber: z.string().trim().min(1, "Vui lòng nhập số tài khoản"),
  ownerType: z.string().trim().min(1, "Vui lòng chọn đơn vị sở hữu"),
  ownerId: z.string().trim().min(1, "Vui lòng chọn đơn vị sở hữu"),
  accountHolder: z.string().trim().min(1, "Vui lòng chọn đơn vị sở hữu"),
  branch: z.string().trim().default(""),
  note: z.string().trim().default(""),
  status: bankAccountStatusSchema.default("active"),
  isPrimary: z.boolean().default(true),
});

export type BankCreateFormInput = z.input<typeof bankCreateFormSchema>;
export type BankCreateFormValues = z.output<typeof bankCreateFormSchema>;

export const defaultBankCreateFormValues: BankCreateFormValues = {
  bankName: "",
  accountNumber: "",
  ownerType: "",
  ownerId: "",
  accountHolder: "",
  branch: "",
  note: "",
  status: "active",
  isPrimary: true,
};
