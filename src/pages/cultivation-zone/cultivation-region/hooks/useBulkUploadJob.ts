import { useQuery } from "@tanstack/react-query";
import {
  plantIdentificationApi,
  type BulkUploadJobStatus,
} from "@/features/farm";

export const RUNNING_STATUSES: BulkUploadJobStatus[] = [
  "STARTING",
  "STARTED",
  "STOPPING",
];

/** Poll trạng thái job upload — dùng chung cache giữa panel và form */
export function useBulkUploadJob(jobId: number | null) {
  const statusQuery = useQuery({
    queryKey: ["plant-identification-bulk-upload", jobId],
    queryFn: () => plantIdentificationApi.getBulkUploadStatus(jobId!),
    enabled: jobId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || RUNNING_STATUSES.includes(status) ? 2000 : false;
    },
  });

  const job = statusQuery.data;
  const isDone =
    statusQuery.isError || (!!job && !RUNNING_STATUSES.includes(job.status));
  // Job COMPLETED vẫn có thể lỗi 1 phần — chỉ coi là xong khi có dòng thành công
  const isSucceeded =
    !statusQuery.isError &&
    job?.status === "COMPLETED" &&
    !!job.result?.successRows;

  return { statusQuery, job, isDone, isSucceeded };
}
