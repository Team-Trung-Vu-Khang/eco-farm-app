import { useRegions } from "@/features/farm/hooks/useRegions";
import {
  useOrganizations,
  type OrganizationRecord,
} from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import useLegalIdentificationStore from "@/stores/useLegalIdentificationStore";
import {
  AdminLayout,
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

function mapOrganizationToEnterprise(
  organization: OrganizationRecord,
): Enterprise {
  return {
    id: Number(organization.id),
    code: organization.code,
    name: organization.name,
    image: organization.imageUrl || undefined,
    type: "enterprise",
    classification: ["other"],
    taxCode: organization.taxCode || "",
    address: organization.address || "",
    phone: organization.contacts?.[0]?.phone || "",
    email: organization.contacts?.[0]?.email || "",
    status: organization.status === "inactive" ? "inactive" : "active",
    createdAt: organization.createdAt || new Date().toISOString(),
    brandName: organization.brandName,
    representative: organization.representative,
    foundedDate: organization.foundedDate,
    website: organization.website,
    province: organization.province,
    district: organization.district,
    ward: organization.ward,
    latitude: organization.latitude,
    longitude: organization.longitude,
    taxAddress: organization.taxAddress,
    taxAuthority: organization.taxAuthority,
    issueDate: organization.issueDate,
    description: organization.description,
    contacts: [],
    branches: [],
    bankAccounts: [],
    documents: [],
  };
}

const emptyFormValue: LegalIdentificationFormState = {
  code: "",
  name: "",
  scopeSelections: [],
  regionName: "",
  areaName: "",
  address: "",
  ownerName: "",
  note: "",
  status: "draft",
};

function getFormValueFromRecord(
  record: LegalIdentificationRecord,
): LegalIdentificationFormState {
  return {
    code: record.code,
    name: record.name,
    scopeSelections: record.scopeSelections ?? [],
    regionName: record.regionName,
    areaName: record.areaName,
    address: record.address,
    ownerName: record.ownerName,
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
  enterprises,
  regions,
}: {
  isEditMode: boolean;
  onSave: (
    payload: Omit<LegalIdentificationRecord, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onCancel: () => void;
  initialFormValue: LegalIdentificationFormState;
  initialDocuments: Record<LegalFileGroupId, LegalIdentificationFileMeta[]>;
  enterprises: Enterprise[];
  regions: Array<{
    id: string | number;
    name: string;
    enterpriseId?: string;
  }>;
}) {
  const [formValue, setFormValue] =
    useState<LegalIdentificationFormState>(initialFormValue);
  const [documents, setDocuments] =
    useState<Record<LegalFileGroupId, LegalIdentificationFileMeta[]>>(
      initialDocuments,
    );

  const updateFiles =
    (groupId: LegalFileGroupId) =>
    (nextFiles: LegalIdentificationFileMeta[]) => {
      setDocuments((prev) => ({ ...prev, [groupId]: nextFiles }));
    };

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin hồ sơ",
      description: "Mã, vùng trồng, khu vực và trạng thái",
      content: (
        <LegalIdentificationInfoStep
          value={formValue}
          enterprises={enterprises}
          regions={regions}
          showStatus={isEditMode}
          onChange={(nextValue) =>
            setFormValue((prev) => ({ ...prev, ...nextValue }))
          }
        />
      ),
      isValid:
        formValue.code.trim().length > 0 &&
        formValue.name.trim().length > 0 &&
        formValue.scopeSelections.length > 0 &&
        formValue.regionName.trim().length > 0 &&
        formValue.areaName.trim().length > 0 &&
        formValue.address.trim().length > 0 &&
        formValue.ownerName.trim().length > 0,
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
          ...formValue,
          documents,
        })
      }
      onCancel={onCancel}
      completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo hồ sơ"}
    />
  );
}

export default function LegalIdentificationCreateEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addRecord, updateRecord, getRecordById } =
    useLegalIdentificationStore();
  const { items: regionItems } = useRegions({ params: { size: 100 } });
  const workspaceId = useSelectedWorkspaceId();
  const organizationsQuery = useOrganizations(
    { type: "enterprise", page: 0, size: 100 },
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null,
    },
  );
  const [matchEdit, paramsEdit] = useRoute("/legal-identification/:id/edit");
  const recordId = Number(paramsEdit?.id || 0);
  const isEditMode = Boolean(matchEdit && recordId > 0);

  const record = useMemo(
    () => (isEditMode ? getRecordById(recordId) : undefined),
    [getRecordById, isEditMode, recordId],
  );

  const initialFormValue = useMemo(
    () =>
      isEditMode && record ? getFormValueFromRecord(record) : emptyFormValue,
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
        enterpriseId: region.metadataJson?.enterpriseId
          ? String(region.metadataJson.enterpriseId)
          : undefined,
      })),
    [regionItems],
  );
  const enterpriseOptions = useMemo(
    () =>
      organizationsQuery.items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(mapOrganizationToEnterprise),
    [organizationsQuery.items],
  );

  const handleSave = (
    payload: Omit<LegalIdentificationRecord, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (isEditMode && record) {
      updateRecord(record.id, payload);
      toast({
        title: "Thành công",
        description: "Đã cập nhật hồ sơ pháp lý.",
      });
      setLocation(`/legal-identification/${record.id}`);
      return;
    }

    const createdRecord = addRecord(payload);
    toast({
      title: "Thành công",
      description: "Đã tạo mới hồ sơ pháp lý.",
    });
    setLocation(`/legal-identification/${createdRecord.id}`);
  };

  useEffect(() => {
    if (matchEdit && recordId > 0 && !record) {
      setLocation("/legal-identification");
    }
  }, [matchEdit, record, recordId, setLocation]);

  return (
    <AdminLayout
      isDev={true}
      title={isEditMode ? "Chỉnh sửa hồ sơ pháp lý" : "Tạo hồ sơ pháp lý"}
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
          enterprises={enterpriseOptions}
          regions={regionOptions}
        />
      </div>
    </AdminLayout>
  );
}
