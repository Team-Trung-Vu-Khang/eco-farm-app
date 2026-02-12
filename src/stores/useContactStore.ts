import { create } from "zustand";

export interface Contact {
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
  createdAt: string;
}

export interface ContactGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  contactCount: number;
  status: "active" | "inactive";
  createdAt: string;
}

interface ContactState {
  contacts: Contact[];
  groups: ContactGroup[];
  getContactById: (id: number) => Contact | undefined;
  getGroupById: (id: number) => ContactGroup | undefined;
  addContact: (contact: Contact) => void;
  updateContact: (id: number, data: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
  addGroup: (group: ContactGroup) => void;
  updateGroup: (id: number, data: Partial<ContactGroup>) => void;
  deleteGroup: (id: number) => void;
}

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
    createdAt: "2024-01-15",
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
    createdAt: "2024-01-16",
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
    createdAt: "2024-01-17",
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
    createdAt: "2024-01-18",
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

const useContactStore = create<ContactState>()((set, get) => ({
  contacts: initialContacts,
  groups: initialGroups,

  getContactById: (id) => {
    return get().contacts.find((contact) => contact.id === id);
  },

  getGroupById: (id) => {
    return get().groups.find((group) => group.id === id);
  },

  addContact: (contact) => {
    set((state) => ({
      contacts: [...state.contacts, contact],
    }));

    // Update group contact count if groupId exists
    if (contact.groupId) {
      set((state) => ({
        groups: state.groups.map((group) =>
          group.id === contact.groupId
            ? { ...group, contactCount: group.contactCount + 1 }
            : group,
        ),
      }));
    }
  },

  updateContact: (id, data) => {
    const oldContact = get().contacts.find((c) => c.id === id);

    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...data } : contact,
      ),
    }));

    // Update group contact counts if groupId changed
    if (
      oldContact &&
      data.groupId !== undefined &&
      oldContact.groupId !== data.groupId
    ) {
      set((state) => ({
        groups: state.groups.map((group) => {
          if (group.id === oldContact.groupId) {
            return {
              ...group,
              contactCount: Math.max(0, group.contactCount - 1),
            };
          }
          if (group.id === data.groupId) {
            return { ...group, contactCount: group.contactCount + 1 };
          }
          return group;
        }),
      }));
    }
  },

  deleteContact: (id) => {
    const contact = get().contacts.find((c) => c.id === id);

    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    }));

    // Update group contact count
    if (contact?.groupId) {
      set((state) => ({
        groups: state.groups.map((group) =>
          group.id === contact.groupId
            ? { ...group, contactCount: Math.max(0, group.contactCount - 1) }
            : group,
        ),
      }));
    }
  },

  addGroup: (group) => {
    set((state) => ({
      groups: [...state.groups, group],
    }));
  },

  updateGroup: (id, data) => {
    set((state) => ({
      groups: state.groups.map((group) =>
        group.id === id ? { ...group, ...data } : group,
      ),
    }));
  },

  deleteGroup: (id) => {
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
      // Remove groupId from contacts that belonged to this group
      contacts: state.contacts.map((contact) =>
        contact.groupId === id ? { ...contact, groupId: undefined } : contact,
      ),
    }));
  },
}));

export default useContactStore;
