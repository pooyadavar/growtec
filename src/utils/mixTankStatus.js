import assets from "../assets";
import { toPersianDigits } from "./persianDigits";
import { formatMixTankInteger } from "./mixTankStockReport";

const formatTarget = (value) => formatMixTankInteger(value);

export const getRangeBarStatusImage = (range, variant = "dashboard") => {
  const good =
    variant === "vertical"
      ? assets.svg.vertical_barstatus_khonsa
      : assets.svg.goodStatusDashboard;
  const high =
    variant === "vertical"
      ? assets.svg.vertical_barstatus_baz
      : assets.svg.highStatusDashboard;
  const low =
    variant === "vertical"
      ? assets.svg.vertical_barstatus_acid
      : assets.svg.lowStatusDashboard;

  if (!range) return good;

  const { higher_than_low, lower_than_high } = range;

  if (lower_than_high === false) return high;
  if (higher_than_low === false) return low;
  return good;
};

const getActiveOutputZones = (data) => {
  if (!data) return [];
  return [1, 2, 3, 4].filter((zone) => data[`output_zone_${zone}`] === true);
};

export const resolveMixTankProcessStatus = (data) => {
  const fallback = {
    title: "نامشخص",
    footerLabel: "",
    footerValue: "",
    icon: assets.svg.statusEmpty,
    iconWidth: 64,
    iconHeight: 64,
    bgColor: "#e0e0e0",
    textColor: "#555",
  };

  if (!data) return fallback;

  const status = data.status || {};
  const outputZones = getActiveOutputZones(data);

  if (outputZones.length > 0) {
    const zoneLabel = outputZones.map((z) => toPersianDigits(z)).join("، ");
    return {
      title: "در حال خروجی",
      footerLabel: "خروج به زون",
      footerValue: zoneLabel,
      icon: assets.svg.outputZone,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#D1E7DD",
      textColor: "#0F5132",
    };
  }

  if (status.soluble_is_ready) {
    return {
      title: "محلول آماده",
      footerLabel: "",
      footerValue: "",
      icon: assets.svg.tike,
      iconWidth: 48,
      iconHeight: 48,
      bgColor: "#D1E7DD",
      textColor: "#0F5132",
    };
  }

  if (status.injecting_acid) {
    const phTarget = data.ec_ph?.target_ph;
    return {
      title: "در حال تنظیم pH",
      footerLabel: "pH هدف",
      footerValue:
        phTarget !== undefined && phTarget !== null ? formatTarget(phTarget) : "",
      icon: assets.svg.statusPh,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#FFF3E0",
      textColor: "#E65100",
    };
  }

  if (
    status.mixing_water_after_stock_injection ||
    status.mixing_water_after_acid_injection ||
    status.mixing
  ) {
    return {
      title: "در حال همزدن",
      footerLabel: "",
      footerValue: "",
      icon: assets.svg.statusMix,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#E3F2FD",
      textColor: "#1565C0",
    };
  }

  if (
    status.making_soluble ||
    status.finished_adding_water_and_mixing_water_before_foodstuff_preparation ||
    status.injecting_stock
  ) {
    const ecTarget = data.ec_ph?.target_ec;
    return {
      title: "تنظیم EC",
      footerLabel: "EC هدف",
      footerValue:
        ecTarget !== undefined && ecTarget !== null ? formatTarget(ecTarget) : "",
      icon: assets.svg.statusEc,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#FFF8E1",
      textColor: "#F57F17",
    };
  }

  if (status.adding_water) {
    return {
      title: "پر کردن آب",
      footerLabel: "",
      footerValue: "",
      icon: assets.svg.statusFill,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#E3F2FD",
      textColor: "#1565C0",
    };
  }

  if (status.mixing_water_before_open_input_water) {
    return {
      title: "هم زدن اولیه",
      footerLabel: "",
      footerValue: "",
      icon: assets.svg.statusMix,
      iconWidth: 56,
      iconHeight: 56,
      bgColor: "#E3F2FD",
      textColor: "#1565C0",
    };
  }

  return {
    ...fallback,
    footerLabel: "",
    footerValue: "",
  };
};
