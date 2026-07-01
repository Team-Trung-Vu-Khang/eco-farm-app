import {
  useFarmDepartments,
  useFarmPersonnel,
  useFarmTeamMutations,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import {
  emptyTeamFormValues,
  teamFormSchema,
  type TeamFormValues,
} from "../data/team-form.schema";

export function useTeamCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { createTeam } = useFarmTeamMutations(parsedWorkspaceId);

  const farmDepartmentsQuery = useFarmDepartments({
    workspaceId: parsedWorkspaceId,
    params: { status: "active", size: 100 },
  });

  const farmPersonnelQuery = useFarmPersonnel({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });

  const departmentOptions = useMemo(() => {
    return farmDepartmentsQuery.items.map((d) => ({
      label: d.name,
      value: String(d.id),
    }));
  }, [farmDepartmentsQuery.items]);

  const leaderOptions = useMemo(() => {
    return farmPersonnelQuery.items.map((p) => ({
      label: p.fullName || p.name || "",
      value: String(p.id),
    }));
  }, [farmPersonnelQuery.items]);

  const {
    control,
    handleSubmit: handleRHFSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: emptyTeamFormValues,
    resolver: zodResolver(teamFormSchema),
  });

  const onSubmit = async (values: TeamFormValues) => {
    try {
      const departmentId = values.department?.trim()
        ? Number(values.department)
        : undefined;
      const leaderId = values.leader?.trim()
        ? Number(values.leader)
        : undefined;

      await createTeam.mutateAsync({
        code: values.code.trim().toUpperCase(),
        name: values.name.trim(),
        departmentId,
        leaderId,
        description: values?.description?.trim() || undefined,
        status: values.status,
      });

      toast({
        title: "Thành công",
        description: `Đã tạo đội nhóm "${values.name}"`,
      });
      setLocation("/team");
    } catch (error) {
      toast({
        title: "Không thể tạo",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  return {
    control,
    errors,
    clearErrors,
    departmentOptions,
    leaderOptions,
    goBack: () => setLocation("/team"),
    isSubmitting: createTeam.isPending,
    handleSubmit: handleRHFSubmit(onSubmit),
  };
}
