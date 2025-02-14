export const statusCapital = (status?: string) => {
  if (!status || status === "") return "";
  return status[0].toUpperCase() + status.slice(1);
};

export const isRole = (role: string) => {
  return role === "admin"
    ? "Admin"
    : role === "pharm"
    ? "Pharmacy"
    : "Technical";
};

export const getBadgeColor = (role: string) => {
  switch (role) {
    case "pharm":
      return "bg-blue-500 hover:bg-blue-500";
    case "tech":
      return "bg-purple-500 hover:bg-purple-500";
    case "admin":
      return "bg-yellow-500 hover:bg-yellow-500";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};
export const getStatusBadgeStyle = (status: string) => {
  // console.log(status);
  switch (status) {
    case "approved":
      return "bg-[#cff7d3] text-[#14ae5c] border-[#cff7d3]";
    case "pending":
      return "bg-[#fdd3d0] text-[#ec221f] border-[#fdd3d0]";
    case "decline":
      return "bg-[#ddc3ff] text-[#7307ff] border-[#ddc3ff]";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

export const getGroupTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Pharmacy":
      return "bg-[#0066ff] hover:bg-[#0066ff]";
    case "Technical":
      return "bg-[#9747ff] hover:bg-[#9747ff]";
    default:
      return "bg-gray-500 hover:bg-gray-500";
  }
};

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase();
}

export function getColorFromPercentage(percentage: number): string {
  const clampedPercentage = Math.max(1, Math.min(100, percentage));

  const normalizedPercentage = (clampedPercentage - 1) / 99;

  const startColor = hexToRgb("#14AE5C");
  const middleColor = hexToRgb("#F9D423");
  const endColor = hexToRgb("#EC221F");

  let r, g, b;

  if (normalizedPercentage < 0.5) {
    const factor = normalizedPercentage * 2;
    r = Math.round(startColor[0] + factor * (middleColor[0] - startColor[0]));
    g = Math.round(startColor[1] + factor * (middleColor[1] - startColor[1]));
    b = Math.round(startColor[2] + factor * (middleColor[2] - startColor[2]));
  } else {
    const factor = (normalizedPercentage - 0.5) * 2;
    r = Math.round(middleColor[0] + factor * (endColor[0] - middleColor[0]));
    g = Math.round(middleColor[1] + factor * (endColor[1] - middleColor[1]));
    b = Math.round(middleColor[2] + factor * (endColor[2] - middleColor[2]));
  }

  return rgbToHex(r, g, b);
}
