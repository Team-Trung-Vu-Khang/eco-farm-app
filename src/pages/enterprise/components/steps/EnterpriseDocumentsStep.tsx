import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Building2,
  Calendar,
  Camera,
  Check,
  CreditCard,
  Download,
  FileText,
  Globe,
  Image,
  Info,
  Mail,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Scan,
  Search,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";
import { PROVINCES } from "@/constants/province";
import { vietQrBankData } from "@/constants/banks";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

const classificationOptions = [
  { value: "production", label: "Sản xuất" },
  { value: "processing", label: "Chế biến" },
  { value: "trading", label: "Thương mại" },
  { value: "service", label: "Dịch vụ" },
  { value: "other", label: "Khác" },
];

const bankOptions = vietQrBankData.map((bank) => ({
  id: bank.id,
  bin: bank.bin,
  label: bank.name,
  image: bank.logo,
  value: bank.bin,
}));

export function EnterpriseDocumentsStep() {
  const {
    formData,
    isDragging,
    handleDrag,
    handleDocumentDrop,
    handleDocumentUpload,
    handleDocumentDelete,
  } = useEnterpriseFormContext();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4">
        <h3 className="font-semibold">Giấy phép kinh doanh</h3>
        <p className="text-sm text-muted-foreground">
          Tải lên hoặc kiểm tra các giấy tờ pháp lý liên quan đến doanh nghiệp.
        </p>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${isDragging["documents"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}`}
        onClick={() => document.getElementById("document-upload")?.click()}
        onDragEnter={(e) => handleDrag("documents", e)}
        onDragOver={(e) => handleDrag("documents", e)}
        onDragLeave={(e) => handleDrag("documents", e)}
        onDrop={handleDocumentDrop}
      >
        <input
          id="document-upload"
          type="file"
          multiple
          className="hidden"
          onChange={handleDocumentUpload}
        />
        <Upload
          className={`w-12 h-12 mx-auto mb-4 transition-colors ${isDragging["documents"] ? "text-primary" : "text-muted-foreground"}`}
        />
        <p className="font-medium mb-1">Kéo thả file hoặc click để tải lên</p>
        <p className="text-sm text-muted-foreground">
          Hỗ trợ PDF, Word, hình ảnh (tối đa 5MB mỗi file)
        </p>
        <Button variant="outline" className="mt-4 pointer-events-none">
          <Upload className="w-4 h-4 mr-2" />
          Chọn file
        </Button>
      </div>
      <div className="space-y-2">
        {formData.documents.map(
          (
            doc: { name: string; type: string; size: string; url?: string },
            index: number,
          ) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
            >
              {doc.type.includes("image") ? (
                <Image className="w-5 h-5 text-green-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.size} • Đã tải lên
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600">
                  <Check className="w-3 h-3 mr-1" /> Hoàn thành
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDocumentDelete(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
