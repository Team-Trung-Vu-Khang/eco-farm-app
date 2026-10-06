import { type ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { AuthLoadingState } from "./AuthLoadingState";

interface AdminGuardProps {
  children: ReactNode;
  fallbackPath?: string;
}

/**
 * Guard component bảo vệ các route dành riêng cho Admin.
 * Nếu chưa tải xong thông tin user: Hiển thị loading state.
 * Nếu không phải Admin: Tự động điều hướng về fallbackPath (mặc định /dashboard) và thông báo toast.
 */
export function AdminGuard({
  children,
  fallbackPath = "/dashboard",
}: AdminGuardProps) {
  const { isAdmin, isLoading } = useIsAdmin();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Không có quyền truy cập",
        description: "Trang này yêu cầu quyền Admin hệ thống.",
        variant: "destructive",
      });
      setLocation(fallbackPath, { replace: true });
    }
  }, [isLoading, isAdmin, setLocation, fallbackPath, toast]);

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
