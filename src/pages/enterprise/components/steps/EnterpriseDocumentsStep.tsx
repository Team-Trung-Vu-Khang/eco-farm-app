import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Image, Trash2, Upload } from "lucide-react";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

interface EnterpriseDocumentsStepProps {
  title: string;
  description: string;
  uploadLabel: string;
}

export function EnterpriseDocumentsStep({
  title,
  description,
  uploadLabel,
}: EnterpriseDocumentsStepProps) {
  const {
    formData,
    isDragging,
    handleDrag,
    handleDocumentDrop,
    handleDocumentUpload,
    handleDocumentDelete,
  } = useEnterpriseFormContext();

  const uploadedDocument = formData.documents[0];

  const handleReplace = () => {
    const input = globalThis.document.getElementById(
      "document-upload",
    ) as HTMLInputElement | null;
    input?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-4 space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <input
        id="document-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={handleDocumentUpload}
      />

      {uploadedDocument ? (
        <div className="rounded-lg border border-primary/15 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border">
              {uploadedDocument.type.includes("image") ? (
                <Image className="h-5 w-5 text-primary" />
              ) : (
                <FileText className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{uploadedDocument.name}</p>
              <p className="text-sm text-muted-foreground">{uploadedDocument.size}</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => handleDocumentDelete(0)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="button" variant="outline" onClick={handleReplace}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadLabel}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-all cursor-pointer ${isDragging["documents"] ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}`}
          onClick={handleReplace}
          onDragEnter={(e) => handleDrag("documents", e)}
          onDragOver={(e) => handleDrag("documents", e)}
          onDragLeave={(e) => handleDrag("documents", e)}
          onDrop={handleDocumentDrop}
        >
          <Upload
            className={`mx-auto mb-4 h-12 w-12 transition-colors ${isDragging["documents"] ? "text-primary" : "text-muted-foreground"}`}
          />
          <p className="mb-1 font-medium">Kéo thả file hoặc click để tải lên</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button type="button" variant="outline" className="mt-4">
            <Upload className="mr-2 h-4 w-4" />
            {uploadLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
