import {
  AdminLayout,
  RadixToaster,
  TooltipProvider,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense, useState, useEffect } from "react";
import { AppLoadingState } from "./components/AppLoadingState";
import { AuthWrapper } from "./features/auth/components/AuthWrapper";
import AppRouter from "./AppRouter";
import { OnboardRegionDialog } from "./pages/region-chart/region-basic-distribution/components/OnboardRegionDialog";
import { useRegions } from "./features/farm/hooks/useRegions";

import { useCurrentUser } from "./features/auth/hooks/useCurrentUser";
import { WorkspaceChangeHandler } from "./components/WorkspaceChangeHandler";

interface OnboardCheckerProps {
  children: React.ReactNode;
}

const OnboardChecker: React.FC<OnboardCheckerProps> = ({ children }) => {
  const [showOnboard, setShowOnboard] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Gọi API lấy danh sách vùng trồng tại root để check
  const { response, isLoading, isError, refetch } = useRegions({
    params: {
      page: 0,
      size: 1, // Chỉ lấy 1 bản ghi để tối ưu tốc độ kiểm tra
      domainCode: "CROP",
    },
  });

  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    // Chỉ tự động kích hoạt Dialog khi:
    // 1. Dữ liệu vùng trồng và dữ liệu user đã tải xong (không lỗi, không loading)
    // 2. User không thuộc các role loại trừ (MEVI_SUPER_ADMIN, MEVI_ADMIN, MEVI_FARM_ADMIN)
    // 3. Danh sách vùng trồng trống và chưa kiểm tra onboarding
    if (!isLoading && !isError && response && !isLoadingUser && currentUser) {
      const userRoles = currentUser.roleCodes ?? [];
      const hasExcludedRole = userRoles.some((role) =>
        ["MEVI_SUPER_ADMIN", "MEVI_ADMIN", "MEVI_FARM_ADMIN"].includes(role),
      );

      if (!hasExcludedRole && response.totalElements === 0 && !hasChecked) {
        setShowOnboard(true);
        setHasChecked(true);
      } else {
        setHasChecked(true);
      }
    }
  }, [isLoading, isError, response, isLoadingUser, currentUser, hasChecked]);

  const handleOnboardSuccess = () => {
    setShowOnboard(false);
    refetch();
  };

  return (
    <>
      {children}
      <OnboardRegionDialog
        open={showOnboard}
        onSuccess={handleOnboardSuccess}
      />
    </>
  );
};

function App() {
  return (
    <TooltipProvider>
      <AuthWrapper>
        <AdminLayout isDev>
          <Suspense fallback={<AppLoadingState />}>
            <WorkspaceChangeHandler />
            <OnboardChecker>
              <AppRouter />
            </OnboardChecker>
          </Suspense>
        </AdminLayout>
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
