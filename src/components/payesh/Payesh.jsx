import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Box,
  Modal,
  Typography,
  Container,
} from "@mui/material";
import imgFan1GreenAnAsset from "../../assets/image/ICONS/fan1Green.png";
import imgColorGreenFan1Asset from "../../assets/image/COLOR-ICONS/green-icons/fan1.png";
import imgFan1AnAsset from "../../assets/image/ICONS/fan1.png";
import imgFan1Asset from "../../assets/image/ICONS/Fan/fan3.png";
import imgFan2GreenAnAsset from "../../assets/image/ICONS/fan2Green.png";
import imgColorGreenFan2Asset from "../../assets/image/COLOR-ICONS/green-icons/fan2.png";
import imgFan2AnAsset from "../../assets/image/ICONS/fan2.png";
import imgFan2Asset from "../../assets/image/ICONS/Fan2/fan.png";
import imgBokhariGreenAnAsset from "../../assets/image/ICONS/bokhariGreen.png";
import imgColorGreenBokhariAsset from "../../assets/image/COLOR-ICONS/green-icons/بخاری.png";
import imgBokhariAnAsset from "../../assets/image/ICONS/بخاری.png";
import imgBokhariAsset from "../../assets/image/ICONS/بخاری/blaze.png";
import imgPadGreenAnAsset from "../../assets/image/ICONS/padGreen.png";
import imgColorGreenPadAsset from "../../assets/image/COLOR-ICONS/green-icons/پد سلولزی.png";
import imgPadANAsset from "../../assets/image/ICONS/پد سلولزی.png";
import imgPadAsset from "../../assets/image/ICONS/پد سلولزی/mesh.png";
import imgPardeGreenAnAsset from "../../assets/image/ICONS/pardehGreen.png";
import imgColorGreenPardeAsset from "../../assets/image/COLOR-ICONS/green-icons/پرده شید.png";
import imgPardeAnAsset from "../../assets/image/ICONS/پرده شید.png";
import imgPardeAsset from "../../assets/image/ICONS/پرده شید/curtain.png";
import imgDaricheGreenAnAsset from "../../assets/image/ICONS/daricheGreen.png";
import imgColorGreenDaricheAsset from "../../assets/image/COLOR-ICONS/green-icons/دریچه سقفی.png";
import imgDaricheAnAsset from "../../assets/image/ICONS/دریچه سقفی.png";
import imgDaricheAsset from "../../assets/image/ICONS/دریچه سقفی/window5.png";
import imgMehPashGreenAnAsset from "../../assets/image/ICONS/mehpashGreen.png";
import imgColorGreenMehPashAsset from "../../assets/image/COLOR-ICONS/green-icons/مه پاش.png";
import imgMehPashAnAsset from "../../assets/image/ICONS/مه پاش.png";
import imgMehPashAsset from "../../assets/image/ICONS/مه پاش/sprinkler4.png";
import svgAutoAsset from "../../assets/svg/auto.svg";
import svgButtonOnAsset from "../../assets/svg/buttonOn.svg";
import svgButtonOffAsset from "../../assets/svg/buttonOff.svg";
import svgNextBtnAsset from "../../assets/svg/nextBTN.svg";
import svgPrevBtnAsset from "../../assets/svg/prevBTN.svg";
import svgSetting2Asset from "../../assets/svg/setting2.svg";
import svgWarningAsset from "../../assets/svg/warning.svg";
import svgScheduleAsset from "../../assets/svg/schedule.svg";
import { AgCharts } from "ag-charts-react";
import PayeshSetting from "./PayeshSetting";
import ModalCloseButton from "../common/ModalCloseButton";
import IconTextButton from "../../card/IconTextButton";
import { useNavigate } from "react-router-dom";
import {
  getOperatorMode,
  getOperatorStatus,
  updateOperatorMode,
  sendOperatorCommand as sendOperatorCommandApi,
  getTemperaturePart,
  getHumidityPart,
} from "../../api/climateApi";
import { getClimateConfig } from "../../api/configApi";
import { getClimateTemperatureHumidityLogs } from "../../api/logsApi";
import { queryKeys } from "../../api/queryKeys";
import { toPersianDigits } from "../../utils/persianDigits";
import { getActiveClimateZoneIds } from "../../utils/irrigationConfig";
import {
  timeToMinutes,
  downsampleSeriesByTime,
  payeshChartTheme,
} from "../../utils/climateChart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PART_PRIORITY_LABELS = {
  A: "اولویت ۴",
  B: "اولویت ۳",
  C: "اولویت ۲",
  D: "اولویت ۱",
};

const formatRangeValue = (value) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return "-";
  return toPersianDigits(numberValue.toFixed(1));
};

const getPartPriorityLabel = (part) => PART_PRIORITY_LABELS[part] ?? "-";

