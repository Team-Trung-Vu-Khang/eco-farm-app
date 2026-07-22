export interface AnimalDistributionListItem {
  id: string;
  code: string;
  name: string;
  scope: "region" | "area" | "plot";
  targetName: string;
  distributionMethod: "zone" | "row";
  totalAnimals: number;
  seedVarieties: number;
  status: "active" | "completed" | "pending";
  createdAt: string;
}

export const PLANT_DISTRIBUTION_MOCK_DATA: AnimalDistributionListItem[] = [
  {
    id: "dist-1",
    code: "DIST-001",
    name: "Phân bổ Bò thịt Angus Vùng Alpha",
    scope: "region",
    targetName: "Vùng Chăn Nuôi Bò Alpha",
    distributionMethod: "zone",
    totalAnimals: 500,
    seedVarieties: 2,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "dist-2",
    code: "DIST-002",
    name: "Phân bổ Lợn giống Duroc Khu vực B",
    scope: "area",
    targetName: "Khu chăn nuôi B - Trại Duroc",
    distributionMethod: "row",
    totalAnimals: 300,
    seedVarieties: 1,
    status: "completed",
    createdAt: "2024-02-10",
  },
  {
    id: "dist-3",
    code: "DIST-003",
    name: "Phân bổ Gà đẻ trứng Ai Cập Chuồng 1",
    scope: "plot",
    targetName: "Chuồng 1 - Khu nuôi gà đẻ Ai Cập",
    distributionMethod: "zone",
    totalAnimals: 150,
    seedVarieties: 2,
    status: "pending",
    createdAt: "2024-03-05",
  },
];
