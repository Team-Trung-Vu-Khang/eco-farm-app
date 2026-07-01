import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { TEAM_STATUS_OPTIONS } from "../data/constants";
import type { TeamFormValues } from "../data/team-form.schema";

interface TeamFormCardProps {
  control: Control<TeamFormValues>;
  errors: FieldErrors<TeamFormValues>;
  clearErrors: (name?: any) => void;
  departmentOptions?: { label: string; value: string }[];
  leaderOptions?: { label: string; value: string }[];
}

export function TeamFormCard({
  control,
  errors,
  clearErrors,
  departmentOptions = [],
  leaderOptions = [],
}: TeamFormCardProps) {
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
          <div className="space-y-2">
            <Label htmlFor="code" required>
              Mã đội
            </Label>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Input
                  id="code"
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
              render={({ field }) => (
                <Combobox
                  options={leaderOptions}
                  value={field.value ?? ""}
                  onChange={(value) => {
                    clearErrors("leader");
                    field.onChange(value);
                  }}
                  placeholder="Chọn trưởng nhóm"
                  searchPlaceholder="Tìm trưởng nhóm..."
                  emptyText="Không tìm thấy trưởng nhóm"
                />
              )}
            />
            {errors.leader ? (
              <p className="text-xs text-red-600">{errors.leader.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
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
        </div>

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
