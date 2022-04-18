import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./TestPage.module.scss";
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
import LawCard from "../component/LawCard";
import Icon from "../atoms/Icon";
import useToggle from "../hooks/useToggle";
import Overlay from "../atoms/Overlay";
import NavigationBar from "../component/NavigationBar";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const TestPage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const [backdrop, setBackdrop] = useState(false);
  const [overlay_stack, setOverlayStack] = useState(false);
  const [close, setClose] = useState(false);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <p className={cx("title")}>Propi_TestPage</p>
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
        <p className={cx("title")}>Icon</p>
        <Icon color="outlined" />
        <Icon />
        {/* <Icon type="close" /> */}
        <Icon type="pick_from_data" />
        <Icon clickable={false} />
        <Icon color="white" />
        <Icon color="primary" />
        <Icon color="black" />
        <p className={cx("title")}>List</p>
        <List />
        <p className={cx("title")}>Navigation</p>
        <Navigation />
        <p className={cx("title")}>Overlay</p>
        <Button
          onClick={() => {
            setBackdrop(true);
          }}
        >
          Backdrop 활성화
        </Button>
        <Switch
          on={overlay_stack}
          button
          onClick={(on) => {
            if (on) {
              setClose(false);
              setOverlayStack(true);
            } else {
              setClose(true);
            }
          }}
        >
          Stack 활성화
        </Switch>
        <p className={cx("title")}>Search</p>
        <Search />
        <p className={cx("title")}>Sheet</p>
        <Sheet />
        <p className={cx("title")}>Snackbar</p>
        <Snackbar />
        {/* <Snackbar style="warning" />
        <Snackbar style="error" />
        <Snackbar style="success" />
        <Snackbar style="info" /> */}
        <Snackbar action="눌러보기">스낵바가 하나 만들어졌어요.</Snackbar>
        <p className={cx("title")}>Switch</p>
        <Switch />
        <Switch on />
        <Switch disabled />
        <Switch on disabled />
        <Switch button />
        <Switch multiple />
        <p className={cx("title")}>TextField</p>
        <TextField />
        <TextField style="filled" />
        <TextField style="underlined" />
        <TextField status="required" />
        <TextField style="filled" status="required" />
        <TextField style="underlined" status="required" />
        <TextField status="disabled" />
        <TextField style="filled" status="disabled" />
        <TextField style="underlined" status="disabled" />
        <TextField status="error" />
        <TextField style="filled" status="error" />
        <TextField style="underlined" status="error" />
        <TextField status="success" />
        <TextField style="filled" status="success" />
        <TextField style="underlined" status="success" />
        <TextField select />
        <TextField
          status="success"
          label="계획 용적률"
          placeholder="용적률을 입력하세요"
          helper_text="0부터 1,300 사이의 숫자이어야 합니다."
          width="400px"
        />
        <p className={cx("title")}>COMPONENTS</p>
        <p className={cx("title")}>LawCard</p>
        <LawCard>children</LawCard>
        <LawCard
          title="주택건설등에 관한 규정"
          sub_title="주택 건설과 관련된 일반 사항"
          type="영"
          depth="1"
        >
          <LawCard
            title="주택건설등에 관한 규칙"
            sub_title="주택 건설과 관련된 세부 사항"
            type="규"
            depth="2"
          />
        </LawCard>
        <p className={cx("title")}>E . N . D</p>
      </div>
      {/* <Sheet></Sheet> */}
      <NavigationBar>test</NavigationBar>
      {overlay_stack ? (
        <Overlay
          backdrop={false}
          onClick={{
            Backdrop: () => {
              setBackdrop(false);
            },
          }}
          auto_close
          close={close}
          callback={() => {
            setOverlayStack(false);
          }}
          type="stack"
        >
          <Snackbar
            action="눌러보기"
            onClick={() => {
              setClose(true);
            }}
          >
            스낵바가 하나 만들어졌어요.
          </Snackbar>
        </Overlay>
      ) : (
        <></>
      )}
      <Overlay
        backdrop={backdrop}
        onClick={{
          Backdrop: () => {
            setBackdrop(false);
          },
        }}
        type="center"
      >
        {backdrop ? <Button /> : <></>}
      </Overlay>
    </div>
  );
};

export default TestPage;
