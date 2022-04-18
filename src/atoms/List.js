import React from "react";
// { useEffect }

import styles from "./List.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const List = ({
  children,
  type,
  align,
  attach,
  multiple_line,
  gap,
  height,
  tight,
}) => {
  return (
    <div
      className={cx(
        "wrapper",
        "type-" + type,
        "align-" + align,
        "attach-" + attach,
        multiple_line ? "multiple-line" : "",
        tight ? "tight" : "full"
      )}
      style={{ height: height + "rem", gap: gap + "rem" }}
    >
      {children}
    </div>
  );
};

List.defaultProps = {
  children: (
    <>
      <div>children.first</div>
      <div>children.last</div>
    </>
  ),
  type: "column",
  align: "center",
  attach: "default",
  multiple_line: false,
  gap: 0.5,
  height: "auto",
  tight: true,
};

export default List;

// ### List

// - type : column / row / grid
// - align : left / center / right
// - attach : start / default / end
// - multiple_line : boolean
// - gap : int
