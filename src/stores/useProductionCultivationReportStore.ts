import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  ReportJob,
  ReportJobStatus,
  ReportRequest,
  ReportResult,
} from "@/pages/production-cultivation-report/types";

interface ProductionCultivationReportState {
  jobs: ReportJob[];
  results: ReportResult[];
  activeJobId: string | null;
  createJob: (request: ReportRequest) => string;
  setActiveJob: (id: string) => void;
  updateJob: (
    id: string,
    updates: Partial<
      Pick<ReportJob, "status" | "progress" | "resultId" | "error" | "completedAt">
    >,
  ) => void;
  completeJob: (id: string, result: ReportResult) => void;
  failJob: (id: string, error: string) => void;
  getResultById: (id: string) => ReportResult | undefined;
  getActiveResult: () => ReportResult | undefined;
  clearHistory: () => void;
}

function createJobId() {
  return `job-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

const useProductionCultivationReportStore =
  create<ProductionCultivationReportState>()(
    devtools(
      persist(
        (set, get) => ({
          jobs: [],
          results: [],
          activeJobId: null,

          createJob: (request) => {
            const id = createJobId();
            const job: ReportJob = {
              id,
              request,
              status: "queued",
              progress: 10,
              createdAt: new Date().toISOString(),
            };

            set(
              (state) => ({
                jobs: [job, ...state.jobs].slice(0, 12),
                activeJobId: id,
              }),
              false,
              "createReportJob",
            );

            return id;
          },

          setActiveJob: (id) => {
            set({ activeJobId: id }, false, "setActiveReportJob");
          },

          updateJob: (id, updates) => {
            set(
              (state) => ({
                jobs: state.jobs.map((job) =>
                  job.id === id ? { ...job, ...updates } : job,
                ),
              }),
              false,
              "updateReportJob",
            );
          },

          completeJob: (id, result) => {
            set(
              (state) => ({
                results: [result, ...state.results].slice(0, 12),
                jobs: state.jobs.map((job) =>
                  job.id === id
                    ? {
                        ...job,
                        status: "completed" as ReportJobStatus,
                        progress: 100,
                        resultId: result.id,
                        completedAt: new Date().toISOString(),
                      }
                    : job,
                ),
                activeJobId: id,
              }),
              false,
              "completeReportJob",
            );
          },

          failJob: (id, error) => {
            set(
              (state) => ({
                jobs: state.jobs.map((job) =>
                  job.id === id
                    ? {
                        ...job,
                        status: "failed" as ReportJobStatus,
                        progress: 100,
                        error,
                        completedAt: new Date().toISOString(),
                      }
                    : job,
                ),
                activeJobId: id,
              }),
              false,
              "failReportJob",
            );
          },

          getResultById: (id) => get().results.find((result) => result.id === id),

          getActiveResult: () => {
            const activeJob = get().jobs.find((job) => job.id === get().activeJobId);
            if (!activeJob?.resultId) return undefined;
            return get().results.find((result) => result.id === activeJob.resultId);
          },

          clearHistory: () => {
            set(
              {
                jobs: [],
                results: [],
                activeJobId: null,
              },
              false,
              "clearReportHistory",
            );
          },
        }),
        {
          name: "production-cultivation-report-storage",
          partialize: (state) => ({
            jobs: state.jobs,
            results: state.results,
            activeJobId: state.activeJobId,
          }),
        },
      ),
      { name: "ProductionCultivationReportStore" },
    ),
  );

export default useProductionCultivationReportStore;
