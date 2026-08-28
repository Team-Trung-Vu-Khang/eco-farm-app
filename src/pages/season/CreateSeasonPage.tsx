import { useSeasonMutations } from "@/features/master-data/hooks/useSeasons";
import { safeConvertLexicalToHtml } from "@/utils/commons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Fish,
  Loader2,
  PawPrint,
  TreeDeciduous,
} from "lucide-react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "wouter";
import {
  useProductionSubjects,
  useProductionSubjectVariants,
} from "../../features/foundation";
import { useFileUpload } from "../../features/storage";
import { AnimalGrowthCycleSteps } from "../animal-husbandry-zone/animal-growth-cycle/components/AnimalGrowthCycleSteps";
import { animalGrowthCycleFormSchema } from "../animal-husbandry-zone/animal-growth-cycle/schemas/animalGrowthCycleSchema";
import { AquacultureGrowthCycleSteps } from "../aquaculture-growth-cycle/components/AquacultureGrowthCycleSteps";
import { GrowthCycleSteps } from "../growth-cycle/components/GrowthCycleSteps";
import { growthCycleFormSchema } from "../growth-cycle/schemas/growthCycleSchema";
import { parseDurationToDays } from "../growth-cycle/utils/duration";

export default function CreateSeasonPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { createSeason } = useSeasonMutations();
  const { uploadFile } = useFileUpload();

  const [selectedDomain, setSelectedDomain] = useState<
    "CROP" | "LIVESTOCK" | "AQUACULTURE"
  >("CROP");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load CROP subjects & variants
  const { items: cropSubjects } = useProductionSubjects({
    params: { domainCode: "CROP", size: 100 },
    enabled: selectedDomain === "CROP",
  });
  const { items: cropVariants } = useProductionSubjectVariants({
    params: { domainCode: "CROP", size: 100 },
    enabled: selectedDomain === "CROP",
  });

  // Load LIVESTOCK subjects & variants
  const { items: livestockSubjects } = useProductionSubjects({
    params: { domainCode: "LIVESTOCK", size: 100 },
    enabled: selectedDomain === "LIVESTOCK",
  });
  const { items: livestockVariants } = useProductionSubjectVariants({
    params: { domainCode: "LIVESTOCK", size: 100 },
    enabled: selectedDomain === "LIVESTOCK",
  });

  // Load AQUACULTURE subjects & variants
  const { items: aquacultureSubjects } = useProductionSubjects({
    params: { domainCode: "AQUACULTURE", size: 100 },
    enabled: selectedDomain === "AQUACULTURE",
  });
  const { items: aquacultureVarieties } = useProductionSubjectVariants({
    params: { domainCode: "AQUACULTURE", size: 100 },
    enabled: selectedDomain === "AQUACULTURE",
  });

  const activeSchema =
    selectedDomain === "CROP"
      ? growthCycleFormSchema
      : animalGrowthCycleFormSchema;

  const form = useForm<any>({
    resolver: zodResolver(activeSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      groupIds: [],
      cropIds: [],
      varietyIds: [],
      totalDays: 0,
      scope: "crop",
      cycleType: selectedDomain === "CROP" ? "plant" : "animal",
      stages: [
        {
          id: "1",
          content: "",
          duration: "",
          usePdf: false,
          name: "Giai đoạn 1",
        },
      ],
    },
  });

  const { watch, reset, handleSubmit } = form;
  const watchedScope = watch("scope");
  const watchedCropIds = watch("cropIds") || [];
  const watchedVarietyIds = watch("varietyIds") || [];
  const watchedStages = watch("stages") || [];

  const totalDays = useMemo(
    () =>
      watchedStages.reduce(
        (sum: number, stage: any) =>
          sum + parseDurationToDays(String(stage.duration)),
        0,
      ),
    [watchedStages],
  );

  const handleDomainChange = (domain: "CROP" | "LIVESTOCK" | "AQUACULTURE") => {
    setSelectedDomain(domain);
    reset({
      name: "",
      groupIds: [],
      cropIds: [],
      varietyIds: [],
      totalDays: 0,
      scope: "crop",
      cycleType: domain === "CROP" ? "plant" : "animal",
      stages: [
        {
          id: "1",
          content: "",
          duration: "",
          usePdf: false,
          name: "Giai đoạn 1",
        },
      ],
    });
  };

  const handleComplete = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Upload PDFs and prepare stages
      const preparedStages = await Promise.all(
        values.stages.map(async (stage: any, index: number) => {
          let documents: any[] = [];
          let description = "";

          if (stage.usePdf && stage.pdfFile instanceof File) {
            const res = await uploadFile.mutateAsync({
              file: stage.pdfFile,
              folder: "season-stages",
            });
            if (res.fileUrl) {
              documents = [
                {
                  documentType: "pdf",
                  name: stage.pdfFile.name,
                  fileUrl: res.fileUrl,
                  fileName: res.fileName || stage.pdfFile.name,
                  mimeType: "application/pdf",
                  sizeBytes: stage.pdfFile.size,
                  displayOrder: 1,
                },
              ];
            }
          } else {
            description = (await safeConvertLexicalToHtml(stage.content)) || "";
          }

          return {
            name: stage.name,
            durationDays: parseDurationToDays(String(stage.duration)),
            description: description,
            documents: documents,
            displayOrder: index + 1,
          };
        }),
      );

      let scopeType: "SUBJECT_GROUP" | "SUBJECT" | "SUBJECT_VARIANT" = "SUBJECT";
      let productionSubjectGroupIds: number[] = [];
      let productionSubjectIds: number[] = [];
      let productionSubjectVariantIds: number[] = [];

      if (values.scope === "variety") {
        scopeType = "SUBJECT_VARIANT";
        const activeVarietyId = values.varietyIds?.[0];
        if (activeVarietyId) {
          productionSubjectVariantIds = [Number(activeVarietyId)];
          const list =
            selectedDomain === "CROP"
              ? cropVariants
              : selectedDomain === "LIVESTOCK"
                ? livestockVariants
                : aquacultureVarieties;
          const matched = list.find((v) => String(v.id) === activeVarietyId);
          if (matched) {
            const subjectId = Number(
              matched.subject?.id ??
                // fallback for stale data
                // @ts-ignore
                (matched.subjectId as unknown as string) ??
                // fallback for stale data
                // @ts-ignore
                (matched.cropId as unknown as string),
            );
            if (subjectId) {
              productionSubjectIds = [subjectId];
            }
          }
        }
      } else if (values.scope === "group") {
        scopeType = "SUBJECT_GROUP";
        productionSubjectGroupIds = values.groupIds ? values.groupIds.map(Number) : [];
      } else {
        scopeType = "SUBJECT";
        productionSubjectIds = values.cropIds ? values.cropIds.map(Number) : [];
      }

      const domainDescriptions = {
        CROP: "Mùa vụ trồng trọt",
        LIVESTOCK: "Mùa vụ chăn nuôi",
        AQUACULTURE: "Mùa vụ nuôi thủy sản",
      };

      await createSeason.mutateAsync({
        domainCode: selectedDomain,
        name: values.name.trim(),
        scopeType,
        productionSubjectGroupIds,
        productionSubjectIds,
        productionSubjectVariantIds,
        description: domainDescriptions[selectedDomain],
        stages: preparedStages,
        displayOrder: 1,
        status: "active",
      });

      toast({ title: "Thành công", description: "Đã tạo mùa vụ mới" });
      setLocation("/season");
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể tạo mùa vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  // Helper selectors for summary dialog names
  const getSelectedSubjectName = () => {
    if (watchedCropIds.length === 0) return "-";
    const subjects =
      selectedDomain === "CROP"
        ? cropSubjects
        : selectedDomain === "LIVESTOCK"
          ? livestockSubjects
          : aquacultureSubjects;
    return watchedCropIds
      .map((id) => subjects.find((c) => String(c.id) === id)?.name || id)
      .join(", ");
  };

  const getSelectedVarietyName = () => {
    if (watchedVarietyIds.length === 0) return "-";
    const varieties =
      selectedDomain === "CROP"
        ? cropVariants
        : selectedDomain === "LIVESTOCK"
          ? livestockVariants
          : aquacultureVarieties;
    return watchedVarietyIds
      .map((id) => varieties.find((v) => String(v.id) === id)?.name || id)
      .join(", ");
  };

  const domainTitles = {
    CROP: {
      title: "Khởi tạo chu kỳ sinh trưởng",
      description:
        "Thiết lập thông tin quá trình sinh trưởng qua các giai đoạn canh tác",
    },
    LIVESTOCK: {
      title: "Khởi tạo chu kỳ sinh trưởng",
      description:
        "Thiết lập thông tin quá trình sinh trưởng qua các giai đoạn chăn nuôi",
    },
    AQUACULTURE: {
      title: "Khởi tạo chu kỳ sinh trưởng",
      description:
        "Thiết lập thông tin quá trình sinh trưởng qua các giai đoạn nuôi trồng thủy sản",
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setLocation("/season")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {domainTitles[selectedDomain].title}
            </h1>
            <p className="text-muted-foreground">
              {domainTitles[selectedDomain].description}
            </p>
          </div>
        </div>

        <Tabs
          value={selectedDomain}
          onValueChange={(val) => handleDomainChange(val as any)}
          className="w-auto"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="CROP" className="gap-1.5 text-xs">
              <TreeDeciduous className="w-3.5 h-3.5" />
              Vụ mùa
            </TabsTrigger>
            <TabsTrigger value="LIVESTOCK" className="gap-1.5 text-xs">
              <PawPrint className="w-3.5 h-3.5" />
              Vụ nuôi
            </TabsTrigger>
            <TabsTrigger value="AQUACULTURE" className="gap-1.5 text-xs">
              <Fish className="w-3.5 h-3.5" />
              Thủy sản
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            {selectedDomain === "CROP" && (
              <GrowthCycleSteps
                schema={growthCycleFormSchema}
                varieties={cropVariants}
                crops={cropSubjects}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
            {selectedDomain === "LIVESTOCK" && (
              <AnimalGrowthCycleSteps
                schema={animalGrowthCycleFormSchema}
                varieties={livestockVariants}
                crops={livestockSubjects}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
            {selectedDomain === "AQUACULTURE" && (
              <AquacultureGrowthCycleSteps
                schema={animalGrowthCycleFormSchema}
                onComplete={() => setConfirmOpen(true)}
                onCancel={() => setLocation("/season")}
                isSubmitting={isSubmitting}
              />
            )}
          </FormProvider>
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => !isSubmitting && setConfirmOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận tạo mùa vụ</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>Bạn có chắc chắn muốn thêm mùa vụ mới này?</p>
                <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Loại mùa vụ:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedDomain === "CROP"
                        ? "Trồng trọt"
                        : selectedDomain === "LIVESTOCK"
                          ? "Chăn nuôi"
                          : "Nuôi trồng thủy sản"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Phạm vi:</span>
                    <span className="font-medium">
                      {watchedScope === "crop"
                        ? "Theo đối tượng"
                        : "Theo giống / dòng"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Đối tượng:</span>
                    <span className="font-medium">
                      {getSelectedSubjectName() || "-"}
                    </span>
                  </div>
                  {watchedScope === "variety" && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Giống / dòng:
                      </span>
                      <span className="font-medium">
                        {getSelectedVarietyName() || "-"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Số giai đoạn:</span>
                    <span className="font-medium">{watchedStages.length}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Tổng thời gian:
                    </span>
                    <span className="font-medium">{totalDays} ngày</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(handleComplete)();
              }}
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Xác nhận tạo mới
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
