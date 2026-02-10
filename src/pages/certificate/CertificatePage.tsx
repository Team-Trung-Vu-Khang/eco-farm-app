import { useState, useRef } from "react";
import { Plus, Upload, X, Building2, Award } from "lucide-react";
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
} from "@tankhang1/eco-shared-ui";

// Interface cho Tổ chức chứng nhận
interface CertificationOrganization {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

// Interface cho Loại tiêu chuẩn
interface Certificate {
  id: number;
  code: string;
  name: string;
  organizationIds: number[]; // Danh sách ID tổ chức có thể cấp
  content: string;
  contentType: "editor" | "file";
  fileUrl?: string;
  stampUrl?: string;
  stampType: "url" | "file";
  stampFileUrl?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

type CategoryType = "standards" | "organizations";

const CertificatePage = () => {
  const { toast } = useToast();
  const editorStateRef = useRef<any>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [stampPreview, setStampPreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<CategoryType>("standards");

  // Dữ liệu Tổ chức chứng nhận
  const [organizations, setOrganizations] = useState<
    CertificationOrganization[]
  >([
    {
      id: 1,
      code: "ORG001",
      name: "Bộ Nông nghiệp và Phát triển Nông thôn",
      address: "2 Ngọc Hà, Ba Đình, Hà Nội",
      phone: "024 3843 3141",
      email: "mard@mard.gov.vn",
      website: "https://www.mard.gov.vn",
      description: "Cơ quan quản lý nhà nước về nông nghiệp",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      code: "ORG002",
      name: "Cục Trồng trọt",
      address: "2 Ngọc Hà, Ba Đình, Hà Nội",
      phone: "024 3733 9775",
      email: "cuctrongtrot@mard.gov.vn",
      website: "https://www.cuctrongtrot.gov.vn",
      description: "Cơ quan chuyên môn thuộc Bộ NN&PTNT",
      status: "active",
      createdAt: "2024-01-02",
    },
    {
      id: 3,
      code: "ORG003",
      name: "Tổ chức GlobalGAP",
      address: "c/o FoodPLUS GmbH, Spichernstr. 55, 50672 Cologne, Germany",
      phone: "+49 221 57993 0",
      email: "info@globalgap.org",
      website: "https://www.globalgap.org",
      description: "Tổ chức tiêu chuẩn nông nghiệp toàn cầu",
      status: "active",
      createdAt: "2024-01-03",
    },
    {
      id: 4,
      code: "ORG004",
      name: "FoodPLUS GmbH",
      address: "Spichernstr. 55, 50672 Cologne, Germany",
      phone: "+49 221 57993 0",
      email: "contact@foodplus.org",
      website: "https://www.foodplus.org",
      description: "Tổ chức quản lý GlobalGAP",
      status: "active",
      createdAt: "2024-01-04",
    },
    {
      id: 5,
      code: "ORG005",
      name: "Cục Quản lý Chất lượng Nông lâm sản và Thủy sản",
      address: "2 Ngọc Hà, Ba Đình, Hà Nội",
      phone: "024 3846 3179",
      email: "nafiqad@mard.gov.vn",
      website: "https://www.nafiqad.gov.vn",
      description: "Quản lý chất lượng và an toàn thực phẩm",
      status: "active",
      createdAt: "2024-01-05",
    },
  ]);

  // Dữ liệu Loại tiêu chuẩn
  const [data, setData] = useState<Certificate[]>([
    {
      id: 1,
      code: "CH001",
      name: "Global GAP",
      organizationIds: [3, 4], // GlobalGAP và FoodPLUS
      content: "Chứng nhận thực hành nông nghiệp tốt toàn cầu",
      contentType: "editor",
      stampUrl: "https://lifarm.vn/wp-content/uploads/2025/03/globalgap-1.png",
      stampType: "url",
      description: "Tiêu chuẩn về thực hành nông nghiệp tốt",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "CH002",
      name: "VietGAP",
      organizationIds: [1, 2], // Bộ NN&PTNT và Cục Trồng trọt
      content: "Chứng nhận thực hành nông nghiệp tốt Việt Nam",
      contentType: "editor",
      stampUrl:
        "https://vietpatservice.com/wp-content/uploads/2019/04/VietGAP.jpg",
      stampType: "url",
      description:
        "Tiêu chuẩn về thực hành sản xuất nông nghiệp tốt ở Việt Nam",
      status: "active",
      createdAt: "2024-01-11",
    },
  ]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<
    Certificate | CertificationOrganization | null
  >(null);

  // Form states cho Loại tiêu chuẩn
  const [standardFormOpen, setStandardFormOpen] = useState(false);
  const [editStandard, setEditStandard] = useState<Certificate | null>(null);
  const [standardFormData, setStandardFormData] = useState<
    Omit<Certificate, "id" | "createdAt">
  >({
    code: "",
    name: "",
    organizationIds: [],
    content: "",
    contentType: "editor",
    fileUrl: "",
    stampUrl: "",
    stampType: "url",
    stampFileUrl: "",
    description: "",
    status: "active",
  });

  // Form states cho Tổ chức
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<CertificationOrganization | null>(
    null,
  );
  const [orgFormData, setOrgFormData] = useState<
    Omit<CertificationOrganization, "id" | "createdAt">
  >({
    code: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    status: "active",
  });

  // State cho tìm kiếm tổ chức
  const [orgSearchQuery, setOrgSearchQuery] = useState("");

  // Lọc danh sách tổ chức theo search query
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      org.code.toLowerCase().includes(orgSearchQuery.toLowerCase()),
  );

  // Columns cho Loại tiêu chuẩn
  const standardColumns: Column<Certificate>[] = [
    { key: "code", label: "Mã số" },
    { key: "name", label: "Tên tiêu chuẩn" },
    {
      key: "stampUrl",
      label: "Dấu mộc",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="Stamp"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      key: "organizationIds",
      label: "Tổ chức cấp",
      render: (value) => {
        const orgIds = value as number[];
        const orgNames = organizations
          .filter((org) => orgIds.includes(org.id))
          .map((org) => org.name);

        if (orgNames.length === 0) return <span>-</span>;
        if (orgNames.length === 1) return <span>{orgNames[0]}</span>;

        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{orgNames[0]}</Badge>
            {orgNames.length > 1 && (
              <Badge variant="outline">+{orgNames.length - 1}</Badge>
            )}
          </div>
        );
      },
    },
  ];

  // Columns cho Tổ chức
  const orgColumns: Column<CertificationOrganization>[] = [
    { key: "code", label: "Mã tổ chức" },
    { key: "name", label: "Tên tổ chức" },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website" },
  ];

  // Handlers cho Loại tiêu chuẩn
  const handleAddStandard = () => {
    setEditStandard(null);
    setStandardFormData({
      code: "",
      name: "",
      organizationIds: [],
      content: "",
      contentType: "editor",
      fileUrl: "",
      stampUrl: "",
      stampType: "url",
      stampFileUrl: "",
      description: "",
      status: "active",
    });
    editorStateRef.current = null;
    setOrgSearchQuery("");
    setStampFile(null);
    setStampPreview("");
    setStandardFormOpen(true);
  };

  const handleEditStandard = (item: Certificate) => {
    setEditStandard(item);
    setStandardFormData({
      code: item.code,
      name: item.name,
      organizationIds: item.organizationIds,
      content: item.content,
      contentType: item.contentType || "editor",
      fileUrl: item.fileUrl || "",
      stampUrl: item.stampUrl || "",
      stampType: item.stampType || "url",
      stampFileUrl: item.stampFileUrl || "",
      description: item.description,
      status: item.status,
    });
    editorStateRef.current = null;
    setStampFile(null);
    setOrgSearchQuery("");
    setStampPreview(item.stampUrl || "");
    setStandardFormOpen(true);
  };

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStampFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setStampPreview(result);
        setStandardFormData({ ...standardFormData, stampUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveStamp = () => {
    setStampFile(null);
    setStampPreview("");
    setStandardFormData({ ...standardFormData, stampUrl: "" });
  };

  const handleSubmitStandard = async () => {
    let finalContent = standardFormData.content;

    if (editorStateRef.current) {
      try {
        const serialized = editorStateRef.current.toJSON();
        // finalContent = await convertLexicalToHtml(serialized);
      } catch (error) {
        console.error("Error converting editor content:", error);
      }
    }

    const submissionData = { ...standardFormData, content: finalContent };

    if (editStandard) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editStandard.id ? { ...item, ...submissionData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật loại tiêu chuẩn",
      });
    } else {
      const newStandard: Certificate = {
        id: Date.now(),
        ...submissionData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData((prev) => [...prev, newStandard]);
      toast({
        title: "Thành công",
        description: "Đã thêm loại tiêu chuẩn mới",
      });
    }
    setStandardFormOpen(false);
  };

  // Handlers cho Tổ chức
  const handleAddOrg = () => {
    setEditOrg(null);
    setOrgFormData({
      code: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      description: "",
      status: "active",
    });
    setOrgFormOpen(true);
  };

  const handleEditOrg = (item: CertificationOrganization) => {
    setEditOrg(item);
    setOrgFormData({
      code: item.code,
      name: item.name,
      address: item.address,
      phone: item.phone,
      email: item.email,
      website: item.website,
      description: item.description,
      status: item.status,
    });
    setOrgFormOpen(true);
  };

  const handleSubmitOrg = () => {
    if (editOrg) {
      setOrganizations((prev) =>
        prev.map((item) =>
          item.id === editOrg.id ? { ...item, ...orgFormData } : item,
        ),
      );
      toast({ title: "Thành công", description: "Đã cập nhật tổ chức" });
    } else {
      const newOrg: CertificationOrganization = {
        id: Date.now(),
        ...orgFormData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setOrganizations((prev) => [...prev, newOrg]);
      toast({ title: "Thành công", description: "Đã thêm tổ chức mới" });
    }
    setOrgFormOpen(false);
  };

  // Delete handlers
  const handleDeleteStandard = (item: Certificate) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleDeleteOrg = (item: CertificationOrganization) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      if (activeTab === "standards") {
        setData((prev) => prev.filter((item) => item.id !== deleteItem.id));
        toast({ title: "Thành công", description: "Đã xóa loại tiêu chuẩn" });
      } else {
        setOrganizations((prev) =>
          prev.filter((item) => item.id !== deleteItem.id),
        );
        toast({ title: "Thành công", description: "Đã xóa tổ chức" });
      }
    }
    setDeleteOpen(false);
  };

  // Toggle organization selection
  const toggleOrganization = (orgId: number) => {
    setStandardFormData((prev) => ({
      ...prev,
      organizationIds: prev.organizationIds.includes(orgId)
        ? prev.organizationIds.filter((id) => id !== orgId)
        : [...prev.organizationIds, orgId],
    }));
  };

  return (
    <AdminLayout
      title="Danh mục tiêu chuẩn"
      description="Quản lý loại tiêu chuẩn và tổ chức chứng nhận (Master Data)"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standards" className="gap-2">
            <Award className="w-4 h-4" />
            Loại tiêu chuẩn
          </TabsTrigger>
          <TabsTrigger value="organizations" className="gap-2">
            <Building2 className="w-4 h-4" />
            Tổ chức chứng nhận
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Loại tiêu chuẩn</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý các loại tiêu chuẩn chứng nhận (VietGAP, GlobalGAP...)
              </p>
            </div>
            <Button onClick={handleAddStandard} data-testid="add-standard">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tiêu chuẩn
            </Button>
          </div>
          <DataTable
            columns={standardColumns}
            data={data}
            onEdit={handleEditStandard}
            onDelete={handleDeleteStandard}
            searchPlaceholder="Tìm kiếm tiêu chuẩn..."
          />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Tổ chức chứng nhận</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý các tổ chức có thẩm quyền cấp chứng nhận
              </p>
            </div>
            <Button onClick={handleAddOrg} data-testid="add-organization">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tổ chức
            </Button>
          </div>
          <DataTable
            columns={orgColumns}
            data={organizations}
            onEdit={handleEditOrg}
            onDelete={handleDeleteOrg}
            searchPlaceholder="Tìm kiếm tổ chức..."
          />
        </TabsContent>
      </Tabs>

      {/* Form Dialog cho Loại tiêu chuẩn */}
      <FormDialog
        open={standardFormOpen}
        onOpenChange={setStandardFormOpen}
        title={
          editStandard
            ? "Chỉnh sửa loại tiêu chuẩn"
            : "Thêm loại tiêu chuẩn mới"
        }
        onSubmit={handleSubmitStandard}
        size="xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 flex flex-col md:flex-row gap-6">
          {/* Left Column: Stamp/Logo */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <Label>Dấu mộc</Label>
            {stampPreview ? (
              <div className="relative">
                <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/20 min-h-[200px]">
                  <img
                    src={stampPreview}
                    alt="Stamp Preview"
                    className="max-w-full max-h-[180px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/200x200?text=Logo";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveStamp}
                  className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="stamp-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors min-h-[200px]"
              >
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <span className="text-sm font-medium text-muted-foreground">
                  Click để tải ảnh dấu mộc lên
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG (tối đa 2MB)
                </span>
                <input
                  id="stamp-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleStampUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-2/3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã số</Label>
                <Input
                  id="code"
                  value={standardFormData.code}
                  onChange={(e) =>
                    setStandardFormData({
                      ...standardFormData,
                      code: e.target.value,
                    })
                  }
                  placeholder="VD: CH001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Tên tiêu chuẩn</Label>
                <Input
                  id="name"
                  value={standardFormData.name}
                  onChange={(e) =>
                    setStandardFormData({
                      ...standardFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="VD: GlobalGAP"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tổ chức có thể cấp chứng nhận</Label>
              <Input
                placeholder="Tìm kiếm tổ chức..."
                value={orgSearchQuery}
                onChange={(e) => setOrgSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto">
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => toggleOrganization(org.id)}
                    >
                      <input
                        type="checkbox"
                        checked={standardFormData.organizationIds.includes(
                          org.id,
                        )}
                        onChange={() => toggleOrganization(org.id)}
                        className="cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {org.code}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Không tìm thấy tổ chức
                  </div>
                )}
              </div>
              {standardFormData.organizationIds.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Đã chọn {standardFormData.organizationIds.length} tổ chức
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Định nghĩa / Mô tả</Label>
              <Textarea
                id="description"
                value={standardFormData.description}
                onChange={(e) =>
                  setStandardFormData({
                    ...standardFormData,
                    description: e.target.value,
                  })
                }
                placeholder="Mô tả thêm..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung giấy chứng nhận</Label>
              <Tabs
                defaultValue={standardFormData.contentType}
                onValueChange={(value) =>
                  setStandardFormData({
                    ...standardFormData,
                    contentType: value as "editor" | "file",
                  })
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="mt-4">
                  <Textarea
                    id="content"
                    value={standardFormData.content}
                    onChange={(e) =>
                      setStandardFormData({
                        ...standardFormData,
                        content: e.target.value,
                      })
                    }
                    placeholder="Nội dung giấy chứng nhận..."
                    rows={2}
                  />
                </TabsContent>

                <TabsContent value="file" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileUpload">Chọn file (PDF, DOCX...)</Label>
                    <Input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const fileUrl = URL.createObjectURL(file);
                          setStandardFormData({
                            ...standardFormData,
                            fileUrl: fileUrl,
                            content: file.name,
                          });
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  {standardFormData.fileUrl && (
                    <div className="p-4 border rounded bg-muted/20 space-y-2">
                      <div className="text-sm text-muted-foreground">
                        File đã chọn:{" "}
                        <span className="font-medium">
                          {standardFormData.content}
                        </span>
                      </div>
                      <a
                        href={standardFormData.fileUrl}
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
        </div>
      </FormDialog>

      {/* Form Dialog cho Tổ chức */}
      <FormDialog
        open={orgFormOpen}
        onOpenChange={setOrgFormOpen}
        title={editOrg ? "Chỉnh sửa tổ chức" : "Thêm tổ chức mới"}
        onSubmit={handleSubmitOrg}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orgCode">Mã tổ chức</Label>
              <Input
                id="orgCode"
                value={orgFormData.code}
                onChange={(e) =>
                  setOrgFormData({ ...orgFormData, code: e.target.value })
                }
                placeholder="VD: ORG001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgName">Tên tổ chức</Label>
              <Input
                id="orgName"
                value={orgFormData.name}
                onChange={(e) =>
                  setOrgFormData({ ...orgFormData, name: e.target.value })
                }
                placeholder="VD: Bộ Nông nghiệp..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={orgFormData.address}
              onChange={(e) =>
                setOrgFormData({ ...orgFormData, address: e.target.value })
              }
              placeholder="Địa chỉ trụ sở..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Điện thoại</Label>
              <Input
                id="phone"
                value={orgFormData.phone}
                onChange={(e) =>
                  setOrgFormData({ ...orgFormData, phone: e.target.value })
                }
                placeholder="024 xxxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={orgFormData.email}
                onChange={(e) =>
                  setOrgFormData({ ...orgFormData, email: e.target.value })
                }
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={orgFormData.website}
              onChange={(e) =>
                setOrgFormData({ ...orgFormData, website: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orgDescription">Mô tả</Label>
            <Textarea
              id="orgDescription"
              value={orgFormData.description}
              onChange={(e) =>
                setOrgFormData({ ...orgFormData, description: e.target.value })
              }
              placeholder="Mô tả về tổ chức..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${activeTab === "standards" ? "loại tiêu chuẩn" : "tổ chức"} này?`}
      />
    </AdminLayout>
  );
};

export default CertificatePage;
