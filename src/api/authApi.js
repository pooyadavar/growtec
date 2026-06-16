import apiClient from "./apiClient";

export const loginToken = async (username, password) => {
  return apiClient.post("/token/", { username, password });
};
