import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Save } from "lucide-react";
import { FileUploader } from "./FileUploader";
import type { SeasonDocument, SeasonFormData } from "../types/types";

interface SeasonDocumentsCardProps {
  documents: (File | SeasonDocument)[];
  onDocumentsChange: (documents: SeasonFormData["documents"]) => void;
  onSubmit: () => void;
  submitLabel: string;
}

export function SeasonDocumentsCard({
  documents,
  onDocumentsChange,
  onSubmit,
  submitLabel,
}: SeasonDocumentsCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle>Tài liệu kỹ thuật</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <FileUploader files={documents} onChange={onDocumentsChange} />
        </CardContent>
      </Card>

      <div className="sticky top-6">
        <Button
          size="lg"
          className="w-full font-bold shadow-lg shadow-primary/20"
          onClick={onSubmit}
        >
          <Save className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
