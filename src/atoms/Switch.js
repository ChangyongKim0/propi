import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./Switch.module.scss";
import classNames from "classnames/bind";
import useToggle from "../hooks/useToggle";

const cx = classNames.bind(styles);

const Switch = ({
  title,
  on,
  disabled,
  onClick,
  color,
  multiple,
  button,
  multiple_data,
  text,
  max_width,
  children,
  vertical,
  unselectable,
  align,
}) => {
  const [new_on, toggleNewOn] = useToggle(on);
  const [active_idx, setActiveIdx] = useState(
    multiple_data
      .map((e, idx) => {
        return [idx, e.active];
      })
      .filter((e2) => e2[1])[0][0]
  );

  useEffect(() => {
    if (on != new_on) {
      toggleNewOn();
    }
  }, [on]);

  return (
    <div
      className={cx(
        "wrapper",
        disabled ? "disabled" : "",
        multiple ? "multiple" : ""
      )}
      onClick={
        multiple
          ? () => {}
          : () => {
              toggleNewOn();
              onClick(!new_on);
            }
      }
      style={{ maxWidth: max_width }}
    >
      {multiple && title ? (
        <div className={cx("title", "align-" + align)}>{title}</div>
      ) : (
        <></>
      )}
      {multiple ? (
        <div
          className={cx(
            "frame-multiple-switch",
            "color-" + color,
            vertical ? "vertical" : "horizontal",
            "align-" + align
          )}
        >
          {multiple_data.map((e, idx) =>
            !unselectable || idx != 0 ? (
              <div
                key={idx}
                id={idx}
                className={cx(
                  "frame-multiple-button",
                  "color-" + color,
                  idx == active_idx ? "on" : "off",
                  unselectable ? "unselectable" : ""
                )}
                onClick={() => {
                  idx != active_idx
                    ? onClick(multiple_data[idx])
                    : onClick(multiple_data[0]);
                  idx != active_idx ? setActiveIdx(idx) : setActiveIdx(0);
                }}
              >
                {e.text}
              </div>
            ) : (
              <div key={idx} style={{ display: "none" }}></div>
            )
          )}
        </div>
      ) : button ? (
        <div className={cx("frame-single-button", new_on ? "on" : "off")}>
          {children ? children : text}
        </div>
      ) : (
        <div className={cx("frame-switch", new_on ? "on" : "off")}>
          <div className={cx("frame-button", new_on ? "on" : "off")}></div>
        </div>
      )}
    </div>
  );
};

Switch.defaultProps = {
  on: false,
  disabled: false,
  onClick: (param) => {
    console.log("clicked default switch with param:");
    console.log(param);
  },
  color: "default",
  multiple: false,
  button: false,
  multiple_data: [
    { id: 0, text: "multiple_data[0]" },
    { id: 1, text: "multiple_data[1]", active: true },
    { id: 2, text: "multiple_data[2]" },
  ],
  text: "text",
  max_width: "570px",
  vertical: false,
  unselectable: false,
};

export default Switch;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - color: white / default
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
