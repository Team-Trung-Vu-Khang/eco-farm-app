import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const CultivationRegionPlaceholderTab = ({
  title,
  description,
  icon: Icon,
}: Props) => {
  return (
    <Card>
      <CardHeader className="border-b bg-slate-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground italic">{description}</div>
      </CardContent>
    </Card>
  );
};
