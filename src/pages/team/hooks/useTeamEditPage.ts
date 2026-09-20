import {
  useFarmPersonnel,
  useFarmTeamById,
  useFarmTeamMutations,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useRoute } from "wouter";
import {
  emptyTeamFormValues,
  teamFormSchema,
  type TeamFormValues,
} from "../data/team-form.schema";
import { getApiErrorMessage } from "@/shared/lib/api-error";

export function useTeamEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/team/:id/edit");
  const { toast } = useToast();
  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const id = params?.id ? Number(params.id) : 0;

  const { data: team, isLoading: isTeamLoading } = useFarmTeamById(id, {
    workspaceId: parsedWorkspaceId,
  });

  const { updateTeam } = useFarmTeamMutations(parsedWorkspaceId);

  const farmPersonnelQuery = useFarmPersonnel({
    workspaceId: parsedWorkspaceId,
    params: { size: 100 },
  });

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
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: emptyTeamFormValues,
    resolver: zodResolver(teamFormSchema),
  });

  useEffect(() => {
    if (team) {
      reset({
        code: team.code ?? "",
        name: team.name ?? "",
        department:
          typeof team.department === "object" && team.department?.id
            ? String(team.department.id)
            : "",
        leader:
          typeof team.leader === "object" && team.leader?.id
            ? String(team.leader.id)
            : "",
        description: team.description ?? "",
        status: (team.status as any) ?? "active",
      });
    }
  }, [team, reset]);

  const onSubmit = async (values: TeamFormValues) => {
    try {
      let departmentId: number | undefined = undefined;
      if (values.department?.trim()) {
        const parts = values.department.split("_");
        departmentId = parts[0] ? Number(parts[0]) : undefined;
      }
      const leaderId = values.leader?.trim()
        ? Number(values.leader)
        : undefined;

      await updateTeam.mutateAsync({
        id,
        data: {
          code: values.code?.trim().toUpperCase() || undefined,
          name: values.name.trim(),
          departmentId,
          leaderId,
          description: values?.description?.trim() || undefined,
          status: values.status,
        },
      });

      toast({
        title: "Thành công",
        description: `Đã cập nhật đội nhóm "${values.name}"`,
      });
      setLocation(`/team/${id}`);
    } catch (error) {
      toast({
        title: "Không thể cập nhật",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  return {
    control,
    errors,
    clearErrors,
    leaderOptions,
    isTeamLoading,
    goBack: () => setLocation(`/team/${id}`),
    isSubmitting: updateTeam.isPending,
    handleSubmit: handleRHFSubmit(onSubmit),
  };
}
