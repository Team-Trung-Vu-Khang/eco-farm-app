import {
  AdminLayout,
  RadixToaster,
  TooltipProvider,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Suspense } from "react";
import { AppLoadingState } from "./components/AppLoadingState";
import { AuthWrapper } from "./features/auth/components/AuthWrapper";
import AppRouter from "./AppRouter";

function App() {
  return (
    <TooltipProvider>
      <AuthWrapper>
        <AdminLayout isDev>
          <Suspense fallback={<AppLoadingState />}>
            <AppRouter />
          </Suspense>
        </AdminLayout>
        <RadixToaster />
      </AuthWrapper>
    </TooltipProvider>
  );
}

export default App;
