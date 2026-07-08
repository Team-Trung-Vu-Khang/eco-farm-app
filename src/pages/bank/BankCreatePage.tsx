import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { useLocation } from "wouter";

import type { BankAccountCreateRequest } from "@/features/bank";
import { useCreateBankAccount } from "@/features/bank";
import type { MasterDataRecord } from "@/features/master-data";
import { useMasterData } from "@/features/master-data";

import { OrganizationSelectDialog } from "@/components/organizations/OrganizationSelectDialog";
import BankLogo from "./components/BankLogo";
import {
  bankCreateFormSchema,
  defaultBankCreateFormValues,
  type BankCreateFormInput,
  type BankCreateFormValues,
} from "./data/bank-form.schema";

type BankMasterDataFields = {
  shortName?: string;
  logoUrl?: string;
  bin?: string;
  swiftCode?: string;
};

type BankMasterDataRecord = MasterDataRecord<"banks"> & BankMasterDataFields;

function mapFormValuesToPayload(
  values: BankCreateFormValues,
  banks: BankMasterDataRecord[],
): BankAccountCreateRequest {
  const selectedBank =
    banks.find((bank) => String(bank.id) === String(values.bankId)) ||
    banks.find((bank) => bank.code === values.bankName);

  return {
    bankId: selectedBank?.id || values.bankId,
    accountNumber: values.accountNumber,
    accountHolder: values.accountHolder,
    branch: values.branch || undefined,
    note: values.note || undefined,
    status: values.status,
    displayOrder: 0,
    isPrimary: values.isPrimary,
    metadataJson: null,
  };
}

export default function BankCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);

  const banksQuery = useMasterData("banks", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const banks = useMemo(
    () => banksQuery.items as BankMasterDataRecord[],
    [banksQuery.items],
  );

  const form = useForm<BankCreateFormInput, unknown, BankCreateFormValues>({
    defaultValues: defaultBankCreateFormValues,
    resolver: zodResolver(bankCreateFormSchema),
    mode: "onSubmit",
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedBankCode = useWatch({ control, name: "bankName" });
  const selectedBankId = useWatch({ control, name: "bankId" });
  const selectedOwnerId = useWatch({ control, name: "ownerId" });
  const selectedBank = useMemo(
    () =>
      banks.find((bank) => String(bank.id) === String(selectedBankId)) ||
      banks.find((bank) => bank.code === selectedBankCode),
    [banks, selectedBankCode, selectedBankId],
  );

  const createBankAccount = useCreateBankAccount({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo tài khoản ngân hàng mới",
      });
      setLocation("/bank");
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit: SubmitHandler<BankCreateFormValues> = async (values) => {
    const payload = mapFormValuesToPayload(values, banks);
    await createBankAccount.createBankAccount(payload);
  };

  const handleConfirmOrganization = (organization: {
    id: number | string;
    type: string;
    name: string;
  }) => {
    setValue("ownerId", String(organization.id), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("ownerType", organization.type, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("accountHolder", organization.name, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSelectBank = (bankId: string) => {
    const selected = banks.find((bank) => String(bank.id) === bankId);
    setValue("bankId", bankId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue(
      "bankName",
      selected?.code || selected?.shortName || selected?.name || "",
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới tài khoản ngân hàng"
      description="Thêm tài khoản ngân hàng mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/bank")}>
            <X className="mr-2 h-4 w-4" />
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="bank-create-form"
            disabled={isSubmitting || createBankAccount.isPending}
          >
            {isSubmitting || createBankAccount.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting || createBankAccount.isPending
              ? "Đang lưu..."
              : "Lưu lại"}
          </Button>
        </div>
      }
    >
      <div className="mx-auto max-w-2xl">
        <form id="bank-create-form" onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Chi tiết thông tin tài khoản ngân hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName" required>
                  Tên ngân hàng
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name="bankName"
                      render={() => (
                        <Select
                          value={selectedBankId}
                          onValueChange={handleSelectBank}
                        >
                          <SelectTrigger
                            id="bankName"
                            aria-invalid={!!errors.bankName}
                          >
                            <SelectValue placeholder="Chọn ngân hàng" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56">
                            {banks.map((bank) => (
                              <SelectItem key={bank.id} value={String(bank.id)}>
                                {bank.shortName || bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.bankName ? (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.bankName.message}
                      </p>
                    ) : null}
                  </div>
                  {selectedBank ? (
                    <BankLogo
                      bankName={selectedBank.shortName || selectedBank.name}
                      logo={selectedBank.logoUrl}
                      className="rounded-lg"
                    />
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" required>
                    Số tài khoản
                  </Label>
                  <Controller
                    control={control}
                    name="accountNumber"
                    render={({ field }) => (
                      <Input
                        id="accountNumber"
                        placeholder="Nhập số tài khoản"
                        aria-invalid={!!errors.accountNumber}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                      />
                    )}
                  />
                  {errors.accountNumber ? (
                    <p className="text-xs text-red-600">
                      {errors.accountNumber.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder" required>
                    Chủ tài khoản
                  </Label>
                  <Controller
                    control={control}
                    name="accountHolder"
                    render={({ field }) => (
                      <div className="relative">
                        <Input
                          id="accountHolder"
                          readOnly
                          placeholder="Chọn đơn vị sở hữu"
                          className="pr-10 cursor-pointer"
                          aria-invalid={!!errors.accountHolder}
                          value={field.value}
                          onClick={() => setOwnerDialogOpen(true)}
                          onFocus={() => setOwnerDialogOpen(true)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                        />
                        {field.value ? (
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setValue("ownerId", "", {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                              setValue("ownerType", "", {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                              field.onChange("");
                            }}
                            aria-label="Xóa chủ tài khoản"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  />
                  {errors.accountHolder ? (
                    <p className="text-xs text-red-600">
                      {errors.accountHolder.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <Controller
                control={control}
                name="ownerType"
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <Controller
                control={control}
                name="ownerId"
                render={({ field }) => <input type="hidden" {...field} />}
              />

              <div className="space-y-2">
                <Label htmlFor="branch">Chi nhánh ngân hàng</Label>
                <Controller
                  control={control}
                  name="branch"
                  render={({ field }) => (
                    <Input
                      id="branch"
                      placeholder="VD: Chi nhánh Hoàn Kiếm"
                      aria-invalid={!!errors.branch}
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Controller
                  control={control}
                  name="note"
                  render={({ field }) => (
                    <Textarea
                      id="note"
                      placeholder="Ghi chú thêm..."
                      rows={3}
                      aria-invalid={!!errors.note}
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  )}
                />
              </div>

              <div className="mt-2 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>
                  Vui lòng kiểm tra kỹ thông tin số tài khoản và chủ tài khoản
                  để tránh sai sót trong quá trình giao dịch.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <OrganizationSelectDialog
        open={ownerDialogOpen}
        onOpenChange={setOwnerDialogOpen}
        selectedId={selectedOwnerId}
        onConfirm={handleConfirmOrganization}
      />
    </AdminLayout>
  );
}
