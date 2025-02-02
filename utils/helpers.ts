export const isRole = (role: string) => {
  return role === "admin"
    ? "Admin"
    : role === "pharm"
    ? "Pharmacy"
    : "Technical";
};
