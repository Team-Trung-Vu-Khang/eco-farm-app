import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  Wheat,
} from "lucide-react";

interface UserGuideBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserGuideBottomSheet({
  open,
  onOpenChange,
}: UserGuideBottomSheetProps) {
  const guideSections = [
    {
      icon: <CalendarCheck className="h-5 w-5 text-emerald-600" />,
      title: "1. Ghi nhật ký canh tác",
      description:
        "Bạn có thể ghi nhật ký theo kế hoạch được giao hoặc ghi nhật ký phát sinh hàng ngày. Chỉ cần chọn vụ mùa, nhập tiến độ công việc và chụp ảnh hiện trường.",
    },
    {
      icon: <PackageCheck className="h-5 w-5 text-blue-600" />,
      title: "2. Cấp phát & Sử dụng vật tư",
      description:
        "Khi thực hiện bón phân, phun thuốc hoặc sử dụng vật tư, hãy ghi nhận số lượng thực tế đã dùng để hệ thống tính toán tồn kho và định mức chi phí.",
    },
    {
      icon: <Wheat className="h-5 w-5 text-amber-600" />,
      title: "3. Ghi nhận sản lượng thu hoạch",
      description:
        "Chọn đối tượng thu hoạch (vùng trồng, luống, hoặc giống cây), nhập sản lượng thu hoạch thực tế để lưu lại kết quả mùa vụ.",
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
      title: "4. Mẹo chụp ảnh hiện trường",
      description:
        "Chụp ảnh rõ nét tình trạng cây trồng, sâu bệnh hoặc bao bì phân thuốc giúp người quản lý dễ dàng kiểm tra và duyệt nhật ký nhanh hơn.",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Hướng dẫn sử dụng
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-3.5">
          {guideSections.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-1.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white shadow-xs flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {item.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-10">
                {item.description}
              </p>
            </div>
          ))}

          <div className="pt-2">
            <Button
              type="button"
              className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm gap-2"
              onClick={() => onOpenChange(false)}
            >
              <CheckCircle2 className="h-4 w-4" /> Đã hiểu
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
