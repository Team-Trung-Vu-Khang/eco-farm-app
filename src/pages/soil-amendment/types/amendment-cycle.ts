export type ActivityType = "chemical" | "biological" | "mechanical" | "other";

export interface Activity {
  text: string;
  type: ActivityType;
}

export interface AmendmentCycle {
  id: string;
  type: "short" | "medium" | "long";
  title: string;
  duration: string;
  condition: string;
  conditionColor: string;
  activities: Activity[];
  outcome: string;
}

export type AmendmentCycleFormData = Partial<AmendmentCycle>;
