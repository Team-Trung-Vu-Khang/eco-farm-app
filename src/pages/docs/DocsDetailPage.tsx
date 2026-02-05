import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  Editor,
  Label,
  Separator,
} from "@tankhang1/eco-shared-ui";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  Flower2,
  Hash,
  Tag,
  Trash,
  TreeDeciduous,
} from "lucide-react";
import { useLocation } from "wouter";
import { initialEditorValue } from "./mocks";

const mockDoc = {
  id: "TL001",
  season: ["Mùa mưa", "Đông Xuân"],
  keywords: ["Kỹ thuật", "Phân bón", "Sầu riêng"],
  scope: "crop",
  cropId: "durian",
  variety: "",
  crop: "Sầu riêng",
  quickSummary:
    "Làm đất, lên líp, thoát nước tốt\nHữu cơ 10–15kg/gốc trước mùa mưa\nĐảm bảo thoát nước trong mùa mưa để tránh ngập úng.",
  specifications: [
    { specName: "Mật độ trồng", specValue: "6 x 6 m (≈278 cây/ha)" },
    { specName: "Độ pH đất", specValue: "5.5 – 6.5" },
    { specName: "Nước tưới", specValue: "3–5 lít/gốc/ngày" },
    { specName: "Phủ gốc", specValue: "Rơm khô/compost 5–10 cm" },
  ],
  attachments: [
    {
      attachmentName: "Quy trình VietGAP.pdf",
      attachmentValue: "https://example.com/file.pdf",
    },
    {
      attachmentName: "Hướng dẫn sử dụng phân bón.pdf",
      attachmentValue: "https://example.com/phan_bon.pdf",
    },
  ],
  applyLevel: 100,
  createdAt: Date.now() - 86400000 * 5, // 5 days ago
  updatedAt: Date.now(),
};

export default function DocsDetailPage() {
  const [, setLocation] = useLocation();

  // In a real app, fetch data based on params.id
  const doc = mockDoc;

  return (
    <AdminLayout
      title={`Chi tiết tài liệu: ${doc.id}`}
      description="Xem thông tin chi tiết và nội dung tài liệu kỹ thuật"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/docs")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <Trash className="h-4 w-4" />
            Xóa
          </Button>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
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
                      doc.season.map((s, i) => (
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
                  {doc.keywords.map((k, i) => (
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

          {/* Quick Summary Card */}
          <Card className="lg:col-span-1 shadow-sm h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-base">Tóm tắt nhanh</h4>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border border-muted/50 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {doc.quickSummary || "Chưa có tóm tắt."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specifications Section */}
        {doc.specifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {doc.specifications.map((spec, index) => (
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
        )}

        {/* Content Section */}
        <Card className="shadow-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Nội dung chi tiết
              </h3>
            </div>
            <div className="prose max-w-none text-foreground/90">
              {/* Read-only Editor */}
              <Editor
                maxLength={50000}
                editorSerializedState={initialEditorValue}
                contentEditableClassname="pointer-events-none focus:outline-none max-w-none min-h-[200px]"
                // @ts-ignore - Assuming readOnly might be supported or strictly controlled via styling
                readOnly={true}
                editable={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachments Section */}
        {doc.attachments.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tài liệu đính kèm ({doc.attachments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doc.attachments.map((file, index) => (
                <div
                  key={index}
                  className="group flex items-center p-3 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="font-medium text-sm truncate">
                      {file.attachmentName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {file.attachmentValue}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
