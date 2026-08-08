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

export const normalizeIrrigationStatus = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

export const getIrrigationStatus = async () => {
  const response = await apiClient.get("/irrigation/irrigation-status/");
  return normalizeIrrigationStatus(response);
};

export const createIrrigationSchedule = async (payload) => {
  return apiClient.post("/irrigation/irrigation-schedule/", payload);
};

export const createIrrigationSchedules = async (payloads) => {
  return apiClient.post("/irrigation/irrigation-schedule/", payloads);
};

export const updateIrrigationSchedule = async (id, payload) => {
  return apiClient.patch(`/irrigation/irrigation-schedule/${id}/`, payload);
};

export const deleteIrrigationSchedule = async (id) => {
  return apiClient.delete(`/irrigation/irrigation-schedule/${id}/`);
};

export const batchDeleteIrrigationSchedules = async (ids) => {
  return apiClient.delete("/irrigation/irrigation-schedule/batch-delete/", {
    data: { ids },
  });
};

export const makeManualIrrigation = async (data) => {
  return apiClient.post("/irrigation/manual-irrigation/", data);
};
