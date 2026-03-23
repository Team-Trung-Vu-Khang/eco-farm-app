export interface FertilizerGroup {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const initialFertilizerGroups: FertilizerGroup[] = [
  {
    id: 1,
    code: "ORGANIC",
    name: "Phân hữu cơ",
    description: "Phân chuồng, phân xanh, phân rác...",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "INORGANIC",
    name: "Phân vô cơ",
    description: "Phân đạm, lân, kali, NPK...",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "MICROBIAL",
    name: "Phân sinh học",
    description: "Chế phẩm sinh học, nấm đối kháng...",
    status: "active",
    createdAt: "2024-01-12",
  },
];
