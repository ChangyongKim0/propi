import React from "react";
// { useEffect }

import styles from "./Divider.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Divider = ({ style, color, vertical }) => {
  return (
    <div
      className={cx(
        "wrapper",
        "style-" + style,
        "color-" + color,
        vertical ? "vertical" : "horizontal"
      )}
    ></div>
  );
};

Divider.defaultProps = {
  style: "default",
  color: "grey",
  vertical: false,
};

export default Divider;

// ### Divider

// - style: default / bold / dashed
// - color: primary / grey
