import { HistoryFormContent } from "./components/HistoryFormContent";

export function HistoryCreatePage() {
  return (
    <HistoryFormContent
      allowModeToggle={true}
      isPlannedModeDefault={false}
      pageTitle="Ghi nhận nhật ký nông hộ"
      backUrl="/history"
    />
  );
}

export default HistoryCreatePage;
