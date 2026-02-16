import apiClient from "./apiClient";

export const getOperatorSchedule = async (params) => {
  return apiClient.get('/climate/operator-schedule/', { params });
};

export const createOperatorSchedule = async (data) => {
  return apiClient.post('/climate/operator-schedule/', data);
};

export const updateOperatorSchedule = async (id, data) => {
  return apiClient.put(`/climate/operator-schedule/${id}/`, data);
};

export const deleteOperatorSchedule = async (id) => {
  return apiClient.delete(`/climate/operator-schedule/${id}/`);
};
