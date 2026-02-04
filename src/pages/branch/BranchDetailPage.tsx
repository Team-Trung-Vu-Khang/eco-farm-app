import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tankhang1/eco-shared-ui";
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  Globe,
  Users,
  CreditCard,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Landmark,
  User,
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Mock Data lấy từ Form để hiển thị (Trong thực tế sẽ fetch API)
const MOCK_DATA = {
  id: "1",
  code: "CN001",
  name: "Chi nhánh Miền Nam",
  enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
  enterpriseId: "DN001",
  status: "active",
  taxCode: "0123456789-001",
  taxAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  address: "123 Nguyễn Huệ",
  ward: "Phường Bến Nghé",
  district: "Quận 1",
  city: "Hồ Chí Minh",
  website: "https://ecofarm.vn",
  imageUrl:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
  latitude: 10.7769,
  longitude: 106.7009,
  contactInfos: [
    {
      id: "1",
      phone: "02839999888",
      email: "hcm@ecofarm.vn",
      isPrimary: true,
    },
    {
      id: "2",
      phone: "0909000111",
      email: "support.hcm@ecofarm.vn",
      isPrimary: false,
    },
  ],
  contacts: [
    {
      id: "1",
      name: "Nguyễn Văn A",
      position: "Giám đốc chi nhánh",
      phone: "0901234567",
      email: "nguyenvana@ecofarm.vn",
      isPrimary: true,
    },
    {
      id: "2",
      name: "Trần Thị B",
      position: "Kế toán trưởng",
      phone: "0901234568",
      email: "tranthib@ecofarm.vn",
      isPrimary: false,
    },
  ],
  bankAccounts: [
    {
      id: "1",
      bankName: "Vietcombank",
      accountNumber: "0123456789",
      accountHolder: "Chi nhánh Miền Nam - EcoFarm",
      branch: "Chi nhánh Sài Gòn",
      isPrimary: true,
    },
    {
      id: "2",
      bankName: "Techcombank",
      accountNumber: "8888999900",
      accountHolder: "Chi nhánh Miền Nam - EcoFarm",
      branch: "Hội sở chính",
      isPrimary: false,
    },
  ],
};

export default function BranchDetailPage() {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Trong thực tế, dùng id này để fetch data
  const [, params] = useRoute("/branch/:id");
  const id = params?.id;

  const handleDelete = () => {
    // Call API delete here
    toast({
      title: "Đã xóa chi nhánh",
      description: `Chi nhánh ${MOCK_DATA.name} đã được xóa thành công.`,
    });
    setShowDeleteDialog(false);
    setLocation("/branch");
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/branch")}
              className="mt-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {MOCK_DATA.name}
                </h1>
                <Badge
                  variant={
                    MOCK_DATA.status === "active" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {MOCK_DATA.status === "active" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Hoạt động
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Ngưng hoạt động
                    </span>
                  )}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {MOCK_DATA.enterpriseName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setLocation(`/branch/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Banner */}
                {MOCK_DATA.imageUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                    <img
                      src={MOCK_DATA.imageUrl}
                      alt={MOCK_DATA.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Mã chi nhánh
                    </label>
                    <p className="text-base font-semibold mt-1">
                      {MOCK_DATA.code}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Mã số thuế
                    </label>
                    <p className="text-base font-medium mt-1">
                      {MOCK_DATA.taxCode}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ đăng ký thuế
                    </label>
                    <p className="text-base mt-1">{MOCK_DATA.taxAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Map Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Định vị & Địa chỉ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/20 rounded-lg flex items-start gap-3 border">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {MOCK_DATA.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {MOCK_DATA.ward}, {MOCK_DATA.district}, {MOCK_DATA.city}
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full rounded-lg overflow-hidden border z-0 relative">
                  <MapContainer
                    center={[MOCK_DATA.latitude, MOCK_DATA.longitude]}
                    zoom={15}
                    style={{ height: "100%", width: "100%", zIndex: 0 }}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[MOCK_DATA.latitude, MOCK_DATA.longitude]}
                    />
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Contacts Lists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Nhân sự liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_DATA.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start gap-4 p-4 border rounded-xl bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {contact.name}
                          </h4>
                          {contact.isPrimary && (
                            <Badge variant="secondary" className="text-[10px]">
                              Chính
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">
                          {contact.position}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5" />
                            {contact.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Sidebar Info) */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4 text-primary" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Website */}
                <div className="flex items-start gap-3 pb-4 border-b">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a
                      href={MOCK_DATA.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      {MOCK_DATA.website}
                    </a>
                  </div>
                </div>

                {/* List Contacts */}
                <div className="space-y-4">
                  {MOCK_DATA.contactInfos.map((info, idx) => (
                    <div
                      key={info.id}
                      className="flex items-start gap-3 relative"
                    >
                      <div className="mt-0.5">
                        {idx === 0 ? (
                          <Phone className="w-5 h-5 text-gray-400" />
                        ) : (
                          <div className="w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {info.phone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {info.email}
                        </p>
                        {info.isPrimary && (
                          <Badge
                            variant="outline"
                            className="mt-1 text-[10px] h-5"
                          >
                            Liên hệ chính
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bank Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Tài khoản ngân hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_DATA.bankAccounts.map((bank) => (
                  <div
                    key={bank.id}
                    className="p-4 rounded-xl border bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-primary" />
                        <span className="font-bold text-gray-900">
                          {bank.bankName}
                        </span>
                      </div>
                      {bank.isPrimary && (
                        <Badge variant="default" className="text-[10px]">
                          Chính
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg font-mono font-semibold text-gray-800 mb-1 tracking-wide">
                      {bank.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                      {bank.accountHolder}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {bank.branch}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa chi nhánh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa chi nhánh "{MOCK_DATA.name}" không?
              <br />
              Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên
              quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
