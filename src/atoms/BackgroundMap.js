import React, {
  // useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  // useLayoutEffect,
  useReducer,
  useState,
} from "react";
// import {
//   reduceOverlay,
//   getOverlayData,
//   handlePolygon,
// } from "../functions/reduceOverlay";
import axios from "axios";

// import useBldgInfoData from "../hooks/useBldgInfoData";

// import InfoBubble from "./InfoBubble";
import styles from "./BackgroundMap.module.scss";
import classNames from "classnames/bind";
import useGlobalVar, { setCookie } from "../hooks/useGlobalVar";
import { ReactComponent as CursorPick } from "../svgs/CursorPick.svg";
// import { setCookie } from "../hooks/useCookieData";
// import { formatData, formatUnit } from "../hooks/useFormatter";
// import useUnitType from "../hooks/useUnitType";
// import useToggleState from "../hooks/useToggle";
// import useCookieData from "../hooks/useCookieData";
// import useOverlayReloader from "../hooks/useOverlayReloader";
// import { API_URI } from "../src_shortcut";
import {
  _fillZeros,
  _getEumTile,
  _getFeatureFromLandData,
  _offsetMapPosition,
} from "../util/alias";
import { API_URI } from "../shortcut";
import useGlobalData from "../hooks/useGlobalData";
import usePolygon from "../hooks/usePolygon";
import { _getAttachLandList } from "../util/formatMapApiData";
import proj4 from "proj4";
import { useMeasureDistance } from "../hooks/useAdditionalTools";
import KakaoPolygon from "../kakaoComponent/KakaoPolygon";
import { KakaoMapProvider } from "../kakaoHooks/useKakaoMap";
import useKakaoEvent from "../kakaoHooks/useKakaoEvent";

const cx = classNames.bind(styles);

const getMapState = (map) => {
  let level = map.getLevel();
  let lat = map.getCenter().getLat();
  let lng = map.getCenter().getLng();
  return { level: level, lat: lat, lng: lng };
};

