import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import Draggable from "react-draggable";
import "react-simple-keyboard/build/css/index.css";
import "./VirtualKeyboard.css";
import { toEnglishDigits } from "../../utils/persianDigits";
import {
  getLayoutName,
  KEYBOARD_DISPLAY,
  KEYBOARD_LAYOUT,
} from "./keyboardLayouts";

const NON_TEXT_INPUT_TYPES = new Set([
  "checkbox",
  "radio",
  "button",
  "submit",
  "reset",
  "file",
  "hidden",
  "image",
  "range",
  "color",
  "date",
  "time",
  "datetime-local",
  "week",
  "month",
]);

const isEditableField = (element) => {
  if (!element || !(element instanceof HTMLElement)) return false;
  if (element.closest("[data-no-virtual-keyboard]")) return false;
  if (
    element.tagName === "SELECT" ||
    element.closest(
      "select, [role='combobox'], [aria-haspopup='listbox'], .MuiSelect-root, .MuiSelect-select",
    )
  ) {
    return false;
  }

  if (element.tagName === "TEXTAREA") {
    return !element.disabled && !element.readOnly;
  }

  if (element.tagName === "INPUT") {
    const type = (element.getAttribute("type") || "text").toLowerCase();
    if (NON_TEXT_INPUT_TYPES.has(type)) return false;
    return !element.disabled && !element.readOnly;
  }

  return false;
};

const isNumericField = (element) => {
  const type = (element.getAttribute("type") || "text").toLowerCase();
  if (type === "number" || type === "tel") return true;

  const inputMode = element.getAttribute("inputmode") || element.inputMode;
  return inputMode === "numeric" || inputMode === "decimal";
};

