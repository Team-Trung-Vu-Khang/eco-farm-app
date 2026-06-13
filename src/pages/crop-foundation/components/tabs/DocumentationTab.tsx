import { Card, CardContent, CardHeader, CardTitle, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Leaf } from "lucide-react";
import type { CropFoundation } from "../../types/types";

interface DocumentationTabProps {
  cropFoundation: CropFoundation;
}

export function DocumentationTab({ cropFoundation }: DocumentationTabProps) {
  const doc = cropFoundation.docs?.farmingTechnique;

  if (!doc) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl">
        <CardContent className="p-12 flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-12 h-12 mb-4 text-slate-300" />
          <p className="text-sm font-medium">Chưa có tài liệu kỹ thuật canh tác</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Kỹ thuật canh tác
            </CardTitle>
            <Badge className={doc.type === "editor" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} variant="secondary">
              {doc.type === "editor" ? "Biên soạn trực tiếp" : "Tài liệu PDF"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {doc.type === "editor" && typeof doc.content === "string" ? (
            <div 
              className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          ) : doc.type === "editor" ? (
            <p className="text-sm text-slate-500 italic">Dữ liệu tài liệu đang ở định dạng chưa được biên dịch (JSON).</p>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <FileText className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Tài liệu PDF đã được tải lên</p>
              <p className="text-xs text-slate-500 mt-1">Tính năng xem trước PDF đang được phát triển</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
