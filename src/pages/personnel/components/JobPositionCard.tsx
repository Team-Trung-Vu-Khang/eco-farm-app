import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { PersonnelFormValues } from "../data/personnel-form.schema";
import {
  useFarmDepartmentOptions,
  useFarmPositionOptions,
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

  const { items: departmentOptionsList } = useFarmDepartmentOptions({
    workspaceId: parsedWorkspaceId,
    params: {
      size: 100,
    },
  });

  const { items: positionOptionsList } = useFarmPositionOptions({
    workspaceId: parsedWorkspaceId,
    params: {
      size: 100,
    },
  });

  const departmentOptions = useMemo(
    () =>
      departmentOptionsList.map((dep) => ({
        label: dep.name,
        value: `${dep.source}_${dep.id}`,
      })),
    [departmentOptionsList],
  );

  const positionOptions = useMemo(
    () =>
      positionOptionsList.map((pos) => ({
        label: pos.name,
        value: `${pos.source}_${pos.id}`,
      })),
    [positionOptionsList],
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
                <FormControl>
                  <Combobox
                    options={departmentOptions}
                    value={field.value ?? ""}
                    onChange={(val) => {
                      field.onChange(val);
                      if (val) {
                        const [type] = val.split("_");
                        setValue("departmentType", type as any, {
                          shouldValidate: true,
                        });
                      } else {
                        setValue("departmentType", undefined, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    placeholder="Chọn phòng ban"
                    searchPlaceholder="Tìm phòng ban..."
                    emptyText="Không tìm thấy phòng ban nào"
                  />
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
                    onChange={(val) => {
                      field.onChange(val);
                      if (val) {
                        const [type] = val.split("_");
                        setValue("positionType", type as any, {
                          shouldValidate: true,
                        });
                      } else {
                        setValue("positionType", undefined, {
                          shouldValidate: true,
                        });
                      }
                    }}
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
