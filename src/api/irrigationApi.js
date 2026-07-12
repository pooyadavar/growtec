import apiClient from "./apiClient";

export const getIrrigationTanksStatusLogs = async () => {
  return apiClient.post("/log/irrigation/irrigation-tanks-status/");
};

export const getIrrigationSchedules = async () => {
  return apiClient.get("/irrigation/irrigation-schedule");
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
  return apiClient.post("/irrigation/make-manual-irrigation/", data);
};
