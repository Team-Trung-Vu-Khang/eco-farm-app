import { History } from "lucide-react";
import { formatDateTime } from "../constants/documentVersionConstants";
import type { DocumentRecord, VersionLog } from "../types";

interface DocumentVersionContentProps {
  selectedDocument: DocumentRecord | null;
  selectedLogs: VersionLog[];
}

export function DocumentVersionContent({
  selectedDocument,
  selectedLogs,
}: DocumentVersionContentProps) {
  if (!selectedDocument) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-muted-foreground md:p-8">
        Chọn một tài liệu để bắt đầu quản lý version.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-violet-600" />
        <div>
          <h3 className="text-lg font-semibold">Lịch sử</h3>
          <p className="text-sm text-muted-foreground">
            Hiển thị rõ ai sửa, sửa gì và khi nào để hỗ trợ audit.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {selectedLogs.map((log) => {
          const version = selectedDocument.versions.find(
            (item) => item.id === log.versionId,
          );
          return (
            <div key={log.id} className="rounded-xl border bg-background p-4">
              <p className="text-sm font-medium text-foreground">
                {log.user}{" "}
                {log.action === "approved"
                  ? "duyệt"
                  : log.action === "updated"
                    ? "cập nhật"
                    : "tạo"}{" "}
                version {version?.version || "không xác định"} lúc{" "}
                {formatDateTime(log.at)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{log.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
