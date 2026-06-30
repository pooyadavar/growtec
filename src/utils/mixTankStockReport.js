import { toPersianDigits } from "./persianDigits";

export const formatMixTankDecimal = (value, decimals = 2) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return toPersianDigits(String(value));
  return toPersianDigits(num.toFixed(decimals));
};

export const formatMixTankInteger = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return toPersianDigits(String(value));
  return toPersianDigits(Math.round(num));
};

export const formatStockCellValue = (value, mode) => {
  if (mode === "stock") return formatMixTankDecimal(value, 2);
  return formatMixTankInteger(value);
};

export const getStockRowCol1Value = (row, mode, _rows, data) => {
  if (row.id === "ph") {
    if (mode === "total") return data?.acid_volume;
    if (mode === "time") return data?.acid_dosing_pump_remaining_time;
    return data?.ph_volume ?? row.col1;
  }

  if (mode === "time") return row.col2;
  return row.col1;
};

export const getStockRowCol2Value = (row, mode, _rows, data) => {
  if (row.id === "ph" && mode === "time") {
    return data?.acid_dosing_pump_remaining_time;
  }

  return row.col2;
};

const sortNumericKeys = (obj = {}) =>
  Object.keys(obj)
    .map((key) => Number(key))
    .filter((key) => !Number.isNaN(key))
    .sort((a, b) => a - b);

export const buildMixTankStockRows = (data) => {
  if (!data) return [];

  const stockVolume = data.stock_volume || {};
  const stockTime = data.stock_dosing_pump_remaining_time || {};
  const stockKeys = sortNumericKeys(stockVolume);

  const rows = [
    {
      id: "ph",
      label: "pH",
      col1: data.ph_volume,
      col2: data.ph_dosing_pump_remaining_time,
    },
  ];

  stockKeys.forEach((key) => {
    const keyStr = String(key);
    rows.push({
      id: `stock-${key}`,
      label: key,
      col1: stockVolume[keyStr] ?? stockVolume[key],
      col2: stockTime[keyStr] ?? stockTime[key] ?? "",
    });
  });

  return rows;
};
