export const getConfigValue = (config, key) => config?.[key] ?? config?.data?.[key];

export const getActiveIrrigationTankIds = (config) => {
  if (!config) return [];

  return [2, 3, 4, 5].reduce((ids, volumeIndex) => {
    const volume = Number(getConfigValue(config, `tank_volume_${volumeIndex}`)) || 0;
    if (volume > 0) ids.push(volumeIndex - 1);
    return ids;
  }, []);
};

export const getActiveClimateZoneIds = (config) => {
  const zones = config?.zones ?? config?.data?.zones;
  if (zones) {
    return [1, 2, 3, 4, 5].filter(
      (zone) => Number(zones[String(zone)]?.number_of_exhaust_fans) > 0,
    );
  }

  return [1, 2, 3, 4, 5].filter(
    (zone) => Number(getConfigValue(config, `climate_z${zone}_number_of_exhaust_fans`)) > 0,
  );
};

export const getTankZoneOptions = (config, tankId) => {
  if (!tankId) return [];

  const tankNumber = Number(tankId);
  let start = 1;

  for (let i = 1; i < tankNumber; i++) {
    start += Number(getConfigValue(config, `number_of_pumps_zone_${i}`)) || 0;
  }

  const count =
    Number(getConfigValue(config, `number_of_pumps_zone_${tankNumber}`)) || 0;

  return Array.from({ length: count }, (_, index) => start + index);
};

export const getActiveIrrigationZonesForTank = (
  config,
  tankId,
  irrigationStatus = [],
) => {
  const zoneOptions = getTankZoneOptions(config, tankId);
  return zoneOptions.reduce((activeZones, zone, index) => {
    if (irrigationStatus[zone - 1] === true) {
      activeZones.push(index + 1);
    }
    return activeZones;
  }, []);
};

export const formatIrrigationStatusText = (activeZones = []) => {
  if (activeZones.length === 0) return "آبیاری انجام نمی‌شود";
  if (activeZones.length === 1) {
    return `زون ${activeZones[0]} دارد آبیاری می‌شود`;
  }
  return `زون‌های ${activeZones.join("، ")} دارند آبیاری می‌شوند`;
};
