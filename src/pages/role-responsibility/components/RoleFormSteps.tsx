import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, CheckCircle2, ShieldCheck, User, Users, X } from "lucide-react";
import {
  DANH_MUC_TRACH_NHIEM,
  TU_DIEN_NHOM_VAI_TRO,
  TU_DIEN_PHAM_VI,
  layNhanMucPheDuyet,
  layNhanTieuChuan,
  layNhanTrachNhiem,
} from "../constants/roleResponsibilityConstants";
import type { FormVaiTroState, NguoiDungVaiTro } from "../types";
import { FieldLabel, FieldSelect } from "./FieldControls";
import { RoleUserSelectDialog } from "./RoleUserSelectDialog";

interface SelectOption {
  value: string;
  label: string;
}

interface RoleFormStepsParams {
  approvalOptions: SelectOption[];
  formData: FormVaiTroState;
  nguoiDungList: NguoiDungVaiTro[];
  setFormData: Dispatch<SetStateAction<FormVaiTroState>>;
  standardOptions: SelectOption[];
  validationSummary: { loi: string[]; canhBao: string[] };
}

function CheckboxCard({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description?: string;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-3">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-input"
        checked={checked}
        onChange={onChange}
      />
      <span>
        <span className="block font-medium">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function RoleUserAssignmentStep({
  formData,
  nguoiDungList,
  setFormData,
}: {
  formData: FormVaiTroState;
  nguoiDungList: NguoiDungVaiTro[];
  setFormData: Dispatch<SetStateAction<FormVaiTroState>>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedUsers = useMemo(
    () => nguoiDungList.filter((nguoiDung) => formData.nguoiDungIds.includes(nguoiDung.id)),
    [formData.nguoiDungIds, nguoiDungList],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <FieldLabel>Người dùng phụ trách</FieldLabel>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn người dùng trong popup và hệ thống sẽ hiển thị danh sách đã gán bên dưới.
          </p>
        </div>
        <Button type="button" onClick={() => setDialogOpen(true)}>
          <Users className="mr-2 h-4 w-4" />
          Chọn người dùng
        </Button>
      </div>

      <div className="space-y-3">
        {selectedUsers.length > 0 ? (
          selectedUsers.map((nguoiDung) => (
            <div
              key={nguoiDung.id}
              className="flex items-center gap-4 rounded-2xl border bg-background p-4"
            >
              <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm">
                <AvatarImage src={nguoiDung.avatar} />
                <AvatarFallback className="bg-sky-100 font-semibold text-sky-700">
                  {getInitials(nguoiDung.hoTen) || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold">{nguoiDung.hoTen}</p>
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
                <p className="truncate text-sm text-muted-foreground">{nguoiDung.chucDanh}</p>
                <p className="truncate text-xs text-muted-foreground">{nguoiDung.donVi}</p>
                {nguoiDung.email ? (
                  <p className="truncate text-xs text-slate-400">{nguoiDung.email}</p>
                ) : null}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    nguoiDungIds: prev.nguoiDungIds.filter((item) => item !== nguoiDung.id),
                  }))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
            Chưa có người dùng nào được chọn cho vai trò này.
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-muted/20 p-4">
        <h4 className="font-semibold">Tóm tắt cấu hình</h4>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Vai trò</p>
            <p className="font-medium">{formData.tenVaiTro || "Chưa nhập"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Mã vai trò</p>
            <p className="font-medium">{formData.maVaiTro || "Chưa nhập"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Số trách nhiệm</p>
            <p className="font-medium">{formData.maTrachNhiem.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Số người dùng</p>
            <p className="font-medium">{formData.nguoiDungIds.length}</p>
          </div>
        </div>
      </div>

      <RoleUserSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        options={nguoiDungList}
        selectedIds={formData.nguoiDungIds}
        onConfirm={(selectedIds) =>
          setFormData((prev) => ({
            ...prev,
            nguoiDungIds: selectedIds,
          }))
        }
      />
    </div>
  );
}

export function useRoleFormSteps({
  approvalOptions,
  formData,
  nguoiDungList,
  setFormData,
  standardOptions,
  validationSummary,
}: RoleFormStepsParams) {
  const isGeneralStepValid =
    formData.maVaiTro.trim().length > 0 &&
    formData.tenVaiTro.trim().length > 0 &&
    formData.moTa.trim().length > 0;

  const isResponsibilityStepValid =
    formData.maTrachNhiem.length > 0 &&
    !(
      (formData.maTrachNhiem.includes("kiem-tra-du-luong") ||
        formData.maTrachNhiem.includes("kiem-soat-chat-luong")) &&
      formData.maTieuChuan.length === 0
    );

  const isAssignmentStepValid =
    validationSummary.loi.length === 0 &&
    !(
      formData.phamVi === "toan-trang-trai" &&
      formData.nguoiDungIds.length === 0
    );

  const selectedUsers = nguoiDungList.filter((nguoiDung) =>
    formData.nguoiDungIds.includes(nguoiDung.id),
  );

  return [
    {
      id: "general",
      title: "Thông tin",
      description: "Mã, tên, nhóm",
      isValid: isGeneralStepValid,
      content: (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel htmlFor="maVaiTro">Mã vai trò</FieldLabel>
              <Input
                id="maVaiTro"
                value={formData.maVaiTro}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    maVaiTro: event.target.value,
                  }))
                }
                placeholder="Ví dụ: VT-NN-004"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel htmlFor="tenVaiTro">Tên vai trò</FieldLabel>
              <Input
                id="tenVaiTro"
                value={formData.tenVaiTro}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenVaiTro: event.target.value,
                  }))
                }
                placeholder="Ví dụ: Quản lý phê duyệt quy trình"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel>Nhóm vai trò</FieldLabel>
              <FieldSelect
                value={formData.nhomVaiTro}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    nhomVaiTro: event.target.value as FormVaiTroState["nhomVaiTro"],
                  }))
                }
              >
                {Object.entries(TU_DIEN_NHOM_VAI_TRO).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </FieldSelect>
            </div>
            <div className="space-y-2">
              <FieldLabel>Phạm vi áp dụng</FieldLabel>
              <FieldSelect
                value={formData.phamVi}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    phamVi: event.target.value as FormVaiTroState["phamVi"],
                  }))
                }
              >
                {Object.entries(TU_DIEN_PHAM_VI).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </FieldSelect>
            </div>
            <div className="space-y-2">
              <FieldLabel>Chức vụ phê duyệt</FieldLabel>
              <FieldSelect
                value={formData.mucPheDuyet}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    mucPheDuyet: event.target.value,
                  }))
                }
              >
                <option value="">Chọn chức vụ phê duyệt</option>
                {approvalOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </FieldSelect>
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel htmlFor="moTa">Mô tả vai trò</FieldLabel>
            <textarea
              id="moTa"
              value={formData.moTa}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, moTa: event.target.value }))
              }
              placeholder="Mô tả trách nhiệm chính, tình huống sử dụng và đầu mối phối hợp."
              className="flex min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      ),
    },
    {
      id: "responsibility",
      title: "Trách nhiệm",
      description: "Nghiệp vụ, tiêu chuẩn",
      isValid: isResponsibilityStepValid,
      content: (
        <div className="space-y-5">
          <div className="space-y-3">
            <FieldLabel>Trách nhiệm nghiệp vụ</FieldLabel>
            <div className="grid gap-3 md:grid-cols-2">
              {DANH_MUC_TRACH_NHIEM.map((item) => {
                const checked = formData.maTrachNhiem.includes(item.id);
                return (
                  <CheckboxCard
                    key={item.id}
                    checked={checked}
                    label={item.label}
                    description={item.moTa}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        maTrachNhiem: checked
                          ? prev.maTrachNhiem.filter((value) => value !== item.id)
                          : [...prev.maTrachNhiem, item.id],
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <FieldLabel>Chứng nhận - chứng chỉ áp dụng</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              {standardOptions.map((item) => {
                const checked = formData.maTieuChuan.includes(item.value);
                return (
                  <CheckboxCard
                    key={item.value}
                    checked={checked}
                    label={item.label}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        maTieuChuan: checked
                          ? prev.maTieuChuan.filter((value) => value !== item.value)
                          : [...prev.maTieuChuan, item.value],
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>

          <Alert className="border-sky-200 bg-sky-50 text-sky-900">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Gợi ý rà soát nhanh</AlertTitle>
            <AlertDescription>
              Nếu chọn trách nhiệm QA/QC hoặc kiểm tra dư lượng thì nên gắn ngay chứng
              nhận hoặc chứng chỉ áp dụng tại bước này để không bị chặn ở bước xác nhận.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "assignment",
      title: "Phân công",
      description: "Người dùng",
      isValid: isAssignmentStepValid,
      content: (
        <RoleUserAssignmentStep
          formData={formData}
          nguoiDungList={nguoiDungList}
          setFormData={setFormData}
        />
      ),
    },
    {
      id: "confirmation",
      title: "Xác nhận",
      description: "Rà soát trước khi lưu",
      isValid: validationSummary.loi.length === 0,
      content: (
        <div className="space-y-5">
          <section className="rounded-2xl border bg-card p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                {formData.maVaiTro || "Chưa có mã"}
              </Badge>
              <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">
                {TU_DIEN_NHOM_VAI_TRO[formData.nhomVaiTro]}
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                {TU_DIEN_PHAM_VI[formData.phamVi]}
              </Badge>
            </div>
            <h3 className="mt-4 text-lg font-semibold">
              {formData.tenVaiTro || "Chưa nhập tên vai trò"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {formData.moTa || "Chưa có mô tả vai trò."}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-background p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Chức vụ phê duyệt
                </p>
                <p className="mt-1 font-medium">
                  {approvalOptions.find((item) => item.value === formData.mucPheDuyet)?.label ||
                    layNhanMucPheDuyet(formData.mucPheDuyet)}
                </p>
              </div>
              <div className="rounded-xl border bg-background p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Người dùng phụ trách
                </p>
                <p className="mt-1 font-medium">{selectedUsers.length}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="text-lg font-semibold">Trách nhiệm và tiêu chuẩn</h3>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra lại trách nhiệm nghiệp vụ và chứng nhận hoặc chứng chỉ áp dụng trước khi lưu.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.maTrachNhiem.map((item) => (
                <Badge
                  key={item}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-100"
                >
                  {layNhanTrachNhiem(item)}
                </Badge>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.maTieuChuan.length > 0 ? (
                formData.maTieuChuan.map((item) => (
                  <Badge
                    key={item}
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                  >
                    {standardOptions.find((option) => option.value === item)?.label ||
                      layNhanTieuChuan(item)}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Chưa gắn chứng nhận hoặc chứng chỉ chuyên biệt.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-4 md:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              <div>
                <h3 className="text-lg font-semibold">Người dùng phụ trách</h3>
                <p className="text-sm text-muted-foreground">
                  Danh sách nhân sự sẽ nhận vai trò ngay sau khi lưu.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {selectedUsers.length > 0 ? (
                selectedUsers.map((nguoiDung) => (
                  <div key={nguoiDung.id} className="rounded-xl border bg-background p-3">
                    <p className="font-medium">{nguoiDung.hoTen}</p>
                    <p className="text-sm text-muted-foreground">
                      {nguoiDung.chucDanh} • {nguoiDung.donVi}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
                  Chưa có người dùng nào được gán cho vai trò này.
                </div>
              )}
            </div>
          </section>

          {validationSummary.loi.length > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Chưa thể lưu vai trò</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationSummary.loi.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Sẵn sàng lưu cấu hình</AlertTitle>
              <AlertDescription>
                Dữ liệu bắt buộc đã đầy đủ. Bạn có thể hoàn tất để lưu vai trò vào hệ thống.
              </AlertDescription>
            </Alert>
          )}

          {validationSummary.canhBao.length > 0 ? (
            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Cảnh báo cần lưu ý</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {validationSummary.canhBao.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      ),
    },
  ];
}
