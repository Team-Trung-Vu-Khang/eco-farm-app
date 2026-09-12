import { HistoryFormContent } from "./components/form/HistoryFormContent";

export function HistoryCreatePage() {
  return (
    <HistoryFormContent
      allowModeToggle={true}
      isPlannedModeDefault={false}
      pageTitle="Ghi nhận nhật ký nông hộ"
      backUrl="/diary/daily-history"
    />
  );
}

export default HistoryCreatePage;
