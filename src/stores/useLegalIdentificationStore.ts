import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  createEmptyLegalDocuments,
  createSampleLegalIdentificationRecords,
  type LegalFileGroupId,
  type LegalIdentificationFileMeta,
  type LegalIdentificationRecord,
} from "@/pages/legal-identification/data/constants";

interface LegalIdentificationDraftInput {
  code: string;
  name: string;
  scopeSelections: LegalIdentificationRecord["scopeSelections"];
  regionName: string;
  areaName: string;
  address: string;
  ownerName: string;
  note?: string;
  status: LegalIdentificationRecord["status"];
  documents: Record<LegalFileGroupId, LegalIdentificationFileMeta[]>;
}

interface LegalIdentificationState {
  records: LegalIdentificationRecord[];
  getRecordById: (id: number) => LegalIdentificationRecord | undefined;
  addRecord: (record: LegalIdentificationDraftInput) => LegalIdentificationRecord;
  updateRecord: (
    id: number,
    record: Partial<LegalIdentificationDraftInput>,
  ) => void;
  deleteRecord: (id: number) => void;
  reset: () => void;
}

const initialRecords = createSampleLegalIdentificationRecords();

const useLegalIdentificationStore = create<LegalIdentificationState>()(
  devtools(
    persist(
      (set, get) => ({
        records: initialRecords,

        getRecordById: (id) => get().records.find((record) => record.id === id),

        addRecord: (record) => {
          const nextId = Math.max(0, ...get().records.map((item) => item.id)) + 1;
          const now = new Date().toISOString();
          const createdRecord: LegalIdentificationRecord = {
            ...record,
            id: nextId,
            createdAt: now,
            updatedAt: now,
          };

          set(
            (state) => ({ records: [createdRecord, ...state.records] }),
            false,
            "addLegalIdentificationRecord",
          );

          return createdRecord;
        },

        updateRecord: (id, record) => {
          set(
            (state) => ({
              records: state.records.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      ...record,
                      documents:
                        record.documents ?? item.documents ?? createEmptyLegalDocuments(),
                      updatedAt: new Date().toISOString(),
                    }
                  : item,
              ),
            }),
            false,
            "updateLegalIdentificationRecord",
          );
        },

        deleteRecord: (id) => {
          set(
            (state) => ({
              records: state.records.filter((item) => item.id !== id),
            }),
            false,
            "deleteLegalIdentificationRecord",
          );
        },

        reset: () => {
          set(
            { records: initialRecords },
            false,
            "resetLegalIdentificationRecords",
          );
        },
      }),
      {
        name: "legal-identification-storage",
        partialize: (state) => ({ records: state.records }),
      },
    ),
    { name: "LegalIdentificationStore" },
  ),
);

export default useLegalIdentificationStore;
