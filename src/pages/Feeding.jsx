import Control from "../components/feeding/Control";
import FeedingStatusBar from "../components/feeding/FeedingStatusBar";
import DailyChart from "../components/feeding/DailyChart";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Modal,
} from "@mui/material";
import React, { useState } from "react";
import PhEcControlCardMixer from "../components/feeding/FeedingMixer";
import IconTextButton from "../card/IconTextButton";
import svgClockiconAsset from "../assets/svg/icon.svg";
import svgSetting2Asset from "../assets/svg/setting2.svg";
import svgTesttubeiconeAsset from "../assets/svg/TestTube.svg";
import svgAiiconAsset from "../assets/svg/Ai.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMixTankStatus } from "../api/dashboardApi";
import { getAiStatus, setAiStatus } from "../api/solubleApi";
import { getSolubleConfig } from "../api/configApi";
import FeedingHistoryPage from "./FeedingHistoryPage";
import FeedingSettingsPage from "./FeedingSettingsPage";
import TankCalibrationModal from "../components/common/TankCalibrationModal";
import ModalCloseButton from "../components/common/ModalCloseButton";
import { MIX_TANK_API_NUMBER } from "../utils/tankMapping";
import { queryKeys } from "../api/queryKeys";
import toast from "react-hot-toast";

