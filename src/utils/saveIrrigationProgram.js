const SAVE_URL = "http://localhost:3001/save-irrigation-program";

export const saveIrrigationProgramToFile = async (programName, data) => {
  const response = await fetch(SAVE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ programName, data }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "خطا در ذخیره فایل برنامه");
  }

  return result;
};
