import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText } from "lucide-react";
import type { Contract } from "../types";

interface ContractStatsProps {
  contracts: Contract[];
}

export const ContractStats = ({ contracts }: ContractStatsProps) => {
  const stats = [
    {
      label: "Tổng hợp đồng",
      value: contracts.length,
      icon: <FileText className="w-8 h-8 text-primary opacity-50" />,
      color: "text-primary",
    },
    {
      label: "Đang hiệu lực",
      value: contracts.filter((c) => c.status === "active").length,
      icon: <FileText className="w-8 h-8 text-green-600 opacity-50" />,
      color: "text-green-600",
    },
    {
      label: "Chờ ký",
      value: contracts.filter((c) => c.status === "pending").length,
      icon: <FileText className="w-8 h-8 text-yellow-600 opacity-50" />,
      color: "text-yellow-600",
    },
    {
      label: "Hết hạn",
      value: contracts.filter((c) => c.status === "expired").length,
      icon: <FileText className="w-8 h-8 text-red-600 opacity-50" />,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
                <div className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              {stat.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
