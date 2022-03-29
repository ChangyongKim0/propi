import React, { Children } from "react";
// { useEffect }

import styles from "./Button.module.scss";
import classNames from "classnames/bind";
import {ReactComponent as Excel} from "../svgs/Excel.svg";
import {ReactComponent as AutoCad} from "../svgs/AutoCad.svg";

const cx = classNames.bind(styles);

const Button = ({
  type,
  shape,
  children,
  color,
  padding,
  onClick,
  tight,
}) => {
  
  return (
    <div className={cx(
      "wrapper",
      "shape-"+shape,
      "color-"+(type=="default"?color:type),
      )}
      onClick={onClick}>
      {
        type=="excel"?
        <Excel className={cx("icon")}/>:(
          type=="cad"?
          <AutoCad className={cx("icon")}/>:
          <></>
        )
      }
      {children}
    </div>
  );
};

Button.defaultProps = {
  type: "default",
  shape: "default",
  children: "children",
  color: "default",
  onClick: ()=>{console.log("clicked default button")},
  tight: true,
};

export default Button;

// ### Button

// - type: default / excel / cad
// - shape: default / rectangle
// - children: any
// - color: default / transparent / primary
// - padding: int
// - onClick: ()=>any
// - tight: boolean
