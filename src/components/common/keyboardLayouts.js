import englishLayout from "simple-keyboard-layouts/build/layouts/english";
import farsiLayout from "simple-keyboard-layouts/build/layouts/farsi";

export const KEYBOARD_LAYOUT = {
  numpad: ["۱ ۲ ۳", "۴ ۵ ۶", "۷ ۸ ۹", "۰ . {bksp}"],
  farsi: farsiLayout.layout.default,
  farsiShift: farsiLayout.layout.shift,
  english: englishLayout.layout.default,
  englishShift: englishLayout.layout.shift,
};

export const KEYBOARD_DISPLAY = {
  "{bksp}": "⌫",
  "{space}": "فاصله",
  "{shift}": "⇧",
  "{lock}": "caps",
  "{enter}": "↵",
  "{tab}": "⇥",
};

export const getLayoutName = (mode, shifted) => {
  if (mode === "numpad") return "numpad";
  if (mode === "farsi") return shifted ? "farsiShift" : "farsi";
  return shifted ? "englishShift" : "english";
};
