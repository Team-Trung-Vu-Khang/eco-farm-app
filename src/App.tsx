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

  useEffect(() => {
    // Chỉ tự động kích hoạt Dialog khi API đã load xong thành công, không lỗi và dữ liệu trống
    // Việc tắt Dialog sẽ do callback handleOnboardSuccess quản lý thủ công để tránh bị tắt sớm khi cache bị invalidate
    if (!isLoading && !isError && response) {
      if (response.totalElements === 0 && !hasChecked) {
        setShowOnboard(true);
        setHasChecked(true);
      } else if (response.totalElements > 0) {
        setHasChecked(true);
      }
    }
  }, [isLoading, isError, response, hasChecked]);

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
