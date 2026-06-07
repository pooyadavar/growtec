import apiClient from "./apiClient";

export const getOperatorSchedule = async (params) => {
  return apiClient.get("/climate/operator-schedule/", { params });
};

export const createOperatorSchedule = async (data) => {
  return apiClient.post("/climate/operator-schedule/", data);
};

export const updateOperatorSchedule = async (id, data) => {
  return apiClient.put(`/climate/operator-schedule/${id}/`, data);
};

export const deleteOperatorSchedule = async (id) => {
  return apiClient.delete(`/climate/operator-schedule/${id}/`);
};

export const getSpecialSettings = async () => {
  return apiClient.get("/climate/special-settings/");
};

export const updateSpecialSettings = async (data) => {
  return apiClient.post("/climate/special-settings/", data);
};

export const getOperatorMode = async (zone) => {
  return apiClient.get(`/climate/operators-mode/?zone=${zone}`);
};

export const updateOperatorMode = async (data) => {
  return apiClient.post("/climate/operators-mode/", data);
};

export const getOperatorStatus = async (zone) => {
  return apiClient.get(`/climate/operator/?zone=${zone}`);
};

export const sendOperatorCommand = async (data) => {
  return apiClient.post("/climate/operator/", data);
};

export const getTemperaturePart = async (zone) => {
  return apiClient.get(`/climate/temperature-part/?zone=${zone}`);
};

export const getHumidityPart = async (zone) => {
  return apiClient.get(`/climate/humidity-part/?zone=${zone}`);
};

export const getRangeStartTime = async () => {
  return apiClient.get("/climate/range-start-time/");
};

export const updateRangeStartTime = async (data) => {
  return apiClient.post("/climate/range-start-time/", data);
};

export const getClimateSettings = async (zone, part) => {
  const [tempRes, humRes, opRes, humOpRes] = await Promise.all([
    apiClient.get("/climate/temperature-range/", { params: { zone, part } }),
    apiClient.get("/climate/humidity-range/", { params: { zone, part } }),
    apiClient.get("/climate/temperature-range-operator/", {
      params: { zone, part },
    }),
    apiClient.get("/climate/humidity-range-operator/", {
      params: { zone, part },
    }),
  ]);
  return { tempRes, humRes, opRes, humOpRes };
};

export const updateTemperatureRange = async (data) => {
  return apiClient.post("/climate/temperature-range/", data);
};

export const updateHumidityRange = async (data) => {
  return apiClient.post("/climate/humidity-range/", data);
};

export const updateTemperatureRangeOperator = async (data) => {
  return apiClient.post("/climate/temperature-range-operator/", data);
};

export const updateHumidityRangeOperator = async (data) => {
  return apiClient.post("/climate/humidity-range-operator/", data);
};

export const parseOperatorSchedules = (response) => {
  let data = [];
  if (Array.isArray(response)) {
    data = response;
  } else if (response?.results && Array.isArray(response.results)) {
    data = response.results;
  } else if (response?.data && Array.isArray(response.data)) {
    data = response.data;
  }

  const grouped = {};
  data.forEach((item) => {
    if (!grouped[item.operator]) grouped[item.operator] = [];
    grouped[item.operator].push(item);
  });
  return grouped;
};

export const parseOperatorLogs = (response) => {
  let logs = [];
  if (Array.isArray(response)) {
    logs = response;
  } else if (response?.results && Array.isArray(response.results)) {
    logs = response.results;
  }

  logs.sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time));
  return logs;
};
