import * as React from "react";
import { Typography, Box, Paper, Divider, Button, Modal } from "@mui/material";
import { AgCharts } from "ag-charts-react";
import svgTikeAsset from "../assets/svg/tike.svg";
import svgCrossAsset from "../assets/svg/cross.svg";
import svgSetting2Asset from "../assets/svg/setting2.svg";
import svgScheduleAsset from "../assets/svg/schedule.svg";
import TankCalibrationModal from "../components/common/TankCalibrationModal";
import Calculator from "../components/tools/Calculator";
import ModalCloseButton from "../components/common/ModalCloseButton";
import { uiIrrigationTankToApi, apiIrrigationTankToUi } from "../utils/tankMapping";
import { toPersianDigits } from "../utils/persianDigits";
import { getIrrigationScheduleDisplayStatus } from "../utils/irrigationScheduleStatus";

const MANUAL_ROW_BG = "#EEEEEE";
const DAY_SECONDS = 24 * 60 * 60;

const timeToSeconds = (time) => {
  if (!time) return null;
  const cleanTime = String(time).includes("T")
    ? String(time).split("T")[1].substring(0, 8)
    : String(time).substring(0, 8);
  const [hours, minutes, seconds = "0"] = cleanTime.split(":").map(Number);

  if ([hours, minutes, seconds].some(Number.isNaN)) return null;
  return hours * 3600 + minutes * 60 + seconds;
};

const getNextIrrigationIndex = (items = [], now = new Date()) => {
  const nowSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  return items.reduce(
    (best, item, index) => {
      if (item?.is_active === false) return best;
      const startSeconds = timeToSeconds(item?.start_time);
      if (startSeconds === null) return best;

      const delay = (startSeconds - nowSeconds + DAY_SECONDS) % DAY_SECONDS;
      if (delay < best.delay) return { index, delay };
      return best;
    },
    { index: -1, delay: Infinity },
  ).index;
};

const renderStatusIcon = (status, size = 16) => (
  <>
    {status === "tick" && (
      <img
        src={svgTikeAsset}
        alt="Success"
        style={{ width: size, height: size }}
      />
    )}
    {status === "cross" && (
      <img
        src={svgCrossAsset}
        alt="Error"
        style={{ width: size, height: size }}
      />
    )}
  </>
);

const getStatusCellSx = (status, width) => ({
  width,
  height: "32px",
  border:
    status === "tick"
      ? "1px solid #4CAF50"
      : status === "cross"
        ? "1px solid #F44336"
        : "0.5px solid #9F9F9F",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    status === "tick"
      ? "#E8F5E9"
      : status === "cross"
        ? "#FFEBEE"
        : "transparent",
});

const ScheduleCell = ({
  label,
  children,
  width,
  labelFontSize,
  boxSx,
  alignTop = false,
}) => (
  <div
    style={{
      height: alignTop ? "100%" : undefined,
      display: "flex",
      flexDirection: "column",
      justifyContent: alignTop ? undefined : "center",
      alignItems: "center",
    }}
  >
    <Typography color="initial" fontFamily="IRANSANS" fontSize={labelFontSize}>
      {label}
    </Typography>
    <Box
      sx={{
        width,
        height: "32px",
        border: "0.5px solid #9F9F9F",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontFamily: "IRANSANS",
        ...boxSx,
      }}
    >
      {children}
    </Box>
  </div>
);