const StatusIndicators = ({ states }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "1px",
      marginRight: "10px", // Changed to marginRight
      ml: 1,
    }}
  >
    {states.map((isOn, idx) => (
      <Box
        key={idx}
        sx={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: isOn ? "#379E79" : "#FF6B6B",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "10px",
          color: "#FFFFFF",
          fontFamily: "IRANSANS",
          border: "1px solid #FFFFFF",
          cursor: "default",
        }}
      >
        {toPersianDigits(idx + 1)}
      </Box>
    ))}
  </Box>
);

const normalizeExclusivePair = (opening, closing) => {
  const isOpening = Boolean(opening);
  const isClosing = Boolean(closing);
  if (isOpening && isClosing) {
    return { opening: true, closing: false };
  }
  return { opening: isOpening, closing: isClosing };
};

const getNextExclusivePairState = (prev, action) => {
  if (prev[action]) {
    return { opening: false, closing: false };
  }
  return {
    opening: action === "opening",
    closing: action === "closing",
  };
};

const Payesh = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isChanging, setIsChanging] = React.useState(false);
  const [operatorMode, setOperatorMode] = React.useState(false);
  const [activity, setActivity] = React.useState(true);
  const [zone, setZone] = useState(1);

  const { data: climateConfig } = useQuery({
    queryKey: queryKeys.adminClimateConfig(),
    queryFn: getClimateConfig,
    staleTime: 5 * 60 * 1000,
  });

  const activeZoneIds = useMemo(
    () => getActiveClimateZoneIds(climateConfig),
    [climateConfig],
  );

  useEffect(() => {
    if (activeZoneIds.length === 0) return;
    if (!activeZoneIds.includes(Number(zone))) {
      setZone(activeZoneIds[0]);
    }
  }, [activeZoneIds, zone]);

  const currentZoneIndex = activeZoneIds.indexOf(Number(zone));
  const canGoNextZone =
    currentZoneIndex >= 0 && currentZoneIndex < activeZoneIds.length - 1;
  const canGoPrevZone = currentZoneIndex > 0;

  const { data: operatorModeData } = useQuery({
    queryKey: queryKeys.operatorMode(zone),
    queryFn: () => getOperatorMode(zone),
    enabled: activeZoneIds.length > 0,
    refetchInterval: 30_000,
  });

  const { data: operatorStatusData } = useQuery({
    queryKey: queryKeys.operatorStatus(zone),
    queryFn: () => getOperatorStatus(zone),
    enabled: activeZoneIds.length > 0,
    refetchInterval: 30_000,
  });

  const operatorStatusSyncLockRef = useRef(0);
  const operatorStatusInvalidateTimerRef = useRef(null);

  const debouncedInvalidateOperatorStatus = useCallback(() => {
    if (operatorStatusInvalidateTimerRef.current) {
      clearTimeout(operatorStatusInvalidateTimerRef.current);
    }
    operatorStatusInvalidateTimerRef.current = setTimeout(() => {
      operatorStatusSyncLockRef.current = 0;
      queryClient.invalidateQueries({
        queryKey: queryKeys.operatorStatus(zone),
      });
    }, 1200);
  }, [queryClient, zone]);

  const patchOperatorStatusCache = useCallback(
    (patch) => {
      operatorStatusSyncLockRef.current += 1;
      queryClient.setQueryData(queryKeys.operatorStatus(zone), (old) =>
        old ? { ...old, ...patch } : old,
      );
      debouncedInvalidateOperatorStatus();
    },
    [queryClient, zone, debouncedInvalidateOperatorStatus],
  );

  const sendExclusiveOperatorPair = useCallback(
    async (prefix, nextState) => {
      patchOperatorStatusCache({
        [`${prefix}_opening`]: nextState.opening,
        [`${prefix}_closing`]: nextState.closing,
      });

      try {
        await Promise.all(
          ["opening", "closing"].map((action) =>
            sendOperatorCommandApi({
              operator: `${prefix}_${action}`,
              zone,
              on_off: nextState[action] ? "on" : "off",
            }),
          ),
        );
      } catch {
        operatorStatusSyncLockRef.current = 0;
        queryClient.invalidateQueries({
          queryKey: queryKeys.operatorStatus(zone),
        });
      }
    },
    [patchOperatorStatusCache, queryClient, zone],
  );

  const updateModeMutation = useMutation({
    mutationFn: (newMode) => updateOperatorMode({ is_auto: newMode, zone }),
    onMutate: async (newMode) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.operatorMode(zone),
      });
      const previous = queryClient.getQueryData(queryKeys.operatorMode(zone));
      queryClient.setQueryData(queryKeys.operatorMode(zone), {
        is_auto: newMode,
        zone,
      });
      return { previous };
    },
    onError: (_err, newMode, context) => {
      queryClient.setQueryData(queryKeys.operatorMode(zone), context?.previous);
      setOperatorMode(!newMode);
      setActivity(newMode);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operatorMode(zone) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.operatorStatus(zone),
      });
    },
  });

  const operatorCommandMutation = useMutation({
    mutationFn: (data) => sendOperatorCommandApi(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.operatorStatus(zone),
      });
      const previous = queryClient.getQueryData(queryKeys.operatorStatus(zone));
      queryClient.setQueryData(queryKeys.operatorStatus(zone), (old) =>
        old ? { ...old, [data.operator]: data.on_off === "on" } : old,
      );
      operatorStatusSyncLockRef.current += 1;
      debouncedInvalidateOperatorStatus();
      return { previous };
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.operatorStatus(zone), context.previous);
      }
      operatorStatusSyncLockRef.current = 0;
    },
  });

  const sendOperatorCommand = (operatorName, isOn) => {
    operatorCommandMutation.mutate({
      operator: operatorName,
      zone,
      on_off: isOn ? "on" : "off",
    });
  };

  const changOnAndOff = () => {
    setIsChanging(true);
    const targetMode = activity;
    setOperatorMode(targetMode);
    setActivity(!targetMode);
    updateModeMutation.mutate(targetMode);
    setTimeout(() => setIsChanging(false), 200);
  };

  // Modal States --------
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = useCallback(() => {
    setOpen(false);
    operatorStatusSyncLockRef.current = 0;
    queryClient.invalidateQueries({ queryKey: queryKeys.operatorStatus(zone) });
    queryClient.invalidateQueries({ queryKey: queryKeys.operatorMode(zone) });
    queryClient.invalidateQueries({ queryKey: queryKeys.payesh.temperaturePart(zone) });
    queryClient.invalidateQueries({ queryKey: queryKeys.payesh.humidityPart(zone) });
  }, [queryClient, zone]);
  // Modal States --------

  // Exhaust Fan Modal States
  const [exhaustFanModalOpen, setExhaustFanModalOpen] = useState(false);
  const [exhaustFanStates, setExhaustFanStates] = useState({
    fan1: false,
    fan2: false,
    fan3: false,
    fan4: false,
  });

  const handleExhaustFanClick = () => {
    if (activity) {
      setExhaustFanModalOpen(true);
    }
  };

  const toggleExhaustFan = (fanKey) => {
    setExhaustFanStates((prev) => {
      const newState = !prev[fanKey];
      // fanKey is like 'fan1', we want 'exhaust_fan_1'
      const number = fanKey.replace("fan", "");
      const operatorName = `exhaust_fan_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [fanKey]: newState,
      };
    });
  };

  // Circulation Fan Modal States
  const [circulationFanModalOpen, setCirculationFanModalOpen] = useState(false);
  const [circulationFanStates, setCirculationFanStates] = useState({
    fan1: false,
    fan2: false,
  });

  const handleCirculationFanClick = () => {
    if (activity) {
      setCirculationFanModalOpen(true);
    }
  };

  const toggleCirculationFan = (fanKey) => {
    setCirculationFanStates((prev) => {
      const newState = !prev[fanKey];
      // fanKey is like 'fan1', we want 'circule_fan_1'
      const number = fanKey.replace("fan", "");
      const operatorName = `circule_fan_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [fanKey]: newState,
      };
    });
  };

  // Pad Pump Modal States
  const [padPumpModalOpen, setPadPumpModalOpen] = useState(false);
  const [padPumpState, setPadPumpState] = useState(false); // Single toggle for pad_pump

  const handlePadPumpClick = () => {
    if (activity) {
      setPadPumpModalOpen(true);
    }
  };

  const togglePadPump = () => {
    setPadPumpState((prev) => {
      const newState = !prev;
      sendOperatorCommand("pad_pump", newState);
      return newState;
    });
  };

  // Fogger Modal States
  const [foggerModalOpen, setFoggerModalOpen] = useState(false);
  const [foggerState, setFoggerState] = useState(false); // Single toggle for fogger

  const handleFoggerClick = () => {
    if (activity) {
      setFoggerModalOpen(true);
    }
  };

  const toggleFogger = () => {
    setFoggerState((prev) => {
      const newState = !prev;
      sendOperatorCommand("fogger", newState);
      return newState;
    });
  };

  // Hatch Modal States (Draiche)
  const [hatchModalOpen, setHatchModalOpen] = useState(false);
  const [hatchStates, setHatchStates] = useState({
    opening: false,
    closing: false,
  });

  const handleHatchClick = () => {
    if (activity) {
      setHatchModalOpen(true);
    }
  };

  const toggleHatch = (action) => {
    setHatchStates((prev) => {
      const next = getNextExclusivePairState(prev, action);
      void sendExclusiveOperatorPair("hatch", next);
      return next;
    });
  };

  // Shade Modal States (Pardeh)
  const [shadeModalOpen, setShadeModalOpen] = useState(false);
  const [shadeStates, setShadeStates] = useState({
    opening: false,
    closing: false,
  });

  const handleShadeClick = () => {
    if (activity) {
      setShadeModalOpen(true);
    }
  };

  const toggleShade = (action) => {
    setShadeStates((prev) => {
      const next = getNextExclusivePairState(prev, action);
      void sendExclusiveOperatorPair("shade", next);
      return next;
    });
  };

  // Heater Modal States (Hiter)
  const [heaterModalOpen, setHeaterModalOpen] = useState(false);
  const [heaterStates, setHeaterStates] = useState({
    hiter1: false,
    hiter2: false,
    hiter3: false,
    hiter4: false,
  });

  const handleHeaterClick = () => {
    if (activity) {
      setHeaterModalOpen(true);
    }
  };

  const toggleHeater = (hiterKey) => {
    setHeaterStates((prev) => {
      const newState = !prev[hiterKey];
      // hiterKey is like 'hiter1', we want 'hiter_1'
      const number = hiterKey.replace("hiter", "");
      const operatorName = `hiter_${number}`;
      sendOperatorCommand(operatorName, newState);
      return {
        ...prev,
        [hiterKey]: newState,
      };
    });
  };

  useEffect(() => {
    if (operatorModeData === undefined) return;
    const mode =
      typeof operatorModeData === "object" &&
      operatorModeData !== null &&
      "is_auto" in operatorModeData
        ? operatorModeData.is_auto
        : operatorModeData;
    setOperatorMode(mode);
    setActivity(!mode);
  }, [operatorModeData]);

  useEffect(() => {
    if (!operatorStatusData || operatorStatusSyncLockRef.current > 0) return;
    const data = operatorStatusData;
    setExhaustFanStates({
      fan1: data.exhaust_fan_1 || false,
      fan2: data.exhaust_fan_2 || false,
      fan3: data.exhaust_fan_3 || false,
      fan4: data.exhaust_fan_4 || false,
      fan5: data.exhaust_fan_5 || false,
    });
    setCirculationFanStates({
      fan1: data.circule_fan_1 || false,
      fan2: data.circule_fan_2 || false,
    });
    setPadPumpState(data.pad_pump || false);
    setFoggerState(data.fogger || false);
    setHatchStates(
      normalizeExclusivePair(data.hatch_opening, data.hatch_closing),
    );
    setShadeStates(
      normalizeExclusivePair(data.shade_opening, data.shade_closing),
    );
    setHeaterStates({
      hiter1: data.hiter_1 || false,
      hiter2: data.hiter_2 || false,
      hiter3: data.hiter_3 || false,
      hiter4: data.hiter_4 || false,
    });
  }, [operatorStatusData]);

  const getExhaustFanIcon = () => {
    const isAnyOn = Object.values(exhaustFanStates).some((s) => s);
    if (!activity) {
      return isAnyOn ? imgFan1GreenAnAsset : imgColorGreenFan1Asset;
    }
    return isAnyOn ? imgFan1AnAsset : imgFan1Asset;
  };

  const getCirculationFanIcon = () => {
    const isAnyOn = Object.values(circulationFanStates).some((s) => s);
    if (!activity) {
      return isAnyOn ? imgFan2GreenAnAsset : imgColorGreenFan2Asset;
    }
    return isAnyOn ? imgFan2AnAsset : imgFan2Asset;
  };

  const getHeaterIcon = () => {
    const isAnyOn = Object.values(heaterStates).some((s) => s);
    if (!activity) {
      return isAnyOn ? imgBokhariGreenAnAsset : imgColorGreenBokhariAsset;
    }
    return isAnyOn ? imgBokhariAnAsset : imgBokhariAsset;
  };

  const getPadIcon = () => {
    const isAnyOn = padPumpState;
    if (!activity) {
      return isAnyOn ? imgPadGreenAnAsset : imgColorGreenPadAsset;
    }
    return isAnyOn ? imgPadANAsset : imgPadAsset;
  };

  const getShadeIcon = () => {
    const isOpen = shadeStates.opening;
    if (!activity) {
      return isOpen ? imgPardeGreenAnAsset : imgColorGreenPardeAsset;
    }
    return isOpen ? imgPardeAnAsset : imgPardeAsset;
  };

  const getHatchIcon = () => {
    const isOpen = hatchStates.opening;
    if (!activity) {
      return isOpen ? imgDaricheGreenAnAsset : imgColorGreenDaricheAsset;
    }
    return isOpen ? imgDaricheAnAsset : imgDaricheAsset;
  };

  const getFoggerIcon = () => {
    const isAnyOn = foggerState;
    if (!activity) {
      return isAnyOn ? imgMehPashGreenAnAsset : imgColorGreenMehPashAsset;
    }
    return isAnyOn ? imgMehPashAnAsset : imgMehPashAsset;
  };

  const { data: temperaturePartStatus = "" } = useQuery({
    queryKey: queryKeys.payesh.temperaturePart(zone),
    queryFn: () => getTemperaturePart(zone),
    enabled: activeZoneIds.length > 0,
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    refetchInterval: 30_000,
  });

  const { data: humidityPartStatus = "" } = useQuery({
    queryKey: queryKeys.payesh.humidityPart(zone),
    queryFn: () => getHumidityPart(zone),
    enabled: activeZoneIds.length > 0,
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    refetchInterval: 30_000,
  });

  const temperaturePartLabel =
    typeof temperaturePartStatus === "string"
      ? temperaturePartStatus
      : temperaturePartStatus?.temperature_part ?? "";

  const humidityPartLabel =
    typeof humidityPartStatus === "string"
      ? humidityPartStatus
      : humidityPartStatus?.humidity_part ?? "";

  const temperatureRangeText =
    typeof temperaturePartStatus === "string"
      ? "-"
      : `${formatRangeValue(
          temperaturePartStatus?.minimum_temperature,
        )} تا ${formatRangeValue(temperaturePartStatus?.maximum_temperature)}`;

  const humidityRangeText =
    typeof humidityPartStatus === "string"
      ? "-"
      : `${formatRangeValue(humidityPartStatus?.minimum_humidity)} تا ${formatRangeValue(
          humidityPartStatus?.maximum_humidity,
        )}`;

  const sensorCount = useMemo(() => {
    const zoneConfig =
      climateConfig?.zones?.[String(zone)] ??
      climateConfig?.data?.zones?.[String(zone)];
    const count = Number(zoneConfig?.number_of_sensors);
    return count > 0 ? Math.min(count, 6) : 6;
  }, [climateConfig, zone]);

  const { data: climateChartData } = useQuery({
    queryKey: queryKeys.payesh.temperatureHumidity(zone),
    queryFn: async () => {
      const response = await getClimateTemperatureHumidityLogs(zone);
      const data = Array.isArray(response) ? response : response.results || [];
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
          avg: t?.avg ?? null,
        });

        humData.push({
          time: timeStr,
          sensor1: h?.["1"] ?? 0,
          sensor2: h?.["2"] ?? 0,
          sensor3: h?.["3"] ?? 0,
          sensor4: h?.["4"] ?? 0,
          sensor5: h?.["5"] ?? 0,
          sensor6: h?.["6"] ?? 0,
          avg: h?.avg ?? null,
        });
      });

      tempData.sort((a, b) => a.time.localeCompare(b.time));
      humData.sort((a, b) => a.time.localeCompare(b.time));

      const lastTimeMinutes =
        tempData.length > 0
          ? timeToMinutes(tempData[tempData.length - 1].time)
          : 0;

      return {
        tempData: downsampleSeriesByTime(tempData, lastTimeMinutes),
        humData: downsampleSeriesByTime(humData, lastTimeMinutes),
        lastTimeMinutes,
      };
    },
    enabled: activeZoneIds.length > 0,
    staleTime: 20_000,
    gcTime: 10 * 60_000,
    refetchInterval: 20_000,
  });

  const temp = useMemo(
    () => climateChartData?.tempData || [],
    [climateChartData],
  );
  const humidity = useMemo(
    () => climateChartData?.humData || [],
    [climateChartData],
  );
  const lineSeriesBase = useMemo(
    () => [
      { yKey: "sensor1", yName: "سنسور ۱", stroke: "#FF6B6B" },
      { yKey: "sensor2", yName: "سنسور ۲", stroke: "#4ECDC4" },
      { yKey: "sensor3", yName: "سنسور ۳", stroke: "#45B7D1" },
      { yKey: "sensor4", yName: "سنسور ۴", stroke: "#FFA07A" },
      { yKey: "sensor5", yName: "سنسور ۵", stroke: "#98D8C8" },
      { yKey: "sensor6", yName: "سنسور ۶", stroke: "#F7DC6F" },
    ],
    [],
  );
  const visibleLineSeries = useMemo(
    () => [
      ...lineSeriesBase.slice(0, sensorCount),
      { yKey: "avg", yName: "میانگین", stroke: "#2F3437", strokeWidth: 4 },
    ],
    [lineSeriesBase, sensorCount],
  );

  // توزیع کاملاً مساوی لیبل‌ها بر اساس ایندکس آرایه برای حل مشکل بصری
  const visibleLabels = useMemo(() => {
    const labels = new Set();
    if (!temp || temp.length === 0) return labels;

    const labelCount = 8;
    const step = Math.max(1, Math.floor((temp.length - 1) / labelCount));

    for (let i = 0; i < temp.length; i += step) {
      if (temp.length - 1 - i < Math.max(1, step * 0.6)) {
        continue;
      }
      labels.add(temp[i].time);
    }

    labels.add(temp[temp.length - 1].time);

    return labels;
  }, [temp]);

  const getXAxisFormatter = useMemo(() => {
    return (params) => {
      if (visibleLabels.has(params.value)) {
        const timeParts = params.value.split(":");
        if (timeParts.length >= 2) {
          const formattedTime = `${String(timeParts[0]).padStart(2, "0")}:${String(timeParts[1]).padStart(2, "0")}`;
          return toPersianDigits(formattedTime);
        }
      }
      return "";
    };
  }, [visibleLabels]);

  const tempOptions = useMemo(
    () => ({
      theme: payeshChartTheme,
      title: { text: "دما", fontFamily: "IRANSANS" },
      data: temp,
      series: visibleLineSeries.map((series) => ({
        type: "line",
        xKey: "time",
        marker: { enabled: false },
        ...series,
      })),
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "" },
          label: {
            formatter: getXAxisFormatter,
            fontFamily: "IRANSANS",
            fontSize: 10,
          },
        },
        {
          type: "number",
          position: "left",
          title: { text: "دما (°C)", fontFamily: "IRANSANS" },
          label: {
            formatter: (p) => toPersianDigits(p.value),
            fontFamily: "IRANSANS",
            fontSize: 10,
          },
        },
      ],
      legend: {
        enabled: true,
        position: "bottom",
        spacing: 10,
        item: {
          spacing: 24,
          marker: {
            shape: "circle",
            size: 12,
          },
          label: {
            fontFamily: "IRANSANS",
            direction: "rtl",
          },
        },
      },
    }),
    [temp, visibleLineSeries, getXAxisFormatter],
  );

  const humOptions = useMemo(
    () => ({
      theme: payeshChartTheme,
      title: { text: "رطوبت", fontFamily: "IRANSANS" },
      data: humidity,
      series: visibleLineSeries.map((series) => ({
        type: "line",
        xKey: "time",
        marker: { enabled: false },
        ...series,
      })),
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "" },
          label: {
            formatter: getXAxisFormatter,
            fontFamily: "IRANSANS",
            fontSize: 10,
          },
        },
        {
          type: "number",
          position: "left",
          title: { text: "درصد", fontFamily: "IRANSANS" },
          label: {
            formatter: (p) => toPersianDigits(p.value),
            fontFamily: "IRANSANS",
            fontSize: 10,
          },
        },
      ],
      legend: {
        enabled: true,
        position: "bottom",
        spacing: 10,
        item: {
          spacing: 24,
          marker: {
            shape: "circle",
            size: 12,
          },
          label: {
            fontFamily: "IRANSANS",
            direction: "rtl",
          },
        },
      },
    }),
    [humidity, visibleLineSeries, getXAxisFormatter],
  );

  // const sendBoolean = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://192.168.100.51:8000/api/v1/climate/operators-mode/?zone=1",
  //       { mode: true, zone: 1 }, // payload: sending { value: true } or { value: false }
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("API success:", res.data);
  //   } catch (error) {
  //     console.error("API error:", error);
  //   }
  // };
  return (
    <Container
      sx={{
        width: "1004px",
        height: "614px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
        transform: "scale(0.93)",
        transformOrigin: "top center",
      }}
    >
      <Box
        sx={{
          width: "1003px",
          height: "483px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Box
          sx={{
            width: "901px",
            height: "556px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "901px",
              height: "56px",
              display: "flex",
              gap: "7px",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Box
              sx={{
                width: "172px",
                height: "56",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #5F5F5F",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingX: "8px",
                paddingY: "6px",
              }}
            >
              <img src={svgAutoAsset} alt="" />
              <img
                onClick={() => {
                  changOnAndOff(); // first function
                  //sendBoolean(); // second function
                }}
                className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
                src={operatorMode ? svgButtonOnAsset : svgButtonOffAsset}
                alt=""
              />
            </Box>
            <Box
              sx={{
                width: "178px",
                height: "56px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "-22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "82px",
                  height: "23px",
                  borderRadius: "10px 10px 0 0",
                  backgroundColor: "#FFCB82",
                  border: "0.5px solid #9F9F9F",
                  borderBottom: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14} fontWeight="bold">
                  دما
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "56px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  px: 0,
                  gap: "7px",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={12} fontWeight="bold">
                  {getPartPriorityLabel(temperaturePartLabel)}
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  color="#3A3A3A"
                  whiteSpace="nowrap"
                  sx={{ lineHeight: 1.05 }}
                >
                  بازه مطلوب دما {temperatureRangeText}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: "195px",
                height: "56px",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "-22px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "82px",
                  height: "23px",
                  borderRadius: "10px 10px 0 0",
                  backgroundColor: "#FFCB82",
                  border: "0.5px solid #9F9F9F",
                  borderBottom: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={14} fontWeight="bold">
                  رطوبت
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "56px",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  px: 0,
                  gap: "7px",
                }}
              >
                <Typography fontFamily={"IRANSANS"} fontSize={12} fontWeight="bold">
                  {getPartPriorityLabel(humidityPartLabel)}
                </Typography>
                <Typography
                  fontFamily={"IRANSANS"}
                  fontSize={12}
                  color="#3A3A3A"
                  whiteSpace="nowrap"
                  sx={{ lineHeight: 1.05 }}
                >
                  بازه مطلوب رطوبت {humidityRangeText}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: "392px",
                height: "37px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <img
                src={svgNextBtnAsset}
                alt=""
                className="button"
                onClick={() => {
                  if (canGoNextZone) {
                    setZone(activeZoneIds[currentZoneIndex + 1]);
                  }
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                style={{ opacity: canGoNextZone ? 1 : 0.45 }}
              />
              <Box
                sx={{
                  width: "288px",
                  height: "37px",
                  display: "flex",
                  backgroundColor: "#FFFFFF",
                  border: "0.5px solid #9F9F9F",
                  borderRadius: "10px",
                  justifyContent: "space-between",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                }}
              >
                <Box
                  sx={{
                    width: "206px",
                    height: "37px",
                    backgroundColor: "#FFCB82",
                    overflow: "hidden",
                    border: "0.5px solid #9F9F9F",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    fontFamily={"IRANSANS"}
                    fontSize={21}
                    color="#3A3A3A"
                    textAlign={"center"}
                    alignContent={"center"}
                  >
                    زون
                  </Typography>
                </Box>
                <Typography
                  fontSize={21}
                  color="#5B5B5B"
                  marginLeft={"40px"}
                  fontFamily="IRANSANS"
                  alignContent={"center"}
                >
                  {activeZoneIds.length > 0 ? toPersianDigits(zone) : "-"}
                </Typography>
              </Box>
              <img
                src={svgPrevBtnAsset}
                alt=""
                className="button"
                onClick={() => {
                  if (canGoPrevZone) {
                    setZone(activeZoneIds[currentZoneIndex - 1]);
                  }
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                style={{ opacity: canGoPrevZone ? 1 : 0.45 }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: "901px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: "90px",
                height: "483px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    exhaustFanStates.fan1,
                    exhaustFanStates.fan2,
                    exhaustFanStates.fan3,
                    exhaustFanStates.fan4,
                    exhaustFanStates.fan5,
                  ]}
                />
                <img
                  src={getExhaustFanIcon()}
                  alt=""
                  className="payesh-svg payesh-svg-fan1 button"
                  onClick={handleExhaustFanClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    circulationFanStates.fan1,
                    circulationFanStates.fan2,
                  ]}
                />
                <img
                  src={getCirculationFanIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleCirculationFanClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators
                  states={[
                    heaterStates.hiter1,
                    heaterStates.hiter2,
                    heaterStates.hiter3,
                    heaterStates.hiter4,
                  ]}
                />
                <img
                  src={getHeaterIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleHeaterClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[padPumpState]} />
                <img
                  src={getPadIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handlePadPumpClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[shadeStates.opening]} />
                <img
                  src={getShadeIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleShadeClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[hatchStates.opening]} />
                <img
                  src={getHatchIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleHatchClick}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusIndicators states={[foggerState]} />
                <img
                  src={getFoggerIcon()}
                  alt=""
                  className="payesh-svg button"
                  onClick={handleFoggerClick}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  width: "790px",
                  height: "232px",
                  borderRadius: "10px",
                  border: "0.5px solid #9F9F9F",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <AgCharts
                  options={tempOptions}
                  style={{
                    width: "790px",
                    height: "232px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                />
              </Box>
              <Box
                sx={{
                  width: "790px",
                  height: "232px",
                  borderRadius: "10px",
                  border: "0.5px solid #9F9F9F",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <AgCharts
                  options={humOptions}
                  style={{
                    width: "790px",
                    height: "232px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "56px",
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "center",
              marginTop: "10px",
              flexGrow: 1,
              gap: 8,
              mt: 3,
              right: "20px",
              position: "relative",
            }}
          >
            <IconTextButton
              icon={svgSetting2Asset}
              text="تنظیمات"
              onClick={handleOpen}
              bgColor="#6CCDB0"
              textColor="#000000"
              borderColor="#77b39dff"
              width="220px"
            />
            {/* <Button
              sx={{
                width: "246px",
                height: "56px",
                backgroundColor: "#6CCDB0",
                borderRadius: "10px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                paddingX: "30px",
                color: "#000000",
              }}
              onClick={handleOpen}
            >
              <img src={svgSetting2Asset} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                تنظیمات
              </Typography>
            </Button> */}
            <IconTextButton
              icon={svgWarningAsset}
              text="تداخلات عملگرها"
              bgColor="#FFCB82"
              textColor="#000000"
              onClick={() => {}}
              borderColor="#dcaf70ff"
              width="220px"
            />

            {/* <Button
              sx={{
                width: "234px",
                height: "56px",
                borderRadius: "10px",
                backgroundColor: "#FFCB82",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <img src={svgWarningAsset} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                تداخلات عملگرها
              </Typography>
            </Button> */}

            <IconTextButton
              icon={svgScheduleAsset}
              text="برنامه زمانی عملگرها"
              bgColor="#FFCB82"
              textColor="#000000"
              onClick={() => navigate("/payesh-time-plans")} // Update onClick
              borderColor="#dcaf70ff"
              width="220px"
            />
            {/* <Button
              sx={{
                width: "246px",
                height: "56px",
                backgroundColor: "#FFCB82",
                borderRadius: "10px",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 5px 2px",
                display: "flex",
                justifyContent: "space-around",
                paddingX: "0px",
                color: "#000000",
              }}
            >
              <img src={svgScheduleAsset} alt="" />
              <Typography fontFamily={"IRANSANS"} fontSize={19} color="#000000">
                برنامه زمانی عملگرها
              </Typography>
            </Button> */}
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "48%",
            transform: "translate(-50%, -50%)",
            scale: "0.95",
          }}
        >
          <PayeshSetting zone={zone} onClose={handleClose} />
        </Box>
      </Modal>

      {/* Exhaust Fan Control Modal */}
      <Modal
        open={exhaustFanModalOpen}
        onClose={() => setExhaustFanModalOpen(false)}
        aria-labelledby="exhaust-fan-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل فن‌های اگزاست
            </Typography>
            <ModalCloseButton onClick={() => setExhaustFanModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  فن اگزاست {toPersianDigits(num)}
                </Typography>
                <img
                  src={
                    exhaustFanStates[`fan${num}`]
                      ? svgButtonOnAsset
                      : svgButtonOffAsset
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleExhaustFan(`fan${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Circulation Fan Control Modal */}
      <Modal
        open={circulationFanModalOpen}
        onClose={() => setCirculationFanModalOpen(false)}
        aria-labelledby="circulation-fan-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل فن‌های سیرکوله
            </Typography>
            <ModalCloseButton onClick={() => setCirculationFanModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  فن سیرکوله {toPersianDigits(num)}
                </Typography>
                <img
                  src={
                    circulationFanStates[`fan${num}`]
                      ? svgButtonOnAsset
                      : svgButtonOffAsset
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleCirculationFan(`fan${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Pad Pump Control Modal */}
      <Modal
        open={padPumpModalOpen}
        onClose={() => setPadPumpModalOpen(false)}
        aria-labelledby="pad-pump-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل پمپ پد
            </Typography>
            <ModalCloseButton onClick={() => setPadPumpModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 1,
              }}
            >
              <Typography fontFamily="IRANSANS" fontSize={18}>
                پمپ پد
              </Typography>
              <img
                src={padPumpState ? svgButtonOnAsset : svgButtonOffAsset}
                alt="toggle"
                style={{ width: "50px", cursor: "pointer" }}
                onClick={togglePadPump}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Fogger Control Modal */}
      <Modal
        open={foggerModalOpen}
        onClose={() => setFoggerModalOpen(false)}
        aria-labelledby="fogger-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل مه پاش
            </Typography>
            <ModalCloseButton onClick={() => setFoggerModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingX: 1,
              }}
            >
              <Typography fontFamily="IRANSANS" fontSize={18}>
                مه پاش
              </Typography>
              <img
                src={foggerState ? svgButtonOnAsset : svgButtonOffAsset}
                alt="toggle"
                style={{ width: "50px", cursor: "pointer" }}
                onClick={toggleFogger}
              />
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Hatch Control Modal */}
      <Modal
        open={hatchModalOpen}
        onClose={() => setHatchModalOpen(false)}
        aria-labelledby="hatch-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل دریچه
            </Typography>
            <ModalCloseButton onClick={() => setHatchModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["opening", "closing"].map((action) => (
              <Box
                key={action}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  {action === "opening" ? "باز شدن دریچه" : "بسته شدن دریچه"}
                </Typography>
                <img
                  src={
                    hatchStates[action]
                      ? svgButtonOnAsset
                      : svgButtonOffAsset
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleHatch(action)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Shade Control Modal */}
      <Modal
        open={shadeModalOpen}
        onClose={() => setShadeModalOpen(false)}
        aria-labelledby="shade-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل پرده
            </Typography>
            <ModalCloseButton onClick={() => setShadeModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {["opening", "closing"].map((action) => (
              <Box
                key={action}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  {action === "opening" ? "باز شدن پرده" : "بسته شدن پرده"}
                </Typography>
                <img
                  src={
                    shadeStates[action]
                      ? svgButtonOnAsset
                      : svgButtonOffAsset
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleShade(action)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* Heater Control Modal */}
      <Modal
        open={heaterModalOpen}
        onClose={() => setHeaterModalOpen(false)}
        aria-labelledby="heater-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "#FFFFFF",
            borderRadius: "15px",
            boxShadow: 24,
            p: 3,
            outline: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontFamily="IRANSANS" fontWeight="bold">
              کنترل هیترها
            </Typography>
            <ModalCloseButton onClick={() => setHeaterModalOpen(false)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3, 4].map((num) => (
              <Box
                key={num}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingX: 1,
                }}
              >
                <Typography fontFamily="IRANSANS" fontSize={18}>
                  هیتر {toPersianDigits(num)}
                </Typography>
                <img
                  src={
                    heaterStates[`hiter${num}`]
                      ? svgButtonOnAsset
                      : svgButtonOffAsset
                  }
                  alt="toggle"
                  style={{ width: "50px", cursor: "pointer" }}
                  onClick={() => toggleHeater(`hiter${num}`)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Payesh;
