import apiClient from "./apiClient";

export const getIrrigationTanksStatus = async () => {
  return apiClient.get('/info/irrigation-tanks-status/');
};

export const getMixTankStatus = async () => {
  return apiClient.get('/soluble/mix-tank-status/');
}

// --- تابع جدید برای کامپوننت Eghlim ---
/**
 * داده‌های اقلیم داخل را برای یک زون خاص واکشی می‌کند
 * @param {number} zoneId - شماره زون (مثلاً 1, 2, ...)
 */
export const getInsideCliment = async () => {
  // دیگر نیازی به کوئری پارامتر ?zone=x نیست
  return apiClient.get('/info/inside-climent/');
};

export const getOutsideCliment = async () => {
  return apiClient.get('/info/outside-climent/');
};