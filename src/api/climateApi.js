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

export const normalizeSpecialParameters = (response) => {
  return response?.special_parameters ?? response ?? {};
};

export const getSpecialParameters = async () => {
  const response = await apiClient.get("/climate/special-parameters/");
  return normalizeSpecialParameters(response);
};

export const updateSpecialParameters = async (parameters) => {
  return apiClient.post("/climate/special-parameters/", {
    special_parameters: parameters,
  });
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

const normalizeTemperaturePart = (response) => {
  if (typeof response === "string") {
    return {
      temperature_part: response,
      minimum_temperature: null,
      maximum_temperature: null,
    };
  }

  return {
    temperature_part: response?.temperature_part ?? "",
    minimum_temperature: response?.minimum_temperature ?? null,
    maximum_temperature: response?.maximum_temperature ?? null,
  };
};

const normalizeHumidityPart = (response) => {
  if (typeof response === "string") {
    return {
      humidity_part: response,
      minimum_humidity: null,
      maximum_humidity: null,
    };
  }

  return {
    humidity_part: response?.humidity_part ?? "",
    minimum_humidity: response?.minimum_humidity ?? null,
    maximum_humidity: response?.maximum_humidity ?? null,
  };
};

export const getTemperaturePart = async (zone) => {
  const response = await apiClient.get(`/climate/temperature-part/?zone=${zone}`);
  return normalizeTemperaturePart(response);
};

export const getHumidityPart = async (zone) => {
  const response = await apiClient.get(`/climate/humidity-part/?zone=${zone}`);
  return normalizeHumidityPart(response);
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

export const OPERATOR_ORDER = [
  "exhaust_fan_1",
  "exhaust_fan_2",
  "exhaust_fan_3",
  "exhaust_fan_4",
  "exhaust_fan_5",
  "circule_fan_1",
  "circule_fan_2",
  "pad_pump",
  "fogger",
  "hatch_opening",
  "hatch_closing",
  "shade_opening",
  "shade_closing",
  "hiter_1",
  "hiter_2",
  "hiter_3",
  "hiter_4",
];

export const sortOperators = (operators) => {
  return [...operators].sort((a, b) => {
    const ai = OPERATOR_ORDER.indexOf(a);
    const bi = OPERATOR_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
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
    const operatorKey = item.operator;
    if (!operatorKey) return;
    if (!grouped[operatorKey]) grouped[operatorKey] = [];
    grouped[operatorKey].push({ ...item, operator: operatorKey });
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
