export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PlantEntry {
  entryId: string;
  height: string;
  ageValue: string;
  ageUnit: string;
  plantedDate: string;
  note: string;
  plotId: string;
  coordinate: Coordinate;
  isInvalidBoundary?: boolean;
}

export const makeEmptyPlant = (): PlantEntry => ({
  entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  height: "",
  ageValue: "",
  ageUnit: "years",
  plantedDate: new Date().toISOString().split("T")[0],
  note: "",
  plotId: "",
  coordinate: { lat: 11.548, lng: 106.896 },
  isInvalidBoundary: false,
});
