import { useCurrentUser } from "@/features/auth";
import { RecentDiaryList } from "./components/RecentDiaryList";
import { WeatherCard } from "./components/WeatherCard";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Chào buổi sáng";
  if (hour < 14) return "Chào buổi trưa";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

/** Trang chủ giao diện mobile: thời tiết + nhật ký gần đây */
export default function MobileHomePage() {
  const { currentUser } = useCurrentUser();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500">{getGreeting()},</p>
        <h1 className="text-xl font-bold text-slate-900">
          {currentUser?.fullName || currentUser?.username || "bạn"}
        </h1>
      </div>
      <WeatherCard />
      <RecentDiaryList />
    </div>
  );
}
