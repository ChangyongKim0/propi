import React, { useEffect, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import Overlay from "../atoms/Overlay";
import Navigation from "../atoms/Navigation";
import NavigationBar from "../component/NavigationBar";
import Sheet from "../atoms/Sheet";
import BackgroundMap from "../atoms/BackgroundMap";
import Search from "../atoms/Search";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Switch from "../atoms/Switch";
import useGlobalVar from "../hooks/useGlobalVar";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const HomePage = () => {
  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const [global_var, setGlobalVar] = useGlobalVar();

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <BackgroundMap></BackgroundMap>
        <Overlay in_container backdrop={false} type="default">
          <div className={cx("frame-button")}>
            <Card border={false} clickable={false} tight>
              <List type={"row"}>
                <Switch
                  multiple
                  multiple_data={[
                    { id: 0, text: "한 필지 분석", active: true },
                    { id: 1, text: "여러 필지 분석" },
                    { id: 2, text: "사업별 " },
                  ]}
                />
                <Switch
                  multiple
                  multiple_data={[
                    { id: 0, text: "일반", active: true },
                    { id: 1, text: "위성" },
                    { id: 2, text: "지적" },
                  ]}
                  onClick={(res) => {
                    switch (res.id) {
                      case 0:
                        setGlobalVar({ map_type: "normal" });
                        break;
                      case 1:
                        setGlobalVar({ map_type: "satelite" });
                        break;
                      case 2:
                        setGlobalVar({ map_type: "jijeok" });
                    }
                    console.log(global_var);
                  }}
                />
              </List>
            </Card>
          </div>
        </Overlay>
      </div>
      <Sheet>
        <div className={cx("frame-search")}>
          <Search
            onClick={(res) => {
              setGlobalVar({
                pnu: res.id,
                lat: res.y,
                lng: res.x,
                addr: res.address_name,
                road_addr: res.road_address_name,
                level: 2,
              });
            }}
          ></Search>
        </div>
        <div className={cx("frame-search")}>
          <List tight={false} gap="1">
            <Card
              border={false}
              tight={false}
              use_tooltip
              tooltip={["지도 서비스로 바로가기"]}
            >
              <List align="left">
                <img
                  className={cx("frame-image")}
                  src="/img/test.png"
                  alt="Propi"
                ></img>
                <div className={cx("text-nav")}>지도로 분석하기</div>
              </List>
            </Card>
            <Card
              border={false}
              tight={false}
              use_tooltip
              tooltip={["법령 서비스로 바로가기"]}
            >
              관계법령 챙겨보기
            </Card>
            <Card
              border={false}
              tight={false}
              use_tooltip
              tooltip={["소식 서비스로 바로가기"]}
            >
              새로운 소식읽기
            </Card>
            <Card
              tight={false}
              use_tooltip
              tooltip={["테스트 서비스로 바로가기"]}
            ></Card>
            <Card
              tight={false}
              use_tooltip
              tooltip={["지도 서비스로 바로가기"]}
            ></Card>
            <Card tight={false}></Card>
            <Card tight={false}></Card>
            <Card tight={false}></Card>
          </List>
        </div>
      </Sheet>
      <NavigationBar>map</NavigationBar>
    </div>
  );
};

export default HomePage;
