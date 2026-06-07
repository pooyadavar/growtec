import apiClient from "./apiClient";

export const calibratePressureSensor = async (payload) => {
  return apiClient.post("/calibration/calibration-pressure-sensor/", payload);
};

export const calibrateDosingPump = async (payload) => {
  return apiClient.post("/calibration/calibration-dosing-pump/", payload);
};
