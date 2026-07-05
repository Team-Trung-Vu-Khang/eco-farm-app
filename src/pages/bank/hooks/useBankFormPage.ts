import {
  useBankAccountById,
  useDeleteBankAccount,
  useUpdateBankAccount,
} from "@/features/bank";
import { useMasterData, type MasterDataRecord } from "@/features/master-data";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { emptyBankFormData } from "../data/constants";
import type { BankFormData } from "../types/types";

interface UseBankFormPageOptions {
  mode: "create" | "edit";
}

type BankMasterDataRecord = MasterDataRecord<"banks"> & {
  id: number | string;
  shortName?: string;
  logoUrl?: string;
  bin?: string;
};

const mapBankAccountToFormData = (
  bankAccount?: ReturnType<typeof useBankAccountById>["item"],
): BankFormData =>
  bankAccount
    ? {
        bankId: bankAccount.bank?.id ?? "",
        bankName: bankAccount.bank?.shortName || bankAccount.bank?.code || "",
        accountNumber: bankAccount.accountNumber || "",
        accountHolder: bankAccount.accountHolder || "",
        branch: bankAccount.branch || "",
        status: bankAccount.status || "active",
        note: bankAccount.note || "",
        logo: bankAccount.bank?.logoUrl || "",
      }
    : emptyBankFormData;

export function useBankFormPage({ mode }: UseBankFormPageOptions) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bank/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const banksQuery = useMasterData("banks", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });

  const bankAccountId = params?.id ? parseInt(params.id) : undefined;
  const bankAccountQuery = useBankAccountById(bankAccountId ?? null, {
    enabled: mode === "edit" && bankAccountId !== undefined,
  });
  const bankAccount = bankAccountQuery.item;
  const updateBankAccountMutation = useUpdateBankAccount();
  const deleteBankAccountMutation = useDeleteBankAccount({
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
      setLocation("/bank");
    },
  });

  const bankRecords = useMemo(
    () => banksQuery.items as BankMasterDataRecord[],
    [banksQuery.items],
  );

  const findBankByLabel = (label: string) =>
    bankRecords.find((bank) => {
      const bankName = bank.shortName || bank.name || "";
      return (
        String(bank.id) === String(label) ||
        bankName === label ||
        bank.code === label ||
        `${bankName} - ${bank.bin}` === label
      );
    });

  const [formData, setFormData] = useState<BankFormData>(() =>
    mapBankAccountToFormData(bankAccount),
  );

  useEffect(() => {
    if (!bankAccount) return;

    // Sync local editable fields once the detail API resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(mapBankAccountToFormData(bankAccount));
  }, [bankAccount]);

  const updateField = <K extends keyof BankFormData>(
    key: K,
    value: BankFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBankChange = (value: string) => {
    const selectedBank = findBankByLabel(value);

    setFormData((prev) => ({
      ...prev,
      bankId: selectedBank?.id ?? value,
      bankName: selectedBank?.shortName || selectedBank?.name || value,
      logo: selectedBank?.logoUrl || "",
    }));
  };

  const validate = () => {
    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountHolder
    ) {
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
      if (!bankAccountId || !bankAccount) {
        return;
      }

      const selectedBank = findBankByLabel(formData.bankName);

      await updateBankAccountMutation.updateBankAccount({
        id: bankAccountId,
        payload: {
          id: bankAccount.id,
          ownerType: bankAccount.ownerType,
          ownerId: bankAccount.ownerId,
          bankId: formData.bankId || selectedBank?.id || bankAccount.bank?.id || "",
          bankCode: selectedBank?.code || bankAccount.bank?.code || "",
          bankName:
            selectedBank?.shortName ||
            selectedBank?.name ||
            bankAccount.bank?.shortName ||
            bankAccount.bank?.name ||
            "",
          bin: selectedBank?.bin || bankAccount.bank?.bin,
          accountNumber: formData.accountNumber,
          accountHolder: formData.accountHolder,
          branch: formData.branch || undefined,
          note: formData.note || undefined,
          logoUrl: selectedBank?.logoUrl || bankAccount.bank?.logoUrl,
          status: formData.status,
          isPrimary: bankAccount.isPrimary,
          metadataJson: bankAccount.metadataJson,
        },
      });
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật tài khoản "${formData.bankName} - ${formData.accountNumber}"`,
      });
    } else {
      toast({
        title: "Chưa hỗ trợ",
        description:
          "Trang này hiện chỉ dùng cho cập nhật tài khoản ngân hàng đã có.",
        variant: "destructive",
      });
      return;
    }

    setLocation("/bank");
  };

  const handleDelete = async () => {
    if (bankAccountId) {
      await deleteBankAccountMutation.deleteBankAccount(bankAccountId);
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
    loading: bankAccountQuery.loading,
    error: bankAccountQuery.error,
    isSubmitting: updateBankAccountMutation.isPending,
    isDeleting: deleteBankAccountMutation.isPending,
    bankAccount,
    banks: bankRecords,
    notFound:
      mode === "edit" &&
      !bankAccountQuery.loading &&
      bankAccountId !== undefined &&
      !bankAccount &&
      !bankAccountQuery.error,
  };
}
