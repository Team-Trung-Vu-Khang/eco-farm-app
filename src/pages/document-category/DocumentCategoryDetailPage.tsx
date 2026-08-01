import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  FileText,
  Layers,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import useDocumentCategoryStore from "../../stores/useDocumentCategoryStore";
import {
  type DocumentCategory,
  ENTITY_TYPE_COLORS,
  ENTITY_TYPE_LABELS,
} from "./data/constants";

const DocumentCategoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getCategoryById } = useDocumentCategoryStore();
  const [category, setCategory] = useState<DocumentCategory | null>(null);

  useEffect(() => {
    if (id) {
      const data = getCategoryById(Number(id));
      if (data) {
        setCategory(data);
      } else {
        setLocation("/document-category");
      }
    }
  }, [id, getCategoryById, setLocation]);

  if (!category) return null;

  return (
    <PageWrapper
      title="Chi tiết danh mục hồ sơ"
      description={`Thông tin thiết lập cho loại tài liệu: ${category.name}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/document-category")}
          >
            <ArrowLeft size={18} className="mr-2" />
            Danh sách
          </Button>
          <Button
            onClick={() =>
              setLocation(`/document-category/${category.id}/edit`)
            }
          >
            <Edit size={18} className="mr-2" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Info */}
        <div className="md:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/30 flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <FileText size={20} />
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Thông tin cơ bản
                </CardTitle>
              </div>
              <Badge
                variant={category.status === "active" ? "default" : "secondary"}
                className={
                  category.status === "active"
                    ? "bg-green-500 border-none"
                    : "bg-slate-200 text-slate-500 border-none"
                }
              >
                {category.status === "active"
                  ? "Đang hoạt động"
                  : "Ngưng hoạt động"}
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mã tài liệu
                  </p>
                  <p className="text-sm font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded w-fit">
                    {category.code}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tên tài liệu
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {category.name}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Mô tả
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {category.description ||
                      "Chưa có mô tả chi tiết cho loại tài liệu này."}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-3 pt-4 border-t border-dashed">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Đối tượng áp dụng
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.entityTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className={`px-3 py-1 font-bold text-xs bg-${ENTITY_TYPE_COLORS[type]}-50 text-${ENTITY_TYPE_COLORS[type]}-700 border-${ENTITY_TYPE_COLORS[type]}-100`}
                      >
                        {ENTITY_TYPE_LABELS[type]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/30 py-4">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-3">
                <Calendar size={18} className="text-slate-400" />
                Dữ liệu hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Danh mục được tạo vào ngày:</span>
                <span className="font-bold text-slate-800">
                  {category.createdAt}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurations Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/[0.02]">
            <CardHeader className="border-b bg-primary/5 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <CheckCircle2 size={16} />
                Cấu hình tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${category.required ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-slate-300"}`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-bold ${category.required ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {category.required
                        ? "Bắt buộc tải lên"
                        : "Không bắt buộc"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Yêu cầu người dùng thực hiện tải tệp tin lên hệ thống.
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${category.allowMultiple ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-slate-300"}`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-bold ${category.allowMultiple ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {category.allowMultiple
                        ? "Cho phép nhiều file"
                        : "Chỉ một file duy nhất"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Hỗ trợ lưu trữ nhiều tệp tin cho một đầu mục hồ sơ.
                    </p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${category.hasExpiry ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-slate-300"}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-bold ${category.hasExpiry ? "text-slate-800" : "text-slate-400"}`}
                      >
                        {category.hasExpiry
                          ? "Quản lý hết hạn"
                          : "Không quản lý thời gian"}
                      </p>
                      {category.hasExpiry && (
                        <Clock
                          size={12}
                          className="text-amber-500 animate-pulse"
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Yêu cầu nhập ngày hết hạn và theo dõi hiệu lực của tài
                      liệu.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default DocumentCategoryDetailPage;
