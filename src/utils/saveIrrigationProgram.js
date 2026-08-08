const SAVE_URL = "http://127.0.0.1:3001/save-irrigation-program";

const sanitizeFileName = (name) => {
  const safeName = String(name || "")
    .trim()
    .replace(/[<>:"/\\|?*]/g, "_")
    .split("")
    .filter((char) => char.charCodeAt(0) >= 32)
    .join("")
    .replace(/\s+/g, "_")
    .slice(0, 120);

  return safeName || "irrigation_program";
};

const downloadIrrigationProgram = (programName, data) => {
  const fileName = `${sanitizeFileName(programName)}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return { ok: true, fileName, downloaded: true };
};

export const saveIrrigationProgramToFile = async (programName, data) => {
  try {
    const response = await fetch(SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programName, data }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "خطا در ذخیره فایل برنامه");
    }

    return { ...result, savedByServer: true };
  } catch (error) {
    if (error instanceof TypeError) {
      return downloadIrrigationProgram(programName, data);
    }

    throw error;
  }
};
