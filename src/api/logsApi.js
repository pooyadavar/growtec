import axios from "axios";
import apiClient from "./apiClient";

export const getClimateTemperatureHumidityLogs = async (zone, retries = 3) => {
  const baseURL = apiClient.defaults?.baseURL;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${baseURL}/log/climate/temperature-humidity/`,
        { zone },
        {
          timeout: 180000,
          headers: { "Content-Type": "application/json" },
        },
      );
      return response.data;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
    }
  }
};

export const getClimateOperatorLogs = async (zone) => {
  return apiClient.post("/log/climate/operators/", { zone: zone || 1 });
};

export const getSolubleEcPhTemperatureLogs = async (sensorId, limit = 1000) => {
  return apiClient.post("/log/soluble/ec-ph-temperature/", {
    sensor_number: sensorId,
    limit,
  });
};

export const parseSolubleEcPhLogs = (response, sensorId) => {
  const array = Array.isArray(response) ? response : response.results || [];
  if (!array.length) return [];

  const sortedArray = [...array]
    .sort((a, b) => new Date(a.log_date_time) - new Date(b.log_date_time))
    .filter((item) => item.log_data.sensot_number === sensorId);

  return sortedArray.map((latest) => {
    const rawTime = latest.log_date_time;
    return {
      dateObj: new Date(rawTime),
      time: rawTime.split(" ")[1],
      ec: Number(latest.log_data.ec) || 0,
      pc: Number(latest.log_data.ph) || 0,
      temp: Number(latest.log_data.temperature) || 0,
    };
  });
};
