import toast from "react-hot-toast";

const toastBase = {
  fontFamily: "IRANSANS",
  fontSize: "15px",
  borderRadius: "10px",
  padding: "12px 18px",
  direction: "rtl",
};

export const showErrorToast = (message, id = "app-error") => {
  toast.error(message, {
    id,
    duration: 4500,
    style: {
      ...toastBase,
      background: "#D32F2F",
      color: "#FFFFFF",
    },
    iconTheme: {
      primary: "#FFCDD2",
      secondary: "#FFFFFF",
    },
  });
};
