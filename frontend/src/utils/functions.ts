const getLocationText = (count: number): string => {
  if (count >= 2 && count <= 4) return "lokalizacje";
  if (count > 5) return "lokalizacji";
  return "lokalizacja";
};

const getSeatsText = (count: number): string => (count > 4 ? "osób" : "osoby");

const formatDate = (dateString: string): string => {
  return new Date(dateString).toISOString().split("T")[0];
};

export { getLocationText, getSeatsText, formatDate };
