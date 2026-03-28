import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useBankStore from "../../../stores/useBankStore";
import { BANK_LOGOS, emptyBankFormData } from "../data/constants";
import type { BankFormData } from "../types/types";

interface UseBankFormPageOptions {
  mode: "create" | "edit";
}

export function useBankFormPage({ mode }: UseBankFormPageOptions) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bank/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const bankAccounts = useBankStore((state) => state.bankAccounts);
  const addBankAccount = useBankStore((state) => state.addBankAccount);
  const getBankAccountById = useBankStore((state) => state.getBankAccountById);
  const updateBankAccount = useBankStore((state) => state.updateBankAccount);
  const deleteBankAccount = useBankStore((state) => state.deleteBankAccount);

  const bankAccountId = params?.id ? parseInt(params.id) : undefined;
  const bankAccount =
    mode === "edit" && bankAccountId
      ? getBankAccountById(bankAccountId)
      : undefined;

  const [formData, setFormData] = useState<BankFormData>(() =>
    bankAccount
      ? {
          bankName: bankAccount.bankName,
          accountNumber: bankAccount.accountNumber,
          accountHolder: bankAccount.accountHolder,
          branch: bankAccount.branch,
          status: bankAccount.status,
          note: bankAccount.note,
          logo: bankAccount.logo,
        }
      : emptyBankFormData,
  );

  const updateField = <K extends keyof BankFormData>(
    key: K,
    value: BankFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBankChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      bankName: value,
      logo: BANK_LOGOS[value] || "",
    }));
  };

  const validate = () => {
    if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    if (mode === "edit") {
      if (!bankAccountId) {
        return;
      }

      updateBankAccount(bankAccountId, formData);
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật tài khoản "${formData.bankName} - ${formData.accountNumber}"`,
      });
    } else {
      const newId =
        bankAccounts.length > 0 ? Math.max(...bankAccounts.map((b) => b.id)) + 1 : 1;

      addBankAccount({
        id: newId,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
        branch: formData.branch,
        status: formData.status,
        note: formData.note,
        logo: formData.logo,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Thành công",
        description: `Đã thêm tài khoản ngân hàng "${formData.bankName} - ${formData.accountNumber}"`,
      });
    }

    setLocation("/bank");
  };

  const handleDelete = () => {
    if (bankAccountId) {
      deleteBankAccount(bankAccountId);
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
      setLocation("/bank");
    }
  };

  return {
    formData,
    updateField,
    handleBankChange,
    handleSubmit,
    handleDelete,
    deleteOpen,
    setDeleteOpen,
    goBack: () => setLocation("/bank"),
    notFound: mode === "edit" && bankAccountId !== undefined && !bankAccount,
  };
}
