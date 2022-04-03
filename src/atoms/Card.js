import React, { useState, useEffect } from "react";
// { useEffect }

import styles from "./Card.module.scss";
import classNames from "classnames/bind";
import Tooltip from "./Tooltip";

const cx = classNames.bind(styles);

const Card = ({
  shape,
  children,
  padding,
  clickable,
  transparent,
  onClick,
  use_tooltip,
  tooltip,
  tight,
  color,
}) => {
  const [mouse_over, setMouseOver] = useState(false);

  return (
    <div
      className={cx(
        "wrapper",
        "shape-" + shape,
        clickable ? "clickable" : "",
        transparent ? "transparent" : "solid",
        tight ? "tight" : "full"
      )}
      style={
        color == "#ffffff"
          ? { padding: padding + "rem" }
          : { backgroundColor: color, padding: padding + "rem" }
      }
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      onClick={clickable ? onClick : () => {}}
    >
      <Tooltip
        visible={mouse_over && use_tooltip}
        tooltip={tooltip}
        align="left"
      />
      {children}
    </div>
  );
};

Card.defaultProps = {
  shape: "default",
  children: "children",
  padding: 0.5,
  clickable: true,
  transparent: false,
  onClick: () => {
    console.log("clicked default card");
  },
  use_tooltip: false,
  tight: true,
  color: "#ffffff",
};

export default Card;

// ### Card

// - shape: default / rectangle
// - children: any
// - padding: int
// - clickable: boolean
// - transparent: boolean
// - onClick: ()=>any
// - use_tooltip: boolean
// - tooltip: [any]
// - tight: boolean
