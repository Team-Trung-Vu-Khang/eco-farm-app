import { useState } from "react";
import { useRoute } from "wouter";
import { useMasterData } from "@/features/master-data";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";
import { EnterpriseBankAccountFormCard } from "./EnterpriseBankAccountFormCard";
import { EnterpriseBankAccountList } from "./EnterpriseBankAccountList";
import { EnterpriseBankSelectorDialog } from "./EnterpriseBankSelectorDialog";

type BankOption = {
  id: number | string;
  code?: string;
  bin?: string;
  shortName?: string;
  name?: string;
  logoUrl?: string;
};

export function EnterpriseBankAccountsStep() {
  const [, editParams] = useRoute("/enterprise/:id/edit");
  const {
    formData,
    newBankAccount,
    setNewBankAccount,
    addBankAccount,
    removeBankAccount,
    bankSearchQuery,
    setBankSearchQuery,
  } = useEnterpriseFormContext();

  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const { items: bankMasterData } = useMasterData("banks", {
    params: { status: "active", page: 0, size: 100 },
  });
  const handleSelectAccount = (account: {
    id: number | string;
    bank?: BankOption | null;
    accountNumber?: string;
    accountHolder?: string;
    branch?: string;
    note?: string;
  }) => {
    setNewBankAccount({
      id: account.id,
      bankId: account.bank?.id ?? "",
      bankName: account.bank?.shortName || account.bank?.name || "",
      accountNumber: account.accountNumber || "",
      accountHolder: account.accountHolder || "",
      branch: account.branch || "",
      note: account.note || "",
      bin: account.bank?.bin || "",
      logo: account.bank?.logoUrl || "",
    });
  };

  const handleSelectBank = (bank: BankOption) => {
    setNewBankAccount({
      ...newBankAccount,
      bankId: bank.id,
      bankName: bank.shortName || bank.name || "",
      bin: bank.bin || "",
      logo: bank.logoUrl || "",
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <EnterpriseBankAccountFormCard
        bankLabel={
          newBankAccount.bankName && newBankAccount.accountNumber
            ? `${newBankAccount.bankName} - ${newBankAccount.accountNumber}`
            : newBankAccount.bankName || "Chọn tài khoản..."
        }
        account={newBankAccount}
        onChange={(updates) =>
          setNewBankAccount({
            ...newBankAccount,
            ...updates,
          })
        }
        onPickBank={() => setIsBankDialogOpen(true)}
        onClearBank={() =>
          setNewBankAccount({
            id: "",
            bankId: "",
            bankName: "",
            accountHolder: "",
            accountNumber: "",
            branch: "",
            note: "",
            bin: "",
            logo: "",
          })
        }
        onAdd={addBankAccount}
      />

      <EnterpriseBankSelectorDialog
        open={isBankDialogOpen}
        onOpenChange={setIsBankDialogOpen}
        selectedAccountLabel={
          newBankAccount.accountNumber
            ? `${newBankAccount.bankName} - ${newBankAccount.accountNumber}`
            : newBankAccount.bankName
        }
        accountQueryParams={{
          ownerType: "ORGANIZATION",
          ownerId: editParams?.id ? Number(editParams.id) : undefined,
        }}
        onSelect={handleSelectAccount}
        onSelectBank={handleSelectBank}
      />

      <EnterpriseBankAccountList
        accounts={formData.bankAccounts ?? []}
        searchQuery={bankSearchQuery}
        onSearchQueryChange={setBankSearchQuery}
        onRemove={removeBankAccount}
        bankMasterData={bankMasterData}
      />
    </div>
  );
}
