/** مخزن ساخت محلول (Feeding) */
export const MIX_TANK_API_NUMBER = 1;

/** UI مخزن آبیاری → API tank_number / zone */
export const uiIrrigationTankToApi = (uiTankNumber) =>
  Number(uiTankNumber) + 1;

/** API → UI مخزن آبیاری */
export const apiIrrigationTankToUi = (apiTankNumber) =>
  Number(apiTankNumber) - 1;
