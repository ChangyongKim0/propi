import React, { Children, useState } from "react";
// { useEffect }

import styles from "./Icon.module.scss";
import classNames from "classnames/bind";
// 아래에 개별 아이콘 추가
import { ReactComponent as Add } from "../svgs/Add.svg";
import { ReactComponent as Analysis } from "../svgs/Analysis.svg";
import { ReactComponent as Autocad } from "../svgs/Autocad.svg";
import { ReactComponent as Building } from "../svgs/Building.svg";
import { ReactComponent as Check } from "../svgs/Check.svg";
import { ReactComponent as City } from "../svgs/City.svg";
import { ReactComponent as Close } from "../svgs/Close.svg";
import { ReactComponent as Copy } from "../svgs/Copy.svg";
import { ReactComponent as Dashboard } from "../svgs/Dashboard.svg";
import { ReactComponent as Delete } from "../svgs/Delete.svg";
import { ReactComponent as Detail } from "../svgs/Detail.svg";
import { ReactComponent as Down } from "../svgs/Down.svg";
import { ReactComponent as Erase } from "../svgs/Erase.svg";
import { ReactComponent as Excel } from "../svgs/Excel.svg";
import { ReactComponent as ExternalLink } from "../svgs/ExternalLink.svg";
import { ReactComponent as Illustrator } from "../svgs/Illustrator.svg";
import { ReactComponent as Land } from "../svgs/Land.svg";
import { ReactComponent as Law } from "../svgs/Law.svg";
import { ReactComponent as Left } from "../svgs/Left.svg";
import { ReactComponent as Map } from "../svgs/Map.svg";
import { ReactComponent as News } from "../svgs/News.svg";
import { ReactComponent as PickEach } from "../svgs/PickEach.svg";
import { ReactComponent as PickFromData } from "../svgs/PickFromData.svg";
import { ReactComponent as PickRange } from "../svgs/PickRange.svg";
import { ReactComponent as Right } from "../svgs/Right.svg";
import { ReactComponent as Search } from "../svgs/Search.svg";
import { ReactComponent as Share } from "../svgs/Share.svg";
import { ReactComponent as ThreeBay } from "../svgs/ThreeBay.svg";
import { ReactComponent as Up } from "../svgs/Up.svg";
import { ReactComponent as User } from "../svgs/User.svg";
import Tooltip from "./Tooltip";

const cx = classNames.bind(styles);

const Icon = ({
  type,
  color,
  clickable,
  onClick,
  use_tooltip,
  tooltip,
  size,
}) => {
  // 아래에 개별 아이콘 호출어 추가
  const getIcon = (type) => {
    switch (type) {
      case "add":
        return <Add />;
      case "analysis":
        return <Analysis />;
      case "autocad":
        return <Autocad />;
      case "building":
        return <Building />;
      case "check":
        return <Check />;
      case "city":
        return <City />;
      case "close":
        return <Close />;
      case "copy":
        return <Copy />;
      case "dashboard":
        return <Dashboard />;
      case "delete":
        return <Delete />;
      case "detail":
        return <Detail />;
      case "down":
        return <Down />;
      case "erase":
        return <Erase />;
      case "excel":
        return <Excel />;
      case "external_link":
        return <ExternalLink />;
      case "illustrator":
        return <Illustrator />;
      case "land":
        return <Land />;
      case "law":
        return <Law />;
      case "left":
        return <Left />;
      case "map":
        return <Map />;
      case "news":
        return <News />;
      case "pick_each":
        return <PickEach />;
      case "pick_from_data":
        return <PickFromData />;
      case "pick_range":
        return <PickRange />;
      case "right":
        return <Right />;
      case "search":
        return <Search />;
      case "share":
        return <Share />;
      case "three_bay":
        return <ThreeBay />;
      case "up":
        return <Up />;
      case "user":
        return <User />;
      default:
        return <User />;
    }
  };

  const [mouse_over, setMouseOver] = useState(false);

  return (
    <div
      className={cx(
        "wrapper",
        "color-" + color,
        use_tooltip ? "" : "hide-tooltip",
        clickable ? "clickable" : ""
      )}
      onMouseOver={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      onClick={clickable ? onClick : () => {}}
      style={{
        height: size + "rem",
        width: size + "rem",
        padding: size / 6 + "rem",
      }}
    >
      {getIcon(type)}
      <Tooltip visible={use_tooltip && mouse_over} tooltip={tooltip} />
    </div>
  );
};

Icon.defaultProps = {
  type: "default",
  color: "default",
  clickable: true,
  onClick: () => {
    console.log("clicked default Icon");
  },
  use_tooltip: false,
  size: 1.5,
};

export default Icon;

// ### Icon

// - type : default / add / analysis / ...
// - color : outlined / default / white / primary / black
// - clickable : boolean
// - onClick : ()=>any
// - use_tooltip : boolean
// - tooltip : [any]
// - size : number
