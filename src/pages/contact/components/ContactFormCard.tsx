import { BranchEnterpriseSelector } from "@/pages/branch/components/steps/BranchEnterpriseSelector";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import type { ContactGroupRecord } from "@/features/contact-group";
import type {
  FarmDepartmentResponse,
  PositionOptionResponse,
} from "@/features/master-data";
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type {
  ContactFormInput,
  ContactFormValues,
} from "../data/contact-form.schema";

interface ContactFormProps {
  control: Control<ContactFormInput, unknown, ContactFormValues>;
  errors: FieldErrors<ContactFormInput>;
  enterprises: Enterprise[];
  groups: ContactGroupRecord[];
  departments: FarmDepartmentResponse[];
  positions: PositionOptionResponse[];
  showStatus?: boolean;
}

export function ContactFormCard({
  control,
  errors,
  enterprises,
  groups,
  departments,
  positions,
  showStatus = false,
}: ContactFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin liên hệ</CardTitle>
        <CardDescription>
          Chi tiết thông tin cá nhân và công việc
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="entityName" required>
            Đơn vị sở hữu
          </Label>
          <Controller
            control={control}
            name="entityName"
            render={({ field }) => (
              <>
                <BranchEnterpriseSelector
                  enterprises={enterprises}
                  selectedId={
                    enterprises.find(
                      (enterprise) => enterprise.name === (field.value ?? ""),
                    )?.id.toString() || ""
                  }
                  onSelect={(value) => {
                    const enterprise = enterprises.find(
                      (item) => item.id.toString() === value,
                    );
                    field.onChange(enterprise?.name || "");
                  }}
                />
                {errors.entityName ? (
                  <p className="text-xs text-red-600">
                    {errors.entityName.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupId">Nhóm danh bạ</Label>
          <Controller
            control={control}
            name="groupId"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="groupId">
                  <SelectValue placeholder="Chọn nhóm danh bạ" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban</Label>
            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Chức vụ</Label>
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.name}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {showStatus ? (
          <div className="space-y-2">
            <Label htmlFor="status" required>
              Trạng thái
            </Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value ?? "active"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="status" aria-invalid={!!errors.status}>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status ? (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="fullName" required>
            Họ và tên
          </Label>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <Input
                id="fullName"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Nhập họ và tên"
                aria-invalid={!!errors.fullName}
              />
            )}
          />
          {errors.fullName ? (
            <p className="text-xs text-red-600">{errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" required>
              Số điện thoại
            </Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="phone"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="0901234567"
                  aria-invalid={!!errors.phone}
                />
              )}
            />
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="contact@example.com"
                  aria-invalid={!!errors.email}
                />
              )}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea
                id="note"
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Ghi chú thêm..."
                rows={3}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
