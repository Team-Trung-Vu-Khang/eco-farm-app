export const DEFAULT_ORGANIZATION_IMAGES = {
  enterprise:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR56d2JGDIoWHisYRfT9VLnEsvaBO-OerqLzbUnlU8mJT5FiWLv2uFacwY&s=10",
  farm:
    "https://img.magnific.com/premium-vector/farmer-logo-template-design-vector-emblem-design-concept-creative-symbol-icon_316488-978.jpg?semt=ais_hybrid&w=740&q=80",
  cooperative:
    "https://cdn.thuvienphapluat.vn/phap-luat/2022/4/07/HN/hop-tac-xa-hai%20(2).png",
} as const;

export function getDefaultOrganizationImage(
  type: "enterprise" | "farm" | "cooperative",
) {
  return DEFAULT_ORGANIZATION_IMAGES[type];
}
