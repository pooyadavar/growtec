import React from "react";
import assets from "../../assets";
import {
  Container,
  Button,
  Typography,
  Modal,
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

const FeedingPlans = () => {
  const [isChanging, setIsChanging] = React.useState(false);

  const changOnAndOff = () => {
    setIsChanging(true);
    setTimeout(() => {
      setActivity(!activity);
      setIsChanging(false);
    }, 200); // Match this to the CSS transition duration
  };
  const [zone, setZone] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState("");
  const handleZoneChange = (event) => {
    event.preventDefault();
    setSelectedZone(event.target.value);
    setZone(event.target.value);
    console.log(event.target.value);
  };
  const [type, setType] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");
  const handleTypeChange = (event) => {
    event.preventDefault();
    setSelectedType(event.target.value);
    setType(event.target.value);
    console.log(event.target.value);
  };

  const numbers = `۰۱۲۳۴۵۶۷۸۹`;
  const convert = (num) => {
    let res = "";
    const str = num.toString();
    for (let c of str) {
      res += numbers.charAt(c);
    }
    return res;
  };

  const [activity, setActivity] = React.useState(false);
  const [modalPlans, setModalPlans] = React.useState(false);
  const handleModalPlansClose = () => setModalPlans(false);
  const handleModalPlansOpen = () => setModalPlans(true);

  return (
    <Container
      sx={{
        width: "274px",
        height: "90px",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
        border: "0.5px solid #008143",
        bgcolor: "#B8FFDD",
        padding: "0 !important",
      }}
    >
      <Button
        sx={{
          color: "#1E1E1E",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
        onClick={handleModalPlansOpen}
      >
        <Typography color="initial" fontFamily={"IRANSANS"}>
          برنامه ساخت محلول غذایی
        </Typography>
      </Button>
      <Modal
        open={true}
        className="plans-modal"
        disableAutoFocus
        onClose={handleModalPlansClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "0.5px solid #9F9F9F",
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            width: "964px",
            height: "324px",
            boxShadow: 24,
            padding: "8px 8px 40px 8px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="modalBox"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography fontFamily={"IRANSANS"} fontSize={14}>
              برنامه زمانی ساخت محلول
            </Typography>
            <img
              className="close-btn"
              src={assets.svg.close}
              alt="close"
              onClick={handleModalPlansClose}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Box
              sx={{
                marginLeft: "10px",
              }}
            >
              <img
                onClick={changOnAndOff}
                className={`on-and-off-btn ${isChanging ? "changing" : ""}`}
                src={activity ? assets.svg.buttonOn : assets.svg.buttonOff}
                alt=""
              />
            </Box>
            <Box
              sx={{
                width: "798px",
                height: "170px",
                backgroundColor: "#FFFFFF",
                border: "0.5px solid #9F9F9F",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "inline-block",
                }}
              >
                <Button
                  variant="text"
                  sx={{
                    marginTop: "31px",
                    backgroundColor: "#FED9D9",
                    border: "0.5px solid #CC0000",
                    borderRadius: "10px",
                    width: "100px",
                    height: "60px",
                    color: "#CC0000",
                  }}
                >
                  <Typography
                    color="#CC0000"
                    fontFamily={"IRANSANS"}
                    fontSize={18}
                  >
                    حذف
                  </Typography>
                </Button>
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"}>وضعیت</Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    border: "0.5px solid #9F9F9F",
                    borderRadius: "10px",
                    width: "100px",
                    height: "60px",
                  }}
                ></Box>
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"}>زون</Typography>
                <FormControl
                  sx={{
                    width: "100px",
                    height: "60px",
                    color: "#004323",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    fontFamily: "IRANSANS",
                  }}
                >
                  {/* <InputLabel
                    id="demo-simple-select-label-id"
                    sx={{
                      color: "#004323",
                      fontFamily: "IRANSANS",
                      fontSize: "18px",
                    }}
                  >
                    زون
                  </InputLabel> */}
                  <Select
                    sx={{
                      height: "60px",
                      fontFamily: "IRANSANS",
                      borderRadius: "10px",
                    }}
                    value={selectedZone}
                    onChange={handleZoneChange}
                    inputProps={{ "aria-label": "Without label" }}
                    labelId="select-type-label"
                    label="نوع"
                    id="select-type"
                  >
                    <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(1)}
                    </MenuItem>
                    <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(2)}
                    </MenuItem>
                    <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(3)}
                    </MenuItem>
                    <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(4)}
                    </MenuItem>
                    <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(5)}
                    </MenuItem>
                    <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                      {convert(6)}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"}>حجم</Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    width: "100px",
                    height: "60px",
                  }}
                >
                  <input
                    id="volume-input"
                    type="number"
                    min={1}
                    max={100}
                    style={{
                      paddingRight: "4px",
                      width: "100px",
                      height: "60px",
                      color: "#1e1e1e",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "0.5px solid #9F9F9F",
                      fontFamily: "IRANSANS",
                    }}
                  ></input>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "100px",
                    height: "99px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography fontFamily={"IRANSANS"}>نوع</Typography>
                  <FormControl
                    sx={{
                      width: "100px",
                      height: "60px",
                      color: "#004323",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      fontFamily: "IRANSANS",
                    }}
                  >
                    {/* <InputLabel
                      id="demo-simple-select-label-id"
                      sx={{
                        color: "#004323",
                        fontFamily: "IRANSANS",
                        fontSize: "18px",
                      }}
                    >
                    </InputLabel> */}
                    <Select
                      sx={{
                        height: "60px",
                        fontFamily: "IRANSANS",
                        borderRadius: "10px",
                      }}
                      value={selectedType}
                      onChange={handleTypeChange}
                      inputProps={{ "aria-label": "Without label" }}
                      labelId="select-type-label"
                      label="نوع"
                      id="select-type"
                    >
                      <MenuItem value={1} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(1)}
                      </MenuItem>
                      <MenuItem value={2} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(2)}
                      </MenuItem>
                      <MenuItem value={3} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(3)}
                      </MenuItem>
                      <MenuItem value={4} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(4)}
                      </MenuItem>
                      <MenuItem value={5} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(5)}
                      </MenuItem>
                      <MenuItem value={6} sx={{ fontFamily: "IRANSANS" }}>
                        {convert(6)}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "100px",
                  height: "99px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography fontFamily={"IRANSANS"}>زمان</Typography>
                <Box
                  sx={{
                    backgroundColor: "#FFFFFF",
                    border: "0.5px solid #9F9F9F",
                    borderRadius: "10px",
                    width: "100px",
                    height: "60px",
                  }}
                >
                  <input
                    id="volume-input"
                    type="time"
                    min={1}
                    max={100}
                    style={{
                      paddingRight: "4px",
                      width: "100px",
                      height: "60px",
                      color: "#1e1e1e",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      border: "0.5px solid #9F9F9F",
                      fontFamily: "IRANSANS",
                    }}
                  ></input>
                  {/* <Typography color="initial" textAlign={"center"}>
                    00:00:00
                  </Typography> */}
                </Box>
              </Box>
            </Box>
          </div>
          <div className="add-field-btn">
            <img src={assets.svg.addField} alt="" />
          </div>
        </Box>
      </Modal>
    </Container>
  );
};

