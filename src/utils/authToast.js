import toast from "react-hot-toast";

const loginToastBase = {
  fontFamily: "IRANSANS",
  fontSize: "15px",
  borderRadius: "10px",
  padding: "12px 18px",
  direction: "rtl",
};

export const showLoginSuccessToast = () => {
  toast.success("ورود با موفقیت انجام شد.", {
    id: "login-feedback",
    duration: 4000,
    style: {
      ...loginToastBase,
      background: "#379E79",
      color: "#FFFFFF",
    },
    iconTheme: {
      primary: "#6CCDB0",
      secondary: "#FFFFFF",
    },
  });
};

export const showLoginErrorToast = (message) => {
  toast.error(message || "نام کاربری یا رمز عبور اشتباه است.", {
    id: "login-feedback",
    duration: 4500,
    style: {
      ...loginToastBase,
      background: "#D32F2F",
      color: "#FFFFFF",
    },
    iconTheme: {
      primary: "#FFCDD2",
      secondary: "#FFFFFF",
    },
  });
};
