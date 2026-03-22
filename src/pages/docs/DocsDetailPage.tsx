import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { useLocation } from "wouter";

import { DocMainInfoCard } from "./components/detail/DocMainInfoCard";
import { DocQuickSummaryCard } from "./components/detail/DocQuickSummaryCard";
import { DocSpecifications } from "./components/detail/DocSpecifications";
import { DocContent } from "./components/detail/DocContent";
import { DocAttachments } from "./components/detail/DocAttachments";

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
          <DocMainInfoCard doc={doc} />
          <DocQuickSummaryCard quickSummary={doc.quickSummary} />
        </div>

        <DocSpecifications specifications={doc.specifications} />
        <DocContent />
        <DocAttachments attachments={doc.attachments} />
      </div>
    </AdminLayout>
  );
}
