export const SUPERUSER_BYPASS_USERNAME = "iman";

export const hasSuperuserBypass = (username) =>
  username?.trim().toLowerCase() === SUPERUSER_BYPASS_USERNAME;