const IrrigationCard = ({
  storageNumber,
  storageCapacity,
  maxStorageCapacity,
  float1,
  float2,
  float3,
  chartData = [],
  onClick,
  onClickSettings,
  irrigationScheduleItems = [],
  zoneOptions = [],
  cardWidth = "288px",
  cardScale = "scale(0.92)",
  titleWidth = "220px",
  titleBoxWidth = "180px",
  titleLabelWidth = "102px",
  chartAreaWidth = "259px",
  chartBoxWidth = "237px",
  tableWidth = "280px",
  scheduleRowWidth = "280px",
  scheduleRowScale = "0.9",
  timeBoxWidth = "65px",
  smallBoxWidth = "35px",
  scheduleRowJustifyContent = "space-between",
  scheduleFieldGap,
  unitInsideTitle = false,
  titleJustifyContent = "space-between",
  showScheduleScrollbar = false,
  showScheduleDetailStatus = false,
  scheduleLabelFontSize = 14,
  volumeStatusBoxWidth = smallBoxWidth,
}) => {
  const [isModalAOpen, setIsModalAOpen] = React.useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = React.useState(false);
  const scheduleListRef = React.useRef(null);
  const scheduleRowRefs = React.useRef([]);
  const apiTankNumber = uiIrrigationTankToApi(storageNumber);
  const displayStorageCapacity = Math.round(Number(storageCapacity || 0));
  const displayMaxStorageCapacity = Math.round(Number(maxStorageCapacity || 0));

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const getDisplayZone = (zone) => {
    const index = zoneOptions.indexOf(Number(zone));
    return index >= 0 ? index + 1 : apiIrrigationTankToUi(zone);
  };

  const chartOptions = React.useMemo(() => {
    const validValues = chartData
      .map((d) => d.filled_volume)
      .filter((v) => typeof v === "number");

    let min = 0;
    if (validValues.length > 0) {
      const dataMin = Math.min(...validValues);
      const buffer = dataMin * 0.2 || 1;
      min = Math.max(0, dataMin - buffer);
    }

    return {
      data: chartData,
      padding: { top: 5, right: 15, bottom: 5, left: 5 },
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "filled_volume",
          stroke: "#0077FF",
          strokeWidth: 2,
          marker: { enabled: false },
          connectMissingValues: false,
          tooltip: {
            renderer: ({ datum, xKey, yKey }) => {
              if (datum[yKey] === undefined || datum[yKey] === null)
                return { content: "No Data" };
              const date = datum[xKey];
              const timeString = date
                ? date.toLocaleTimeString("en-GB", { hour12: false })
                : "";
              return {
                title: toPersianDigits(timeString),
                content: `Volume: ${toPersianDigits(Math.round(Number(datum[yKey] || 0)))}`,
              };
            },
          },
        },
      ],
      axes: [
        {
          type: "time",
          position: "bottom",
          nice: true,
          label: { enabled: false },
          line: { enabled: false, width: 1, color: "#ccc" },
          tick: {
            enabled: true,
            color: "transparent",
            width: 1,
            size: 6,
          },
          gridStyle: [
            {
              stroke: "#000000",
              lineDash: [0],
              opacity: 0.3,
              width: 1,
            },
          ],
          crosshair: {
            enabled: true,
            stroke: "#999999",
            strokeWidth: 1,
          },
        },
        {
          type: "number",
          position: "left",
          min,
          max: maxStorageCapacity || 100,
          label: {
            enabled: true,
            fontSize: 9,
            color: "#333",
            formatter: ({ value }) =>
              toPersianDigits(Math.round(Number(value || 0))),
          },
          tick: { count: 3, enabled: true },
          gridStyle: [{ stroke: "#eee", lineDash: [2, 2] }],
          crosshair: { enabled: false },
        },
      ],
      legend: { enabled: false },
      background: { visible: false },
    };
  }, [chartData, maxStorageCapacity]);

  const handleCloseModalA = (e) => {
    if (e) e.stopPropagation();
    setIsModalAOpen(false);
  };

  const handleCloseCalculatorModal = (e) => {
    if (e) e.stopPropagation();
    setIsCalculatorModalOpen(false);
  };

  React.useEffect(() => {
    const nextIndex = getNextIrrigationIndex(irrigationScheduleItems);
    const listElement = scheduleListRef.current;
    const targetIndex = Math.min(
      irrigationScheduleItems.length - 1,
      Math.max(0, nextIndex + 3),
    );
    const rowElement = scheduleRowRefs.current[targetIndex];
    if (!listElement || !rowElement) return;

    const listRect = listElement.getBoundingClientRect();
    const rowRect = rowElement.getBoundingClientRect();
    const relativeTop = rowRect.top - listRect.top + listElement.scrollTop;

    listElement.scrollTop = Math.max(0, relativeTop - 6);
  }, [irrigationScheduleItems]);

  const calculatorModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    bgcolor: "#F0F0F0",
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: "15px",
    display: "block",
    overflow: "hidden",
    fontFamily: "IRANSANS",
  };

  return (
    <Paper
      onClick={onClick}
      sx={{
        width: cardWidth,
        height: "560px",
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 1,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
        p: 1.5,
        transform: cardScale,
        "&:hover": onClick ? { transform: "scale(1.02)" } : {},
      }}
    >
      <Box
        className="irrigation-card-title"
        sx={{
          width: titleWidth,
          height: "37px",
          display: "flex",
          justifyContent: titleJustifyContent,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: titleBoxWidth,
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: titleLabelWidth,
              height: "37px",
              borderRadius: "10px",
              borderRight: "0.5px solid #9F9F9F",
              backgroundColor: "#FFCB82",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              textAlign={"center"}
            >
              مخزن {toPersianDigits(storageNumber)}
            </Typography>
          </Box>
          {unitInsideTitle ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                fontFamily={"IRANSANS"}
                fontSize={21}
                textAlign={"center"}
              >
                {toPersianDigits(displayStorageCapacity)}
              </Typography>
              <Typography
                color="#5B5B5B"
                fontFamily={"IRANSANS"}
                fontSize={18}
                sx={{ mr: 0.25 }}
              >
                لیتر
              </Typography>
            </Box>
          ) : (
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={21}
              textAlign={"center"}
              flexGrow={1}
              alignContent={"center"}
            >
              {toPersianDigits(displayStorageCapacity)}
            </Typography>
          )}
        </Box>
        {!unitInsideTitle && (
          <Typography color="#5B5B5B" fontFamily={"IRANSANS"} fontSize={18}>
            لیتر
          </Typography>
        )}
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          نمودار سطح مخزن در طول روز
        </Typography>
      </Box>

      <Box
        sx={{
          width: chartAreaWidth,
          height: "102px",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-around",
          marginRight: "10px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: chartBoxWidth,
            height: "102px",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AgCharts
            options={chartOptions}
            style={{ width: "90%", height: "85%" }}
          />
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-around",
            position: "relative",
            right: "-19px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float3 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float2 ? "#00FF85" : "white",
            }}
          ></div>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "1px solid #9F9F9F",
              backgroundColor: float1 ? "#00FF85" : "white",
            }}
          ></div>
        </div>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
        >
          جدول آبیاری
        </Typography>
      </Box>

      <Box
        className="irrigation-card-table"
        sx={{
          width: tableWidth,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          ref={scheduleListRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
            scrollbarWidth: showScheduleScrollbar ? "thin" : "none",
            msOverflowStyle: showScheduleScrollbar ? "auto" : "none",
            "&::-webkit-scrollbar": {
              display: showScheduleScrollbar ? "block" : "none",
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#BDBDBD",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#F1F1F1",
              borderRadius: "4px",
            },
          }}
        >
          {irrigationScheduleItems.length > 0 ? (
            irrigationScheduleItems.map((item, index) => {
              const displayStatus = getIrrigationScheduleDisplayStatus(item);
              const volumeStatus =
                item.volume_status === null ||
                item.volume_status === undefined ||
                item.volume_status === ""
                  ? "-"
                  : item.volume_status;

              return (
                <React.Fragment key={index}>
                  <Box
                    ref={(element) => {
                      scheduleRowRefs.current[index] = element;
                    }}
                    sx={{
                      width: scheduleRowWidth,
                      height: "56px",
                      display: "flex",
                      justifyContent: scheduleRowJustifyContent,
                      alignItems: "center",
                      gap: scheduleFieldGap,
                      flexShrink: 0,
                      alignSelf: "center",
                      scale: scheduleRowScale,
                      backgroundColor: item.is_manual ? MANUAL_ROW_BG : "transparent",
                      borderRadius: item.is_manual ? "8px" : 0,
                      px: item.is_manual ? 0.5 : 0,
                    }}
                  >
                    <ScheduleCell
                      label="زمان شروع"
                      width={timeBoxWidth}
                      labelFontSize={scheduleLabelFontSize}
                      alignTop
                      boxSx={{ border: "0.3px solid #9F9F9F" }}
                    >
                        {toPersianDigits(formatTime(item.start_time))}
                    </ScheduleCell>
                    <ScheduleCell
                      label="زمان پایان"
                      width={timeBoxWidth}
                      labelFontSize={scheduleLabelFontSize}
                    >
                        {toPersianDigits(formatTime(item.end_time))}
                    </ScheduleCell>
                    <ScheduleCell
                      label="زون"
                      width={smallBoxWidth}
                      labelFontSize={scheduleLabelFontSize}
                    >
                        {toPersianDigits(getDisplayZone(item.zone))}
                    </ScheduleCell>
                    <ScheduleCell
                      label="حجم"
                      width={smallBoxWidth}
                      labelFontSize={scheduleLabelFontSize}
                    >
                        {toPersianDigits(item.volume)}
                    </ScheduleCell>
                    <ScheduleCell
                      label="وضعیت"
                      width={smallBoxWidth}
                      labelFontSize={scheduleLabelFontSize}
                      boxSx={getStatusCellSx(displayStatus, smallBoxWidth)}
                    >
                      {renderStatusIcon(displayStatus)}
                    </ScheduleCell>
                    {showScheduleDetailStatus && (
                      <ScheduleCell
                        label="آب‌رفته"
                        width={volumeStatusBoxWidth}
                        labelFontSize={scheduleLabelFontSize}
                      >
                        {toPersianDigits(volumeStatus)}
                      </ScheduleCell>
                    )}
                  </Box>
                  {index < irrigationScheduleItems.length - 1 && (
                    <Divider
                      sx={{ width: "100%", backgroundColor: "#9F9F9F" }}
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                fontFamily="IRANSANS"
                fontSize={14}
                color="text.secondary"
              >
                برنامه‌ای موجود نیست
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: "auto",
            pt: 1,
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalAOpen(true);
              }}
              sx={{
                flex: 1,
                height: "48px",
                backgroundColor: "#6CCDB0",
                color: "#000",
                fontFamily: "IRANSANS",
                fontSize: "13px",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#5bbd9e", boxShadow: "none" },
                display: "flex",
                gap: 1,
              }}
            >
              <img
                src={svgSetting2Asset}
                alt="calibration"
                style={{ width: "18px", height: "18px" }}
              />
              کالیبره مخزن
            </Button>

            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                if (onClickSettings) onClickSettings(e);
              }}
              sx={{
                flex: 1,
                height: "48px",
                backgroundColor: "#FFCB82",
                color: "#000",
                fontFamily: "IRANSANS",
                fontSize: "11px",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "none",
                display: "flex",
                gap: 1,
                "&:hover": { backgroundColor: "#eeb569", boxShadow: "none" },
              }}
            >
              <img
                src={svgScheduleAsset}
                alt="schedule"
                style={{ width: "18px", height: "18px" }}
              />
              برنامه زمانی آبیاری
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              setIsCalculatorModalOpen(true);
            }}
            sx={{
              width: "100%",
              height: "48px",
              backgroundColor: "#FF9933",
              color: "#fff",
              fontFamily: "IRANSANS",
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { backgroundColor: "#d67c22", boxShadow: "none" },
            }}
          >
            ماشین حساب آبیاری
          </Button>
        </Box>
      </Box>

      <TankCalibrationModal
        open={isModalAOpen}
        onClose={handleCloseModalA}
        displayNumber={storageNumber}
        apiTankNumber={apiTankNumber}
        float1={float1}
        float2={float2}
        float3={float3}
        fallbackVolume={displayStorageCapacity}
        fallbackMaxVolume={displayMaxStorageCapacity}
      />

      <Modal
        open={isCalculatorModalOpen}
        onClose={handleCloseCalculatorModal}
        aria-labelledby="irrigation-calculator-modal"
        disableScrollLock
      >
        <Box sx={calculatorModalStyle} onClick={(e) => e.stopPropagation()}>
          <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}>
            <ModalCloseButton onClick={handleCloseCalculatorModal} />
          </Box>
          <Calculator onClose={handleCloseCalculatorModal} />
        </Box>
      </Modal>
    </Paper>
  );
};

export default IrrigationCard;
