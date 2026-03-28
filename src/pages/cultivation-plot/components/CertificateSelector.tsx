import { Award, CheckCircle2 } from "lucide-react";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";

interface CertificateSelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const CertificateSelector = ({
  selectedIds,
  onToggle,
}: CertificateSelectorProps) => {
  const { standards } = useEnterpriseCertificateStore();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {standards.map((certificate) => (
          <div
            key={certificate.code}
            className={`cursor-pointer border rounded-xl p-3 relative flex items-start gap-3 transition-all ${
              selectedIds.includes(certificate.code)
                ? "border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm"
                : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
            }`}
            onClick={() => onToggle(certificate.code)}
          >
            <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {certificate.imageUrl ? (
                <img
                  src={certificate.imageUrl}
                  alt={certificate.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Award
                  className={`w-6 h-6 ${
                    selectedIds.includes(certificate.code)
                      ? "text-primary"
                      : "text-slate-400"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate pr-4">
                {certificate.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {certificate.code}
              </div>
              <div className="text-xs text-slate-500 truncate mt-0.5">
                {certificate.organizations.join(", ")}
              </div>
            </div>
            {selectedIds.includes(certificate.code) && (
              <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
