import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2 } from "lucide-react";

interface BasicInfoCardProps {
  branch: {
    imageUrl?: string;
    name: string;
    code: string;
    phone?: string;
    address: string;
  };
}

export function BasicInfoCard({ branch }: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Thông tin chung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {branch.imageUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
            <img
              src={branch.imageUrl}
              alt={branch.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Mã chi nhánh
            </label>
            <p className="text-base font-semibold mt-1">{branch.code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Điện thoại
            </label>
            <p className="text-base font-medium mt-1">{branch.phone || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">
              Địa chỉ
            </label>
            <p className="text-base mt-1">{branch.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
