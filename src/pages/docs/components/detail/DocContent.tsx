import { Card, CardContent, Editor } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { initialEditorValue } from "../../mocks";

export function DocContent() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Nội dung chi tiết
          </h3>
        </div>
        <div className="prose max-w-none text-foreground/90">
          <Editor
            maxLength={50000}
            editorSerializedState={initialEditorValue}
            contentEditableClassname="pointer-events-none focus:outline-none max-w-none min-h-[200px]"
            // @ts-ignore
            readOnly={true}
            editable={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
