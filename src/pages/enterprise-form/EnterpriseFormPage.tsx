import { useState } from "react";
import { Plus, Building2, Briefcase } from "lucide-react";
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
  useToast,
  type Column,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface EnterpriseType {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

type CategoryType = "organization" | "business";

const EnterpriseFormPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<CategoryType>("organization");

  // Dữ liệu Loại hình tổ chức
  const [organizationData, setOrganizationData] = useState<EnterpriseType[]>([
    {
      id: 1,
      code: "HTX",
      name: "Hợp tác xã",
      description:
        "Tổ chức kinh tế tập thể do các thành viên tự nguyện thành lập",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "DNTN",
      name: "Doanh nghiệp tư nhân",
      description:
        "Doanh nghiệp do một cá nhân làm chủ và chịu trách nhiệm bằng toàn bộ tài sản",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "TNHH",
      name: "Công ty TNHH",
      description:
        "Công ty trách nhiệm hữu hạn, thành viên chịu trách nhiệm trong phạm vi vốn góp",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "CP",
      name: "Công ty cổ phần",
      description:
        "Công ty có vốn điều lệ chia thành nhiều phần bằng nhau gọi là cổ phần",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "DNNN",
      name: "Doanh nghiệp nhà nước",
      description: "Doanh nghiệp do Nhà nước nắm giữ 100% vốn điều lệ",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 6,
      code: "NH",
      name: "Nông hộ",
      description: "Hộ gia đình sản xuất nông nghiệp, lâm nghiệp, ngư nghiệp",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 7,
      code: "HTXLN",
      name: "Hợp tác xã liên hiệp",
      description: "Liên hiệp của các hợp tác xã cùng ngành nghề hoặc lãnh thổ",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      code: "TCKT",
      name: "Tổ hợp tác",
      description: "Tổ chức kinh tế hợp tác nhỏ hơn hợp tác xã",
      status: "active",
      createdAt: "2024-01-17",
    },
  ]);

  // Dữ liệu Lĩnh vực hoạt động
  const [businessData, setBusinessData] = useState<EnterpriseType[]>([
    {
      id: 1,
      code: "SX",
      name: "Sản xuất",
      description:
        "Hoạt động sản xuất nông nghiệp, trồng trọt, chăn nuôi, nuôi trồng thủy sản",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "CB",
      name: "Chế biến",
      description: "Chế biến nông sản, thực phẩm, đóng gói và bảo quản",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "TM",
      name: "Thương mại",
      description: "Mua bán, phân phối nông sản, vật tư nông nghiệp",
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 4,
      code: "DV",
      name: "Dịch vụ",
      description:
        "Dịch vụ hỗ trợ sản xuất: tưới tiêu, cơ giới hóa, tư vấn kỹ thuật",
      status: "active",
      createdAt: "2024-01-13",
    },
    {
      id: 5,
      code: "XK",
      name: "Xuất khẩu",
      description: "Xuất khẩu nông sản, thủy sản ra thị trường quốc tế",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: 6,
      code: "DVTC",
      name: "Dịch vụ tài chính",
      description: "Tín dụng, bảo hiểm, cho vay vốn sản xuất nông nghiệp",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 7,
      code: "CNSH",
      name: "Công nghệ sau thu hoạch",
      description: "Bảo quản, sơ chế, đóng gói, vận chuyển nông sản",
      status: "active",
      createdAt: "2024-01-16",
    },
    {
      id: 8,
      code: "DVKT",
      name: "Dịch vụ khoa học kỹ thuật",
      description:
        "Nghiên cứu, chuyển giao công nghệ, tư vấn kỹ thuật canh tác",
      status: "active",
      createdAt: "2024-01-17",
    },
    {
      id: 9,
      code: "DVVT",
      name: "Dịch vụ vật tư",
      description:
        "Cung cấp giống, phân bón, thuốc bảo vệ thực vật, thức ăn chăn nuôi",
      status: "active",
      createdAt: "2024-01-18",
    },
    {
      id: 10,
      code: "DVLH",
      name: "Dịch vụ logistics",
      description: "Vận chuyển, kho bãi, phân phối nông sản",
      status: "active",
      createdAt: "2024-01-19",
    },
    {
      id: 11,
      code: "DVTV",
      name: "Dịch vụ tư vấn",
      description: "Tư vấn quản lý, marketing, chứng nhận tiêu chuẩn",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: 12,
      code: "NNCS",
      name: "Nông nghiệp công nghệ cao",
      description: "Ứng dụng công nghệ cao trong sản xuất nông nghiệp",
      status: "active",
      createdAt: "2024-01-21",
    },
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnterpriseType | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnterpriseType | null>(null);

  const [formData, setFormData] = useState<
    Omit<EnterpriseType, "id" | "createdAt">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const columns: Column<EnterpriseType>[] = [
    { key: "code", label: "Mã" },
    { key: "name", label: "Tên" },
    { key: "description", label: "Mô tả" },
  ];

  const getCurrentData = () => {
    return activeTab === "organization" ? organizationData : businessData;
  };

  const setCurrentData = (
    updater: (prev: EnterpriseType[]) => EnterpriseType[],
  ) => {
    if (activeTab === "organization") {
      setOrganizationData(updater);
    } else {
      setBusinessData(updater);
    }
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setFormOpen(true);
  };

  const handleEdit = (item: EnterpriseType) => {
    setEditItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setFormOpen(true);
  };

  const handleDelete = (item: EnterpriseType) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleSubmit = () => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (editItem) {
      setCurrentData((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: `Đã cập nhật ${categoryName}`,
      });
    } else {
      const newItem: EnterpriseType = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCurrentData((prev) => [...prev, newItem]);
      toast({
        title: "Thành công",
        description: `Đã thêm ${categoryName} mới`,
      });
    }
    setFormOpen(false);
  };

  const handleConfirmDelete = () => {
    const categoryName =
      activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động";

    if (deleteItem) {
      setCurrentData((prev) =>
        prev.filter((item) => item.id !== deleteItem.id),
      );
      toast({
        title: "Thành công",
        description: `Đã xóa ${categoryName}`,
      });
    }
    setDeleteOpen(false);
  };

  const getTitle = () => {
    return activeTab === "organization"
      ? "Thêm loại hình tổ chức"
      : "Thêm lĩnh vực hoạt động";
  };

  const getEditTitle = () => {
    return activeTab === "organization"
      ? "Chỉnh sửa loại hình tổ chức"
      : "Chỉnh sửa lĩnh vực hoạt động";
  };

  return (
    <AdminLayout
      title="Danh mục tổ chức"
      description="Quản lý loại hình tổ chức và lĩnh vực hoạt động"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="organization" className="gap-2">
            <Building2 className="w-4 h-4" />
            Loại hình tổ chức
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Briefcase className="w-4 h-4" />
            Lĩnh vực hoạt động
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Loại hình tổ chức</h3>
              <p className="text-sm text-muted-foreground">
                Phân loại các loại hình tổ chức kinh tế trong nông nghiệp
              </p>
            </div>
            <Button onClick={handleAdd} data-testid="add-organization-type">
              <Plus className="w-4 h-4 mr-2" />
              Thêm loại hình
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={organizationData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Tìm kiếm loại hình tổ chức..."
          />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Lĩnh vực hoạt động</h3>
              <p className="text-sm text-muted-foreground">
                Phân loại các lĩnh vực hoạt động kinh doanh trong nông nghiệp
              </p>
            </div>
            <Button onClick={handleAdd} data-testid="add-business-field">
              <Plus className="w-4 h-4 mr-2" />
              Thêm lĩnh vực
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={businessData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Tìm kiếm lĩnh vực hoạt động..."
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editItem ? getEditTitle() : getTitle()}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: HTX, SX, CB..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="VD: Hợp tác xã, Sản xuất..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Mô tả chi tiết..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${activeTab === "organization" ? "loại hình tổ chức" : "lĩnh vực hoạt động"} này?`}
      />
    </AdminLayout>
  );
};

export default EnterpriseFormPage;
