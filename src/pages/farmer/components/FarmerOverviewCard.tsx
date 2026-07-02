import type { Enterprise } from "@/pages/enterprise/data/constants";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface FarmerOverviewCardProps {
  data: Enterprise;
}

export const FarmerOverviewCard = ({ data }: FarmerOverviewCardProps) => {
  return (
    <Card className="overflow-hidden relative shadow-md">
      <div className="h-32 bg-gray-100 flex items-center justify-center relative">
        <img
          src={
            data.image ||
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
          }
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 z-10">
          <div
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg rounded-bl-xl ${data.status === "active" ? "bg-green-600" : "bg-gray-500"}`}
          >
            {data.status === "active" ? "Đang hoạt động" : "Dừng hoạt động"}
          </div>
        </div>
      </div>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-20 h-20 -mt-12 rounded-full border-4 border-background bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
          {data.image ? (
            <img
              src={data.image}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-primary">
              {data.brandName?.charAt(0) || data.name.charAt(0)}
            </span>
          )}
        </div>
        <CardTitle className="text-xl flex items-center justify-center gap-2">
          {data.brandName || data.name}
          {data.status === "active" && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}
        </CardTitle>
        <CardDescription>{data.name}</CardDescription>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {data.classification?.map((item) => (
            <Badge key={item} variant="outline" className="capitalize">
              {item === "production"
                ? "Sản xuất"
                : item === "processing"
                  ? "Chế biến"
                  : item === "trading"
                    ? "Thương mại"
                    : item === "service"
                      ? "Dịch vụ"
                      : "Khác"}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{data.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>
              Đại diện:{" "}
              <span className="font-medium">
                {data.representative || "Chưa cập nhật"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              Thành lập:{" "}
              {data.foundedDate
                ? new Date(data.foundedDate).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </span>
          </div>
        </div>
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span>
              {data.address}
              {data.ward && `, ${data.ward}`}
              {data.province && `, ${data.province}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a
              href={`tel:${data.phone}`}
              className="hover:underline hover:text-primary transition-colors"
            >
              {data.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${data.email}`}
              className="hover:underline hover:text-primary transition-colors"
            >
              {data.email}
            </a>
          </div>
          {data.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-primary transition-colors text-blue-600"
              >
                {data.website}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
