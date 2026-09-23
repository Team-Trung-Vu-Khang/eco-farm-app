import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import {
  useDashboardAlertItems,
  type DashboardAlertTone,
} from "../hooks/useDashboardAlertItems";

const TONE_CLASSES: Record<
  DashboardAlertTone,
  { box: string; title: string; text: string }
> = {
  red: {
    box: "bg-red-50 border-red-200 hover:bg-red-100",
    title: "text-red-800",
    text: "text-red-600",
  },
  amber: {
    box: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    title: "text-amber-800",
    text: "text-amber-600",
  },
  blue: {
    box: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    title: "text-blue-800",
    text: "text-blue-600",
  },
};

export function DashboardAlerts() {
  const { items, isLoading } = useDashboardAlertItems();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Cảnh báo</span>
          </div>
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const tone = TONE_CLASSES[item.tone];
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`p-4 rounded-lg border transition-colors group ${tone.box}`}
              >
                <p
                  className={`font-medium flex items-center gap-1 ${tone.title}`}
                >
                  {item.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className={`text-sm mt-1 ${tone.text}`}>
                  {isLoading ? "Đang kiểm tra..." : item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
