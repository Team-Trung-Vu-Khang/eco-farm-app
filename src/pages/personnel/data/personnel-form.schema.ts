import * as z from "zod";

export const personnelFormSchema = z
  .object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    phone: z.string().min(1, "Số điện thoại là bắt buộc"),
    email: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Email không hợp lệ",
      ),
    province: z.string().optional(),
    ward: z.string().optional(), // Replaced district with ward
    address: z.string().optional(),
    personalTaxCode: z.string().optional(), // Replaced taxCode with personalTaxCode
    taxAddress: z.string().optional(),
    avatarUrl: z.string().optional(),
    avatarFile: z.any().optional(),
    departmentType: z.enum(["OWNER", "MASTER"]).optional(),
    department: z.string().optional(),
    positionType: z.enum(["OWNER", "MASTER"]).optional(),
    position: z.string().optional(),
    team: z.string().optional(),
    status: z.enum(["active", "inactive", "archived"] as const), // Added archived
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolder: z.string().optional(),
    bankBranch: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasAnyJobInfo =
      !!data.department ||
      !!data.position ||
      !!data.team;

    if (hasAnyJobInfo) {
      if (!data.department) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn phòng ban",
          path: ["department"],
        });
      }
      if (!data.position) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn chức vụ",
          path: ["position"],
        });
      }
      if (!data.team) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn đội / nhóm",
          path: ["team"],
        });
      }
    }

    const hasAnyBankInfo =
      !!data.bankName ||
      !!data.accountNumber ||
      !!data.accountHolder ||
      !!data.bankBranch;

    if (hasAnyBankInfo) {
      if (!data.bankName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng chọn ngân hàng",
          path: ["bankName"],
        });
      }
      if (!data.bankBranch) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập chi nhánh",
          path: ["bankBranch"],
        });
      }
      if (!data.accountNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập số tài khoản",
          path: ["accountNumber"],
        });
      }
      if (!data.accountHolder) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập tên chủ tài khoản",
          path: ["accountHolder"],
        });
      }
    }
  });

export type PersonnelFormValues = z.infer<typeof personnelFormSchema>;

export const emptyPersonnelFormValues: PersonnelFormValues = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  ward: "",
  address: "",
  personalTaxCode: "",
  taxAddress: "",
  avatarUrl: "",
  avatarFile: undefined,
  departmentType: undefined,
  department: "",
  positionType: undefined,
  position: "",
  team: "",
  status: "active",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  bankBranch: "",
};