const Feeding = () => {
  const queryClient = useQueryClient();
  const modalFrameStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "96vw", md: "91vw" },
    maxWidth: "1200px",
    height: { xs: "88vh", md: "760px" },
    maxHeight: "92vh",
    p: 1.5,
    bgcolor: "#efeeee",
    borderRadius: "15px",
    boxShadow: "0 22px 60px rgba(0, 0, 0, 0.18)",
    border: "1px solid rgba(120, 140, 120, 0.22)",
    overflow: "hidden",
    outline: "none",
  };

  const settingsModalFrameStyle = {
    ...modalFrameStyle,
    width: { xs: "96vw", md: "88vw" },
    maxWidth: "1280px",
    height: { xs: "88vh", md: "780px" },
  };

  const {
    data: mixTankData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.mixTankStatus(),
    queryFn: getMixTankStatus,
    refetchInterval: 2000,
    placeholderData: (previousData) => previousData,
  });

  const { data: solubleConfig } = useQuery({
    queryKey: queryKeys.solubleConfig(),
    queryFn: getSolubleConfig,
    staleTime: 5 * 60 * 1000,
  });

  const dosingPumpCount =
    solubleConfig?.number_of_dosing_pumps ??
    solubleConfig?.data?.number_of_dosing_pumps;

  const {
    data: aiStatusData,
    isLoading: isAiStatusLoading,
    isError: isAiStatusError,
  } = useQuery({
    queryKey: queryKeys.aiStatus(),
    queryFn: getAiStatus,
    refetchOnMount: "always",
  });

  const isAiOn = aiStatusData?.status === "on";
  const isAiButtonDisabled = isAiStatusLoading || isAiStatusError;

  const { mutate: toggleAiStatus, isPending: isAiStatusPending } = useMutation({
    mutationFn: setAiStatus,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.aiStatus() });
      const previousAiStatus = queryClient.getQueryData(queryKeys.aiStatus());
      queryClient.setQueryData(queryKeys.aiStatus(), {
        ...previousAiStatus,
        status: variables.status,
      });

      return { previousAiStatus };
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.aiStatus(), {
        ...data,
        status: variables.status,
      });
      toast.success(
        `هوش مصنوعی ${variables.status === "on" ? "فعال شد" : "غیرفعال شد"}`,
      );
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        queryKeys.aiStatus(),
        context?.previousAiStatus ?? { status: variables.status === "on" ? "off" : "on" },
      );
      console.error("Error setting AI status:", error);
      toast.error("خطا در تغییر وضعیت هوش مصنوعی");
    },
  });

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCalibModalOpen, setIsCalibModalOpen] = useState(false);

  const handleHistoryClick = () => setIsHistoryModalOpen(true);
  const handleAiClick = () => {
    if (isAiButtonDisabled || isAiStatusPending) return;
    toggleAiStatus({ status: isAiOn ? "off" : "on" });
  };
  const handleSettingsClick = () => setIsSettingsModalOpen(true);
  const handleCalibClick = () => setIsCalibModalOpen(true);

  return (
    <Container>
      <div
        style={{
          paddingTop: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "950px",
          height: "338px",
          gap: "0px",
        }}
      >
        <div
          style={{
            width: "295px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            scale: "0.6",
            position: "relative",
            top: "-60px",
            left: "30px",
            transform: "scaleX(1.05)",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={14}
            pb={1}
          >
            کنترل دستی
          </Typography>
          <Control />
        </div>
        <div
          style={{
            width: "274px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            scale: "0.88",
            position: "relative",
            top: "-18px",
            left: "55px",
            transform: "scaleX(1.05)",
            paddingTop: "5px",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={10}
            pb={1}
          >
            وضعیت محلول
          </Typography>
          <div
            style={{
              width: "100%",
              height: "310px",
              display: "flex",
              flexDirection: "column",

              justifyContent: "space-between",
            }}
          >
            <FeedingStatusBar />
            {/* <FeedingPlans /> */}
          </div>
        </div>
        <div
          style={{
            width: "750px",
            height: "338px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            scale: "0.63",
            position: "relative",
            top: "-53px",
            left: "80px",
            transform: "scaleX(1.07)",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            textAlign={"center"}
            fontSize={14}
            pb={1}
          >
            مخزن ساخت محلول
          </Typography>
          {/* <FeedingMixer /> */}
          {isLoading && !mixTankData ? (
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                width: "560px",
                height: "320px",
                minHeight:"300px",
                backgroundColor: "#ffff",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "10px",
              }}
            >
              <CircularProgress />
            </Paper>
          ) : isError && !mixTankData ? (
            <Alert severity="error">
              خطا: {error.message}
            </Alert>
          ) : (
            <PhEcControlCardMixer
              contents={mixTankData?.contents}
              mixTankData={mixTankData}
              ecValue={mixTankData?.ec_ph?.ec}
              phValue={mixTankData?.ec_ph?.ph}
              ecRange={mixTankData?.ec_ph?.range?.ec}
              phRange={mixTankData?.ec_ph?.range?.ph}
              dosingPumpCount={dosingPumpCount}
            />
          )}
          <Paper
            sx={{
              // boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
              borderRadius: "10px",
              height: "320px",
              backgroundColor: "#ffff",
              mt: "0.5rem",
            }}
          >
            <Stack
              direction="row"
              spacing={0}
              gap={5}
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              sx={{
                width: "95%",
                margin: "5px 0",
                px: "0px",
                transform: "scale(0.95, 0.85)",
              }}
            >
              <Box>
                <IconTextButton
                  icon={svgClockiconAsset}
                  text="تاریخچه ساخت "
                  bgColor="#FFD799"
                  textColor="#333"
                  onClick={handleHistoryClick}
                  width="110px"

                />
              </Box>

              <Box>
                <IconTextButton
                  icon={svgSetting2Asset}
                  text="کالیبره مخزن"
                  bgColor="#6CCDB0"
                  textColor="#333"
                  onClick={handleCalibClick}
                  width="110px"
                />
              </Box>

              <Box>
                <IconTextButton
                  icon={svgTesttubeiconeAsset}
                  text="تنظیمات محلول"
                  bgColor="#86CCB2"
                  textColor="#333"
                  onClick={handleSettingsClick}
                  width="110px"
                />
              </Box>

              <Box>
                <IconTextButton
                  icon={svgAiiconAsset}
                  text={isAiOn ? "هوش مصنوعی فعال" : "هوش مصنوعی غیرفعال"}
                  bgColor={isAiOn ? "#B8FFDD" : "#FED9D9"}
                  textColor={isAiOn ? "#004323" : "#CC0000"}
                  borderColor={isAiOn ? "#004323" : "#CC0000"}
                  onClick={handleAiClick}
                  width="100px"
                  sx={{
                    transform: "scaleY(0.79)",
                    opacity: isAiButtonDisabled || isAiStatusPending ? 0.65 : 1,
                    cursor:
                      isAiButtonDisabled || isAiStatusPending
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </Box>




            </Stack>
          </Paper>
        </div>
      </div>
      <Modal
        open={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        aria-labelledby="feeding-history-modal-title"
      >
        <Box sx={modalFrameStyle}>
          <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
            <ModalCloseButton onClick={() => setIsHistoryModalOpen(false)} />
          </Box>
          <Box sx={{ width: "100%", height: "100%", overflow: "auto", pt: 1 }}>
            <FeedingHistoryPage
              isModal
              onClose={() => setIsHistoryModalOpen(false)}
            />
          </Box>
        </Box>
      </Modal>
      <Modal
        open={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        aria-labelledby="feeding-settings-modal-title"
      >
        <Box sx={settingsModalFrameStyle}>
          <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
            <ModalCloseButton onClick={() => setIsSettingsModalOpen(false)} />
          </Box>
          <Box sx={{ width: "100%", height: "100%", overflow: "auto", pt: 1 }}>
            <FeedingSettingsPage
              isModal
              onClose={() => setIsSettingsModalOpen(false)}
            />
          </Box>
        </Box>
      </Modal>
      <TankCalibrationModal
        open={isCalibModalOpen}
        onClose={() => setIsCalibModalOpen(false)}
        displayNumber="ساخت محلول"
        apiTankNumber={MIX_TANK_API_NUMBER}
        tankType="mix"
        float1={mixTankData?.contents?.buttom_float_switch}
        float2={mixTankData?.contents?.middle_float_switch}
        float3={mixTankData?.contents?.top_float_switch}
        fallbackVolume={mixTankData?.contents?.filled_volume}
        fallbackMaxVolume={mixTankData?.contents?.max_volume}
        externalContents={mixTankData?.contents}
      />
      <div
        style={{
          marginTop: "125px",
          position: "relative",
          top: "-180px",
          transform: "scaleY(0.90)",
        }}
      >
        <DailyChart />
      </div>
    </Container>
  );
};
export default Feeding;
