import PageWrapper from "@/components/PageWrapper";
import { useRegions } from "@/features/farm/hooks/useRegions";
import {
  useCreateLegalIdentification,
  useLegalIdentificationById,
  useUpdateLegalIdentification,
} from "@/features/legal-identification";
import {
  mapLegalIdentificationRecordToUpsertRequest,
  mapLegalIdentificationResponseToRecord,
} from "@/pages/legal-identification/utils/legal-identification.mapper";
import {
  Button,
  StepperForm,
  useToast,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { LegalIdentificationFileGroup } from "./components/LegalIdentificationFileGroup";
import {
  LegalIdentificationInfoStep,
  type LegalIdentificationFormState,
} from "./components/LegalIdentificationInfoStep";
import { LegalIdentificationReviewStep } from "./components/LegalIdentificationReviewStep";
import {
  createEmptyLegalDocuments,
  LEGAL_FILE_GROUPS,
  type LegalFileGroupId,
  type LegalIdentificationFileMeta,
  type LegalIdentificationRecord,
} from "./data/constants";

const emptyFormValue: LegalIdentificationFormState = {
  name: "",
  scopeSelections: [],
  address: "",
  note: "",
  status: "draft",
};

function getFormValueFromRecord(
  record: LegalIdentificationRecord,
): LegalIdentificationFormState {
  return {
    name: record.name,
    scopeSelections: record.scopeSelections ?? [],
    address: record.address,
    note: record.note || "",
    status: record.status,
  };
}

function getDocumentsFromRecord(
  record?: LegalIdentificationRecord | null,
): Record<LegalFileGroupId, LegalIdentificationFileMeta[]> {
  if (!record) return createEmptyLegalDocuments();
  return {
    landProof: record.documents.landProof ?? [],
    boundaryProof: record.documents.boundaryProof ?? [],
    soilSuitability: record.documents.soilSuitability ?? [],
  };
}

function LegalIdentificationFormBody({
  isEditMode,
  onSave,
  onCancel,
  initialFormValue,
  initialDocuments,
  regions,
  initialCode,
  isSubmitting,
}: {
  isEditMode: boolean;
  onSave: (
    payload: Omit<LegalIdentificationRecord, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onCancel: () => void;
  initialFormValue: LegalIdentificationFormState;
  initialDocuments: Record<LegalFileGroupId, LegalIdentificationFileMeta[]>;
  initialCode: string;
  isSubmitting: boolean;
  regions: Array<{
    id: string | number;
    name: string;
  }>;
}) {
  const [formValue, setFormValue] =
    useState<LegalIdentificationFormState>(initialFormValue);
  const [documents, setDocuments] =
    useState<Record<LegalFileGroupId, LegalIdentificationFileMeta[]>>(
      initialDocuments,
    );

  useEffect(() => {
    setFormValue(initialFormValue);
  }, [initialFormValue]);

  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const updateFiles =
    (groupId: LegalFileGroupId) =>
    (nextFiles: LegalIdentificationFileMeta[]) => {
      setDocuments((prev) => ({ ...prev, [groupId]: nextFiles }));
    };

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin hồ sơ",
      description: "Vùng trồng và trạng thái",
      content: (
        <LegalIdentificationInfoStep
          value={formValue}
          regions={regions}
          showStatus={isEditMode}
          onChange={(nextValue) =>
            setFormValue((prev) => ({ ...prev, ...nextValue }))
          }
        />
      ),
      isValid:
        formValue.name.trim().length > 0 &&
        formValue.scopeSelections.length > 0 &&
        formValue.address.trim().length > 0,
    },
    {
      id: "land",
      title: "Giấy tờ pháp lý",
      description: "Hồ sơ chứng minh quyền sử dụng đất",
      content: (
        <LegalIdentificationFileGroup
          group={LEGAL_FILE_GROUPS[0]}
          files={documents.landProof}
          onChange={updateFiles("landProof")}
        />
      ),
      isValid: documents.landProof.length > 0,
    },
    {
      id: "boundary",
      title: "Đo đạc và ranh giới",
      description: "Tài liệu thể hiện ranh giới rõ ràng",
      content: (
        <LegalIdentificationFileGroup
          group={LEGAL_FILE_GROUPS[1]}
          files={documents.boundaryProof}
          onChange={updateFiles("boundaryProof")}
        />
      ),
      isValid: documents.boundaryProof.length > 0,
    },
    {
      id: "suitability",
      title: "Mục đích sử dụng",
      description: "Chứng minh đất phù hợp cho canh tác",
      content: (
        <LegalIdentificationFileGroup
          group={LEGAL_FILE_GROUPS[2]}
          files={documents.soilSuitability}
          onChange={updateFiles("soilSuitability")}
        />
      ),
      isValid: documents.soilSuitability.length > 0,
    },
    {
      id: "review",
      title: "Rà soát",
      description: "Xem lại trước khi lưu hồ sơ",
      content: (
        <LegalIdentificationReviewStep
          formValue={formValue}
          documents={documents}
        />
      ),
    },
  ];

  return (
    <StepperForm
      steps={steps}
      onComplete={() =>
        onSave({
          code: initialCode,
          ...formValue,
          documents,
        })
      }
      onCancel={onCancel}
      completeLabel={isEditMode ? "Lưu thay đổi" : "Tiến hành xét duyệt"}
    />
  );
}

