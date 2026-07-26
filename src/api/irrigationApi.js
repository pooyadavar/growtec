import apiClient from "./apiClient";

export const normalizeIrrigationTanksStatusLogs = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

export const getIrrigationTanksStatusLogs = async () => {
  const response = await apiClient.post(
    "/log/irrigation/irrigation-tanks-status/",
    { limit: 400 },
  );
  return normalizeIrrigationTanksStatusLogs(response);
};

export const normalizeIrrigationSchedules = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

export const getIrrigationSchedules = async () => {
  const response = await apiClient.get("/irrigation/irrigation-schedule");
  return normalizeIrrigationSchedules(response);
};

export const createIrrigationSchedule = async (payload) => {
  return apiClient.post("/irrigation/irrigation-schedule/", payload);
};

export const updateIrrigationSchedule = async (id, payload) => {
  return apiClient.patch(`/irrigation/irrigation-schedule/${id}/`, payload);
};

export const deleteIrrigationSchedule = async (id) => {
  return apiClient.delete(`/irrigation/irrigation-schedule/${id}/`);
};

export const makeManualIrrigation = async (data) => {
  return apiClient.post("/irrigation/manual-irrigation/", data);
};

const formatScheduleTime = (date) => {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}.000Z`;
};

export const buildManualIrrigationSchedulePayload = ({
  status,
  zone,
  volume,
  duration,
}) => {
  const now = new Date();
  let startDate = now;
  let endDate = now;

  const durationSeconds = Number(duration);
  const hasDuration = duration !== "" && !Number.isNaN(durationSeconds);

  if (status === "finish" && hasDuration) {
    startDate = new Date(now.getTime() - durationSeconds * 1000);
  } else if (status === "start" && hasDuration) {
    endDate = new Date(now.getTime() + durationSeconds * 1000);
  }

  return {
    is_active: true,
    is_manual: true,
    start_status: 0,
    end_status: 0,
    zone: Number(zone),
    volume: volume !== "" && volume != null ? Number(volume) : 0,
    start_time: formatScheduleTime(startDate),
    end_time: formatScheduleTime(endDate),
  };
};

export const submitManualIrrigationWithSchedule = async ({
  manualPayload,
  scheduleInput,
}) => {
  await makeManualIrrigation(manualPayload);
  return createIrrigationSchedule(
    buildManualIrrigationSchedulePayload(scheduleInput),
  );
};
