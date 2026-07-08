import type { BankAccount } from "../../data/constants";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard, Search, Trash2 } from "lucide-react";
import { useMemo } from "react";

type BankOption = {
  id: number | string;
  code?: string;
  bin?: string;
  shortName?: string;
  name?: string;
  logoUrl?: string;
};

type EnterpriseBankAccountListProps = {
  accounts: BankAccount[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onRemove: (index: number) => void;
  bankMasterData: BankOption[];
};

function getBankDisplayName(bank: BankOption) {
  return bank.shortName || bank.name || "";
}

export function EnterpriseBankAccountList({
  accounts,
  searchQuery,
  onSearchQueryChange,
  onRemove,
  bankMasterData,
}: EnterpriseBankAccountListProps) {
  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return accounts
      .map((account, index) => ({ account, index }))
      .filter(({ account }) => {
        if (!query) return true;

        return [
          account.bankName,
          account.accountNumber,
          account.accountHolder,
          account.branch,
          account.note,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }, [accounts, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <h4 className="flex items-center gap-3 text-xl font-bold">
          Danh sách đã thêm
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
            {accounts.length}
          </Badge>
        </h4>
        {accounts.length > 0 && (
          <p className="text-sm italic text-muted-foreground">
            * Nhấn vào biểu tượng thùng rác để xóa tài khoản
          </p>
        )}
      </div>

      {accounts.length > 0 && (
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài khoản..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="border-none bg-muted/30 pl-10 shadow-none focus-visible:ring-primary"
          />
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed bg-muted/5 py-16 text-center transition-colors hover:bg-muted/10">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
            <CreditCard className="h-10 w-10 text-muted-foreground" />
          </div>
          <h5 className="text-lg font-bold text-muted-foreground">
            Chưa có tài khoản nào
          </h5>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground/70">
            Các tài khoản ngân hàng bạn thêm sẽ hiển thị tại đây để kiểm tra
            trước khi lưu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAccounts.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed bg-muted/5 py-16 text-center text-sm text-muted-foreground">
              <Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground/70" />
              Không tìm thấy tài khoản phù hợp
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredAccounts.map(({ account, index }) => {
                const bankInfo = bankMasterData.find((bank) => {
                  const bankName = getBankDisplayName(bank);
                  return (
                    bankName === account.bankName ||
                    bank.name === account.bankName ||
                    bank.code === account.bankName ||
                    bank.bin === account.bin
                  );
                });

                const bankName = bankInfo
                  ? getBankDisplayName(bankInfo)
                  : account.bankName;
                const displayBankCode = bankInfo?.code ?? "";
                const displayBin = account.bin || bankInfo?.bin || "";
                const logoUrl = account.logo || bankInfo?.logoUrl || "";

                return (
                  <Card
                    key={`${account.bankName}-${account.accountNumber}-${index}`}
                    className="group cursor-default border-primary/10 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-transform group-hover:scale-105">
                        <img
                          src={logoUrl || "https://placehold.co/56x56?text=B"}
                          alt={bankName}
                          className="h-full w-full object-contain"
                          onError={(event) => {
                            (event.target as HTMLImageElement).src =
                              "https://placehold.co/56x56?text=B";
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="truncate text-base font-bold">
                              {bankName}
                            </span>
                            {displayBin && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                BIN: {displayBin}
                                {displayBankCode ? ` • ${displayBankCode}` : ""}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => onRemove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <p className="font-mono text-lg font-bold tracking-wider text-primary">
                          {account.accountNumber}
                        </p>

                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate font-medium uppercase">
                            {account.accountHolder}
                          </span>
                          {account.branch && (
                            <span className="ml-2 truncate italic">
                              CN: {account.branch}
                            </span>
                          )}
                        </div>

                        {account.note && (
                          <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                            {account.note}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