const BackgroundMap = ({ children }) => {
  const [map, setMap] = useState();
  const [need_update_overlay, setNeedUpdateOverlay] = useState(false);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [polygons, handlePolygons] = usePolygon();
  const [use_cursor, setUseCursor] = useState(false);
  const [onClick, setOnClick] = useState(() => {});
  const [onClickFor, setOnClickFor] = useReducer(
    (state, action) => {
      return { ...state, ...action };
    },
    { None: () => {}, RoadView: () => {} }
  );

  useMeasureDistance(map, global_var.sub_function);

  useEffect(() => {
    let container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    let options = {
      // //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(global_var.lat, global_var.lng), //지도의 중심좌표.
      level: global_var.level, //지도의 레벨(확대, 축소 정도)
      mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
      // projectionId: null,
    };
    setMap(new window.kakao.maps.Map(container, options)); //지도 생성 및 객체 리턴
  }, []);

  useEffect(() => {
    if (map) {
      setGlobalVar({ land_clicked: false });

      handlePolygons({ type: "set map", map: map });
      window.kakao.maps.event.addListener(
        map,
        "bounds_changed",
        onCenterChanged
      );

      let tileset = new window.kakao.maps.Tileset({
        width: 256,
        height: 256,
        getTile: _getEumTile,
        copyright: [],
        dark: false,
        minZoom: 0,
        maxZoom: 15,
      });

      window.kakao.maps.Tileset.add("EUM", tileset);

      pushAddress(getMapState(map));
      // eslint-disable-next-line react-hooks/exhaustive-deps
      return () => {
        setGlobalVar({ land_clicked: false });
      };
    }
  }, [map]);

  useKakaoEvent(map, "click", onClick);

  useEffect(() => {
    if (map) {
      switch (global_var.map_type) {
        case "jijeok":
          console.log("change");
          map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT);
          break;
        case "normal":
          map.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
          map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT);
          break;
        case "satelite":
          // map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
          map.setMapTypeId(window.kakao.maps.MapTypeId.SKYVIEW);
          map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT);
          break;
        case "eum":
          // map.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
          map.setMapTypeId(window.kakao.maps.MapTypeId.EUM);
          map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT);
          break;
        default:
          break;
      }
    }
  }, [map, global_var.map_type]);

  // useEffect(() => {
  //   if (map) {
  //     window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  //       var latlng = mouseEvent.latLng;
  //       console.log(
  //         proj4(
  //           "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
  //           "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
  //           [latlng.getLng(), latlng.getLat()]
  //         )
  //       );
  //     });
  //   }
  // }, [map]);

  useEffect(() => {
    if (map) {
      switch (global_var.sub_function) {
        case "road_view":
          map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
          break;
        default:
          map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
      }
    }
  }, [map, global_var.sub_function]);

  useEffect(() => {
    if (map) {
      console.log("land_clicked");
      if (global_var.land_clicked) {
        const latlng = new window.kakao.maps.LatLng(
          global_var.lat,
          global_var.lng
        );
        map.setCenter(_offsetMapPosition(map, latlng, 256, -256));
        onClick({ latLng: latlng });
        setGlobalVar({ land_clicked: false });
      }
    }
  }, [map, global_var.land_clicked]);

  useEffect(() => {
    if (map && global_var.level) {
      map.setLevel(global_var.level);
    }
  }, [map, global_var.level]);

  useEffect(() => {
    if (map && global_var.lat && global_var.lng) {
      const latlng = new window.kakao.maps.LatLng(
        global_var.lat,
        global_var.lng
      );
      map.relayout();
      map.setCenter(_offsetMapPosition(map, latlng, 256, -256));
    }
  }, [map, global_var.lat, global_var.lng]);

  const [address_data, setAddressData] = useState();
  const [region_code_data, setRegionCodeData] = useState();

  const updateFeatureListAsync = (pnu_list) => {
    if (pnu_list.length == 0) {
      return;
    }
    axios
      .put(API_URI + "land_data/list", { id: pnu_list, save_file: "false" })
      .then((res_list) => {
        res_list.data.map((res, idx) => {
          if (res !== null) {
            if (res["NSDI:F251"]) {
              handlePolygons({
                type: "add secondary",
                data: [
                  {
                    pnu: pnu_list[idx],
                    ..._getFeatureFromLandData(res),
                  },
                ],
              });
            }
          }
        });
      });
  };

  useEffect(() => {
    setOnClickFor({
      RoadView: (event) => {
        const latlng = event.latLng;
        console.log(latlng.getLat(), latlng.getLng());
        window.open(
          "https://map.kakao.com/link/roadview/" +
            latlng.getLat() +
            "," +
            latlng.getLng(),
          "propi_roadview",
          "width=1080,height=720"
        );
      },
    });
  }, []);

  useEffect(() => {
    setOnClickFor({
      None: !map
        ? () => {}
        : (event) => {
            if (map.getLevel() < 6 && global_var.state != "loading") {
              const latlng = event.latLng;
              // console.log(latlng.getLat(), latlng.getLng());
              setGlobalVar({
                state: "loading",
              });
              setCookie("lat", latlng.getLat(), 365);
              setCookie("lng", latlng.getLng(), 365);
              let geocoder = new window.kakao.maps.services.Geocoder();
              const promise_road_addr = new Promise((resolve, reject) => {
                geocoder.coord2Address(
                  latlng.getLng(),
                  latlng.getLat(),
                  (result, status) => {
                    setAddressData(result);
                    resolve(result);
                  }
                );
              });
              const promise_region = new Promise((resolve, reject) => {
                geocoder.coord2RegionCode(
                  latlng.getLng(),
                  latlng.getLat(),
                  (result, status) => {
                    setRegionCodeData(result);
                    resolve(result);
                  }
                );
              });
              const promise_addr = axios.put(API_URI + "address", {
                lat: latlng.getLat(),
                lng: latlng.getLng(),
              });
              Promise.all([
                promise_road_addr,
                promise_region,
                promise_addr,
              ]).then((res_list) => {
                if (res_list[1] == undefined) {
                  setGlobalVar({ state: "fail" });
                }
                const road_pnu =
                  res_list[1].filter((e) => e.region_type == "B")[0].code +
                  (res_list[0][0]?.address?.mountain_yn == "Y" ? "2" : "1") +
                  _fillZeros(
                    res_list[0][0]?.address?.main_address_no || "",
                    4
                  ) +
                  _fillZeros(res_list[0][0]?.address?.sub_address_no || "", 4);
                const pnu = res_list[2]?.data?.pnu;
                if (!pnu || !res_list[0][0]) {
                  setGlobalVar({ state: "fail" });
                } else {
                  const request_list = [
                    { type: "land_data", id: pnu },
                    { type: "building_data", id: road_pnu },
                  ];
                  axios
                    .put(API_URI + "multiple_data", {
                      request_list: request_list,
                    })
                    .then((res_list) => {
                      console.log(res_list);
                      if (
                        res_list.data[0] == "" ||
                        !res_list.data[0]["NSDI:F251"]
                      ) {
                        setGlobalVar({ state: "fail" });
                      } else {
                        setGlobalData({ type: "land", data: res_list.data[0] });

                        const attach_pnu_list = _getAttachLandList(
                          res_list.data[1]?.bldg_attach_jibun_list || [],
                          road_pnu,
                          pnu
                        );
                        if (attach_pnu_list[0] != -1) {
                          setGlobalData({
                            type: "building",
                            data: res_list.data[1],
                          });
                        } else {
                          console.log("wrong road pnu.");
                          setGlobalData({ type: "building", data: {} });
                        }

                        handlePolygons({ type: "remove all" });

                        if (res_list.data[0]["NSDI:F251"]) {
                          handlePolygons({
                            type: "add",
                            data: [
                              {
                                pnu: pnu,
                                ..._getFeatureFromLandData(res_list.data[0]),
                              },
                            ],
                          });
                          if (attach_pnu_list[0] != -1) {
                            updateFeatureListAsync(attach_pnu_list);
                          }
                        }
                        setGlobalVar({
                          state: "success",
                          building_title_current_idx: 0,
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      setGlobalVar({ state: "fail" });
                    });
                  setGlobalVar({ pnu: pnu });
                }
              });
            } else if (map.getLevel() >= 6) {
              setGlobalVar({ snackbar: "too_zoomed_out" });
            } else {
              setGlobalVar({ snackbar: "data_is_loading" });
            }
          },
    });
  }, [map, global_var.state]);

  useEffect(() => {
    const prevent_map_click = global_var.prevent_map_click;
    const sub_function = global_var.sub_function;
    setOnClick(() => (event) => {
      if (global_var.prevent_map_click || !event) {
        return;
      }
      switch (global_var.sub_function) {
        case "none":
          return onClickFor.None(event);
        case "road_view":
          return onClickFor.RoadView(event);
        case "measure_distance":
          return;
        case "measure_area":
          return;
        default:
          return onClickFor.None(event);
      }
    });
  }, [global_var.prevent_map_click, global_var.sub_function, onClickFor]);

  useEffect(() => {
    if (address_data && region_code_data) {
      const address = address_data[0]?.address?.address_name || "주소 없음";
      const road_address =
        address_data[0]?.road_address?.address_name || "도로명 주소 없음";
      setGlobalVar({ address: address, road_address: road_address });

      setAddressData(null);
      setRegionCodeData(null);
    }
  }, [address_data, region_code_data, global_var.land_clicked]);

  useEffect(() => {
    if (!global_var.land_clicked) {
      console.log(polygons);
      handlePolygons({ type: "remove all" });
      setGlobalVar({ state: "initial" });
    }
  }, [global_var.land_clicked]);

  const onCenterChanged = (event) => {
    // console.log("center changed.");
    let level = map.getLevel();
    setGlobalVar({ level: level });
    pushAddress(getMapState(map));
  };

  const pushAddress = ({ level, lat, lng }) => {
    let geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2RegionCode(lng, lat, (result, status) => {
      // console.log(result);
      if (level <= 2) {
        setGlobalVar({ region_address: result[0].address_name });
      } else if (level <= 5) {
        setGlobalVar({
          region_address:
            result[0].region_1depth_name + " " + result[0].region_2depth_name,
        });
      } else if (level <= 9) {
        setGlobalVar({ region_address: result[0].region_1depth_name });
      } else {
        setGlobalVar({ region_address: "대한민국" });
      }
    });
  };

  const onMouseMove = (event) => {
    const element = document.getElementById("cursor-follower");
    if (element) {
      element.style.top = event.clientY + "px";
      element.style.left = event.clientX + "px";
    }
  };
  const [a, setA] = useState(
    [
      ["126.97937942", "37.57749327"],
      ["126.97936586", "37.57778038"],
      ["126.97936019", "37.57786908"],
      ["126.97935794", "37.5778846"],
      ["126.97935533", "37.57786269"],
      ["126.97934849", "37.57770717"],
      ["126.97933889", "37.57749326"],
      ["126.97933892", "37.57733723"],
    ].map((e) => {
      return { lat: e[1], lng: e[0] };
    })
  );

  useEffect(() => {
    console.log("change");
    setA(
      [
        [global_var.lat, global_var.lng],
        [Number(global_var.lat) + 0.01, global_var.lng],
        [global_var.lat, Number(global_var.lng) + 0.01],
      ].map((e) => {
        return { lat: e[0], lng: e[1] };
      })
    );
  }, [map, global_var.lat, global_var.lng]);
  return (
    <div
      className={cx("background-map-wrapper", "wrapper")}
      onMouseMove={onMouseMove}
      onMouseOver={(event) => {
        onMouseMove(event);
        setUseCursor(true);
      }}
      onMouseLeave={() => {
        setUseCursor(false);
      }}
    >
      <div id="map" className={cx("map", global_var.sub_function)}></div>
      {map && (
        <KakaoMapProvider value={map}>
          {children}
          {/* {global_var.sub_function == "measure_distance" ? (
            <KakaoPolygon map={map} path={a} />
          ) : (
            <></>
          )}
          <KakaoPolygon map={map} path={a} /> */}
        </KakaoMapProvider>
      )}
      <div
        id="cursor-follower"
        className={cx("cursor-follower", global_var.sub_function || "none")}
      >
        {use_cursor ? (
          global_var.sub_function == "measure_distance" ||
          global_var.sub_function == "measure_area" ? (
            <CursorPick />
          ) : (
            <div></div>
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

BackgroundMap.defaultProps = {};

export default BackgroundMap;
