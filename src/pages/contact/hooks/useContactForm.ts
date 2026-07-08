import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useContactById,
  useDeleteContact,
  useUpdateContact,
} from "@/features/contact";
import { useContactGroups } from "@/features/contact-group";
import { useOrganizations } from "@/features/organization";
import {
  useFarmDepartmentOptions,
  useFarmPositionOptions,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { ContactUpdateRequest } from "@/features/contact";
import { emptyContactFormData } from "../data/constants";
import type { ContactFormData } from "../types/types";
import { mapOrganizationToEnterprise } from "../utils/mapOrganizationToEnterprise";

interface UseContactFormOptions {
  mode: "create" | "edit";
}

const normalizeContactFormStatus = (
  status: ContactFormData["status"] | string | undefined,
): ContactFormData["status"] => {
  return status === "inactive" ? "inactive" : "active";
};

const buildOptionValue = (source: string, id: number) => `${source}_${id}`;

export function useContactForm({ mode }: UseContactFormOptions) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/contact/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const workspaceId = useSelectedWorkspaceId();

  const contactId = params?.id ? parseInt(params.id) : undefined;
  const contactQuery = useContactById(contactId, {
    enabled:
      mode === "edit" && contactId !== undefined && !Number.isNaN(contactId),
  });
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();
  const groupsQuery = useContactGroups({
    params: { status: "active", size: 100 },
  });
  const organizationsQuery = useOrganizations(
    { status: "active", size: 100 },
    workspaceId ?? "missing",
    {
      enabled:
        workspaceId !== null && workspaceId !== undefined && workspaceId !== "",
    },
  );
  const departmentsQuery = useFarmDepartmentOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const positionsQuery = useFarmPositionOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const enterprises = useMemo(
    () => organizationsQuery.items.map(mapOrganizationToEnterprise),
    [organizationsQuery.items],
  );

  const contact = contactQuery.item ?? undefined;
  const positionValue = useMemo(() => {
    if (!contact?.position) {
      return "";
    }

    const matchedPosition = positionsQuery.items.find(
      (item) => item.name === contact.position,
    );

    return matchedPosition
      ? buildOptionValue(matchedPosition.source, matchedPosition.id)
      : contact.position;
  }, [contact?.position, positionsQuery.items]);

  const defaultValues = useMemo<ContactFormData>(
    () =>
      contact
        ? {
            entityName: contact.entityName ?? "",
            groupId: contact.group?.id ? contact.group.id.toString() : "",
            department: contact.department?.name ?? "",
            position: positionValue,
            fullName: contact.fullName,
            phone: contact.phone,
            email: contact.email ?? "",
            note: contact.note ?? "",
            status: normalizeContactFormStatus(contact.status),
        }
        : emptyContactFormData,
    [contact, positionValue],
  );

  const submitContact = async (formData: ContactFormData) => {
    if (mode !== "edit") {
      return;
    }

    if (!contactId) {
      return;
    }

    const department = departmentsQuery.items.find(
      (item) => item.name === formData.department,
    );
    const selectedPosition = positionsQuery.items.find((item) => {
      const optionValue = buildOptionValue(item.source, item.id);
      return optionValue === formData.position || item.name === formData.position;
    });

    const payload: ContactUpdateRequest = {
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      position: (selectedPosition?.name ?? formData.position.trim()) || null,
      entityName: formData.entityName.trim() || null,
      groupId: formData.groupId ? Number(formData.groupId) : null,
      departmentType: department?.source ?? null,
      departmentId: department ? department.id : null,
      note: formData.note.trim() || null,
      status: formData.status,
    };

    await updateContactMutation.updateContact({
      id: contactId,
      payload,
    });

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật liên hệ "${formData.fullName}"`,
    });

    setLocation("/contact");
  };

  const handleDelete = async () => {
    if (contactId) {
      await deleteContactMutation.deleteContact({ id: contactId });
      toast({ title: "Thành công", description: "Đã xóa liên hệ" });
      setLocation("/contact");
    }
    setDeleteOpen(false);
  };

  return {
      contact,
      contactId,
      defaultValues,
      groups: groupsQuery.items,
      enterprises,
      departments: departmentsQuery.items,
      positions: positionsQuery.items,
      loading:
        organizationsQuery.loading ||
        contactQuery.loading ||
        groupsQuery.loading ||
        departmentsQuery.loading ||
        positionsQuery.isLoading,
      isDeleting: deleteContactMutation.isPending,
      deleteOpen,
      setDeleteOpen,
      submitContact,
      handleDelete,
      goBack: () => setLocation("/contact"),
  };
}
