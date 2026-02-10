import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plus, Users, BookUser } from "lucide-react";
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
} from "@tankhang1/eco-shared-ui";

interface Contact {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  entityName: string;
  groupId?: number;
  note: string;
  status: "active" | "inactive";
}

interface ContactGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  contactCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

type CategoryType = "contacts" | "groups";

const initialContacts: Contact[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    position: "Trưởng phòng",
    department: "Kinh doanh",
    entityName: "Công ty CP Nông nghiệp Xanh",
    groupId: 1,
    note: "Liên hệ chính",
    status: "active",
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@example.com",
    position: "Kế toán trưởng",
    department: "Kế toán",
    entityName: "HTX Rau sạch Thanh Hà",
    groupId: 1,
    note: "Phụ trách thanh toán",
    status: "active",
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@example.com",
    position: "Kỹ thuật viên",
    department: "Kỹ thuật",
    entityName: "Nông hộ Nguyễn Văn A",
    groupId: 2,
    note: "",
    status: "inactive",
  },
  {
    id: 4,
    fullName: "Phạm Thị D",
    phone: "0923456789",
    email: "phamthid@example.com",
    position: "Giám đốc",
    department: "Ban giám đốc",
    entityName: "Công ty TNHH Thủy sản Miền Tây",
    groupId: 2,
    note: "VIP - Khách hàng lớn",
    status: "active",
  },
];