const setNativeInputValue = (element, value) => {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

  if (descriptor?.set) {
    descriptor.set.call(element, value);
  } else {
    element.value = value;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const getFieldValue = (element) => {
  const raw = element.value ?? "";
  return isNumericField(element) ? toEnglishDigits(raw) : raw;
};

const KEYBOARD_GAP = 10;
const NUMPAD_SIZE = {
  width: 360,
  height: 360,
};

const clamp = (value, min, max) => {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
};

const getKeyboardPosition = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rightX = rect.right + KEYBOARD_GAP;
  const leftX = rect.left - NUMPAD_SIZE.width - KEYBOARD_GAP;
  const hasRightSpace = rightX + NUMPAD_SIZE.width <= viewportWidth - KEYBOARD_GAP;
  const x = hasRightSpace ? rightX : leftX;
  const y = rect.top + rect.height / 2 - NUMPAD_SIZE.height / 2;

  return {
    x: clamp(x, KEYBOARD_GAP, viewportWidth - NUMPAD_SIZE.width - KEYBOARD_GAP),
    y: clamp(y, KEYBOARD_GAP, viewportHeight - NUMPAD_SIZE.height - KEYBOARD_GAP),
  };
};

const VirtualKeyboard = () => {
  const keyboardRef = useRef(null);
  const containerRef = useRef(null);
  const activeFieldRef = useRef(null);
  const savedInputModeRef = useRef(null);
  const modeRef = useRef("numpad");
  const blurTimeoutRef = useRef(null);
  
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("numpad");
  const [shifted, setShifted] = useState(false);
  const [keyboardPosition, setKeyboardPosition] = useState({ x: 0, y: 0 });

  modeRef.current = mode;
  const layoutName = useMemo(() => getLayoutName(mode, shifted), [mode, shifted]);
  const isNumpadMode = mode === "numpad";
  const isFarsiMode = mode === "farsi";

  const syncKeyboardInput = useCallback((element) => {
    if (!element) return;
    keyboardRef.current?.setInput(getFieldValue(element));
  }, []);

  const hideKeyboard = useCallback(() => {
    const element = activeFieldRef.current;

    if (element) {
      if (savedInputModeRef.current !== null) {
        if (savedInputModeRef.current) {
          element.setAttribute("inputmode", savedInputModeRef.current);
        } else {
          element.removeAttribute("inputmode");
        }
      }
      savedInputModeRef.current = null;
    }

    activeFieldRef.current = null;
    setMode("numpad");
    setShifted(false);
    setVisible(false);
    document.body.classList.remove("virtual-keyboard-open");
  }, []);

  const showForField = useCallback(
    (element) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      activeFieldRef.current = element;
      setMode("numpad");
      setShifted(false);
      setKeyboardPosition(getKeyboardPosition(element));
      setVisible(true);
      document.body.classList.add("virtual-keyboard-open");

      savedInputModeRef.current = element.getAttribute("inputmode");
      element.setAttribute("inputmode", "none");

      requestAnimationFrame(() => syncKeyboardInput(element));

      setTimeout(() => {
        element.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 120);
    },
    [syncKeyboardInput]
  );

  const switchMode = useCallback(
    (nextMode) => {
      setMode(nextMode);
      setShifted(false);
      requestAnimationFrame(() => syncKeyboardInput(activeFieldRef.current));
    },
    [syncKeyboardInput]
  );

  const handleKeyboardChange = useCallback((input) => {
    const element = activeFieldRef.current;
    if (!element) return;

    const nextValue = isNumericField(element) ? toEnglishDigits(input) : input;
    setNativeInputValue(element, nextValue);
  }, []);

  const handleKeyPress = useCallback(
    (button) => {
      if (button === "{shift}" || button === "{lock}") {
        if (modeRef.current === "numpad") return;
        setShifted((current) => !current);
        return;
      }

      if (button === "{enter}") {
        activeFieldRef.current?.blur();
        hideKeyboard();
      }
    },
    [hideKeyboard]
  );

  useEffect(() => {
    const handleFocusIn = (event) => {
      const target = event.target;
      if (!isEditableField(target)) return;
      showForField(target);
    };

    const handleFocusOut = (event) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      blurTimeoutRef.current = setTimeout(() => {
        const active = document.activeElement;
        if (containerRef.current?.contains(active)) return;
        if (containerRef.current?.contains(event.relatedTarget)) return;
        if (isEditableField(active)) return;
        
        hideKeyboard();
      }, 150);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      document.body.classList.remove("virtual-keyboard-open");
    };
  }, [showForField, hideKeyboard]);

  useEffect(() => {
    if (!visible) return undefined;

    const element = activeFieldRef.current;
    if (!element) return undefined;

    const handleInput = () => syncKeyboardInput(element);
    element.addEventListener("input", handleInput);

    return () => element.removeEventListener("input", handleInput);
  }, [visible, syncKeyboardInput]);

  useEffect(() => {
    if (!visible || !isNumpadMode) return undefined;

    const updatePosition = () => {
      const element = activeFieldRef.current;
      if (!element) return;
      setKeyboardPosition(getKeyboardPosition(element));
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible, isNumpadMode]);

  if (!visible) return null;

  const keyboardContent = (
    <div
      ref={containerRef}
      className={`virtual-keyboard-container ${
        isNumpadMode
          ? "numpad-mode"
          : isFarsiMode
            ? "letters-mode farsi-mode"
            : "letters-mode english-mode"
      }`}
      onMouseDown={(e) => e.preventDefault()}
    >
      {isNumpadMode && (
        <div className="numpad-drag-handle handle">
          <span>⠿ برای جابجایی کادر بگیرید و بکشید</span>
        </div>
      )}
      <div className="virtual-keyboard-toolbar">
        <div className="virtual-keyboard-mode-group">
          <button
            type="button"
            className={mode === "numpad" ? "active" : ""}
            onClick={() => switchMode("numpad")}
          >
            اعداد
          </button>
          <button
            type="button"
            className={mode === "farsi" ? "active" : ""}
            onClick={() => switchMode("farsi")}
          >
            فارسی
          </button>
          <button
            type="button"
            className={mode === "english" ? "active" : ""}
            onClick={() => switchMode("english")}
          >
            English
          </button>
        </div>
        <button type="button" onClick={hideKeyboard} aria-label="بستن">
          ✕
        </button>
      </div>
      <Keyboard
        keyboardRef={(instance) => {
          keyboardRef.current = instance;
        }}
        layout={KEYBOARD_LAYOUT}
        layoutName={layoutName}
        rtl={isFarsiMode}
        onChange={handleKeyboardChange}
        onKeyPress={handleKeyPress}
        display={KEYBOARD_DISPLAY}
        theme="hg-theme-default virtual-keyboard-theme"
      />
    </div>
  );

  if (isNumpadMode) {
    return (
      <Draggable
        handle=".handle"
        bounds="body"
        position={keyboardPosition}
        onDrag={(_, data) => setKeyboardPosition({ x: data.x, y: data.y })}
        onStop={(_, data) => setKeyboardPosition({ x: data.x, y: data.y })}
      >
        <div className="draggable-wrapper">
          {keyboardContent}
        </div>
      </Draggable>
    );
  }

  return keyboardContent;
};

export default VirtualKeyboard;
