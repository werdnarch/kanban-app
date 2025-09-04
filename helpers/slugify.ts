export const slugify = (name: string) =>
  name.trim().replace(/\s+/g, "-").toLowerCase();
