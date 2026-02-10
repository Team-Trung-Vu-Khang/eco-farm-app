import { useState, useRef } from "react";
import { Plus, AlertCircle, CheckCircle2, Clock, Filter } from "lucide-react";
import {
  AdminLayout,
  Badge,
  Button,
  DataTable,
  DeleteDialog,
  FormDialog,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
  type Column,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@tankhang1/eco-shared-ui";

interface EnterpriseCertificate {
  id: number;
  code: string;
  name: string;
  standardType: string; // Loại tiêu chuẩn (VietGAP, GlobalGAP...)
  organization: string; // Tổ chức cấp
  issuedDate: string; // Thời gian cấp
  expiryDate: string; // Thời gian hết hạn
  status: "valid" | "expired" | "expiring_soon"; // Tự động tính
  entityType: "enterprise" | "area"; // Doanh nghiệp hoặc Vùng trồng
  entityId: string; // ID của doanh nghiệp hoặc vùng trồng
  entityName: string; // Tên doanh nghiệp hoặc vùng trồng
  content: string; // Nội dung chứng nhận
  contentType: "editor" | "file";
  fileUrl?: string;
  attachments: string[]; // Danh sách file đính kèm
  createdAt: string;
}

const EnterpriseCertificatePage = () => {
  const { toast } = useToast();
  const editorContentRef = useRef<string>("");

  // Danh sách tiêu chuẩn (lấy từ Certificate Master Data)
  const standards = [
    {
      code: "VietGAP",
      name: "VietGAP",
      organizations: [
        "Bộ Nông nghiệp và Phát triển Nông thôn",
        "Cục Trồng trọt",
      ],
    },
    {
      code: "GlobalGAP",
      name: "Global GAP",
      organizations: ["Tổ chức GlobalGAP", "FoodPLUS GmbH"],
    },
    {
      code: "Organic",
      name: "Organic",
      organizations: [
        "Bộ Nông nghiệp và Phát triển Nông thôn",
        "Cục Quản lý Chất lượng Nông lâm sản và Thủy sản",
      ],
    },
    {
      code: "HACCP",
      name: "HACCP",
      organizations: ["Cục Quản lý Chất lượng Nông lâm sản và Thủy sản"],
    },
    {
      code: "ISO22000",
      name: "ISO 22000",
      organizations: ["Tổ chức Tiêu chuẩn Quốc tế (ISO)"],
    },
  ];

  // State để lưu danh sách tổ chức có thể cấp cho tiêu chuẩn đã chọn
  const [availableOrganizations, setAvailableOrganizations] = useState<
    string[]
  >([]);

  // Danh sách doanh nghiệp (mock data)
  const enterprises = [
    { id: "DN001", code: "DN001", name: "HTX Nông nghiệp Xanh" },
    { id: "DN002", code: "DN002", name: "Trang trại hữu cơ B" },
    { id: "DN003", code: "DN003", name: "Công ty TNHH Nông sản Sạch" },
    { id: "DN004", code: "DN004", name: "HTX Rau Quả An Toàn" },
    { id: "DN005", code: "DN005", name: "Trang trại Eco Farm" },
  ];

  // Danh sách vùng trồng theo doanh nghiệp (mock data)
  const areas = [
    {
      id: "VT001",
      code: "VT001",
      name: "Vùng trồng A - Đồng bằng",
      enterpriseId: "DN001",
    },
    {
      id: "VT002",
      code: "VT002",
      name: "Vùng trồng B - Miền núi",
      enterpriseId: "DN001",
    },
    {
      id: "VT003",
      code: "VT003",
      name: "Vùng trồng C - Ven biển",
      enterpriseId: "DN002",
    },
    {
      id: "VT004",
      code: "VT004",
      name: "Vùng trồng D - Cao nguyên",
      enterpriseId: "DN003",
    },
    {
      id: "VT005",
      code: "VT005",
      name: "Vùng trồng E - Đồng bằng sông Cửu Long",
      enterpriseId: "DN003",
    },
    {
      id: "VT006",
      code: "VT006",
      name: "Vùng trồng F - Tây Nguyên",
      enterpriseId: "DN003",
    },
  ];

  const [data, setData] = useState<EnterpriseCertificate[]>([
    {
      id: 1,
      code: "CN-2024-001",
      name: "Chứng nhận VietGAP cho HTX Nông nghiệp",
      standardType: "VietGAP",
      organization: "Bộ Nông nghiệp và Phát triển Nông thôn",
      issuedDate: "2024-01-15",
      expiryDate: "2025-01-15",
      status: "valid",
      entityType: "enterprise",
      entityId: "DN001",
      entityName: "HTX Nông nghiệp Xanh",
      content: "Chứng nhận đạt tiêu chuẩn VietGAP cho sản xuất rau an toàn",
      contentType: "editor",
      attachments: [],
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      code: "CN-2024-002",
      name: "Chứng nhận GlobalGAP - Vùng trồng A",
      standardType: "GlobalGAP",
      organization: "Tổ chức GlobalGAP",
      issuedDate: "2023-06-20",
      expiryDate: "2024-12-20",
      status: "expiring_soon",
      entityType: "area",
      entityId: "VT001",
      entityName: "Vùng trồng A - Đồng bằng",
      content: "Chứng nhận đạt tiêu chuẩn GlobalGAP",
      contentType: "editor",
      attachments: [],
      createdAt: "2023-06-20",
    },
    {
      id: 3,
      code: "CN-2023-015",
      name: "Chứng nhận Organic - Trang trại B",
      standardType: "Organic",
      organization: "Cục Quản lý Chất lượng",
      issuedDate: "2023-03-10",
      expiryDate: "2024-03-10",
      status: "expired",
      entityType: "enterprise",
      entityId: "DN002",
      entityName: "Trang trại hữu cơ B",
      content: "Chứng nhận sản xuất hữu cơ",
      contentType: "editor",
      attachments: [],
      createdAt: "2023-03-10",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseCertificate | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseCertificate | null>(
    null,
  );

  const [formData, setFormData] = useState<
    Omit<EnterpriseCertificate, "id" | "createdAt" | "status">
  >({
    code: "",
    name: "",
    standardType: "",
    organization: "",
    issuedDate: "",
    expiryDate: "",
    entityType: "enterprise",
    entityId: "",
    entityName: "",
    content: "",
    contentType: "editor",
    fileUrl: "",
    attachments: [],
  });

  // State để lưu enterprise đã chọn (dùng cho việc lọc vùng trồng)
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    status: "all",
    standardType: "all",
    entityType: "all",
  });

  const [filterOpen, setFilterOpen] = useState(false);

  // Lọc dữ liệu dựa trên filters
  const filteredData = data.filter((item) => {
    if (filters.status !== "all" && item.status !== filters.status)
      return false;
    if (
      filters.standardType !== "all" &&
      item.standardType !== filters.standardType
    )
      return false;
    if (filters.entityType !== "all" && item.entityType !== filters.entityType)
      return false;
    return true;
  });

  // Hàm xử lý khi chọn loại tiêu chuẩn
  const handleStandardTypeChange = (value: string) => {
    const selectedStandard = standards.find((s) => s.code === value);
    const orgs = selectedStandard?.organizations || [];
    setAvailableOrganizations(orgs);
    setFormData({
      ...formData,
      standardType: value,
      organization: orgs.length === 1 ? orgs[0] : "", // Auto-fill nếu chỉ có 1 tổ chức
    });
  };

  // Hàm xử lý khi chọn doanh nghiệp
  const handleEnterpriseSelect = (enterpriseId: string) => {
    const selectedEnterprise = enterprises.find((e) => e.id === enterpriseId);

    if (selectedEnterprise) {
      setSelectedEnterpriseId(enterpriseId);

      // Nếu chọn cấp cho toàn doanh nghiệp
      if (formData.entityType === "enterprise") {
        setFormData({
          ...formData,
          entityId: selectedEnterprise.code,
          entityName: selectedEnterprise.name,
        });
      } else {
        // Nếu chọn vùng trồng, reset vùng trồng đã chọn
        setFormData({
          ...formData,
          entityId: "",
          entityName: "",
        });
      }
    }
  };

  // Hàm xử lý khi chọn vùng trồng
  const handleAreaSelect = (areaId: string) => {
    const selectedArea = areas.find((a) => a.id === areaId);

    if (selectedArea) {
      setFormData({
        ...formData,
        entityId: selectedArea.code,
        entityName: selectedArea.name,
      });
    }
  };

  // Hàm tính trạng thái tự động
  const calculateStatus = (
    expiryDate: string,
  ): "valid" | "expired" | "expiring_soon" => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 30) return "expiring_soon";
    return "valid";
  };

  const columns: Column<EnterpriseCertificate>[] = [
    { key: "code", label: "Mã chứng nhận" },
    { key: "name", label: "Tên chứng nhận" },
    { key: "standardType", label: "Loại tiêu chuẩn" },
    {
      key: "entityName",
      label: "Đối tượng",
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium">{value as string}</span>
          <span className="text-xs text-muted-foreground">
            {row.entityType === "enterprise" ? "Doanh nghiệp" : "Vùng trồng"}
          </span>
        </div>
      ),
    },
    { key: "organization", label: "Tổ chức cấp" },
    { key: "issuedDate", label: "Ngày cấp" },
    { key: "expiryDate", label: "Ngày hết hạn" },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => {
        const statusConfig = {
          valid: {
            variant: "default",
            label: "Đang hiệu lực",
            icon: CheckCircle2,
          },
          expiring_soon: {
            variant: "secondary",
            label: "Sắp hết hạn",
            icon: Clock,
          },
          expired: {
            variant: "destructive",
            label: "Hết hạn",
            icon: AlertCircle,
          },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        const Icon = config.icon;
        return (
          <Badge variant={config.variant as any} className="gap-1">
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        );
      },
    },
  ];

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      standardType: "",
      organization: "",
      issuedDate: "",
      expiryDate: "",
      entityType: "enterprise",
      entityId: "",
      entityName: "",
      content: "",
      contentType: "editor",
      fileUrl: "",
      attachments: [],
    });
    setAvailableOrganizations([]);
    editorContentRef.current = "";
    setFormOpen(true);
  };

  const handleEdit = (item: EnterpriseCertificate) => {
    setEditItem(item);
    const selectedStandard = standards.find(
      (s) => s.code === item.standardType,
    );
    setAvailableOrganizations(selectedStandard?.organizations || []);
    setFormData({
      code: item.code,
      name: item.name,
      standardType: item.standardType,
      organization: item.organization,
      issuedDate: item.issuedDate,
      expiryDate: item.expiryDate,
      entityType: item.entityType,
      entityId: item.entityId,
      entityName: item.entityName,
      content: item.content,
      contentType: item.contentType,
      fileUrl: item.fileUrl || "",
      attachments: item.attachments,
    });
    editorContentRef.current = item.content;
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseCertificate) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const status = calculateStatus(formData.expiryDate);
    const finalContent =
      formData.contentType === "editor"
        ? editorContentRef.current
        : formData.content;

    const submissionData = {
      ...formData,
      content: finalContent,
      status,
    };

    if (editItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...submissionData } : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật chứng nhận" });
    } else {
      const newItem: EnterpriseCertificate = {
        id: Date.now(),
        ...submissionData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newItem]);
      toast({ title: "Thành công", description: "Đã thêm chứng nhận mới" });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
      toast({ title: "Thành công", description: "Đã xóa chứng nhận" });
    }
    setDeleteOpen(false);
  };

  // Cấu hình bộ lọc cho DataTable
  const filterConfig = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang hiệu lực", value: "valid" },
        { label: "Sắp hết hạn", value: "expiring_soon" },
        { label: "Hết hạn", value: "expired" },
      ],
    },
    {
      key: "standardType",
      label: "Loại tiêu chuẩn",
      options: [
        ...standards.map((standard) => ({
          label: standard.name,
          value: standard.code,
        })),
      ],
    },
    {
      key: "entityType",
      label: "Loại đối tượng",
      options: [
        { label: "Doanh nghiệp", value: "enterprise" },
        { label: "Vùng trồng", value: "area" },
      ],
    },
  ];

  return (
    <AdminLayout
      title="Chứng nhận - Chứng chỉ"
      description="Quản lý chứng nhận cho doanh nghiệp và vùng trồng"
      actions={
        <Button onClick={handleAdd} data-testid="add-certificate">
          <Plus className="w-4 h-4 mr-2" />
          Thêm chứng nhận
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm chứng nhận..."
        filters={filterConfig}
      />

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? "Chỉnh sửa chứng nhận" : "Thêm chứng nhận mới"}
        onSubmit={handleSubmit}
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã chứng nhận *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: CN-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên chứng nhận *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Chứng nhận VietGAP..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standardType">Loại tiêu chuẩn *</Label>
              <Select
                value={formData.standardType}
                onValueChange={handleStandardTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại tiêu chuẩn" />
                </SelectTrigger>
                <SelectContent>
                  {standards.map((standard) => (
                    <SelectItem key={standard.code} value={standard.code}>
                      {standard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Tổ chức cấp *</Label>
              <Select
                value={formData.organization}
                onValueChange={(val) =>
                  setFormData({ ...formData, organization: val })
                }
                disabled={availableOrganizations.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      availableOrganizations.length === 0
                        ? "Chọn tiêu chuẩn trước"
                        : "Chọn tổ chức cấp..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableOrganizations.map((org, index) => (
                    <SelectItem key={index} value={org}>
                      {org}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issuedDate">Ngày cấp *</Label>
              <Input
                id="issuedDate"
                type="date"
                value={formData.issuedDate}
                onChange={(e) =>
                  setFormData({ ...formData, issuedDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Đối tượng được cấp */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <Label>Đối tượng được cấp chứng nhận *</Label>

            {/* Bước 1: Chọn doanh nghiệp */}
            <div className="space-y-2">
              <Label htmlFor="enterpriseSelect">1. Chọn doanh nghiệp *</Label>
              <Select
                value={selectedEnterpriseId}
                onValueChange={handleEnterpriseSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tìm và chọn doanh nghiệp..." />
                </SelectTrigger>
                <SelectContent>
                  {enterprises.map((enterprise) => (
                    <SelectItem key={enterprise.id} value={enterprise.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{enterprise.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {enterprise.code}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bước 2: Chọn cấp cho toàn doanh nghiệp hay vùng trồng cụ thể */}
            {selectedEnterpriseId && (
              <div className="space-y-2">
                <Label htmlFor="entityType">2. Cấp chứng nhận cho *</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(val: any) => {
                    setFormData({
                      ...formData,
                      entityType: val,
                      entityId: "",
                      entityName: "",
                    });

                    // Nếu chọn toàn doanh nghiệp, tự động điền thông tin
                    if (val === "enterprise") {
                      const enterprise = enterprises.find(
                        (e) => e.id === selectedEnterpriseId,
                      );
                      if (enterprise) {
                        setFormData({
                          ...formData,
                          entityType: val,
                          entityId: enterprise.code,
                          entityName: enterprise.name,
                        });
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phạm vi..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">
                      Toàn bộ doanh nghiệp
                    </SelectItem>
                    <SelectItem value="area">Vùng trồng cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bước 3: Nếu chọn vùng trồng, hiển thị danh sách vùng trồng của doanh nghiệp */}
            {selectedEnterpriseId && formData.entityType === "area" && (
              <div className="space-y-2">
                <Label htmlFor="areaSelect">3. Chọn vùng trồng *</Label>
                <Select
                  value={formData.entityId}
                  onValueChange={handleAreaSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vùng trồng..." />
                  </SelectTrigger>
                  <SelectContent>
                    {areas
                      .filter(
                        (area) => area.enterpriseId === selectedEnterpriseId,
                      )
                      .map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{area.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {area.code}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Hiển thị thông tin đã chọn */}
            {formData.entityName && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">
                      ✓ Đã chọn:
                    </span>
                    <span className="font-medium">{formData.entityName}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Mã: {formData.entityId} • Loại:{" "}
                    {formData.entityType === "enterprise"
                      ? "Doanh nghiệp"
                      : "Vùng trồng"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nội dung & Tài liệu */}
          <div className="space-y-2">
            <Label>Nội dung chứng nhận</Label>
            <Tabs
              defaultValue={formData.contentType}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  contentType: value as "editor" | "file",
                })
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
                <TabsTrigger value="file">File đính kèm</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => {
                    editorContentRef.current = e.target.value;
                    setFormData({ ...formData, content: e.target.value });
                  }}
                  placeholder="Nội dung chứng nhận..."
                  rows={5}
                />
              </TabsContent>

              <TabsContent value="file" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fileUpload">Chọn file (PDF, Image...)</Label>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const fileUrl = URL.createObjectURL(file);
                        setFormData({
                          ...formData,
                          fileUrl: fileUrl,
                          content: file.name,
                        });
                      }
                    }}
                    className="cursor-pointer"
                  />
                </div>
                {formData.fileUrl && (
                  <div className="p-4 border rounded bg-muted/20 space-y-2">
                    <div className="text-sm text-muted-foreground">
                      File đã chọn:{" "}
                      <span className="font-medium">{formData.content}</span>
                    </div>
                    <a
                      href={formData.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm inline-block"
                    >
                      Xem file
                    </a>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chứng nhận này?"
      />
    </AdminLayout>
  );
};

export default EnterpriseCertificatePage;
