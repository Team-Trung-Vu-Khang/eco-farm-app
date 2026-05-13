import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import type { ReportResult } from "../types";

function createSafeFileName(result: ReportResult, extension: string) {
  const date = new Date(result.generatedAt).toISOString().slice(0, 10);
  const slug = result.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "bao-cao-san-xuat-canh-tac"}-${date}.${extension}`;
}

export function exportReportToExcel(result: ReportResult) {
  const workbook = XLSX.utils.book_new();

  const summaryRows = [
    ["Tên báo cáo", result.title],
    ["Kỳ báo cáo", result.periodLabel],
    ["Phạm vi", result.scopeLabel],
    ["Thời điểm tổng hợp", new Date(result.generatedAt).toLocaleString("vi-VN")],
    [],
    ["Chỉ tiêu", "Giá trị", "Diễn giải"],
    ...result.metrics.map((metric) => [
      metric.label,
      metric.value,
      metric.change,
    ]),
  ];

  const chartRows = [
    ["Kỳ", "Sản lượng dự kiến", "Công việc", "Nhóm vật tư"],
    ...result.chartData.map((point) => [
      point.label,
      point.yield,
      point.tasks,
      point.materials,
    ]),
  ];

  const detailRows = [
    [
      "Kế hoạch",
      "Phạm vi",
      "Cây trồng",
      "Thời gian",
      "Tiến độ",
      "Sản lượng",
      "Vật tư",
      "Rủi ro",
    ],
    ...result.tableRows.map((row) => [
      row.name,
      row.scope,
      row.crop,
      row.period,
      row.progress,
      row.yield,
      row.material,
      row.risk,
    ]),
  ];

  const insightRows = [
    ["Nhận định", "Mô tả", "Mức độ"],
    ...result.insights.map((insight) => [
      insight.title,
      insight.description,
      insight.tone,
    ]),
  ];
  const taskStatusRows = [
    ["Trạng thái", "Giá trị", "Diễn giải", "Mức độ"],
    ...result.taskStatusRows.map((row) => [
      row.label,
      row.value,
      row.description,
      row.tone,
    ]),
  ];
  const planPurposeRows = [
    ["Mục đích", "Giá trị", "Diễn giải", "Mức độ"],
    ...result.planPurposeRows.map((row) => [
      row.label,
      row.value,
      row.description,
      row.tone,
    ]),
  ];
  const materialRows = [
    ["Kế hoạch", "Giai đoạn", "Nhóm", "Vật tư", "Số lượng", "Đơn vị"],
    ...result.materialRows.map((row) => [
      row.planName,
      row.stage,
      row.category,
      row.materialName,
      row.quantity,
      row.unit,
    ]),
  ];
  const sourceRows = [
    ["Nguồn", "Bản ghi", "Độ phủ", "Ghi chú", "Mức độ"],
    ...result.sourceRows.map((row) => [
      row.source,
      row.records,
      row.coverage,
      row.note,
      row.tone,
    ]),
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(summaryRows),
    "Tong quan",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(chartRows),
    "Du lieu bieu do",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(detailRows),
    "Chi tiet",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(insightRows),
    "Nhan dinh",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(taskStatusRows),
    "Trang thai cong viec",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(planPurposeRows),
    "Muc dich ke hoach",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(materialRows),
    "Vat tu",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet(sourceRows),
    "Nguon du lieu",
  );

  XLSX.writeFile(workbook, createSafeFileName(result, "xlsx"));
}

export function exportReportToPdf(result: ReportResult) {
  const document = new jsPDF({ orientation: "landscape", unit: "mm" });
  const generatedAt = new Date(result.generatedAt).toLocaleString("vi-VN");

  document.setFontSize(16);
  document.text(result.title, 14, 16);
  document.setFontSize(10);
  document.text(`Ky bao cao: ${result.periodLabel}`, 14, 24);
  document.text(`Pham vi: ${result.scopeLabel}`, 14, 30);
  document.text(`Tong hop luc: ${generatedAt}`, 14, 36);
  document.text(`Tom tat: ${result.executiveSummary}`, 14, 42, {
    maxWidth: 260,
  });

  autoTable(document, {
    startY: 54,
    head: [["Chi tieu", "Gia tri", "Dien giai"]],
    body: result.metrics.map((metric) => [
      metric.label,
      metric.value,
      metric.change,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 101, 52] },
  });

  autoTable(document, {
    startY: 96,
    head: [
      [
        "Ke hoach",
        "Pham vi",
        "Cay trong",
        "Thoi gian",
        "Tien do",
        "San luong",
        "Vat tu",
        "Rui ro",
      ],
    ],
    body: result.tableRows.map((row) => [
      row.name,
      row.scope,
      row.crop,
      row.period,
      row.progress,
      row.yield,
      row.material,
      row.risk,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 101, 52] },
  });

  autoTable(document, {
    head: [["Nguon", "Ban ghi", "Do phu", "Ghi chu"]],
    body: result.sourceRows.map((row) => [
      row.source,
      row.records,
      row.coverage,
      row.note,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [22, 101, 52] },
  });

  document.save(createSafeFileName(result, "pdf"));
}
