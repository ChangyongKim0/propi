import React, { useEffect, useState } from "react";
import "../util/reset.css";
import "./LawPage.module.scss";
import classNames from "classnames/bind";
import styles from "./LawPage.module.scss";
import InfoText from "../atoms/InfoText";
import Card from "../atoms/Card";
import Banner from "../atoms/Banner";
import Button from "../atoms/Button";
import Chip from "../atoms/Chip";
import DataTable from "../atoms/DataTable";
import Dialog from "../atoms/Dialog";
import List from "../atoms/List";
import Navigation from "../atoms/Navigation";
import Search from "../atoms/Search";
import Sheet from "../atoms/Sheet";
import Snackbar from "../atoms/Snackbar";
import Switch from "../atoms/Switch";
import TextField from "../atoms/TextField";
import Divider from "../atoms/Divider";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const LawPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  return (
    <div className={cx("wrapper")}>
      <p className={cx("title")}>Propi_LawPage</p>
      <p className={cx("title")}>ATOMS</p>
      <p className={cx("title")}>Banner</p>
      <Banner />
      <p className={cx("title")}>Button</p>
      <Button shape="rectangle" />
      <Button />
      <Button color="transparent" />
      <Button color="primary" />
      <Button type="excel">엑셀로 내보내기</Button>
      <Button type="cad">캐드로 내보내기</Button>
      <p className={cx("title")}>Card</p>
      <Card use_tooltip={true} clickable={false} />
      <Card use_tooltip={true} tooltip={["법령정보센터에서 보기"]} />
      <Card use_tooltip={true} transparent={false} />
      <Card use_tooltip={true} transparent={false} shape="rectangle" />
      <p className={cx("title")}>Chip</p>
      <Chip />
      <Chip clicked={true} />
      <p className={cx("title")}>DataTable</p>
      <DataTable />
      <p className={cx("title")}>Dialog</p>
      <Dialog />
      <p className={cx("title")}>Divider</p>
      <Divider color="primary" />
      <Divider />
      <Divider style="bold" />
      <Divider style="dashed" />
      <p className={cx("title")}>List</p>
      <List />
      <p className={cx("title")}>Navigation</p>
      <Navigation />
      <p className={cx("title")}>Search</p>
      <Search />
      <p className={cx("title")}>Sheet</p>
      <Sheet />
      <p className={cx("title")}>Snackbar</p>
      <Snackbar />
      <p className={cx("title")}>Switch</p>
      <Switch />
      <p className={cx("title")}>TextField</p>
      <TextField />
      <p className={cx("title")}>E . N . D</p>
    </div>
  );
};

export default LawPage;
