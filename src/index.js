import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient } from "./lib/queryClient";
import { idbPersister } from "./lib/idbPersister";
import { startBackgroundPrefetch } from "./lib/backgroundPrefetch";

const theme = createTheme();
const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? React.lazy(() =>
        import("@tanstack/react-query-devtools").then((module) => ({
          default: module.ReactQueryDevtools,
        }))
      )
    : null;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <PersistQueryClientProvider
        client={queryClient}
        onSuccess={() => {
          startBackgroundPrefetch(queryClient);
        }}
        persistOptions={{
          persister: idbPersister,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => {
              return query.state.status === "success";
            },
          },
        }}
      >
        <App />
        {ReactQueryDevtools ? (
          <React.Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </React.Suspense>
        ) : null}
      </PersistQueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);