const initialGroups: ContactGroup[] = [
  {
    id: 1,
    code: "KH",
    name: "Khách hàng",
    description: "Nhóm khách hàng mua sản phẩm",
    contactCount: 2,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "DT",
    name: "Đối tác",
    description: "Nhóm đối tác kinh doanh, hợp tác",
    contactCount: 2,
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "NCC",
    name: "Nhà cung cấp",
    description: "Nhóm nhà cung cấp vật tư, nguyên liệu",
    contactCount: 0,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "CQNN",
    name: "Cơ quan nhà nước",
    description: "Nhóm liên hệ cơ quan quản lý nhà nước",
    contactCount: 0,
    status: "active",
    createdAt: "2024-01-13",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<CategoryType>("contacts");

  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [groups, setGroups] = useState<ContactGroup[]>(initialGroups);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Contact | ContactGroup | null>(
    null,
  );

  const [groupFormOpen, setGroupFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<ContactGroup | null>(null);
  const [groupFormData, setGroupFormData] = useState<
    Omit<ContactGroup, "id" | "createdAt" | "contactCount">
  >({
    code: "",
    name: "",
    description: "",
    status: "active",
  });

  const contactColumns: Column<Contact>[] = [
    { key: "fullName", label: "Họ và tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "department", label: "Phòng ban" },
    { key: "position", label: "Chức vụ" },
    { key: "entityName", label: "Đơn vị" },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      render: (value) => {
        const group = groups.find((g) => g.id === value);
        return group ? (
          <Badge variant="secondary">{group.name}</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa phân nhóm</span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "outline"}>
          {value === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
        </Badge>
      ),
    },
  ];

  const groupColumns: Column<ContactGroup>[] = [
    { key: "code", label: "Mã nhóm" },
    { key: "name", label: "Tên nhóm" },
    { key: "description", label: "Mô tả" },
    {
      key: "contactCount",
      label: "Số liên hệ",
      render: (value) => <Badge variant="secondary">{value} người</Badge>,
    },
  ];

  const contactFilters = [
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { label: "Đang làm việc", value: "active" },
        { label: "Đã nghỉ việc", value: "inactive" },
      ],
    },
    {
      key: "department",
      label: "Phòng ban",
      options: [
        { label: "Kinh doanh", value: "Kinh doanh" },
        { label: "Kế toán", value: "Kế toán" },
        { label: "Kỹ thuật", value: "Kỹ thuật" },
        { label: "Hành chính", value: "Hành chính" },
      ],
    },
    {
      key: "groupId",
      label: "Nhóm danh bạ",
      options: groups.map((group) => ({
        label: group.name,
        value: group.id.toString(),
      })),
    },
  ];

  const handleDeleteContact = (item: Contact) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleDeleteGroup = (item: ContactGroup) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteItem) {
      if (activeTab === "contacts") {
        setContacts((prev) => prev.filter((item) => item.id !== deleteItem.id));
        toast({
          title: "Thành công",
          description: "Đã xóa liên hệ khỏi hệ thống",
        });
      } else {
        setGroups((prev) => prev.filter((item) => item.id !== deleteItem.id));
        toast({
          title: "Thành công",
          description: "Đã xóa nhóm danh bạ",
        });
      }
    }
    setDeleteOpen(false);
  };

  const handleAddGroup = () => {
    setEditGroup(null);
    setGroupFormData({
      code: "",
      name: "",
      description: "",
      status: "active",
    });
    setGroupFormOpen(true);
  };

  const handleEditGroup = (item: ContactGroup) => {
    setEditGroup(item);
    setGroupFormData({
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    });
    setGroupFormOpen(true);
  };

  const handleSubmitGroup = () => {
    if (editGroup) {
      setGroups((prev) =>
        prev.map((item) =>
          item.id === editGroup.id ? { ...item, ...groupFormData } : item,
        ),
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật nhóm danh bạ",
      });
    } else {
      const newGroup: ContactGroup = {
        id: Date.now(),
        ...groupFormData,
        contactCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGroups((prev) => [...prev, newGroup]);
      toast({
        title: "Thành công",
        description: "Đã thêm nhóm danh bạ mới",
      });
    }
    setGroupFormOpen(false);
  };

  return (
    <AdminLayout
      title="Quản lý thông tin liên hệ"
      description="Quản lý sổ danh bạ và nhóm danh bạ"
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CategoryType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="contacts" className="gap-2">
            <BookUser className="w-4 h-4" />
            Sổ danh bạ
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Users className="w-4 h-4" />
            Nhóm danh bạ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Sổ danh bạ</h3>
              <p className="text-sm text-muted-foreground">
                Danh sách thông tin liên hệ của doanh nghiệp / nông hộ
              </p>
            </div>
            <Link href="/contact/create">
              <Button data-testid="add-contact">
                <Plus className="w-4 h-4 mr-2" />
                Thêm liên hệ
              </Button>
            </Link>
          </div>
          <DataTable
            columns={contactColumns}
            data={contacts}
            onView={(item) => setLocation(`/contact/${item.id}/edit`)}
            onEdit={(item) => setLocation(`/contact/${item.id}/edit`)}
            onDelete={handleDeleteContact}
            searchPlaceholder="Tìm kiếm liên hệ..."
            filters={contactFilters}
            selectable
          />
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Nhóm danh bạ</h3>
              <p className="text-sm text-muted-foreground">
                Quản lý các nhóm để phân loại danh bạ
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/contact/create">
                <Button variant="outline" data-testid="add-contact-from-group">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo liên hệ
                </Button>
              </Link>
              <Button onClick={handleAddGroup} data-testid="add-group">
                <Plus className="w-4 h-4 mr-2" />
                Thêm nhóm
              </Button>
            </div>
          </div>
          <DataTable
            columns={groupColumns}
            data={groups}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            searchPlaceholder="Tìm kiếm nhóm danh bạ..."
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={groupFormOpen}
        onOpenChange={setGroupFormOpen}
        title={editGroup ? "Chỉnh sửa nhóm danh bạ" : "Thêm nhóm danh bạ mới"}
        onSubmit={handleSubmitGroup}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã nhóm</Label>
              <Input
                id="code"
                value={groupFormData.code}
                onChange={(e) =>
                  setGroupFormData({ ...groupFormData, code: e.target.value })
                }
                placeholder="VD: KH, NCC, DT..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên nhóm</Label>
              <Input
                id="name"
                value={groupFormData.name}
                onChange={(e) =>
                  setGroupFormData({ ...groupFormData, name: e.target.value })
                }
                placeholder="VD: Khách hàng, Nhà cung cấp..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={groupFormData.description}
              onChange={(e) =>
                setGroupFormData({
                  ...groupFormData,
                  description: e.target.value,
                })
              }
              placeholder="Mô tả chi tiết về nhóm danh bạ..."
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa ${activeTab === "contacts" ? "liên hệ" : "nhóm danh bạ"} này? Hoạt động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
}
