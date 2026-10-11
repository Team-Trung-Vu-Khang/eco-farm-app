export function getUserLogoText(name?: string | null): string {
  if (!name) return "U";
  const clean = name.trim();
  if (!clean) return "U";

  if (/^(\+?84|0)\d+$/.test(clean)) {
    return "MF";
  }

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const single = words[0];
    return single.length >= 2
      ? single.slice(0, 2).toUpperCase()
      : single.toUpperCase();
  }

  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  const secondLast = words[words.length - 2];
  const last = words[words.length - 1];
  return (secondLast[0] + last[0]).toUpperCase();
}
