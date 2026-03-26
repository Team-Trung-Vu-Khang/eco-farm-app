import { Info } from "lucide-react";
import { amendmentCycleIntroduction } from "../data/amendmentCycleData";

export function AmendmentCycleIntro() {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-6">
      <div className="shrink-0 rounded-lg bg-blue-100 p-3 text-blue-600">
        <Info className="h-6 w-6" />
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-blue-900">
          {amendmentCycleIntroduction.title}
        </h3>
        <p className="text-sm leading-relaxed text-blue-800/80">
          {amendmentCycleIntroduction.description}
        </p>
      </div>
    </div>
  );
}
