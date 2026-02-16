import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import assets from "../assets";
import IconTextButton from "./IconTextButton";
import { AgCharts } from "ag-charts-react";
import { TransitionGroup } from "react-transition-group";
import {
  createOperatorSchedule,
  updateOperatorSchedule,
  deleteOperatorSchedule,
} from "../api/climateApi";
import toast from "react-hot-toast";

const operatorTranslations = {
  exhaust_fan_1: "فن اگزاست ۱",
  exhaust_fan_2: "فن اگزاست ۲",
  exhaust_fan_3: "فن اگزاست ۳",
  exhaust_fan_4: "فن اگزاست ۴",
  exhaust_fan_5: "فن اگزاست ۵",
  circule_fan_1: "فن سیرکوله ۱",
  circule_fan_2: "فن سیرکوله ۲",
  pad_pump: "پمپ پد",
  fogger: "مه پاش",
  hatch_opening: "باز کردن دریچه",
  hatch_closing: "بستن دریچه",
  shade_opening: "باز کردن پرده",
  shade_closing: "بستن پرده",
  hiter_1: "هیتر ۱",
  hiter_2: "هیتر ۲",
  hiter_3: "هیتر ۳",
  hiter_4: "هیتر ۴",
};

const TimePlansCards = ({
  fan,
  float1,
  float2,
  float3,
  data,
  zone,
  schedules = [],
  onRefresh,
}) => {
  const [rows, setRows] = useState([]);
  const [initialRows, setInitialRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const translatedFanName = operatorTranslations[fan] || fan;

  const hasChanges = useMemo(() => {
    // Check for any new rows
    if (rows.some(row => row.isNew)) {
      return true;
    }

    // Filter out rows that are only in `rows` (meaning deleted from server but not saved yet, or just new rows not yet in initialRows)
    const currentServerRows = rows.filter(r => !r.isNew);

    // Check if number of server-sourced rows changed (deletion/addition not yet saved)
    if (currentServerRows.length !== initialRows.length) {
      return true;
    }

    // Check if any existing row has been modified
    for (const currentRow of currentServerRows) {
      const initialRow = initialRows.find(ir => ir.id === currentRow.id);
      
      // If an initialRow is not found, it means this row is new, or was deleted from initialRows.
      // This should ideally be covered by length check, but also handles cases where IDs might mismatch or a row was replaced.
      if (!initialRow) {
        return true;
      }

      // Deep comparison of relevant fields
      if (
          currentRow.start_time !== initialRow.start_time ||
          currentRow.end_time !== initialRow.end_time ||
          Number(currentRow.on_time) !== Number(initialRow.on_time) ||
          Number(currentRow.off_time) !== Number(initialRow.off_time) ||
          currentRow.is_active !== initialRow.is_active
      ) {
          return true;
      }
    }

    return false;
  }, [rows, initialRows]);

  useEffect(() => {
    if (Array.isArray(schedules)) {
      const mappedServerRows = schedules.map(s => ({
        ...s,
        uiId: s.id, // Use ID from API as stable ID
        isNew: false,
        is_active: s.is_active !== undefined ? s.is_active : true,
        isChanging: false
      }));
      setInitialRows(mappedServerRows); // Set original server state
      
      setRows(prevRows => {
        const newRows = prevRows.filter(r => r.isNew); // Keep local new rows
        return [...mappedServerRows, ...newRows]; // Merge
      });
    }
  }, [schedules]);

  const handleAddRow = () => {
    setRows((prevRows) => [
      {
        uiId: crypto.randomUUID(),
        isNew: true,
        start_time: "00:00:00",
        end_time: "00:00:00",
        on_time: 0,
        off_time: 0,
        is_active: true,
        isChanging: false,
      },
      ...prevRows, // Prepends new row to the beginning
    ]);
  };

  const handleToggleActive = (uiId) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.uiId === uiId) {
          return { ...row, isChanging: true };
        }
        return row;
      }),
    );

    setTimeout(() => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.uiId === uiId) {
            return { ...row, is_active: !row.is_active, isChanging: false };
          }
          return row;
        }),
      );
    }, 200);
  };

  const handleDeleteRow = async (row) => {
    // Optimistic update: remove immediately from UI
    setRows((prevRows) => prevRows.filter((r) => r.uiId !== row.uiId));
    
    if (!row.isNew) {
      try {
        await deleteOperatorSchedule(row.id);
        toast.success("حذف شد");
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error(error);
        toast.error("خطا در حذف");
        if (onRefresh) onRefresh();
      }
    }
  };

  const handleInputChange = (uiId, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.uiId === uiId ? { ...row, [field]: value } : row)),
    );
  };

  const handleSave = async () => {
    setLoading(true);
    let hasError = false;
    try {
      for (const row of rows) {
        let startTime = row.start_time;
        let endTime = row.end_time;

        if (startTime && startTime.length === 5) startTime += ":00";
        if (endTime && endTime.length === 5) endTime += ":00";

        const payload = {
          zone: zone || 1,
          operator: fan,
          start_time: startTime,
          end_time: endTime,
          on_time: Number(row.on_time),
          off_time: Number(row.off_time),
          is_active: row.is_active,
          start_status: 4294967295,
          end_status: 4294967295,
        };

        try { // Inner try-catch for specific error handling per row
          if (row.isNew) {
            await createOperatorSchedule(payload);
          } else {
            await updateOperatorSchedule(row.id, payload);
          }
        } catch (rowError) {
          hasError = true;
          console.error("Row save error:", rowError);

          // Check for 400 error specifically for on_time/off_time being 0
          if (
            rowError.response?.status === 400 &&
            (payload.on_time === 0 || payload.off_time === 0)
            // Can add more specific checks from rowError.response.data if available
            // e.g., rowError.response.data.detail?.includes("cannot be 0")
          ) {
            toast.error(`خطا: فیلدهای روشن و خاموش نمی‌توانند 0 باشند.`); // Specific message
          } else {
            toast.error(`خطا در ذخیره سازی ردیف: ${rowError.response?.data?.detail || rowError.message || "نامشخص"}`);
          }
          // Decide whether to continue or break the loop
          break; // Exit loop on first error
        }
      }

      if (!hasError) {
        toast.success("تغییرات ذخیره شد");
        const updatedRows = rows.map(r => ({ ...r, isNew: false }));
        setRows(updatedRows);
        setInitialRows(updatedRows.filter(r => !r.isNew)); // Update initialRows from successfully saved (now non-new) rows
        if (onRefresh) onRefresh();
      } else {
         // If there was an error, re-fetch to restore correct state if some saved before error
         if (onRefresh) onRefresh();
      }
    } catch (generalError) { // This catch will only be hit if something outside the loop fails, unlikely
      console.error(generalError);
      toast.error("خطا کلی در ذخیره سازی");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = useMemo(
    () => ({
      data: data || [],
      series: [
        {
          type: "line",
          xKey: "time",
          yKey: "value",
          yName: fan,
          stroke: "#007bff",
          strokeWidth: 3,
          marker: {
            enabled: true,
            size: 5,
            fill: "#007bff",
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          label: {
            enabled: false,
          },
        },
        {
          type: "number",
          position: "left",
          min: 0,
          max: 1,
          nice: false,
          tick: {
            values: [0, 1],
            count: 2,
          },
          label: {
            formatter: (params) => {
              if (params.value === 1) return "روشن";
              if (params.value === 0) return "خاموش";
              return "";
            },
            fontSize: 10,
          },
          gridStyle: [
            {
              stroke: "#e2e2e2",
              lineDash: [4, 2],
            },
          ],
        },
      ],
      background: {
        fill: "transparent",
      },
      padding: {
        top: 5,
        right: 10,
        bottom: 20,
        left: 5,
      },
    }),
    [data, fan],
  );

  return (
    <Container
      sx={{
        width: "400px", // Increased width in previous step
        height: "580px", // Reduced height in previous step
        bgcolor: "#FFFFFF",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        transition: "transform 0.2s",
        p: 2,
        transform: "scale(1)",
      }}
    >
      <Box
        className="irrigation-card-title"
        sx={{
          width: "300px", // Increased width in previous step
          height: "37px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "102px",
            height: "37px",
            borderRadius: "10px",
            border: "0.5px solid #9F9F9F",
            backgroundColor: "#FFCB82",
          }}
        >
          <Typography
            fontFamily={"IRANSANS"}
            fontSize={16} // Reduced font size to fit longer names
            textAlign={"center"}
          >
            {translatedFanName}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={14}
          textAlign={"center"}
          sx={{ wordSpacing: "4px" }}
        >
          تاریخچه عملگر{" "}
        </Typography>
      </Box>

      <Box // This box now directly contains only the chart.
        sx={{
          width: "350px", // Increased width in previous step
          height: "113px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box // This is the chart container itself
          sx={{
            width: "100%", // Now fills its parent
            height: "113px",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            paddingTop: "15px",
            paddingRight: "15px",
          }}
        >
          <Box sx={{ width: "100%", height: "calc(100% - 10px)" }}>
            {" "}
            {/* Also fills its parent */}
            <AgCharts
              options={chartOptions}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>
      </Box>

      <Box my={3}>
        {/* <Typography
          color="initial"
          fontFamily={"IRANSANS"}
          fontSize={16}
          textAlign={"center"}
        >
          تاریخچه وضعیت عملگر
        </Typography> */}
      </Box>

      <Box
        className="irrigation-card-table"
        sx={{
          width: "360px", // Increased width in previous step
          height: "260px",
          minHeight: "275px",
          display: "flex",
          flexDirection: "column",
        }}
      >
          <Box // Header Always Visible
            sx={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              mb: 1,
              backgroundColor: "#F3F4F6",
              borderRadius: "8px",
              padding: "8px 4px",
              alignItems: "center"
            }}
          >
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "30px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              وضعیت
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "75px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              شروع
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "75px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              پایان
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "50px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              روشن
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "50px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              خاموش
            </Typography>
            <Typography
              fontFamily={"IRANSANS"}
              fontSize={10}
              sx={{ width: "20px", textAlign: "center", fontWeight: "bold", color: "#555" }}
            >
              حذف
            </Typography>
          </Box>

        <Box // Scrollable content or message
          sx={{
            width: "98%",
            flexGrow: 1, // This makes the box fill remaining vertical space
            maxHeight: rows.length > 0 ? "220px" : "auto",
            overflowY: rows.length > 0 ? "auto" : "hidden",
            paddingRight: rows.length > 0 ? "4px" : "0",
            mb: 1,
            display: "flex",
            flexDirection: "column", // ADDED: Ensure rows stack vertically
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && rows.length === 0 && ( // Changed condition: only show spinner if empty AND loading
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {rows.length > 0
            ? (
              <TransitionGroup style={{ width: "98%" }}>
                {rows.map((row) => (
                  <Collapse key={row.uiId}>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        py: 1,
                        mb: 1,
                        border: row.isNew ? "1px dashed #2196F3" : "1px solid #F3F4F6",
                        borderRadius: "8px",
                        backgroundColor: row.isNew ? "#E3F2FD" : "transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                           borderColor: row.isNew ? "#2196F3" : "#E5E7EB",
                           boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: "30px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          onClick={() => handleToggleActive(row.uiId)}
                          className={`on-and-off-btn ${row.isChanging ? "changing" : ""}`}
                          src={
                            row.is_active
                              ? assets.svg.buttonOn
                              : assets.svg.buttonOff
                          }
                          alt="Toggle"
                          style={{
                            cursor: "pointer",
                            width: "30px",
                            height: "auto",
                          }}
                        />
                      </Box>

                      <TextField
                        variant="standard"
                        size="small"
                        type="time"
                        value={row.start_time?.substring(0, 5) || "00:00"}
                        onChange={(e) =>
                          handleInputChange(
                            row.uiId,
                            "start_time",
                            e.target.value,
                          )
                        }
                        sx={{
                          width: "75px",
                          "& .MuiInputBase-input": {
                            p: 0.5,
                            fontSize: "12px",
                            textAlign: "center",
                          },
                          "& .MuiInput-underline:before": { borderBottom: "none" },
                          "& .MuiInput-underline:after": { borderBottom: "2px solid #FFCB82" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #ddd" }
                        }}
                      />
                      <TextField
                        variant="standard"
                        size="small"
                        type="time"
                        value={row.end_time?.substring(0, 5) || "00:00"}
                        onChange={(e) =>
                          handleInputChange(row.uiId, "end_time", e.target.value)
                        }
                        sx={{
                          width: "75px",
                          "& .MuiInputBase-input": {
                            p: 0.5,
                            fontSize: "12px",
                            textAlign: "center",
                          },
                          "& .MuiInput-underline:before": { borderBottom: "none" },
                          "& .MuiInput-underline:after": { borderBottom: "2px solid #FFCB82" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #ddd" }
                        }}
                      />
                      <TextField
                        variant="standard"
                        size="small"
                        type="number"
                        value={row.on_time}
                        onChange={(e) =>
                          handleInputChange(row.uiId, "on_time", e.target.value)
                        }
                        sx={{
                          width: "50px",
                          "& .MuiInputBase-input": {
                            p: 0.5,
                            fontSize: "12px",
                            textAlign: "center",
                          },
                          "& .MuiInput-underline:before": { borderBottom: "none" },
                          "& .MuiInput-underline:after": { borderBottom: "2px solid #FFCB82" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #ddd" }
                        }}
                      />
                      <TextField
                        variant="standard"
                        size="small"
                        type="number"
                        value={row.off_time}
                        onChange={(e) =>
                          handleInputChange(row.uiId, "off_time", e.target.value)
                        }
                        sx={{
                          width: "50px",
                          "& .MuiInputBase-input": {
                            p: 0.5,
                            fontSize: "12px",
                            textAlign: "center",
                          },
                          "& .MuiInput-underline:before": { borderBottom: "none" },
                          "& .MuiInput-underline:after": { borderBottom: "2px solid #FFCB82" },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "1px solid #ddd" }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteRow(row)}
                        sx={{ p: 0.5, width: "20px", color: "#ef5350" }}
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Box>
                  </Collapse>
                ))}
              </TransitionGroup>
            )
            : !loading && ( // Only show message if not loading
                <Typography fontFamily={"IRANSANS"} color="text.secondary">
                  برنامه زمانی ای تنظیم نشده
                </Typography>
              )}
        </Box>

        <Box // Buttons Box - Moved to bottom
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "right", // Center buttons
            gap: 8, // Space between buttons
            mb: 3,
            mt: 2,

          }}
        >
          <IconTextButton
            text="اضافه کردن سطر"
            icon={assets?.svg?.addField}
            iconPosition="left"
            bgColor="#FFCB82"
            textColor="#000000"
            width="40%"
            height="20px"
            borderColor="#FFCB82"
            onClick={handleAddRow}
            sx={{
              justifyContent: "center",
              gap: 1,
              "& .MuiTypography-root": {
                fontSize: "11px",
              },
            }}
          />
          <IconTextButton
            text={loading ? "..." : "ذخیره"}
            icon={!loading ? assets?.svg?.Save : null}
            iconPosition="left"
            bgColor={!loading && hasChanges ? "#86CCB2" : "#dbf5eb"} 
            textColor="#000000"
            width="30%"
            height="20px"
            borderColor={!loading && hasChanges ? "#86CCB2" : "#119162"}
            onClick={handleSave}
            disabled={loading || !hasChanges}
            sx={{
              justifyContent: "center",
              gap: 1,
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
export default TimePlansCards;
