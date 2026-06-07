const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const toPersianDigits = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[d]);
};

export const toEnglishDigits = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return String(value)
    .replace(/[۰-۹]/g, (d) => PERSIAN_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
};

/** @deprecated use toPersianDigits */
export const convert = toPersianDigits;
