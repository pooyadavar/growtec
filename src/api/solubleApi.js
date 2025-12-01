import apiClient from "./apiClient";

export const makeManualSoluble = async (data) => {
  return apiClient.post('/soluble/make-manual-soluble/', data);
};

export const emptyingTank = async (data) => {
  return apiClient.post('/soluble/emptying-tank/', data);
};

export const manualInjection = async (data) => {
  return apiClient.post('/soluble/manual-injection/', data);
};

export const controlMixer = async (data) => {
  return apiClient.post('/soluble/mix-mix-tank/', data);
};

export const controlStocksMixer = async (data) => {
  return apiClient.post('/soluble/mix-stocks/', data);
};

export const emergencyStop = async () => {
  return apiClient.post('/soluble/emergency-stop/', {});
};

export const getFoodstuffSchedule = async () => {
  return apiClient.get('/soluble/foodstuff-preparation-program-schedule/');
};

export const saveFoodstuffSchedule = async (data) => {
  return apiClient.post('/soluble/foodstuff-preparation-program-schedule/', data);
};

export const updateFoodstuffSchedule = async (id, data) => {
  return apiClient.put(`/soluble/foodstuff-preparation-program-schedule/${id}/`, data);
};

export const deleteFoodstuffSchedule = async (id) => {
  return apiClient.delete(`/soluble/foodstuff-preparation-program-schedule/${id}/`);
};

export const getFoodstuffScheduleById = async (id) => {
  return apiClient.get(`/soluble/foodstuff-preparation-program-schedule/${id}/`);
};

export const getMixTankStatus = async () => {
  return apiClient.get('/soluble/mix-tank-status/');
};
