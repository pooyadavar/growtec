/** مخزن ساخت محلول (Feeding) */
export const MIX_TANK_API_NUMBER = 1;

/** UI مخزن آبیاری = API tank_number */
export const uiIrrigationTankToApi = (uiTankNumber) => Number(uiTankNumber);

/** API tank_number = UI مخزن آبیاری */
export const apiIrrigationTankToUi = (apiTankNumber) => Number(apiTankNumber);
