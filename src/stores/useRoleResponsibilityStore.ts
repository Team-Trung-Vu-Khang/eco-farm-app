import { create } from "zustand";
import { DANH_SACH_VAI_TRO } from "../pages/role-responsibility/mocks";
import type {
  FormVaiTroState,
  VaiTroNghiepVu,
} from "../pages/role-responsibility/types";

interface RoleResponsibilityStore {
  roles: VaiTroNghiepVu[];
  addRole: (role: FormVaiTroState, actorName: string) => VaiTroNghiepVu;
  updateRole: (
    id: string,
    role: FormVaiTroState,
    actorName: string,
  ) => VaiTroNghiepVu | null;
  deleteRole: (id: string) => void;
}

const useRoleResponsibilityStore = create<RoleResponsibilityStore>((set, get) => ({
  roles: DANH_SACH_VAI_TRO,

  addRole: (role, actorName) => {
    const timestamp = Date.now();
    const newRole: VaiTroNghiepVu = {
      id: `role-${timestamp}`,
      ...role,
      nhatKy: [
        {
          id: `log-${timestamp}`,
          hanhDong: "tao-moi",
          nguoiThucHien: actorName,
          thoiDiem: new Date().toISOString(),
          noiDung: `Tạo mới vai trò ${role.tenVaiTro} và cấu hình trách nhiệm ban đầu.`,
        },
      ],
    };

    set((state) => ({
      roles: [newRole, ...state.roles],
    }));

    return newRole;
  },

  updateRole: (id, role, actorName) => {
    const currentRole = get().roles.find((item) => item.id === id);
    if (!currentRole) return null;

    const timestamp = Date.now();
    const updatedRole: VaiTroNghiepVu = {
      ...currentRole,
      ...role,
      nhatKy: [
        {
          id: `log-${timestamp}`,
          hanhDong: "cap-nhat",
          nguoiThucHien: actorName,
          thoiDiem: new Date().toISOString(),
          noiDung: `Cập nhật vai trò ${role.tenVaiTro}, điều chỉnh trách nhiệm và người dùng phụ trách.`,
        },
        ...currentRole.nhatKy,
      ],
    };

    set((state) => ({
      roles: state.roles.map((item) => (item.id === id ? updatedRole : item)),
    }));

    return updatedRole;
  },

  deleteRole: (id) => {
    set((state) => ({
      roles: state.roles.filter((item) => item.id !== id),
    }));
  },
}));

export default useRoleResponsibilityStore;
