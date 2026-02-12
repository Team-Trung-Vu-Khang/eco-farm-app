import { Sprout, Clock } from "lucide-react";
import type { Treatment } from "../types/treatment.types";
import { severityConfig } from "../data/treatment.data";

interface TreatmentListItemProps {
  treatment: Treatment;
  isSelected?: boolean;
  onClick: () => void;
}

export function TreatmentListItem({
  treatment,
  isSelected,
  onClick,
}: TreatmentListItemProps) {
  const getSeverityStyle = (severity: keyof typeof severityConfig) => {
    return (
      severityConfig[severity]?.color ||
      "text-gray-700 bg-gray-50 border-gray-200"
    );
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl border p-4 transition-all duration-300 group overflow-hidden
        ${
          isSelected
            ? "bg-white border-green-500 shadow-md ring-1 ring-green-500/20"
            : "bg-white border-gray-100 hover:border-green-300 hover:shadow-md hover:-translate-y-0.5"
        }
      `}
    >
      {/* Background Image Overlay - Subtle */}
      {treatment.images?.[0] && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/40 z-10" />
          <img
            src={treatment.images[0]}
            alt=""
            className="w-full h-full object-cover grayscale opacity-20"
          />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-3 mb-2">
          <div
            className={`
                text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border
                ${getSeverityStyle(treatment.severity)}
            `}
          >
            {severityConfig[treatment.severity]?.label || treatment.severity}
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {treatment.code}
          </span>
        </div>

        <h4
          className={`font-bold text-gray-900 text-sm leading-snug mb-3 group-hover:text-green-700 transition-colors line-clamp-2`}
        >
          {treatment.name}
        </h4>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100/50 pt-3 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-full bg-green-50 text-green-600">
              <Sprout className="w-3 h-3" />
            </div>
            <span className="font-semibold text-gray-700">
              {treatment.crop}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{treatment.totalDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
