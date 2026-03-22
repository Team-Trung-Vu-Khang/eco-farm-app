import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard, Landmark, MapPin } from "lucide-react";

interface BankAccountCardProps {
  bankAccounts?: Array<{
    id: string;
    bankName: string;
    isPrimary?: boolean;
    accountNumber: string;
    accountHolder: string;
    branch: string;
  }>;
}

export function BankAccountCard({ bankAccounts }: BankAccountCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="w-4 h-4 text-primary" />
          Tài khoản ngân hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bankAccounts && bankAccounts.length > 0 ? (
          bankAccounts.map((bank) => (
            <div
              key={bank.id}
              className="p-4 rounded-xl border bg-gradient-to-br from-gray-50 to-white"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-primary" />
                  <span className="font-bold text-gray-900">{bank.bankName}</span>
                </div>
                {bank.isPrimary && (
                  <Badge variant="default" className="text-[10px]">
                    Chính
                  </Badge>
                )}
              </div>
              <p className="text-lg font-mono font-semibold text-gray-800 mb-1 tracking-wide">
                {bank.accountNumber}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                {bank.accountHolder}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {bank.branch}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có thông tin tài khoản ngân hàng
          </p>
        )}
      </CardContent>
    </Card>
  );
}
