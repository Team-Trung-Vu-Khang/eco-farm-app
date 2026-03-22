import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  MapPin,
  Sprout,
  CheckSquare,
  TrendingUp,
  Clock,
  Briefcase,
  Activity,
  User,
  Users,
} from "lucide-react";

export function OverviewStats() {
  return (
    <>
      {/* Row 1: Organizations */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Doanh nghiệp / Nông hộ / Hợp tác xã
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Tổng doanh nghiệp"
            value="45"
            change="Tổng 850 ha"
            changeType="neutral"
            icon={Building2}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Tổng hợp tác xã"
            value="12"
            change="Tổng 1,200 ha"
            changeType="neutral"
            icon={Users}
            iconColor="bg-indigo-100 text-indigo-600"
          />
          <StatsCard
            title="Tổng nông hộ"
            value="99"
            change="Tổng 300 ha"
            changeType="neutral"
            icon={User}
            iconColor="bg-sky-100 text-sky-600"
          />
        </div>
      </div>

      {/* Row 2: Vùng trồng */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Vùng trồng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatsCard
            title="Tổng diện tích đang canh tác"
            value="1,250 ha"
            change="Sầu riêng Thaco - 85 vùng trồng"
            changeType="positive"
            icon={MapPin}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Tổng diện tích đang cải tạo"
            value="80 ha"
            change="Cải tạo đất lúa - 8 vùng - 25 khu vực"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="bg-orange-100 text-orange-600"
          />
        </div>
      </div>

      {/* Row 3: Cây trồng */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Cây trồng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Tổng cây trồng canh tác"
            value="15.420"
            change="Tất cả loại cây"
            changeType="neutral"
            icon={Sprout}
            iconColor="bg-amber-100 text-amber-600"
          />
          <StatsCard
            title="Số lượng cây mắc bệnh"
            value="124"
            change="Cần xử lý ngay"
            changeType="negative"
            icon={Activity}
            iconColor="bg-red-100 text-red-600"
          />
          <StatsCard
            title="Số lượng cây sức khỏe tốt"
            value="14.200"
            change="Chiếm 92%"
            changeType="positive"
            icon={CheckSquare}
            iconColor="bg-emerald-100 text-emerald-600"
          />
        </div>
      </div>

      {/* Row 4: Công việc */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Công việc
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Công việc đã thực hiện"
            value="1.245"
            change="Trong năm nay"
            changeType="positive"
            icon={CheckSquare}
            iconColor="bg-purple-100 text-purple-600"
          />
          <StatsCard
            title="Công việc đang xử lý"
            value="85"
            change="Đang triển triển khai"
            changeType="neutral"
            icon={Clock}
            iconColor="bg-indigo-100 text-indigo-600"
          />
          <StatsCard
            title="Công việc đang chờ"
            value="42"
            change="Sắp tới"
            changeType="neutral"
            icon={Briefcase}
            iconColor="bg-slate-100 text-slate-600"
          />
        </div>
      </div>
    </>
  );
}
