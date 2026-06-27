import type { ProvinceWardRecord } from "@/features/master-data/types/master-data.type";

export type ProvinceWard = ProvinceWardRecord;

export interface ProvinceRow {
  id: string;
  code: string;
  name: string;
  fullName: string;
  wardCount: number;
  wards?: ProvinceWard[];
}

export interface ProvinceTableRow {
  id: string;
  code: string;
  name: string;
  fullName: string;
  wardCount: number;
}
