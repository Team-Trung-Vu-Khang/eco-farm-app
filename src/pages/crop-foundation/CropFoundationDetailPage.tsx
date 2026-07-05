import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  ClipboardList,
  Edit,
  FlaskConical,
  Leaf,
} from "lucide-react";
import { Link } from "wouter";
import { CropFoundationIdentity } from "./components/tabs/CropFoundationIdentity";
import { DocumentationTab } from "./components/tabs/DocumentationTab";
import { TechnicalSpecsTab } from "./components/tabs/TechnicalSpecsTab";
import { useCropFoundationDetail } from "./hooks/useCropFoundationDetail";

export default function CropFoundationDetailPage() {
  const { cropFoundation, loading } = useCropFoundationDetail();

  if (loading) {
    return (
      <AdminLayout
        title="Chi tiết cây trồng"
        description="Đang tải thông tin chi tiết về cây trồng"
      >
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
          <span className="text-sm font-medium">
            Đang tải thông tin cây trồng...
          </span>
        </div>
      </AdminLayout>
    );
  }

  if (!cropFoundation) {
    return (
      <AdminLayout
        title="Chi tiết cây trồng"
        description="Thông tin chi tiết về cây trồng"
      >
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Leaf className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            Không tìm thấy thông tin cây trồng này.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chi tiết cây trồng"
      description={`Quản lý và theo dõi thông tin chi tiết về ${cropFoundation.name}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/crop-foundation">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <Link href={`/crop-foundation/${cropFoundation.id}/edit`}>
            <Button className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/10 active:scale-95 transition-all">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8 pb-8">
        <CropFoundationIdentity cropFoundation={cropFoundation} />

        <Tabs defaultValue="technical-info" className="w-full">
          <TabsList className="bg-slate-100/50 p-1 border border-slate-200 rounded-xl mb-6 flex overflow-x-auto h-auto max-w-full no-scrollbar">
            <TabsTrigger
              value="technical-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <FlaskConical className="w-4 h-4" />
              Thông số nông học
            </TabsTrigger>
            <TabsTrigger
              value="docs-info"
              className="rounded-lg px-4 py-2 text-sm font-medium gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
            >
              <ClipboardList className="w-4 h-4" />
              Tài liệu kỹ thuật
            </TabsTrigger>
          </TabsList>

          <TabsContent value="technical-info">
            <TechnicalSpecsTab cropFoundation={cropFoundation} />
          </TabsContent>
          <TabsContent value="docs-info">
            <DocumentationTab cropFoundation={cropFoundation} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