export default function LegalIdentificationCreateEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items: regionItems } = useRegions({ params: { size: 100 } });
  const [matchEdit, paramsEdit] = useRoute("/legal-identification/:id/edit");
  const recordId = Number(paramsEdit?.id || 0);
  const isEditMode = Boolean(matchEdit && recordId > 0);

  const recordQuery = useLegalIdentificationById(recordId, {
    enabled: isEditMode,
  });

  const createMutation = useCreateLegalIdentification();
  const updateMutation = useUpdateLegalIdentification();

  const record = useMemo(
    () =>
      isEditMode && recordQuery.item
        ? mapLegalIdentificationResponseToRecord(recordQuery.item)
        : undefined,
    [isEditMode, recordQuery.item],
  );

  const initialFormValue = useMemo(
    () =>
      isEditMode && record ? getFormValueFromRecord(record) : emptyFormValue,
    [isEditMode, record],
  );
  const initialCode = useMemo(
    () => (isEditMode && record ? record.code : ""),
    [isEditMode, record],
  );
  const initialDocuments = useMemo(
    () => getDocumentsFromRecord(isEditMode ? record : undefined),
    [isEditMode, record],
  );
  const regionOptions = useMemo(
    () =>
      regionItems.map((region) => ({
        id: region.id,
        name: region.name ?? "",
      })),
    [regionItems],
  );

  const handleSave = async (
    payload: Omit<LegalIdentificationRecord, "id" | "createdAt" | "updatedAt">,
  ) => {
    const request = mapLegalIdentificationRecordToUpsertRequest(payload);

    try {
      if (isEditMode && record) {
        const updated = await updateMutation.updateLegalIdentification({
          id: record.id,
          payload: request,
        });

        toast({
          title: "Thành công",
          description: "Đã cập nhật hồ sơ pháp lý.",
        });
        setLocation(`/legal-identification/${updated.id}`);
        return;
      }

      const created = await createMutation.createLegalIdentification(request);
      toast({
        title: "Thành công",
        description: "Đã tạo mới hồ sơ pháp lý.",
      });
      setLocation(`/legal-identification/${created.id}`);
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể lưu hồ sơ pháp lý.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isEditMode && !recordQuery.loading && !recordQuery.item) {
      setLocation("/legal-identification");
    }
  }, [isEditMode, recordQuery.item, recordQuery.loading, setLocation]);

  if (isEditMode && recordQuery.loading) {
    return (
      <PageWrapper
        title="Đang tải hồ sơ pháp lý"
        description="Vui lòng chờ trong giây lát"
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-sm text-slate-500">
            Đang tải dữ liệu hồ sơ pháp lý...
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (isEditMode && !record) {
    return (
      <PageWrapper
        title="Không tìm thấy hồ sơ"
        description="Hồ sơ pháp lý không tồn tại hoặc đã bị xóa."
      >
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <div className="text-sm text-slate-500">
            Không tìm thấy hồ sơ pháp lý này.
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/legal-identification")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isEditMode ? "Cập nhật hồ sơ pháp lý" : "Khai báo sơ pháp lý"}
      description="Nhập thông tin theo từng bước để hoàn thiện bộ hồ sơ định danh pháp lý cho vùng trồng."
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/legal-identification")}
          className="border-slate-200 bg-white text-slate-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="mx-auto max-w-5xl pb-10">
        <LegalIdentificationFormBody
          key={`${isEditMode ? `edit-${record?.id ?? "missing"}` : "create"}`}
          isEditMode={isEditMode}
          onSave={handleSave}
          onCancel={() => setLocation("/legal-identification")}
          initialFormValue={initialFormValue}
          initialDocuments={initialDocuments}
          initialCode={initialCode}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          regions={regionOptions}
        />
      </div>
    </PageWrapper>
  );
}
