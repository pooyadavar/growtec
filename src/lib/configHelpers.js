export const cleanDecimal = (val) => {
  if (typeof val === "number") return val.toString();
  if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val))) {
    return Number(val).toString();
  }
  return val;
};

export const parseAdminConfig = ({ irrRes, solRes, cliRes }) => {
  let newData = {};

  if (irrRes?.status === "fulfilled") {
    const data = irrRes.value.data || irrRes.value;
    for (let key in data) newData[key] = cleanDecimal(data[key]);
  }
  if (solRes?.status === "fulfilled") {
    const data = solRes.value.data || solRes.value;
    for (let key in data) newData[key] = cleanDecimal(data[key]);
  }
  if (cliRes?.status === "fulfilled") {
    const data = cliRes.value.data || cliRes.value;
    if (data.zones) {
      for (let i = 1; i <= 5; i++) {
        const zoneData = data.zones[i.toString()];
        if (zoneData) {
          newData[`climate_z${i}_number_of_exhaust_fans`] = cleanDecimal(
            zoneData.number_of_exhaust_fans,
          );
          newData[`climate_z${i}_number_of_circulating_fans`] = cleanDecimal(
            zoneData.number_of_circulating_fans,
          );
          newData[`climate_z${i}_pump_pad`] = zoneData.pump_pad;
          newData[`climate_z${i}_heater`] = zoneData.heater;
          newData[`climate_z${i}_roof_hatch`] = zoneData.roof_hatch;
          newData[`climate_z${i}_fogger`] = zoneData.fogger;
          newData[`climate_z${i}_shade`] = zoneData.shade;
          newData[`climate_z${i}_number_of_sensors`] = cleanDecimal(
            zoneData.number_of_sensors,
          );
        }
      }
    }
  }

  return newData;
};
