import {
  Badge,
  Card,
  CardContent,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard, Search } from "lucide-react";
import { useState } from "react";
import type { BankAccount } from "../../types";

interface FarmerBankTabProps {
  bankAccounts?: BankAccount[];
}

export const FarmerBankTab = ({ bankAccounts }: FarmerBankTabProps) => {
  const [bankSearchQuery, setBankSearchQuery] = useState("");

  const filteredAccounts = bankAccounts?.filter(
    (acc) =>
      acc.bankName.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      acc.accountNumber.includes(bankSearchQuery) ||
      acc.accountHolder.toLowerCase().includes(bankSearchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tài khoản ngân hàng..."
          className="pl-10"
          value={bankSearchQuery}
          onChange={(e) => setBankSearchQuery(e.target.value)}
        />
      </div>

      {!bankAccounts || bankAccounts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có tài khoản ngân hàng nào.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAccounts?.map((account, i) => (
            <Card key={i} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm line-clamp-1 h-10 flex items-center">
                        {account.bankName}
                      </h3>
                      <p className="text-sm text-muted-foreground font-mono">
                        {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-50 shrink-0"
                  >
                    Hoạt động
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                      Chủ tài khoản:
                    </span>
                    <div className="font-medium uppercase truncate">
                      {account.accountHolder}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                      Chi nhánh:
                    </span>
                    <div className="font-medium truncate">
                      {account.branch || "-"}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-1">
                      Ghi chú:
                    </span>
                    <div className="font-medium truncate">
                      {account.note || "-"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
