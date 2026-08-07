const NETWORK_STATUS_EVENT = "growtec-network-status";
const FAILED_REQUEST_THRESHOLD = 10;

let failedRequestCount = 0;
let hasConnectionIssue = false;

const emitNetworkStatus = () => {
  window.dispatchEvent(
    new CustomEvent(NETWORK_STATUS_EVENT, {
      detail: getNetworkStatus(),
    }),
  );
};

export const getNetworkStatus = () => ({
  failedRequestCount,
  hasConnectionIssue,
});

export const subscribeNetworkStatus = (callback) => {
  const handleStatusChange = (event) => callback(event.detail);
  window.addEventListener(NETWORK_STATUS_EVENT, handleStatusChange);

  return () => {
    window.removeEventListener(NETWORK_STATUS_EVENT, handleStatusChange);
  };
};

export const recordApiSuccess = () => {
  if (failedRequestCount === 0 && !hasConnectionIssue) return;

  failedRequestCount = 0;
  hasConnectionIssue = false;
  emitNetworkStatus();
};

export const recordApiFailure = (error) => {
  const isConnectionFailure =
    !error?.response ||
    error?.code === "ERR_NETWORK" ||
    error?.code === "ECONNABORTED";

  if (!isConnectionFailure) return;

  failedRequestCount += 1;
  const nextHasConnectionIssue = failedRequestCount >= FAILED_REQUEST_THRESHOLD;

  if (nextHasConnectionIssue !== hasConnectionIssue) {
    hasConnectionIssue = nextHasConnectionIssue;
    emitNetworkStatus();
  }
};
