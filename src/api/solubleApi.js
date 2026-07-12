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
  return apiClient.post('/info/emergency-stop/', {});
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

const STOCK_PERCENT_KEYS = Array.from({ length: 10 }, (_, i) =>
  String(i + 1),
);
const STOCK_PERCENT_ZERO_KEYS = ["11", "12", "13"];

const formatProgramDecimal = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;

  const num = Number(value);
  if (Number.isNaN(num)) return fallback;
  if (Number.isInteger(num)) return num;

  return parseFloat(num.toFixed(2));
};

export const normalizeFoodstuffProgram = (response) => {
  const data =
    response?.foodstuff_preparation_program ??
    response?.foodstuff_preparation_program ??
    response ??
    {};

  const stockPercent = {};
  STOCK_PERCENT_KEYS.forEach((key) => {
    stockPercent[key] = formatProgramDecimal(data?.stock_percent?.[key], 0);
  });

  return {
    target_ec: formatProgramDecimal(data?.target_ec, 0),
    ec_acceptable_error: formatProgramDecimal(data?.ec_acceptable_error, 0),
    target_ph: formatProgramDecimal(data?.target_ph, 0),
    ph_acceptable_error: formatProgramDecimal(data?.ph_acceptable_error, 0),
    ec_correction_coefficient: formatProgramDecimal(
      data?.ec_correction_coefficient,
      0,
    ),
    stock_percent: stockPercent,
  };
};

export const buildFoodstuffProgramPayload = (programNumber, program) => {
  const stockPercent = {};
  STOCK_PERCENT_KEYS.forEach((key) => {
    stockPercent[key] = formatProgramDecimal(program?.stock_percent?.[key], 0);
  });
  STOCK_PERCENT_ZERO_KEYS.forEach((key) => {
    stockPercent[key] = 0;
  });

  return {
    program_number: programNumber,
    foodstuff_preparation_program: {
      target_ec: formatProgramDecimal(program?.target_ec, 0),
      ec_acceptable_error: formatProgramDecimal(program?.ec_acceptable_error, 0),
      target_ph: formatProgramDecimal(program?.target_ph, 0),
      ph_acceptable_error: formatProgramDecimal(program?.ph_acceptable_error, 0),
      ec_correction_coefficient: formatProgramDecimal(
        program?.ec_correction_coefficient,
        0,
      ),
      stock_percent: stockPercent,
    },
  };
};

export const getFoodstuffPreparationProgram = async (programNumber) => {
  const response = await apiClient.get("/soluble/foodstuff-preparation-program/", {
    params: { program_number: programNumber },
  });
  return normalizeFoodstuffProgram(response);
};

export const updateFoodstuffPreparationProgram = async ({ program_number, program }) => {
  const payload = buildFoodstuffProgramPayload(program_number, program);
  return apiClient.post("/soluble/foodstuff-preparation-program/", payload);
};

export const getFoodstuffPreparationProgramPh = async (programNumber) => {
  return apiClient.get('/soluble/foodstuff-preparation-program-ph/', {
    params: { program_number: programNumber },
  });
};

export const updateFoodstuffPreparationProgramPh = async (data) => {
  return apiClient.post('/soluble/foodstuff-preparation-program-ph/', data);
};

export const getFoodstuffPreparationProgramInputWaterRatio = async () => {
  const response = await apiClient.get(
    "/soluble/foodstuff-preparation-program-input-water-ratio/",
  );
  const value =
    response?.input_water_ratio ??
    response?.data?.input_water_ratio ??
    response;
  return formatProgramDecimal(
    typeof value === "object" ? value?.input_water_ratio : value,
    0,
  );
};

export const updateFoodstuffPreparationProgramInputWaterRatio = async (
  input_water_ratio,
) => {
  const num = Number(input_water_ratio);
  const normalized = Number.isNaN(num) ? 0 : parseFloat(num.toFixed(1));
  return apiClient.post(
    "/soluble/foodstuff-preparation-program-input-water-ratio/",
    { input_water_ratio: normalized },
  );
};

export const calibrationEc = async (data) => {
  return apiClient.post('/calibration/calibration-ec/', data);
};

export const calibrationPh = async (data) => {
  return apiClient.post('/calibration/calibration-ph/', data);
};

export const getSolubleEcPhTemperature = async () => {
  return apiClient.get('/soluble/ec-ph-temperature/');
};

export const getFoodstuffHistory = async (limit = 10) => {
  return apiClient.post('/log/soluble/foodstuff-preparation-program-schedule/', { limit });
};
