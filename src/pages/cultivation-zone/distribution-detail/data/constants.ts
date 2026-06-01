export interface PlantDistributionListItem {
  id: string;
  code: string;
  name: string;
  scope: "region" | "area" | "plot";
  targetName: string;
  distributionMethod: "zone" | "row";
  totalPlants: number;
  seedVarieties: number;
  status: "active" | "completed" | "pending";
  createdAt: string;
}

export const PLANT_DISTRIBUTION_MOCK_DATA: PlantDistributionListItem[] = [
  {
    id: "dist-1",
    code: "DIST-001",
    name: "Phân bổ Sầu riêng Ri6 Vùng Alpha",
    scope: "region",
    targetName: "Vùng Sầu riêng Bình Phước Alpha",
    distributionMethod: "zone",
    totalPlants: 500,
    seedVarieties: 2,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "dist-2",
    code: "DIST-002",
    name: "Phân bổ Sầu riêng Monthong Khu vực B",
    scope: "area",
    targetName: "Khu vực B - Vườn sầu riêng Monthong",
    distributionMethod: "row",
    totalPlants: 300,
    seedVarieties: 1,
    status: "completed",
    createdAt: "2024-02-10",
  },
  {
    id: "dist-3",
    code: "DIST-003",
    name: "Phân bổ Sầu riêng Musang King Lô 1",
    scope: "plot",
    targetName: "Lô 1 - Sầu riêng Musang King",
    distributionMethod: "zone",
    totalPlants: 150,
    seedVarieties: 2,
    status: "pending",
    createdAt: "2024-03-05",
  },
];
