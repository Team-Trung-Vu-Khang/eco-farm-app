import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React, { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";
import {
  useFarmDepartmentOptions,
  useFarmPositionOptions,
  useMasterData,
  useFarmTeams,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";

export function JobPositionCard() {
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { items: teams } = useFarmTeams({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });

  const { control, setValue } = useFormContext<PersonnelFormValues>();

  const positionType = useWatch({ control, name: "positionType" });
  const departmentType = useWatch({ control, name: "departmentType" });

  const { items: farmDepartments } = useFarmDepartmentOptions({
    workspaceId: parsedWorkspaceId,
    params: {
      size: 100,
    },
    enabled: departmentType === "OWNER",
  });

  const { items: masterDepartments } = useMasterData("departments", {
    params: { status: "active", size: 100 },
    enabled: departmentType === "MASTER",
  });

  const { items: masterPositions } = useMasterData("positions", {
    params: { status: "active", size: 100 },
    enabled: positionType === "MASTER",
  });

  const { items: ownerPositions } = useFarmPositionOptions({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });

  const _departments = React.useMemo(() => {
    return farmDepartments.filter((item) => item.source === "OWNER");
  }, [farmDepartments]);

  const departments =
    departmentType === "MASTER" ? masterDepartments : _departments;

  const positions = React.useMemo(() => {
    if (positionType === "MASTER") {
      return masterPositions;
    }

    if (positionType === "OWNER") {
      return ownerPositions.filter((item) => item.source === "OWNER");
    }

    return [];
  }, [positionType, masterPositions, ownerPositions]);

  const departmentOptions = useMemo(
    () =>
      departments.map((dep) => ({
        label: dep.name,
        value: dep.id.toString(),
      })),
    [departments],
  );

  const positionOptions = useMemo(
    () =>
      positions.map((pos) => ({
        label: pos.name,
        value: pos.id.toString(),
      })),
    [positions],
  );

  const teamOptions = useMemo(
    () =>
      teams.map((t) => ({
        label: t.name,
        value: t.id.toString(),
      })),
    [teams],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Công việc & Chức vụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="departmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phòng ban</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("department", "", { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Nội bộ (OWNER)</SelectItem>
                      <SelectItem value="MASTER">Khác (MASTER)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
                <FormControl>
                  <Combobox
                    options={departmentOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Chọn phòng ban"
                    searchPlaceholder="Tìm phòng ban..."
                    emptyText="Không tìm thấy phòng ban nào"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="positionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại chức vụ</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("position", "", { shouldValidate: true });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại chức vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNER">Nội bộ (OWNER)</SelectItem>
                      <SelectItem value="MASTER">Khác (MASTER)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức vụ</FormLabel>
                <FormControl>
                  <Combobox
                    options={positionOptions}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Chọn chức vụ"
                    searchPlaceholder="Tìm chức vụ..."
                    emptyText="Không tìm thấy chức vụ nào"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đội / Nhóm</FormLabel>
              <FormControl>
                <Combobox
                  options={teamOptions}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Chọn Đội / Nhóm"
                  searchPlaceholder="Tìm đội nhóm..."
                  emptyText="Không tìm thấy đội nhóm nào"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
