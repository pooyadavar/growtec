const toNumber = (value) => Number(value);

const isStatus = (value, expected) => toNumber(value) === expected;

const hasError = (value) => value === true || value === "true";

const hasNonZeroVolumeStatus = (value) => {
  if (value === null || value === undefined || value === "") return false;
  const numberValue = toNumber(value);
  return !Number.isNaN(numberValue) && numberValue !== 0;
};

const timeToSeconds = (time) => {
  if (!time) return null;

  const cleanTime = String(time).includes("T")
    ? String(time).split("T")[1].substring(0, 8)
    : String(time).substring(0, 8);
  const [hours, minutes, seconds = "0"] = cleanTime.split(":").map(Number);

  if ([hours, minutes, seconds].some(Number.isNaN)) return null;

  return hours * 3600 + minutes * 60 + seconds;
};

const hasEndTimePassed = (startTime, endTime, now = new Date()) => {
  const startSeconds = timeToSeconds(startTime);
  const endSeconds = timeToSeconds(endTime);
  if (endSeconds === null) return false;

  const nowSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  if (startSeconds !== null && endSeconds < startSeconds) {
    return nowSeconds >= endSeconds && nowSeconds < startSeconds;
  }

  return nowSeconds > endSeconds;
};

export const getIrrigationScheduleDisplayStatus = (row, now) => {
  const volumeDone = hasNonZeroVolumeStatus(row?.volume_status);

  if (isStatus(row?.start_status, 2) && (isStatus(row?.end_status, 2) || volumeDone)) {
    return hasError(row?.has_error) ? "cross" : "tick";
  }

  if (
    ((isStatus(row?.start_status, 2) && !isStatus(row?.end_status, 2)) ||
      (isStatus(row?.start_status, 1) && isStatus(row?.end_status, 1))) &&
    !volumeDone &&
    hasEndTimePassed(row?.start_time, row?.end_time, now)
  ) {
    return "cross";
  }

  if (isStatus(row?.start_status, 3) && isStatus(row?.end_status, 3)) {
    return hasError(row?.has_error) ? "cross" : "tick";
  }

  if (isStatus(row?.start_status, 4) || isStatus(row?.end_status, 4)) {
    return "cross";
  }

  return "blank";
};
