import PageWrapper from "@/components/PageWrapper";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Save, X } from "lucide-react";
import { TeamFormCard } from "./components/TeamFormCard";
import { useTeamCreatePage } from "./hooks/useTeamCreatePage";

export default function TeamCreatePage() {
  const {
    control,
    errors,
    clearErrors,
    departmentOptions,
    leaderOptions,
    handleSubmit,
    goBack,
    isSubmitting,
  } = useTeamCreatePage();

  return (
    <PageWrapper
      title="Thêm mới đội nhóm"
      description="Tạo đội nhóm làm việc mới"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <TeamFormCard
          control={control}
          errors={errors}
          clearErrors={clearErrors}
          departmentOptions={departmentOptions}
          leaderOptions={leaderOptions}
        />
      </div>
    </PageWrapper>
  );
}
