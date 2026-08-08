const readTime = (value) => {
  if (!value) return "";
  const str = String(value);
  if (str.includes("T")) return str.split("T")[1].substring(0, 8);
  return str.replace(".000Z", "").substring(0, 8);
};

const readSchedule = (payload) => {
  const data = payload?.data ?? payload;
  return Array.isArray(data?.schedule) ? data.schedule : [];
};

export const buildRowsFromIrrigationProgramFile = (payload, zoneOptions = []) => {
  const allowedZones = zoneOptions.map(Number).filter(Number.isFinite);

  return readSchedule(payload)
    .map((row) => {
      const zone = Number(row.zone ?? row.irrigation_number);
      if (!Number.isFinite(zone)) return null;
      if (allowedZones.length > 0 && !allowedZones.includes(zone)) return null;

      return {
        tempId: crypto.randomUUID(),
        start_time: readTime(row.start_time ?? row.start),
        end_time: readTime(row.end_time ?? row.end),
        zone,
        volume: row.volume ?? "",
        is_active: row.is_active ?? true,
        start_status: row.start_status ?? 0,
        end_status: row.end_status ?? 0,
        volume_status: row.volume_status ?? 0,
        isNew: true,
      };
    })
    .filter(Boolean);
};

