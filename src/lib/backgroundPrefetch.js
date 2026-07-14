import { queryKeys } from "../api/queryKeys";
import {
  getErrorCodes,
  getInsideCliment,
  getIrrigationTanksStatus,
  getMixTankStatus,
  getOutsideCliment,
} from "../api/dashboardApi";
import {
  getHumidityPart,
  getOperatorMode,
  getOperatorStatus,
  getTemperaturePart,
} from "../api/climateApi";
import { getClimateTemperatureHumidityLogs } from "../api/logsApi";
import {
  getFoodstuffSchedule,
  getSolubleEcPhTemperature,
} from "../api/solubleApi";
import {
  getIrrigationSchedules,
  getIrrigationTanksStatusLogs,
} from "../api/irrigationApi";
import { getAccessToken } from "../utils/authStorage";

let prefetchStarted = false;

const normalizeTemperatureHumidity = (response, zone) => {
  const data = Array.isArray(response) ? response : response?.results || [];
  const zoneData = data.filter((item) => item.log_data?.zone === zone);
  const sortedData = [...zoneData].reverse();
  const tempData = [];
  const humData = [];

  sortedData.forEach((item) => {
    const timeStr = item.log_date_time.split(" ")[1];
    const t = item.log_data.temperature;
    const h = item.log_data.humidity;

    tempData.push({
      time: timeStr,
      sensor1: t?.["1"] ?? 0,
      sensor2: t?.["2"] ?? 0,
      sensor3: t?.["3"] ?? 0,
      sensor4: t?.["4"] ?? 0,
      sensor5: t?.["5"] ?? 0,
      sensor6: t?.["6"] ?? 0,
    });

    humData.push({
      time: timeStr,
      sensor1: h?.["1"] ?? 0,
      sensor2: h?.["2"] ?? 0,
      sensor3: h?.["3"] ?? 0,
      sensor4: h?.["4"] ?? 0,
      sensor5: h?.["5"] ?? 0,
      sensor6: h?.["6"] ?? 0,
    });
  });

  return { tempData, humData };
};

const prefetch = (queryClient, queryKey, queryFn) =>
  queryClient
    .prefetchQuery({
      queryKey,
      queryFn,
    })
    .catch(() => undefined);

const prefetchSection = (queryClient, queries) =>
  Promise.all(
    queries.map(({ queryKey, queryFn }) => prefetch(queryClient, queryKey, queryFn)),
  );

const preloadSection = (loadModule) => loadModule().catch(() => undefined);

const waitForIdle = () =>
  new Promise((resolve) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(resolve, { timeout: 1500 });
      return;
    }
    window.setTimeout(resolve, 300);
  });

export const startBackgroundPrefetch = async (queryClient) => {
  if (prefetchStarted || !getAccessToken()) return;
  prefetchStarted = true;

  await waitForIdle();

  const zone = 1;
  const sections = [
    {
      loadModule: () => import("../pages/Dashboard"),
      queries: [
        {
          queryKey: queryKeys.mixTankStatus(),
          queryFn: getMixTankStatus,
        },
        {
          queryKey: queryKeys.irrigationTanks(),
          queryFn: getIrrigationTanksStatus,
        },
        {
          queryKey: queryKeys.insideCliment(),
          queryFn: getInsideCliment,
        },
        {
          queryKey: queryKeys.outsideCliment(),
          queryFn: getOutsideCliment,
        },
        {
          queryKey: queryKeys.errorCodes(),
          queryFn: getErrorCodes,
        },
      ],
    },
    {
      loadModule: () => import("../components/payesh/Payesh"),
      queries: [
        {
          queryKey: queryKeys.operatorMode(zone),
          queryFn: () => getOperatorMode(zone),
        },
        {
          queryKey: queryKeys.operatorStatus(zone),
          queryFn: () => getOperatorStatus(zone),
        },
        {
          queryKey: queryKeys.payesh.temperaturePart(zone),
          queryFn: () => getTemperaturePart(zone),
        },
        {
          queryKey: queryKeys.payesh.humidityPart(zone),
          queryFn: () => getHumidityPart(zone),
        },
        {
          queryKey: queryKeys.payesh.temperatureHumidity(zone),
          queryFn: async () =>
            normalizeTemperatureHumidity(
              await getClimateTemperatureHumidityLogs(zone, 1),
              zone,
            ),
        },
      ],
    },
    {
      loadModule: () => import("../pages/Feeding"),
      queries: [
        {
          queryKey: queryKeys.mixTankStatus(),
          queryFn: getMixTankStatus,
        },
        {
          queryKey: queryKeys.foodstuffSchedule(),
          queryFn: getFoodstuffSchedule,
        },
        {
          queryKey: queryKeys.solubleEcPhTemperature(),
          queryFn: getSolubleEcPhTemperature,
        },
      ],
    },
    {
      loadModule: () => import("../pages/Irrigation"),
      queries: [
        {
          queryKey: queryKeys.irrigationTanksStatusLogs(),
          queryFn: getIrrigationTanksStatusLogs,
        },
        {
          queryKey: queryKeys.irrigationSchedules(),
          queryFn: getIrrigationSchedules,
        },
      ],
    },
  ];

  for (const section of sections) {
    await Promise.all([
      preloadSection(section.loadModule),
      prefetchSection(queryClient, section.queries),
    ]);
  }
};
