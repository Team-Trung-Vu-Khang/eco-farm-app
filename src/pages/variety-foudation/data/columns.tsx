import { Hash, Leaf, Sprout } from "lucide-react";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { VarietyFoundation } from "../types/types";

export const varietyFoundationColumns: Column<VarietyFoundation>[] = [
  {
    key: "varietyFoundationCode",
    label: "Mã giống",
    render: (value: string) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value}
      </div>
    ),
  },
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | File | null) => (
      <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="w-full h-full object-cover"
            alt="Giống cây (nền tảng)"
          />
        ) : (
          <Sprout className="w-8 h-8 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "varietyFoundationName",
    label: "Tên giống cây (nền tảng)",
    render: (value: string) => (
      <span className="font-semibold text-foreground">{value}</span>
    ),
  },
  {
    key: "crop",
    label: "Cây trồng",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="font-medium text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (value: string) => (
      <p className="text-xs text-muted-foreground line-clamp-3 max-w-[300px]">
        {value}
      </p>
    ),
  },
  // {
  //   key: "documents",
  //   label: "Tài liệu",
  //   render: (value: VarietyFoundation["documents"], item: VarietyFoundation) => {
  //     if (item.contentType === "editor" && item.editorContent) {
  //       const snippet = item.editorContent
  //         .replace(/<[^>]*>/g, " ")
  //         .replace(/\s+/g, " ")
  //         .trim()
  //         .substring(0, 60);

  //       return (
  //         <div className="flex flex-col gap-1">
  //           <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">
  //             Bản thảo nội dung
  //           </span>
  //           <p className="text-[11px] text-muted-foreground line-clamp-2 italic leading-relaxed">
  //             "{snippet}..."
  //           </p>
  //         </div>
  //       );
  //     }

  //     return (
  //       <div className="flex flex-col gap-1">
  //         {value.length > 0 ? (
  //           value.map((doc, idx) => (
  //             <a
  //               key={idx}
  //               href={doc.url}
  //               className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 w-fit"
  //             >
  //               <FileText className="w-3 h-3" />
  //               {doc.name}
  //             </a>
  //           ))
  //         ) : (
  //           <span className="text-[11px] text-muted-foreground/50">
  //             Chưa có tài liệu
  //           </span>
  //         )}
  //       </div>
  //     );
  //   },
  // },
];
