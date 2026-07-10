import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Users } from "lucide-react";
import { useState } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { TeamFormValues } from "../data/team-form.schema";
import { LeaderSelectorDialog } from "./LeaderSelectorDialog";

interface TeamFormCardProps {
  control: Control<TeamFormValues>;
  errors: FieldErrors<TeamFormValues>;
  clearErrors: (name?: any) => void;
  departmentOptions?: { label: string; value: string }[];
  leaderOptions?: { label: string; value: string }[];
  isEdit?: boolean;
}

export function TeamFormCard({
  control,
  errors,
  clearErrors,
  departmentOptions = [],
  leaderOptions = [],
  isEdit = false,
}: TeamFormCardProps) {
  const [isLeaderDialogOpen, setIsLeaderDialogOpen] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đội nhóm</CardTitle>
        <CardDescription>
          Thiết lập thông tin cơ bản cho đội nhóm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {isEdit ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Mã đội</Label>
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <Input
                      id="code"
                      disabled={isEdit}
                      clearable={!isEdit}
                      placeholder="VD: TEAM-KD-01"
                      aria-invalid={!!errors.code}
                      value={field.value}
                      onChange={(e) => {
                        clearErrors("code");
                        field.onChange(e.target.value.toUpperCase());
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  )}
                />
                {errors.code ? (
                  <p className="text-xs text-red-600">{errors.code.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" required>
                  Tên đội nhóm
                </Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Nhập tên đội nhóm"
                      aria-invalid={!!errors.name}
                      value={field.value}
                      onChange={(e) => {
                        clearErrors("name");
                        field.onChange(e.target.value);
                      }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      name={field.name}
                    />
                  )}
                />
                {errors.name ? (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name" required>
                Tên đội nhóm
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    id="name"
                    placeholder="Nhập tên đội nhóm"
                    aria-invalid={!!errors.name}
                    value={field.value}
                    onChange={(e) => {
                      clearErrors("name");
                      field.onChange(e.target.value);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                  />
                )}
              />
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              ) : null}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Thuộc phòng ban</Label>
            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <Combobox
                  options={departmentOptions}
                  value={field.value ?? ""}
                  onChange={(value) => {
                    clearErrors("department");
                    field.onChange(value);
                  }}
                  placeholder="Chọn phòng ban"
                  searchPlaceholder="Tìm phòng ban..."
                  emptyText="Không tìm thấy phòng ban"
                />
              )}
            />
            {errors.department ? (
              <p className="text-xs text-red-600">
                {errors.department.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="leader">Trưởng nhóm</Label>
            <Controller
              control={control}
              name="leader"
              render={({ field }) => {
                const selectedLeaderOption = leaderOptions.find(
                  (opt) => opt.value === (field.value ?? ""),
                );
                const selectedLeaderLabel = selectedLeaderOption
                  ? selectedLeaderOption.label
                  : "Chọn trưởng nhóm";

                return (
                  <>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsLeaderDialogOpen(true)}
                        className="h-10 flex-1 justify-between border-slate-200 bg-white text-left font-normal hover:bg-slate-50"
                      >
                        <span className="truncate">{selectedLeaderLabel}</span>
                        <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </Button>
                      {field.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            clearErrors("leader");
                            field.onChange("");
                          }}
                          className="h-10 px-3 text-muted-foreground"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                    <LeaderSelectorDialog
                      open={isLeaderDialogOpen}
                      onOpenChange={setIsLeaderDialogOpen}
                      selectedId={field.value ? Number(field.value) : null}
                      onSelect={(personnel) => {
                        clearErrors("leader");
                        field.onChange(String(personnel.id));
                      }}
                    />
                  </>
                );
              }}
            />
            {errors.leader ? (
              <p className="text-xs text-red-600">{errors.leader.message}</p>
            ) : null}
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="status" required>
            Trạng thái
          </Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  clearErrors("status");
                  field.onChange(value);
                }}
              >
                <SelectTrigger id="status" aria-invalid={!!errors.status}>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status ? (
            <p className="text-xs text-red-600">{errors.status.message}</p>
          ) : null}
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Mô tả nhiệm vụ, chức năng của đội nhóm..."
                rows={4}
                aria-invalid={!!errors.description}
                value={field.value}
                onChange={(e) => {
                  clearErrors("description");
                  field.onChange(e.target.value);
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
          {errors.description ? (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
