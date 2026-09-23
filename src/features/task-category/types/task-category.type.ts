import type { DomainCode } from "@/features/farm-supply/types";
import type { PageResponse } from "@/features/foundation/types/foundation.type";

export type TaskCategoryStatus = "active" | "inactive" | "archived";

export interface TaskCategoryRecord {
  id: number;
  domainCode: DomainCode;
  /**
   * Chuỗi tag phân tách dấu phẩy, FE tự quy ước (BE không parse), tối đa 500 ký tự.
   * VD: "DINHDUONG:Bón phân,TUOITIEU:Bón phân".
   */
  tags: string | null;
  code: string;
  name: string;
  example: string;
  displayOrder: number;
  status: TaskCategoryStatus;
  metadataJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskCategoryRequest {
  domainCode: DomainCode;
  tags?: string;
  /** Bỏ trống khi tạo — BE tự sinh */
  code?: string;
  name: string;
  example: string;
  displayOrder: number;
  status: TaskCategoryStatus;
  metadataJson?: Record<string, unknown>;
}

export type UpdateTaskCategoryRequest = CreateTaskCategoryRequest;

export type TaskCategoryPageResponse = PageResponse<TaskCategoryRecord>;

/** @deprecated Use TaskCategoryRecord. Kept for existing consumers. */
export type TaskCategoryLookupResponse = TaskCategoryRecord;

export interface TaskCategoryLookupQueryParams {
  /** Khớp một phần (LIKE %tags%, không phân biệt hoa/thường), VD: "DINHDUONG:" */
  tags?: string;
  keyword?: string;
  domainCode?: DomainCode;
  status?: TaskCategoryStatus;
  page?: number;
  size?: number;
}
