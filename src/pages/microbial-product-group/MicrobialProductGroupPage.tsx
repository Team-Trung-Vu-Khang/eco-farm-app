import PageWrapper from "@/components/PageWrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FlaskConical, Layers, Leaf, Pill } from "lucide-react";
import { useState } from "react";
import { MicrobialProductGroupTabContent } from "./components/MicrobialProductGroupTabContent";

type MicrobialProductGroupTab =
  | "enzyme"
  | "carrier"
  | "bio_extract"
  | "supplement";

const MicrobialProductGroupPage = () => {
  const [activeTab, setActiveTab] = useState<MicrobialProductGroupTab>("enzyme");

  return (
    <PageWrapper
      title="Danh mục chế phẩm vi sinh"
      description="Quản lý phân loại chế phẩm vi sinh theo enzyme, chất mang, chiết xuất sinh học và dinh dưỡng bổ sung"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as MicrobialProductGroupTab)
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="enzyme" className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4" />
            Enzyme
          </TabsTrigger>
          <TabsTrigger value="carrier" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Chất mang / Dung môi
          </TabsTrigger>
          <TabsTrigger value="bio_extract" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Chiết xuất sinh học
          </TabsTrigger>
          <TabsTrigger value="supplement" className="flex items-center gap-2">
            <Pill className="w-4 h-4" />
            Dinh dưỡng bổ sung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enzyme">
          <MicrobialProductGroupTabContent
            classification="enzyme"
            title="Nhóm Enzyme (Men xúc tác sinh học)"
            description="Đẩy nhanh phân giải chất hữu cơ phức tạp trước khi vi sinh vật kịp xử lý. Ví dụ: Protease (protein), Amylase (tinh bột), Cellulase (chất xơ), Lipase (chất béo). Đơn vị đo: UI/g hoặc UI/ml."
          />
        </TabsContent>

        <TabsContent value="carrier">
          <MicrobialProductGroupTabContent
            classification="carrier"
            title="Nhóm Chất mang (Carrier) / Dung môi"
            description="Lớp nền vật lý giúp bảo quản vi sinh vật ở trạng thái ngủ đông, giữ ẩm hoặc tạo hình sản phẩm. Dạng bột/hạt: Zeolite, bột Talc, bột cám, Dextrose, CaCO3. Dạng lỏng: nước cất, mật rỉ đường. Đơn vị đo: %."
          />
        </TabsContent>

        <TabsContent value="bio_extract">
          <MicrobialProductGroupTabContent
            classification="bio_extract"
            title="Nhóm Chiết xuất sinh học / Thảo dược đặc thù"
            description="Xử lý vấn đề môi trường cụ thể hoặc tăng đề kháng tức thời. Ví dụ: Yucca schidigera (hấp thu khí độc NH3/NO2), Beta-glucan & MOS (kích thích miễn dịch), Saponin (diệt cá tạp)."
          />
        </TabsContent>

        <TabsContent value="supplement">
          <MicrobialProductGroupTabContent
            classification="supplement"
            title="Nhóm Dinh dưỡng bổ sung (Vi khoáng & Vitamin)"
            description="Cung cấp thức ăn ban đầu để vi sinh vật kích hoạt sinh sôi, hoặc bổ sung trực tiếp cho vật nuôi. Ví dụ: Vitamin C, Premix Vitamin, Kali, Canxi, Magie."
          />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  );
};

export default MicrobialProductGroupPage;
