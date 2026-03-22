import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Download, FileText } from "lucide-react";

interface DocAttachmentsProps {
  attachments: { attachmentName: string; attachmentValue: string }[];
}

export function DocAttachments({ attachments }: DocAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Tài liệu đính kèm ({attachments.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="group flex items-center p-3 rounded-xl border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 mr-4">
              <p className="font-medium text-sm truncate">
                {file.attachmentName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {file.attachmentValue}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
