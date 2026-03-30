import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout, Target } from "lucide-react";

type CropDetailNotFoundStateProps = {
  icon: "crop" | "scope";
  title: string;
  onBack: () => void;
};

export const CropDetailNotFoundState = ({
  icon,
  title,
  onBack,
}: CropDetailNotFoundStateProps) => {
  const Icon = icon === "crop" ? Sprout : Target;

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Icon className="mb-4 h-16 w-16 text-slate-300" />
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <Button variant="ghost" className="mt-4" onClick={onBack}>
        Quay lại danh sách
      </Button>
    </div>
  );
};
