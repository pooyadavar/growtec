export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m, s] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0) + (s || 0) / 60;
};

export const getMinutesFromEnd = (timeStr, lastTimeMinutes) => {
  const current = timeToMinutes(timeStr);
  let diff = lastTimeMinutes - current;
  if (diff < 0) diff += 24 * 60;
  return diff;
};

/** Coarser labels for older hours, finer near latest time */
export const shouldShowAdaptiveTimeLabel = (timeStr, lastTimeMinutes) => {
  if (!timeStr || lastTimeMinutes == null) return false;

  const minutesFromEnd = getMinutesFromEnd(timeStr, lastTimeMinutes);
  const currentMinutes = timeToMinutes(timeStr);
  const minute = Math.floor(currentMinutes % 60);
  const hour = Math.floor(currentMinutes / 60);

  if (minutesFromEnd <= 15) return true;

  if (minutesFromEnd <= 120) {
    return minute % 15 === 0;
  }
  if (minutesFromEnd <= 360) {
    return minute === 0 || minute === 30;
  }
  if (minutesFromEnd <= 720) {
    return minute === 0;
  }
  return minute === 0 && hour % 3 === 0;
};

/** Thin early-day points, keep recent detail */
export const downsampleSeriesByTime = (data, lastTimeMinutes) => {
  if (!data?.length) return [];
  if (data.length <= 60) return data;

  const result = [];
  let lastKeptMinutes = -Infinity;

  data.forEach((point, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === data.length - 1;
    const minutesFromEnd = getMinutesFromEnd(point.time, lastTimeMinutes);
    const current = timeToMinutes(point.time);

    let minGapMinutes;
    if (minutesFromEnd <= 120) minGapMinutes = 10;
    else if (minutesFromEnd <= 360) minGapMinutes = 20;
    else if (minutesFromEnd <= 720) minGapMinutes = 45;
    else minGapMinutes = 90;

    if (
      isFirst ||
      isLast ||
      current - lastKeptMinutes >= minGapMinutes
    ) {
      result.push(point);
      lastKeptMinutes = current;
    }
  });

  return result;
};

export const payeshChartTheme = {
  overrides: {
    common: {
      title: { fontFamily: "IRANSANS" },
      legend: { item: { label: { fontFamily: "IRANSANS" } } },
      axes: {
        number: { label: { fontFamily: "IRANSANS" } },
        category: { label: { fontFamily: "IRANSANS" } },
      },
    },
  },
};
