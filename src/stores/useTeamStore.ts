import { create } from "zustand";

export interface Team {
  id: number;
  code: string;
  name: string;
  leader: string;
  department: string;
  memberCount: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface TeamMember {
  id: number;
  teamId: number;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  avatar: string;
}

interface TeamStore {
  teams: Team[];
  members: TeamMember[];

  // Team CRUD operations
  getTeamById: (id: number) => Team | undefined;
  addTeam: (team: Omit<Team, "id" | "createdAt" | "memberCount">) => void;
  updateTeam: (
    id: number,
    updates: Partial<Omit<Team, "id" | "createdAt" | "memberCount">>,
  ) => void;
  deleteTeam: (id: number) => void;
  bulkAddTeams: (
    teams: Omit<Team, "id" | "createdAt" | "memberCount">[],
  ) => void;

  // Member operations
  getMembersByTeamId: (teamId: number) => TeamMember[];
  addMember: (member: Omit<TeamMember, "id">) => void;
  removeMember: (memberId: number) => void;
}

const useTeamStore = create<TeamStore>((set, get) => ({
  // Initial data
  teams: [
    {
      id: 1,
      code: "TEAM-KD-MB",
      name: "Đội kinh doanh miền Bắc",
      leader: "Nguyễn Văn A",
      department: "Kinh doanh",
      memberCount: 3,
      description: "Phụ trách thị trường từ Đà Nẵng trở ra.",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      code: "TEAM-KT-T1",
      name: "Tổ kỹ thuật trại 1",
      leader: "Lê Văn C",
      department: "Kỹ thuật",
      memberCount: 2,
      description: "Chăm sóc và vận hành kỹ thuật tại Farm 1.",
      status: "active",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      code: "TEAM-KT-TH",
      name: "Tổ kế toán tổng hợp",
      leader: "Trần Thị B",
      department: "Kế toán",
      memberCount: 1,
      description: "Xử lý số liệu kế toán toàn công ty.",
      status: "active",
      createdAt: "2024-01-12",
    },
  ],

  members: [
    {
      id: 1,
      teamId: 1,
      fullName: "Nguyễn Văn A",
      position: "Trưởng phòng",
      phone: "0901234567",
      email: "nam.nguyen@ecofarm.vn",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      id: 2,
      teamId: 1,
      fullName: "Trần Thị B",
      position: "Nhân viên kinh doanh",
      phone: "0909876543",
      email: "b.tran@ecofarm.vn",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      id: 3,
      teamId: 1,
      fullName: "Phạm Văn D",
      position: "Nhân viên kinh doanh",
      phone: "0918273645",
      email: "d.pham@ecofarm.vn",
      status: "inactive",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024f",
    },
  ],

  // Team CRUD operations
  getTeamById: (id) => {
    return get().teams.find((t) => t.id === id);
  },

  addTeam: (teamData) => {
    set((state) => {
      const newId =
        state.teams.length > 0
          ? Math.max(...state.teams.map((t) => t.id)) + 1
          : 1;
      const newTeam: Team = {
        ...teamData,
        id: newId,
        memberCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        teams: [...state.teams, newTeam],
      };
    });
  },

  updateTeam: (id, updates) => {
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTeam: (id) => {
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      // Also remove all members of this team
      members: state.members.filter((m) => m.teamId !== id),
    }));
  },

  bulkAddTeams: (teamsList) => {
    set((state) => {
      const currentMaxId =
        state.teams.length > 0 ? Math.max(...state.teams.map((t) => t.id)) : 0;

      const newTeams = teamsList.map((data, index) => ({
        ...data,
        id: currentMaxId + index + 1,
        memberCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }));

      return {
        teams: [...state.teams, ...newTeams],
      };
    });
  },

  // Member operations
  getMembersByTeamId: (teamId) => {
    return get().members.filter((m) => m.teamId === teamId);
  },

  addMember: (memberData) => {
    set((state) => {
      const newId =
        state.members.length > 0
          ? Math.max(...state.members.map((m) => m.id)) + 1
          : 1;
      const newMember: TeamMember = {
        ...memberData,
        id: newId,
      };

      // Update team member count
      const updatedTeams = state.teams.map((t) =>
        t.id === memberData.teamId
          ? { ...t, memberCount: t.memberCount + 1 }
          : t,
      );

      return {
        members: [...state.members, newMember],
        teams: updatedTeams,
      };
    });
  },

  removeMember: (memberId) => {
    set((state) => {
      const member = state.members.find((m) => m.id === memberId);
      if (!member) return state;

      // Update team member count
      const updatedTeams = state.teams.map((t) =>
        t.id === member.teamId
          ? { ...t, memberCount: Math.max(0, t.memberCount - 1) }
          : t,
      );

      return {
        members: state.members.filter((m) => m.id !== memberId),
        teams: updatedTeams,
      };
    });
  },
}));

export default useTeamStore;
