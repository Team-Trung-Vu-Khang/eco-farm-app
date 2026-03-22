import {
  Card,
  CardContent,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image, FileText, Check } from "lucide-react";

interface DocumentsTabProps {
  documents: any[];
}

export function DocumentsTab({ documents }: DocumentsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((doc: any, i: number) => (
        <Card
          key={i}
          className="group hover:border-primary/50 transition-colors cursor-pointer"
        >
          <CardContent className="p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              {doc.type.includes("image") ? (
                <Image className="w-5 h-5 text-blue-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate" title={doc.name}>
                {doc.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{doc.size}</span>
                <span>•</span>
                <span>{doc.date}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Check className="w-4 h-4 text-green-600" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
