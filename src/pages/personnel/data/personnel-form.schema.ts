import * as z from "zod";

export const personnelFormSchema = z
  .object({
    fullName: z.string().min(1, "Họ và tên là bắt buộc"),
    phone: z.string().min(1, "Số điện thoại là bắt buộc"),
    email: z
      .string()
      .min(1, "Email là bắt buộc")
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Email không hợp lệ",
      ),
    province: z.string().optional(),
    ward: z.string().optional(), // Replaced district with ward
    address: z.string().optional(),
    personalTaxCode: z.string().min(1, "Mã số thuế là bắt buộc"), // Replaced taxCode with personalTaxCode
    taxAddress: z.string().optional(),
    avatarUrl: z.string().optional(),
    avatarFile: z.any().optional(),
    departmentType: z.enum(["OWNER", "MASTER"]).optional(),
    department: z.string().min(1, "Vui lòng chọn phòng ban"),
    positionType: z.enum(["OWNER", "MASTER"]).optional(),
    position: z.string().min(1, "Vui lòng chọn chức vụ"),
    teamIds: z.array(z.string()).optional(),
    status: z.enum(["active", "inactive", "archived"] as const), // Added archived
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolder: z.string().optional(),
    bankBranch: z.string().optional(),
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
  teamIds: [],
  status: "active",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  bankBranch: "",
};
