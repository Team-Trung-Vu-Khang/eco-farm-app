import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText } from "lucide-react";

interface DocQuickSummaryCardProps {
  quickSummary: string;
}

export function DocQuickSummaryCard({ quickSummary }: DocQuickSummaryCardProps) {
  return (
    <Card className="lg:col-span-1 shadow-sm h-fit">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-semibold text-base">Tóm tắt nhanh</h4>
        </div>
        <div className="bg-muted/30 p-4 rounded-xl border border-muted/50 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {quickSummary || "Chưa có tóm tắt."}
        </div>
      </CardContent>
    </Card>
  );
}
