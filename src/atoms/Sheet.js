import React from "react";
// { useEffect }

import styles from "./Sheet.module.scss";
import classNames from "classnames/bind";
import Card from "./Card";
import List from "./List";
import Divider from "./Divider";

const cx = classNames.bind(styles);

const Sheet = ({ children, type, nav_data, emph, onClick }) => {
  // console.log(children);
  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame", "type-" + type)}>
        <div className={cx("frame-top")}>
          <div className={cx("frame-top-content")}>{children[0]}</div>
        </div>
        <div className={cx("frame-content")}>{children[1]}</div>
      </div>
    </div>
  );
};

Sheet.defaultProps = {
  nav_data: [
    { id: 0, icon: "default", title: "nav_data[0].title", link_to: "" },
    { id: 1, icon: "default", title: "nav_data[1].title", link_to: "" },
  ],
  emph: 1,
  onClick: (e) => {
    console.log("clicked default navigation with param:");
    console.log(e);
  },
  children: (
    <>
      <Card shape="rectangle" tight={false} border={false}></Card>
      <Card shape="rectangle" tight={false} border={false}></Card>
      <Card shape="rectangle" tight={false} border={false}></Card>
      <Card shape="rectangle" tight={false} border={false}></Card>
    </>
  ),
};

export default Sheet;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
