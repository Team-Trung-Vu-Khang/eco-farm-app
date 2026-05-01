import { type FC } from "react";
import { Box } from "lucide-react";

interface ResultsSummaryProps {
  totalCount: number;
}

export const ResultsSummary: FC<ResultsSummaryProps> = ({ totalCount }) => {
  return (
    <div className="px-6">
      <div className="relative overflow-hidden rounded-xl border border-green-200 bg-linear-to-r from-green-50 via-white to-green-50 p-5 shadow-sm mt-4">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-green-600 shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-green-900 uppercase tracking-wide">
              Kết quả tra cứu
            </h3>
            <p className="text-sm text-green-700/80 font-medium">
              Đã tìm thấy{" "}
              <span className="text-green-600 font-black px-1.5 py-0.5 bg-white rounded-md border border-green-100 shadow-xs">
                {totalCount}
              </span>{" "}
              vật tư phù hợp với tiêu chí.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};
