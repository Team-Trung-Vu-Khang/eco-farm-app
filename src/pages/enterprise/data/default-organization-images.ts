export const DEFAULT_ORGANIZATION_IMAGES = {
  enterprise: "/company.jpg",
  farm: "/farmer.jpg",
  cooperative: "/cooperative.jpg",
} as const;

export function getDefaultOrganizationImage(
  type: "enterprise" | "farm" | "cooperative",
) {
  const path = DEFAULT_ORGANIZATION_IMAGES[type];
  return typeof window !== "undefined"
    ? `${window.location.origin}${path}`
    : path;
}
