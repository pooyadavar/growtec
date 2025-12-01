import apiClient from "./apiClient";

export const makeManualSoluble = async (data) => {
  return apiClient.post('/soluble/make-manual-soluble/', data);
};
