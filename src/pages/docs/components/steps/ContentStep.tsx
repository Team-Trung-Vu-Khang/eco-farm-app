import { Card, Editor, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { initialEditorValue } from "../../mocks";

export function ContentStep() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">Nội dung chi tiết</Label>
            <p className="text-sm text-muted-foreground">
              Soạn thảo nội dung trực tiếp hoặc để trống nếu chỉ dùng file đính
              kẻm.
            </p>
          </div>
        </div>

        <Card className="min-h-[500px] border-2 shadow-sm">
          <Editor
            maxLength={50000}
            editorSerializedState={initialEditorValue}
            contentEditableClassname="min-h-[450px] p-6 focus:outline-none prose max-w-none"
          />
        </Card>
      </div>
    </div>
  );
}
