import { useBankDirectory } from "@/features/bank-directory/hooks/useBankDirectory";
import { useMemo, useState } from "react";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";
import { EnterpriseBankAccountFormCard } from "./EnterpriseBankAccountFormCard";
import { EnterpriseBankAccountList } from "./EnterpriseBankAccountList";
import { EnterpriseBankSelectorDialog } from "./EnterpriseBankSelectorDialog";

export function EnterpriseBankAccountsStep() {
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
  const { banks: bankMasterData, loading } = useBankDirectory({
    initialQuery: {
      page: 0,
      size: 100,
      status: "active",
    },
  });

  const selectedBankLabel = useMemo(() => {
    if (!newBankAccount.bankName) return "Chọn ngân hàng...";

    return newBankAccount.bin
      ? `${newBankAccount.bankName} - ${newBankAccount.bin}`
      : newBankAccount.bankName;
  }, [newBankAccount.bankName, newBankAccount.bin]);

  const handleSelectBank = (bank: (typeof bankMasterData)[number]) => {
    setNewBankAccount({
      bankName: bank.shortName || bank.name || "",
      accountNumber: newBankAccount.accountNumber,
      accountHolder: newBankAccount.accountHolder,
      branch: newBankAccount.branch,
      note: newBankAccount.note,
      bin: bank.bin,
      logo: bank.logoUrl,
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <EnterpriseBankAccountFormCard
        bankLabel={selectedBankLabel}
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
        selectedBankName={selectedBankLabel}
        banks={bankMasterData}
        loading={loading}
        onSelect={handleSelectBank}
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
