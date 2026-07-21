export interface Coordinate {
  lat: number;
  lng: number;
}

export interface GeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
  name?: string;
  regionName?: string;
  areaName?: string;
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

export const makeEmptyPlant = (lat = 11.548, lng = 106.896): PlantEntry => ({
  entryId: `plant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  height: "",
  ageValue: "",
  ageUnit: "years",
  plantedDate: new Date().toISOString().split("T")[0],
  note: "",
  plotId: "",
  coordinate: { lat, lng },
  isInvalidBoundary: false,
});
