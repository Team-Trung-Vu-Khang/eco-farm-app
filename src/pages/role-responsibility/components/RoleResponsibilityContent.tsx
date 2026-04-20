import { Alert, AlertDescription, AlertTitle, Avatar, AvatarFallback, AvatarImage, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ShieldCheck, Users } from "lucide-react";
import {
  TU_DIEN_NHOM_VAI_TRO,
  TU_DIEN_PHAM_VI,
  dinhDangNgayGio,
  layNhanMucPheDuyet,
  layNhanTieuChuan,
  layNhanTrachNhiem,
} from "../constants/roleResponsibilityConstants";
import type { NguoiDungVaiTro, VaiTroNghiepVu } from "../types";

interface RoleResponsibilityContentProps {
  approvalOptions: Array<{ value: string; label: string }>;
  standardOptions: Array<{ value: string; label: string }>;
  validationSummary: { loi: string[]; canhBao: string[] };
  selectedRole: VaiTroNghiepVu | null;
  selectedUsers: NguoiDungVaiTro[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function RoleResponsibilityContent({
  approvalOptions,
  standardOptions,
  validationSummary,
  selectedRole,
  selectedUsers,
}: RoleResponsibilityContentProps) {
  if (!selectedRole) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center text-muted-foreground md:p-8">
        Chọn một vai trò để xem chi tiết trách nhiệm và tình trạng vận hành.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                {selectedRole.maVaiTro}
              </Badge>
              <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">
                {TU_DIEN_NHOM_VAI_TRO[selectedRole.nhomVaiTro]}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedRole.tenVaiTro}</h3>
              <p className="text-sm text-muted-foreground">{selectedRole.moTa}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Phạm vi</p>
              <p className="mt-1 font-medium">{TU_DIEN_PHAM_VI[selectedRole.phamVi]}</p>
            </div>
            <div className="rounded-xl border bg-background p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cấp phê duyệt</p>
              <p className="mt-1 font-medium">
                {approvalOptions.find((item) => item.value === selectedRole.mucPheDuyet)?.label ||
                  layNhanMucPheDuyet(selectedRole.mucPheDuyet)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <h3 className="text-lg font-semibold">Trách nhiệm được giao</h3>
            <p className="text-sm text-muted-foreground">
              Mỗi vai trò cần gắn trách nhiệm rõ ràng để phục vụ kiểm soát và audit.
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          {selectedRole.maTrachNhiem.map((maTrachNhiem) => (
            <div key={maTrachNhiem} className="rounded-xl border bg-background p-3">
              <p className="font-medium">{layNhanTrachNhiem(maTrachNhiem)}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedRole.maTieuChuan.length > 0 ? (
            selectedRole.maTieuChuan.map((maTieuChuan) => (
              <Badge
                key={maTieuChuan}
                className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
              >
                {standardOptions.find((item) => item.value === maTieuChuan)?.label ||
                  layNhanTieuChuan(maTieuChuan)}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Vai trò này chưa gắn bộ tiêu chuẩn chuyên biệt.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-sky-600" />
          <div>
            <h3 className="text-lg font-semibold">Người dùng được gán</h3>
            <p className="text-sm text-muted-foreground">
              Theo dõi ai đang chịu trách nhiệm thực thi vai trò trong thực tế.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {selectedUsers.length > 0 ? (
            selectedUsers.map((nguoiDung) => (
              <div key={nguoiDung.id} className="rounded-xl border bg-background p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-11 w-11 border border-white shadow-sm">
                      <AvatarImage src={nguoiDung.avatar} />
                      <AvatarFallback className="bg-sky-100 font-semibold text-sky-700">
                        {getInitials(nguoiDung.hoTen)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium">{nguoiDung.hoTen}</p>
                      <p className="text-sm text-muted-foreground">
                        {nguoiDung.chucDanh} • {nguoiDung.donVi}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      nguoiDung.trangThai === "dang-lam-viec"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    }
                  >
                    {nguoiDung.trangThai === "dang-lam-viec"
                      ? "Đang làm việc"
                      : "Tạm ngưng"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
              Chưa có người dùng nào được gán vào vai trò này.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-violet-600" />
          <div>
            <h3 className="text-lg font-semibold">Kiểm tra điều kiện nghiệp vụ</h3>
            <p className="text-sm text-muted-foreground">
              Rà soát điều kiện audit, phân quyền và tính hợp lệ của cấu hình vai trò.
            </p>
          </div>
        </div>

        {validationSummary.loi.length === 0 && validationSummary.canhBao.length === 0 ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Vai trò đang hợp lệ</AlertTitle>
            <AlertDescription>
              Không phát hiện xung đột nghiệp vụ hoặc thiếu thông tin bắt buộc.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {validationSummary.loi.map((loi) => (
              <Alert key={loi} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lỗi nghiệp vụ</AlertTitle>
                <AlertDescription>{loi}</AlertDescription>
              </Alert>
            ))}
            {validationSummary.canhBao.map((canhBao) => (
              <Alert
                key={canhBao}
                className="border-amber-200 bg-amber-50 text-amber-900"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cảnh báo</AlertTitle>
                <AlertDescription>{canhBao}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4 md:p-5">
        <h3 className="text-lg font-semibold">Nhật ký thay đổi</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Ghi nhận ai cập nhật cấu hình vai trò, lúc nào và đã thay đổi nội dung gì.
        </p>
        <div className="space-y-3">
          {selectedRole.nhatKy.map((item) => (
            <div key={item.id} className="rounded-xl border bg-background p-3">
              <p className="font-medium">
                {item.nguoiThucHien} {item.hanhDong === "tao-moi"
                  ? "tạo mới"
                  : item.hanhDong === "cap-nhat"
                    ? "cập nhật"
                    : "gán người dùng"}{" "}
                lúc {dinhDangNgayGio(item.thoiDiem)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.noiDung}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