export default FeedingPlans;



// onst FeedingStatusBar = () => {
//   const [ec, setEc] = useState(0.0);
//   let ph = 5;
//   const numbers = `۰۱۲۳۴۵۶۷۸۹`;
//   const convert = (num) => {
//     let res = "";
//     const str = num.toString();
//     for (let c of str) {
//       res += numbers.charAt(c);
//     }
//     return res;
//   };
//   return (
//     <Container
//       sx={{
//         width: "254px",
//         height: "200px",
//         borderRadius: "10px",
//         boxShadow: "rgba(100, 100, 111, 0.2) 0px 5px 20px 10px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         gap: "10px",
//       }}
//     >
//       <div
//         // className={classes.barContainer}
//         style={{
//           backgroundColor: "#ffff",
//           width: "220px",
//           height: "32px",
//           border: "0.5px solid #9F9F9F",
//           borderRadius: "20px",
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "end",
//           justifyContent: "space-around",
//           paddingRight: "1rem",
//         }}
//       >
//         <Typography fontFamily={"IRANSANS"} fontSize={13}>
//           {" "}
//           EC : {convert(ec)}
//         </Typography>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: "4px",
//           }}
//         >
//           <img
//             style={{
//               position: "relative",
//               top: "6px",
//               right: `${ph}px`,
//               scale: "1.2",
//               zIndex: "1",
//             }}
//             src={assets.svg.mark}
//             alt="mark"
//           />
//           <img
//             style={{ width: "166px", height: "16px", scale: "0.9" }}
//             src={assets.svg.phBar}
//             alt="bar"
//           />
//         </div>
//       </div>
//       <div
//         // className={classes.barContainer}
//         style={{
//           backgroundColor: "#ffff",
//           width: "230px",
//           height: "32px",
//           border: "0.5px solid #9F9F9F",
//           marginTop: "10px",
//           borderRadius: "20px",
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "end",
//           justifyContent: "space-around",
//           paddingRight: "1rem",
//         }}
//       >
//         <Typography fontFamily={"IRANSANS"} fontSize={13}>
//           {" "}
//           pH : {convert(ph)}
//         </Typography>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             marginBottom: "4px",
//           }}
//         >
//           <img
//             style={{
//               position: "relative",
//               top: "6px",
//               right: `${ph}px`,
//               scale: "1.2",
//               zIndex: "1",
//             }}
//             src={assets.svg.mark}
//             alt="mark"
//           />
//           <img
//             style={{ width: "166px", height: "16px", scale: "0.9" }}
//             src={assets.svg.ecBar}
//             alt="bar"
//           />
//         </div>
//       </div>
//     </Container>
//   );
// };
// export default FeedingStatusBar;
