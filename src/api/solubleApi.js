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
