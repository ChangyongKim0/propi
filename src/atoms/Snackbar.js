import React from "react";
// { useEffect }

import styles from "./Snackbar.module.scss";
import classNames from "classnames/bind";
import Icon from "./Icon";

const cx = classNames.bind(styles);

const Snackbar = ({ style, children, action, onClick }) => {
  const getStatusChar = (status) => {
    switch (status) {
      case "warning":
        return "!";
      case "error":
        return "×";
      case "success":
        return "✓";
      default:
        return "i";
    }
  };

  return (
    <div className={cx("wrapper", "style-" + style)} onClick={onClick}>
      {style == "default" ? (
        <></>
      ) : (
        <div className={cx("frame-icon", "style-" + style)}>
          {getStatusChar(style)}
        </div>
      )}
      <div className={cx("frame-text")}>{children}</div>
      <div className={cx("action")}>{action}</div>
      {/* <Icon type="close" size="2" /> */}
    </div>
  );
};

Snackbar.defaultProps = {
  style: "default",
  children: "children",
  action: "action",
  onClick: () => {
    console.log("clicked default snackbar");
  },
  callback: () => {
    console.log("fired callback of default snackbar");
  },
};

export default Snackbar;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
