import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tankhang1/eco-shared-ui";
import { Edit, FileText, Hash, Leaf, Sprout } from "lucide-react";
import { Link } from "wouter";
import { initialData } from "./mocks";

interface VarietyDetailPageProps {
  id: string;
}

export default function VarietyDetailPage({ id }: VarietyDetailPageProps) {
  const variety = initialData.find((v) => v.id === id);

  if (!variety) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">
          Không tìm thấy thông tin giống cây này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Link href={`/variety/${variety.id}/edit`}>
          <Button className="bg-green-600 hover:bg-green-700">
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 overflow-hidden bg-white">
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden border-b">
            {variety.illustration ? (
              <img
                src={
                  variety.illustration instanceof File
                    ? URL.createObjectURL(variety.illustration)
                    : variety.illustration
                }
                className="w-full h-full object-cover"
                alt={variety.varietyName}
              />
            ) : (
              <Sprout className="w-16 h-16 text-muted-foreground/30" />
            )}
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Mã giống
              </p>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
                <Hash className="w-3 h-3 opacity-60" />
                {variety.varietyCode}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Trạng thái
              </p>
              <Badge
                variant={variety.status === "active" ? "default" : "outline"}
              >
                {variety.status === "active" ? "Hoạt động" : "Ngừng kinh doanh"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-700">
                <Leaf className="w-5 h-5" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tên giống cây</p>
                  <p className="font-bold text-foreground text-lg">
                    {variety.varietyName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Loại cây trồng
                  </p>
                  <p className="font-bold text-foreground text-lg">
                    {variety.crop}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="text-foreground leading-relaxed">
                  {variety.description || "Không có mô tả cho giống cây này."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" />
                Tài liệu kỹ thuật
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {variety.documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {variety.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 ring-1 ring-zinc-100 hover:bg-zinc-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-green-600 border">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground truncate max-w-[200px]">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">
                            Tài liệu hướng dẫn
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noreferrer">
                          Xem tài liệu
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-2xl border-muted-foreground/10">
                  <p className="text-muted-foreground text-sm font-medium">
                    Chưa có tài liệu kỹ thuật nào được đính kèm.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
