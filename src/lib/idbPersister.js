import { get, set, del } from "idb-keyval";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

export const idbPersister = createAsyncStoragePersister({
  throttleTime: 10000,
  storage: {
    getItem: async (key) => {
      const value = await get(key);
      return value ?? null;
    },
    setItem: async (key, value) => {
      await set(key, value);
    },
    removeItem: async (key) => {
      await del(key);
    },
  },
});
