import type { ColumnFilterOption } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  AmendmentMethod,
  AmendmentMethodFormData,
  MethodType,
} from "../types/amendment-method";

export const INITIAL_AMENDMENT_METHODS: AmendmentMethod[] = [
  {
    id: "1",
    code: "BP01",
    name: "Bón vôi bột",
    type: "chemical",
    target: "Đất chua (pH < 5.5)",
    description:
      "Sử dụng vôi bột (CaCO3) hoặc vôi tôi để trung hòa độ chua của đất, cung cấp Canxi và khử trùng.",
    implementation:
      "Rải đều vôi trên mặt ruộng, cày xới để trộn vào đất trước khi gieo trồng 15-20 ngày.",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  },
  {
    id: "2",
    code: "BP02",
    name: "Bón phân hữu cơ hoai mục",
    type: "biological",
    target: "Đất bạc màu, nghèo dinh dưỡng",
    description:
      "Bổ sung chất hữu cơ giúp cải thiện kết cấu đất, tăng độ tơi xốp và khả năng giữ nước, giữ phân.",
    implementation:
      "Bón lót trong quá trình làm đất hoặc bón quanh gốc cây lâu năm.",
    difficulty: "trung bình",
    cost: "trung bình",
    status: "active",
  },
  {
    id: "3",
    code: "BP03",
    name: "Cày sâu, phơi ải",
    type: "mechanical",
    target: "Đất tích tụ mầm bệnh, nén chặt",
    description:
      "Cày lật đất sâu, phơi nắng để diệt mầm bệnh, trứng sâu hại và tăng cường quá trình khoáng hóa.",
    implementation:
      "Thực hiện vào mùa khô, cày lật đất và phơi nắng trong 2-4 tuần.",
    difficulty: "trung bình",
    cost: "thấp",
    status: "active",
  },
  {
    id: "4",
    code: "BP04",
    name: "Trồng cây họ Đậu che phủ",
    type: "biological",
    target: "Đất xói mòn, thiếu Đạm",
    description:
      "Trồng các loại đậu đỗ, lạc dại để che phủ đất, hạn chế cỏ dại và cố định đạm sinh học.",
    implementation: "Gieo hạt xen canh hoặc luân canh giữa các vụ trồng chính.",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  },
  {
    id: "5",
    code: "BP05",
    name: "Rửa mặn",
    type: "mechanical",
    target: "Đất nhiễm mặn",
    description:
      "Sử dụng nước ngọt để hòa tan muối trong đất và đẩy chúng ra khỏi vùng rễ qua hệ thống thoát nước.",
    implementation:
      "Xây dựng hệ thống kênh mương, bơm nước ngọt vào ruộng và tháo nước mặn ra.",
    difficulty: "khó",
    cost: "cao",
    status: "active",
  },
  {
    id: "6",
    code: "BP06",
    name: "Sử dụng chế phẩm IMO",
    type: "biological",
    target: "Hệ vi sinh vật đất nghèo nàn",
    description:
      "Sử dụng các chủng vi sinh vật có lợi bản địa để phân giải chất hữu cơ và đối kháng nấm bệnh.",
    implementation:
      "Nhân nuôi chế phẩm và tưới vào đất hoặc trộn với phân hữu cơ.",
    difficulty: "khó",
    cost: "thấp",
    status: "active",
  },
];

export const createEmptyAmendmentMethodForm =
  (): AmendmentMethodFormData => ({
    code: "",
    name: "",
    type: "biological",
    target: "",
    description: "",
    implementation: "",
    difficulty: "dễ",
    cost: "thấp",
    status: "active",
  });

export const amendmentMethodFilters: {
  key: keyof AmendmentMethod;
  label: string;
  options: ColumnFilterOption[];
}[] = [
  {
    key: "type",
    label: "Loại",
    options: [
      { label: "Sinh học", value: "biological" },
      { label: "Hóa học", value: "chemical" },
      { label: "Cơ giới", value: "mechanical" },
      { label: "Canh tác", value: "cultural" },
    ],
  },
  {
    key: "difficulty",
    label: "Độ khó",
    options: [
      { label: "Dễ", value: "dễ" },
      { label: "Trung bình", value: "trung bình" },
      { label: "Khó", value: "khó" },
    ],
  },
  {
    key: "cost",
    label: "Chi phí",
    options: [
      { label: "Thấp", value: "thấp" },
      { label: "Trung bình", value: "trung bình" },
      { label: "Cao", value: "cao" },
    ],
  },
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Đang áp dụng", value: "active" },
      { label: "Ngưng", value: "inactive" },
    ],
  },
] as const;

export const getMethodTypeConfig = (type: MethodType) => {
  switch (type) {
    case "chemical":
      return {
        label: "Hóa học",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "biological":
      return {
        label: "Sinh học",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "mechanical":
      return {
        label: "Cơ giới",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "cultural":
      return {
        label: "Canh tác",
        className: "bg-purple-100 text-purple-700 border-purple-200",
      };
    default:
      return {
        label: "Khác",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
};

export const getMethodLevelColor = (
  level: string,
  type: "cost" | "difficulty",
) => {
  if (type === "cost") {
    switch (level) {
      case "thấp":
        return "text-green-600 bg-green-50";
      case "trung bình":
        return "text-amber-600 bg-amber-50";
      case "cao":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600";
    }
  }

  switch (level) {
    case "dễ":
      return "text-green-600 bg-green-50";
    case "trung bình":
      return "text-blue-600 bg-blue-50";
    case "khó":
      return "text-red-600 bg-red-50";
    default:
      return "text-slate-600";
  }
};
