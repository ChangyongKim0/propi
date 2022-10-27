import React, { useEffect, useReducer, useState } from "react";
import "../util/reset.css";
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import Overlay from "../atoms/Overlay";
import NavigationBar from "../component/NavigationBar";
import BackgroundMap from "../atoms/BackgroundMap";
import Card from "../atoms/Card";
import List from "../atoms/List";
import Switch from "../atoms/Switch";
import useGlobalVar, { getCookie } from "../hooks/useGlobalVar";
import MapSheet from "../component/MapSheet";
import Snackbar from "../atoms/Snackbar";
import SnackbarScenario from "../component/SnackbarScenario";
import IFrame from "../atoms/IFrame";
import Search from "../atoms/Search";
import TabBar from "../atoms/TabBar";
import MapButton from "../component/MapButton";

const cx = classNames.bind(styles);
// var mapDiv = document.getElementById('map');
// var map = new naver.maps.Map(mapDiv);

const HomePage = () => {
  const [global_var, setGlobalVar] = useGlobalVar();
  const [overlay_stack, setOverlayStack] = useState(false);

  useEffect(() => {
    // console.log("useEffect");
  }, []);

  const sub_button_data = [
    {
      multiple: true,
      vertical: true,
      unselectable: true,
      multiple_data: [
        { id: 0, text: "", active: true },
        { id: 1, text: "로드뷰" },
        { id: 2, text: "길이" },
        { id: 3, text: "면적" },
      ],
      onClick: (res) => {
        switch (res.id) {
          case 0:
            setGlobalVar({ sub_function: "none" });
            break;
          case 1:
            setGlobalVar({ sub_function: "road_view" });
            break;
          case 2:
            setGlobalVar({ sub_function: "distance" });
            break;
          case 3:
            setGlobalVar({ sub_function: "area" });
        }
        console.log(global_var);
      },
    },
  ];

  const getDefaultButtonData = (map_type = "normal") => [
    {
      multiple: true,
      multiple_data: [
        { id: 0, text: "일반", active: map_type == "normal" },
        { id: 1, text: "위성", active: map_type == "satelite" },
        { id: 2, text: "지적", active: map_type == "jijeok" },
        { id: 3, text: "규제", active: map_type == "eum" },
      ],
      onClick: (res) => {
        switch (res.id) {
          case 0:
            setGlobalVar({ map_type: "normal" });
            break;
          case 1:
            setGlobalVar({ map_type: "satelite" });
            break;
          case 2:
            setGlobalVar({ map_type: "jijeok" });
            break;
          case 3:
            setGlobalVar({ map_type: "eum" });
        }
        console.log(global_var);
      },
    },
    {
      multiple: true,
      multiple_data: [
        { id: 0, text: "개별 필지 정보 조회", active: true },
        { id: 1, text: "여러 필지 분석" },
        { id: 2, text: "사업 조건 검토" },
        { id: 3, text: "지구단위계획 확인" },
      ],
      onClick: (res) => {
        onClickButton(res.text);
      },
    },
  ];

  const [button_data, handleButtonData] = useReducer((state, action) => {
    const new_state = [...state].slice(0, action.index);
    action.data.forEach((e) => {
      new_state.push(e);
    });
    return new_state;
  }, getDefaultButtonData(getCookie("map_type") != undefined ? getCookie("map_type") : "normal"));

  const onClickButton = (id) => {
    switch (id) {
      case "구역계 그리기":
        handleButtonData({
          index: 3,
          data: [
            {
              button: true,
              text: "구역계 편집",
            },
          ],
        });
        break;
      case "여러 필지 분석":
        handleButtonData({
          index: 2,
          data: [
            {
              multiple: true,
              multiple_data: [
                { id: 0, text: "하나씩 선택하기", active: true },
                { id: 1, text: "구역계 그리기" },
                { id: 2, text: "필지 목록 입력하기" },
              ],
              onClick: (res) => {
                onClickButton(res.text);
              },
            },
          ],
        });
        break;
      case "개별 필지 정보 조회":
        handleButtonData({ index: 2, data: [] });
        break;
      case "사업 조건 검토":
        handleButtonData({
          index: 2,
          data: [
            {
              multiple: true,
              multiple_data: [
                { id: 0, text: "주택건설", active: true },
                { id: 1, text: "도시개발" },
                { id: 2, text: "정비사업" },
                { id: 2, text: "소규모주택" },
                { id: 2, text: "지구단위계획 수립" },
              ],
            },
          ],
        });
        break;
      case "지구단위계획 확인":
        handleButtonData({ index: 2, data: [] });
        break;
      default:
        handleButtonData({ index: 3, data: [] });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("frame-content")}>
        <BackgroundMap></BackgroundMap>
        {global_var.media_mobile ? (
          <>
            {button_data.map((e, idx) => {
              return idx == 1 ? <TabBar {...e} /> : <></>;
            })}
            <div className={cx("frame-button-field")}>
              <List align="right">
                <MapButton icon="map" />
              </List>
            </div>

            <Overlay key="1" backdrop={false} type="default" padding="0">
              <Search
                onClick={(res) => {
                  setGlobalVar({
                    pnu: res.id,
                    lat: res.y,
                    lng: res.x,
                    addr: res.address_name,
                    road_addr: res.road_address_name,
                    level: 2,
                    land_clicked: true,
                  });
                }}
              ></Search>
            </Overlay>
          </>
        ) : (
          <Overlay key="2" in_container="map" backdrop={false} type="default">
            <List type="row" attach="space" align="left" disable>
              <List type="row" multiple_line disable>
                {button_data.map((e, idx) => {
                  return (
                    <Card
                      key={idx}
                      border={false}
                      clickable={false}
                      tight
                      padding={0}
                    >
                      <Switch {...e} color="white" />
                    </Card>
                  );
                })}
              </List>
              <List type="column" multiple_line>
                {sub_button_data.map((e, idx) => {
                  return (
                    <Card
                      key={idx}
                      border={false}
                      clickable={false}
                      tight
                      padding={0}
                    >
                      <Switch {...e} color="white" vertical />
                    </Card>
                  );
                })}
              </List>
            </List>
          </Overlay>
        )}
        {global_var.show_iframe ? (
          <Overlay id="iframe" in_container="map" type="center" backdrop close>
            <IFrame
              url={global_var.iframe_url}
              onClick={{
                Close: () => {
                  setGlobalVar({ show_iframe: false });
                },
                ExternalLink: () => {},
                Share: () => {},
              }}
            />
          </Overlay>
        ) : (
          <></>
        )}
      </div>
      {!global_var.media_mobile && global_var.media_mobile !== undefined ? (
        <MapSheet />
      ) : (
        <></>
      )}
      <NavigationBar>map</NavigationBar>
      {global_var.snackbar ? <SnackbarScenario /> : <></>}
    </div>
  );
};

export default HomePage;
