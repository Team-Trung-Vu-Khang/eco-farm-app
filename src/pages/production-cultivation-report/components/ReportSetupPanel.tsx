import { CheckCircle2, Filter, Loader2, Send } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { reportTemplates } from "../data/reportTemplates";
import type {
  ReportPeriodType,
  ReportScopeType,
  ReportTemplateId,
} from "../types";
import {
  periodTypeOptions,
  scopeTypeOptions,
  type Option,
} from "../utils/ui";

interface ReportSetupPanelProps {
  templateId: ReportTemplateId;
  periodType: ReportPeriodType;
  startDate: string;
  endDate: string;
  scopeType: ReportScopeType;
  scopeId: string;
  scopeOptions: Option[];
  selectedTemplateName?: string;
  hasRunningJob: boolean;
  onTemplateChange: (value: ReportTemplateId) => void;
  onPeriodTypeChange: (value: ReportPeriodType) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onScopeTypeChange: (value: ReportScopeType) => void;
  onScopeIdChange: (value: string) => void;
  onSubmit: () => void;
}

export function ReportSetupPanel({
  templateId,
  periodType,
  startDate,
  endDate,
  scopeType,
  scopeId,
  scopeOptions,
  selectedTemplateName,
  hasRunningJob,
  onTemplateChange,
  onPeriodTypeChange,
  onStartDateChange,
  onEndDateChange,
  onScopeTypeChange,
  onScopeIdChange,
  onSubmit,
}: ReportSetupPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-primary" />
          Thiết lập yêu cầu tổng hợp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="flex min-w-max gap-3">
            {reportTemplates.map((template) => {
              const isActive = template.id === templateId;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onTemplateChange(template.id)}
                  className={`w-[220px] shrink-0 text-left border rounded-lg p-3 transition-colors ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                      : "border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {template.category}
                    </Badge>
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-900">
                    {template.name}
                  </p>
                  <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted-foreground">
                    {template.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:items-end">
          <div className="space-y-2">
            <Label>Loại kỳ báo cáo</Label>
            <Select
              value={periodType}
              onValueChange={(value) =>
                onPeriodTypeChange(value as ReportPeriodType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                {periodTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Mẫu đang chọn</Label>
            <div className="h-10 rounded-md border bg-slate-50 px-3 flex items-center truncate text-sm font-medium">
              {selectedTemplateName}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phạm vi dữ liệu</Label>
            <Select
              value={scopeType}
              onValueChange={(value) =>
                onScopeTypeChange(value as ReportScopeType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phạm vi" />
              </SelectTrigger>
              <SelectContent>
                {scopeTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 xl:col-span-2">
            <Label>Đối tượng dữ liệu</Label>
            <Select
              value={scopeId}
              onValueChange={onScopeIdChange}
              disabled={scopeType === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đối tượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {scopeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onSubmit}
            disabled={hasRunningJob}
            className="h-10 whitespace-nowrap"
          >
            {hasRunningJob ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Tổng hợp báo cáo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
