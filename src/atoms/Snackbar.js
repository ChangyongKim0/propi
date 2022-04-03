import React from "react";
// { useEffect }

import styles from "./Snackbar.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Snackbar = ({ thumbnail, text, subtext, onClick }) => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-title")}>
        <div>{thumbnail}</div>
        <div>
          <div>{text}</div>
          <div>{subtext}</div>
        </div>
      </div>
    </div>
  );
};

Snackbar.defaultProps = {
  thumbnail: (
    <div>
      <p>
        행정<p></p>규칙
      </p>
    </div>
  ),
  text: "text",
  subtext: "subtext",
  onClick: () => {},
  clickable: true,
  transparent: true,
  use_thumbnail: true,
  tight: true,
};

export default Snackbar;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
