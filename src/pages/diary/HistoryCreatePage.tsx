import { useState } from "react";
import { HistoryFormContent } from "./components/form/HistoryFormContent";

export function HistoryCreatePage() {
  // Đổi key để dựng lại form từ đầu khi bấm "Làm mới"
  const [formKey, setFormKey] = useState(0);

  return (
    <HistoryFormContent
      key={formKey}
      onReset={() => {
        setFormKey((key) => key + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      allowModeToggle={true}
      isPlannedModeDefault={false}
      pageTitle="Ghi nhận nhật ký nông hộ"
      backUrl="/diary/daily-history"
    />
  );
}

export default HistoryCreatePage;
