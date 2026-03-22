import {
  Badge,
  Card,
  CardContent,
  Label,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Calendar,
  Clock,
  Flower2,
  Tag,
  TreeDeciduous,
} from "lucide-react";

interface DocMainInfoCardProps {
  doc: any;
}

export function DocMainInfoCard({ doc }: DocMainInfoCardProps) {
  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {doc.crop}
              {doc.scope === "variety" && doc.variety && (
                <Badge variant="secondary" className="text-sm">
                  {doc.variety}
                </Badge>
              )}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Cập nhật: {new Date(doc.updatedAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="font-medium text-foreground">
                Mã: {doc.id}
              </span>
            </div>
          </div>
          <Badge
            className={`px-3 py-1 text-sm font-medium ${
              doc.scope === "crop"
                ? "bg-primary/15 text-primary hover:bg-primary/20"
                : "bg-blue-500/15 text-blue-600 hover:bg-blue-500/20"
            }`}
          >
            {doc.scope === "crop" ? (
              <span className="flex items-center gap-1.5">
                <TreeDeciduous className="h-4 w-4" />
                Theo Loại Cây
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Flower2 className="h-4 w-4" />
                Theo Giống
              </span>
            )}
          </Badge>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              Mùa vụ áp dụng
            </Label>
            <div className="flex flex-wrap gap-2">
              {doc.season.length > 0 ? (
                doc.season.map((s: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-100 text-sm font-medium"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {s}
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">
                  Áp dụng tất cả mùa vụ
                </span>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              Mức độ áp dụng
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/80 transition-all"
                  style={{ width: `${doc.applyLevel}%` }}
                />
              </div>
              <span className="font-bold text-lg">
                {doc.applyLevel ?? 100}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Từ khoá
          </Label>
          <div className="flex flex-wrap gap-2">
            {doc.keywords.map((k: string, i: number) => (
              <Badge
                key={i}
                variant="outline"
                className="gap-1 px-2.5 py-1 text-xs"
              >
                <Tag className="h-3 w-3 opacity-50" />
                {k}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
