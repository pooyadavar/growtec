import apiClient from "./apiClient";

export const getIrrigationTanksStatus = async () => {
  return apiClient.get('/info/irrigation-tanks-status/');
};