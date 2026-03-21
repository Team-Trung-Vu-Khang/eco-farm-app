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
import { useState } from "react";
import useBranchStore from "../../stores/useBranchStore";
import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";

export default function BranchDetailPage() {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  // Get branch ID from route params
  const [, params] = useRoute("/branch/:id/detail");
  const branchId = params?.id ? parseInt(params.id) : undefined;

  // Fetch branch from store
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const handleDelete = () => {
    if (branchId) {
      deleteBranch(branchId);
      toast({
        title: "Đã xóa chi nhánh",
        description: `Chi nhánh ${branch?.name} đã được xóa thành công.`,
      });
      setShowDeleteDialog(false);
      setLocation("/branch");
    }
  };

  // Show not found if branch doesn't exist
  if (!branch) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy thông tin chi nhánh
          </h2>
          <Button onClick={() => setLocation("/branch")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Default coordinates if not available
  const latitude = branch.latitude ? parseFloat(branch.latitude) : 10.7769;
  const longitude = branch.longitude ? parseFloat(branch.longitude) : 106.7009;

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
                  {branch.name}
                </h1>
                <Badge
                  variant={branch.status === "active" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {branch.status === "active" ? (
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
                {branch.enterpriseName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setLocation(`/branch/${branchId}/edit`)}
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
                {branch.imageUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                    <img
                      src={branch.imageUrl}
                      alt={branch.name}
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
                      {branch.code}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Điện thoại
                    </label>
                    <p className="text-base font-medium mt-1">
                      {branch.phone || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Địa chỉ
                    </label>
                    <p className="text-base mt-1">{branch.address}</p>
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
                      {branch.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {branch.ward && `${branch.ward}, `}
                      {branch.district && `${branch.district}, `}
                      {branch.city}
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full rounded-lg overflow-hidden border z-0 relative">
                  <MFMap
                    center={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    zoom={15}
                    accessKey="37b541da761a2896d03951cf69bc989e"
                    options={{
                      mapType: "raster",
                      controlOptions: {},
                    }}
                    version="2.5"
                  >
                    <MFMarker
                      position={{
                        lat: latitude,
                        lng: longitude,
                      }}
                      label={""}
                      title={`${branch.enterpriseName} - ${branch.name}`}
                    />
                  </MFMap>
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
                {branch.contacts && branch.contacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {branch.contacts.map((contact) => (
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
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
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
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có thông tin nhân sự liên hệ
                  </p>
                )}
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
                {/* Phone and Email */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Điện thoại
                      </p>
                      <p className="font-medium text-gray-900">
                        {branch.phone || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {branch.email || "-"}
                      </p>
                    </div>
                  </div>
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
                {branch.bankAccounts && branch.bankAccounts.length > 0 ? (
                  branch.bankAccounts.map((bank) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có thông tin tài khoản ngân hàng
                  </p>
                )}
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
              Bạn có chắc chắn muốn xóa chi nhánh "{branch.name}" không?
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
