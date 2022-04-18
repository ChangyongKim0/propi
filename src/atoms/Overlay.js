import React, { useEffect, useState } from "react";
// { useEffect }

import styles from "./Overlay.module.scss";
import classNames from "classnames/bind";
import useToggle from "../hooks/useToggle";

const cx = classNames.bind(styles);

let auto_closer;

const Overlay = ({
  backdrop,
  in_container,
  onClick,
  type,
  children,
  auto_close,
  close,
  callback,
}) => {
  const [new_backdrop, toggleBackdrop] = useToggle(backdrop);
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    if (!close) {
      setAnimation(true);
      if (auto_close) {
        auto_closer = setTimeout(() => {
          setAnimation(false);
          setTimeout(() => {
            callback();
          }, 300);
        }, 3000);
      }
    } else {
      setAnimation(false);
      clearTimeout(auto_closer);
      setTimeout(() => {
        callback();
      }, 300);
    }
  }, [close]);

  const onClickBackdrop = (e) => {
    if (e.target.id == "backdrop") {
      onClick.Backdrop();
    }
  };

  return (
    <div
      id="backdrop"
      className={cx(
        "wrapper",
        backdrop ? "backdrop" : "",
        "type-" + type,
        in_container ? "in-container" : ""
      )}
      onClick={(e) => {
        onClickBackdrop(e);
      }}
    >
      <div className={cx("frame", "type-" + type, animation ? "on" : "off")}>
        {children}
      </div>
    </div>
  );
};

Overlay.defaultProps = {
  backdrop: "false",
  in_container: false,
  onClick: {
    Backdrop: () => {
      console.log("clicked backdrop of default overlay");
    },
  },
  type: "stack",
  auto_close: false,
  close: false,
  callback: () => {
    console.log("fired callback of default overlay");
  },
};

export default Overlay;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
