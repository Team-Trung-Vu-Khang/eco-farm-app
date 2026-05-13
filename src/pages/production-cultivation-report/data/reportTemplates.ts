import type { ReportTemplate } from "../types";

export const reportTemplates: ReportTemplate[] = [
  {
    id: "executive-summary",
    name: "Tổng hợp điều hành",
    description:
      "Bức tranh tổng quan cho lãnh đạo: diện tích, sản lượng, tiến độ, rủi ro và điểm cần xử lý.",
    category: "Điều hành",
    audience: "Ban lãnh đạo",
    metrics: ["Diện tích", "Sản lượng", "Tiến độ", "Rủi ro"],
  },
  {
    id: "yield-harvest",
    name: "Sản lượng & thu hoạch",
    description:
      "Theo dõi sản lượng dự kiến, kế hoạch thu hoạch và năng suất theo phạm vi sản xuất.",
    category: "Sản xuất",
    audience: "Ban lãnh đạo / Quản lý thu hoạch",
    metrics: ["Sản lượng dự kiến", "Năng suất", "Kế hoạch thu hoạch"],
  },
  {
    id: "cultivation-progress",
    name: "Tiến độ canh tác",
    description:
      "Tổng hợp kế hoạch, giai đoạn và công việc theo trạng thái hoàn thành, đang xử lý và trễ hạn.",
    category: "Vận hành",
    audience: "Ban lãnh đạo / Quản lý canh tác",
    metrics: ["Kế hoạch", "Công việc", "Hoàn thành", "Trễ hạn"],
  },
  {
    id: "material-cost",
    name: "Vật tư & chi phí canh tác",
    description:
      "Tổng hợp vật tư sử dụng, nhóm vật tư trọng yếu và ước tính áp lực chi phí theo kế hoạch.",
    category: "Nguồn lực",
    audience: "Ban lãnh đạo / Tài chính vận hành",
    metrics: ["Vật tư", "Chủng loại", "Định mức", "Ước tính chi phí"],
  },
  {
    id: "crop-health",
    name: "Sức khỏe cây trồng & xử lý",
    description:
      "Theo dõi tình trạng cây trồng, kế hoạch điều trị, mức độ bệnh hại và cảnh báo cần can thiệp.",
    category: "Rủi ro",
    audience: "Ban lãnh đạo / QA nông nghiệp",
    metrics: ["Cây bệnh", "Điều trị", "Mức độ nặng", "Cảnh báo"],
  },
  {
    id: "cost-efficiency",
    name: "Chi phí & hiệu quả sản xuất",
    description:
      "Đối chiếu diện tích, sản lượng dự kiến, nhóm vật tư và áp lực chi phí theo từng kế hoạch.",
    category: "Tài chính",
    audience: "Ban lãnh đạo / Tài chính",
    metrics: ["Chi phí ước tính", "Năng suất", "Vật tư", "Hiệu quả"],
  },
  {
    id: "labor-performance",
    name: "Năng suất lao động",
    description:
      "Theo dõi khối lượng công việc, trạng thái thực hiện, nhóm phụ trách và điểm nghẽn vận hành.",
    category: "Nhân sự",
    audience: "Ban lãnh đạo / Quản lý đội nhóm",
    metrics: ["Công việc", "Hoàn thành", "Trễ hạn", "Nguồn lực"],
  },
  {
    id: "compliance-traceability",
    name: "Tuân thủ & truy xuất",
    description:
      "Tổng hợp dữ liệu kế hoạch, mùa vụ, vùng/lô, vật tư và xử lý để phục vụ đối chiếu tuân thủ.",
    category: "QA",
    audience: "Ban lãnh đạo / QA",
    metrics: ["Nguồn dữ liệu", "Độ phủ", "Hồ sơ", "Rủi ro thiếu dữ liệu"],
  },
  {
    id: "risk-warning",
    name: "Cảnh báo rủi ro sản xuất",
    description:
      "Làm nổi bật công việc trễ, điều trị đang hoạt động, kế hoạch thu hoạch và vùng cần ưu tiên.",
    category: "Rủi ro",
    audience: "Ban lãnh đạo",
    metrics: ["Việc trễ", "Điều trị", "Thu hoạch", "Ưu tiên"],
  },
  {
    id: "plan-vs-actual",
    name: "Kế hoạch so với thực hiện",
    description:
      "So sánh tiến độ công việc và sản lượng dự kiến theo kế hoạch để phục vụ họp điều hành.",
    category: "Điều hành",
    audience: "Ban lãnh đạo / PMO nông nghiệp",
    metrics: ["Kế hoạch", "Thực hiện", "Sai lệch", "Hành động"],
  },
];

export function getReportTemplateName(templateId: string) {
  return (
    reportTemplates.find((template) => template.id === templateId)?.name ||
    "Báo cáo sản xuất/canh tác"
  );
}
