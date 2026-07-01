import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmTeamApi } from "../api/farm-master-data.api";
import { farmTeamKeys } from "./useFarmTeams";
import type {
  FarmTeamRequest,
  FarmTeamResponse,
} from "../types/farm-master-data.type";

export function useFarmTeamMutations(workspaceId?: number) {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: farmTeamKeys.all() });

  const createTeam = useMutation<
    FarmTeamResponse,
    Error,
    FarmTeamRequest
  >({
    mutationFn: (data) => farmTeamApi.create(data, workspaceId),
    onSuccess: invalidateList,
  });

  const updateTeam = useMutation<
    FarmTeamResponse,
    Error,
    { id: number; data: FarmTeamRequest }
  >({
    mutationFn: ({ id, data }) => farmTeamApi.update(id, data, workspaceId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmTeamKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmTeamKeys.detail(id, workspaceId),
      });
    },
  });

  const deleteTeam = useMutation<void, Error, number>({
    mutationFn: (id) => farmTeamApi.delete(id, workspaceId).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTeam, updateTeam, deleteTeam };
}
