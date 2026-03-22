import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Tag } from "lucide-react";

interface DocSpecificationsProps {
  specifications: { specName: string; specValue: string }[];
}

export function DocSpecifications({ specifications }: DocSpecificationsProps) {
  if (!specifications || specifications.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Hash className="h-5 w-5 text-primary" />
        Thông số kỹ thuật
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {specifications.map((spec, index) => (
          <Card
            key={index}
            className="shadow-sm hover:shadow-md transition-shadow bg-card"
          >
            <CardContent className="p-4 flex flex-col h-full justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3 w-3" />
                {spec.specName}
              </span>
              <span className="text-base font-semibold text-foreground break-words">
                {spec.specValue}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
