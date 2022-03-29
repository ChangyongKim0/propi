import React from "react";
// { useEffect }

import styles from "./List.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const List = ({
  thumbnail,
  text,
  subtext,
  onClick,
}) => {
  
  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-title")}>
        <div>{thumbnail}</div>
        <div>
          <div>
            {text}
          </div>
          <div>
            {subtext}
          </div>
        </div>
      </div>
    </div>
  );
};

List.defaultProps = {
  thumbnail: <div><p>행정<p></p>규칙</p></div>,
  text: "text",
  subtext: "subtext",
  onClick: ()=>{},
  clickable: true,
  transparent: true,
  use_thumbnail: true,
  tight: true,
};

export default List;

// ### ValuationCompText

// - style: column, row, grid
// - multiple-line: boolean
// - gap: int
