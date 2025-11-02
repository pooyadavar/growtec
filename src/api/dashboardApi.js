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
export const getInsideCliment = async (zoneId) => {
  // ما از apiClient استفاده می‌کنیم و دیگر نیازی به apiDomain نیست
  return apiClient.get(`/info/inside-climent/?zone=${zoneId}`);
};

export const getOutsideCliment = async () => {
  return apiClient.get('/info/outside-climent/');
};