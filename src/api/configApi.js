import apiClient from "./apiClient";

export const getIrrigationConfig = async () => {
  return apiClient.get("/config/irrigation/");
};

export const getSolubleConfig = async () => {
  return apiClient.get("/config/soluble/");
};

export const getClimateConfig = async () => {
  return apiClient.get("/config/climate/");
};

export const getAllConfig = async () => {
  const [irrRes, solRes, cliRes] = await Promise.allSettled([
    getIrrigationConfig(),
    getSolubleConfig(),
    getClimateConfig(),
  ]);
  return { irrRes, solRes, cliRes };
};

export const updateIrrigationConfig = async (payload) => {
  return apiClient.put("/config/irrigation/", payload);
};

export const updateSolubleConfig = async (payload) => {
  return apiClient.put("/config/soluble/", payload);
};

export const updateClimateConfig = async (payload) => {
  return apiClient.put("/config/climate/", payload);
};
