import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { vietQrBankData } from "../../../constants/banks";
import { useCreateBank } from "../../../features/bank/hooks/useCreateBank";
import useBankStore from "../../../stores/useBankStore";
import { BANK_LOGOS, emptyBankFormData } from "../data/constants";
import type { BankDirectoryCreateRequest } from "../../../features/bank/types/bank.type";
import type { BankFormData } from "../types/types";

interface UseBankFormPageOptions {
  mode: "create" | "edit";
}

export function useBankFormPage({ mode }: UseBankFormPageOptions) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bank/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const createBank = useCreateBank({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm tài khoản ngân hàng",
      });
    },
    onError: (error) => {
      toast({
        title: "Không thể thêm",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const handleSubmit = async () => {
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
      const bankInfo = vietQrBankData.find(
        (bank) =>
          bank.shortName === formData.bankName || bank.name === formData.bankName,
      );

      const payload: BankDirectoryCreateRequest = {
        code: bankInfo?.code ?? formData.bankName.trim().toUpperCase(),
        bin: formData.accountNumber.trim(),
        shortName: bankInfo?.shortName ?? formData.bankName.trim(),
        name: bankInfo?.name ?? formData.accountHolder.trim(),
        logoUrl: bankInfo?.logo ?? formData.logo,
        swiftCode: bankInfo?.swift_code ?? null,
        transferSupported: bankInfo ? Boolean(bankInfo.transferSupported) : true,
        lookupSupported: bankInfo ? Boolean(bankInfo.lookupSupported) : true,
        displayOrder: bankInfo?.id ?? 0,
        status: formData.status,
        metadataJson: {
          source: "manual",
          accountHolder: formData.accountHolder,
          branch: formData.branch,
          note: formData.note,
        },
      };

      await createBank.mutateAsync(payload);
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
