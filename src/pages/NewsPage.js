import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./NewsPage.module.scss";
import Overlay from "../atoms/Overlay";
import Navigation from "../atoms/Navigation";
import NavigationBar from "../component/NavigationBar";
import Sheet from "../atoms/Sheet";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const NewsPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}></div>
      <Sheet></Sheet>
      <NavigationBar>news</NavigationBar>
    </div>
  );
};

export default NewsPage;
