import React, { useState } from "react";
// { useEffect }

import styles from "./Card.module.scss";
import classNames from "classnames/bind";

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
}) => {

  const [mouse_over, setMouseOver] = useState(false);

  return (
    <div className={cx(
      "wrapper",
      "shape-"+shape,
      clickable?"clickable":"",
      transparent?"transparent":"solid",
      tight?"tight":"full",
      )} 
    style={{padding:padding+"rem"}}
    onMouseEnter={()=>setMouseOver(true)}
    onMouseLeave={()=>setMouseOver(false)}
    onClick={onClick}>
      <div className={cx("tooltip", "tooltip-"+(mouse_over&&use_tooltip?"visible":"hidden"))}>{
        tooltip.map(e => {
          return <div>{e}</div>;
        })
      }</div>
      {children}
    </div>
  );
};

Card.defaultProps = {
  shape: "default",
  children: "children",
  padding: 0.5,
  clickable: true,
  transparent: true,
  onClick: ()=>{console.log("clicked default card")},
  use_tooltip: false,
  tooltip: ["tooltip[0]", "tooltip[1]"],
  tight: true,
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
