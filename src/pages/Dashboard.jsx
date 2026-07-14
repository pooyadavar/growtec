import Around from "../components/dashboard/Around";
import Eghlim from "../components/dashboard/Eghlim";
import ErrorComponent from "../components/dashboard/ErrorComponent";
import PhEcControlCard from "../components/dashboard/Mixer";
import StatusBar from "../components/dashboard/StatusBar";
import Storages from "../components/dashboard/Storages";
import { Container, Typography, CircularProgress, Alert, Box, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getMixTankStatus, getIrrigationTanksStatus } from "../api/dashboardApi";
import { queryKeys } from "../api/queryKeys";

const Dashboard = () => {
  sessionStorage.setItem("sample", 2);

  const {
    data: mixTankData,
    isLoading: isMixTankLoading,
    isError: isMixTankError,
    isRefetchError: isMixTankRefetchError,
  } = useQuery({
    queryKey: queryKeys.mixTankStatus(),
    queryFn: getMixTankStatus,
    refetchInterval: 2000,
  });

  const {
    data: storagesList,
    isLoading: isStoragesLoading,
    isError: isStoragesError,
    isRefetchError: isStoragesRefetchError,
  } = useQuery({
    queryKey: queryKeys.irrigationTanks(),
    queryFn: getIrrigationTanksStatus,
    refetchInterval: 5000,
    select: (data) => {
      if (!data || typeof data !== "object") return [];
      return Object.entries(data)
        .map(([key, value]) => ({
          id: key,
          ...value?.contents,
        }))
        .filter((item) => item.max_volume != null);
    },
  });

  const mixTankFetchFailed =
    (isMixTankError || isMixTankRefetchError) && !mixTankData;
  const mixTankInitialLoading = isMixTankLoading && !mixTankData;
  const storagesFetchFailed =
    (isStoragesError || isStoragesRefetchError) && !storagesList?.length;
  const storagesInitialLoading = isStoragesLoading && !storagesList?.length;

  return (
    <Container
      className="dashboard-display"
      sx={{ marginTop: "1rem", height: "100%" }}
    >
      <div
        className="top"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div className="errors" style={{ height: "351px", scale: "0.9" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={12}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            خطاها
          </Typography>
          <ErrorComponent />
        </div>
        <div className="mixer" style={{ height: "351px", scale: "0.9" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={12}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            فرایند ساخت محلول
          </Typography>
          {mixTankInitialLoading ? (
            <Paper
              elevation={3}
              sx={{
                width: "360px",
                height: "320px",
                backgroundColor: "#ffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
                borderRadius: "10px",
              }}
            >
              <CircularProgress />
            </Paper>
          ) : mixTankFetchFailed ? (
            <Alert severity="error">خطا در دریافت اطلاعات مخزن</Alert>
          ) : (
            <PhEcControlCard
              contents={mixTankData?.contents}
              mixTankData={mixTankData}
            />
          )}
        </div>
        <div
          className="status-storages"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "351px",
            paddingBottom: "4px",
            scale: "0.9",
          }}
        >
          <div style={{ marginBottom: "0", width: "100%", minHeight: "150px" }}>
            <Typography
              color="initial"
              fontFamily={"IRANSANS"}
              fontSize={12}
              textAlign={"center"}
              paddingBottom={"5px"}
            >
              وضعیت محلول
            </Typography>
            {mixTankInitialLoading ? (
              <Paper
                sx={{
                  width: "350px",
                  height: "100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
                  backgroundColor: "#ffff",
                }}
              >
                <CircularProgress size={30} />
              </Paper>
            ) : mixTankFetchFailed ? (
              <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
                خطا در دریافت اطلاعات
              </Alert>
            ) : (
              <StatusBar
                ecValue={mixTankData?.ec_ph?.ec}
                phValue={mixTankData?.ec_ph?.ph}
                ecRange={mixTankData?.ec_ph?.range?.ec}
                phRange={mixTankData?.ec_ph?.range?.ph}
              />
            )}
          </div>
          <div>
            <Typography
              color="initial"
              fontFamily={"IRANSANS"}
              fontSize={12}
              textAlign={"center"}
              paddingBottom={"5px"}
            >
              {" "}
              مخازن آبیاری
            </Typography>
            {storagesInitialLoading ? (
              <Paper
                sx={{
                  width: "340px",
                  height: "184px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
                  backgroundColor: "#ffff",
                }}
              >
                <CircularProgress size={30} />
              </Paper>
            ) : storagesFetchFailed ? (
              <Alert severity="error" sx={{ fontSize: "0.8rem" }}>
                خطا در دریافت اطلاعات
              </Alert>
            ) : (
              <Storages storagesList={storagesList} />
            )}
          </div>
        </div>
      </div>
      <div
        className="bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
        }}
      >
        <div className="around" style={{ height: "240px", scale: "0.95" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={12}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            هواشناسی
          </Typography>
          <Around />
        </div>
        <div className="eghlim" style={{ height: "240px", scale: "0.95" }}>
          <Typography
            color="initial"
            fontFamily={"IRANSANS"}
            fontSize={12}
            textAlign={"center"}
            paddingBottom={"5px"}
          >
            اقلیم داخلی
          </Typography>
          <Eghlim />
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
