import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Loader2, Save, X } from "lucide-react";
import { TeamFormCard } from "./components/TeamFormCard";
import { useTeamEditPage } from "./hooks/useTeamEditPage";

export default function TeamEditPage() {
  const {
    control,
    errors,
    clearErrors,
    departmentOptions,
    leaderOptions,
    handleSubmit,
    goBack,
    isSubmitting,
    isTeamLoading,
  } = useTeamEditPage();

  if (isTeamLoading) {
    return (
      <AdminLayout isDev={true} title="Chỉnh sửa đội nhóm">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            Đang tải thông tin đội nhóm...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chỉnh sửa đội nhóm"
      description="Cập nhật thông tin đội nhóm làm việc"
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
    </AdminLayout>
  );
}
