import React, {
  // useContext,
  useEffect,
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
// import { setCookie } from "../hooks/useCookieData";
// import { formatData, formatUnit } from "../hooks/useFormatter";
// import useUnitType from "../hooks/useUnitType";
// import useToggleState from "../hooks/useToggle";
// import useCookieData from "../hooks/useCookieData";
// import useOverlayReloader from "../hooks/useOverlayReloader";
// import { API_URI } from "../src_shortcut";
import { _fillZeros } from "../util/alias";
import { API_URI } from "../shortcut";
import useGlobalData from "../hooks/useGlobalData";
import usePolygon from "../hooks/usePolygon";
import { _getAttachLandList } from "../util/formatMapApiData";

const cx = classNames.bind(styles);

let map;
let event_handlers_for_kakao = {};

const getMapState = () => {
  let level = map.getLevel();
  let lat = map.getCenter().getLat();
  let lng = map.getCenter().getLng();
  return { level: level, lat: lat, lng: lng };
};

let synched_state = "loading";
let synched_sub_function = "none";

const BackgroundMap = ({ handleBldgInfo, is_clicked, setIsClicked }) => {
  // let [overlay, handleOverlay] = useReducer(reduceOverlay, {
  //   show: false,
  //   data: [],
  //   data_pushed: [],
  //   data_removed: [],
  //   is_clicked: false,
  //   clicked_data: { id: -1, polygon: -1 },
  //   clicked_data_before: { id: -1, polygon: -1 },
  //   map_base_state: { level: 2, lat: 0, lng: 0 },
  // });

  const [need_update_overlay, setNeedUpdateOverlay] = useState(false);
  // const [global_var, handleBldgInfoData] = useBldgInfoData();
  // const [overlay_reloader, handleOverlayReloader] = useOverlayReloader();
  const [info_bubble_elements, setInfoBubbleElements] = useState([]);
  const [pilji_list, setPiljiList] = useState([]);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [global_data, setGlobalData] = useGlobalData();
  const [polygons, handlePolygons] = usePolygon();
  const [use_cursor, setUseCursor] = useState(false);

  const handleKakaoListener = ({ type, id, object, mouse_event, handler }) => {
    switch (type) {
      case "create":
        var onEvent = function event() {
          handler();
        };
        if (event_handlers_for_kakao[id] === undefined) {
          event_handlers_for_kakao[id] = {};
        }
        event_handlers_for_kakao[id][mouse_event] = onEvent;
        window.kakao.maps.event.addListener(
          object,
          mouse_event,
          event_handlers_for_kakao[id][mouse_event]
        );
        // console.log(event_handlers_for_kakao);
        break;
      case "remove":
        window.kakao.maps.event.removeListener(
          object,
          mouse_event,
          event_handlers_for_kakao[id][mouse_event]
        );
        delete event_handlers_for_kakao[id][mouse_event];
        // console.log(event_handlers_for_kakao);
        break;
      default:
    }
  };

  useEffect(() => {
    setGlobalVar({ land_clicked: false });
    let container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    let options = {
      // //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(global_var.lat, global_var.lng), //지도의 중심좌표.
      level: global_var.level, //지도의 레벨(확대, 축소 정도)
      mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
      // projectionId: null,
    };
    map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    // map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.USE_DISTRICT) // 지적현황도 내용
    // var zoomControl = new window.kakao.maps.ZoomControl();
    // map.addControl(zoomControl, window.kakao.maps.ControlPosition.BOTTOMRIGHT);

    // handleOverlay({ type: "create", map: map, getMapState: getMapState });
    // getOverlayData(map).then((data) => {
    //   handleOverlay({ type: "update", data: data });
    // });
    // window.kakao.maps.event.addListener(map, "click", onClick);
    handlePolygons({ type: "set map", map: map });
    window.kakao.maps.event.addListener(map, "bounds_changed", onCenterChanged);
    window.kakao.maps.event.addListener(map, "click", onClick);
    // window.kakao.maps.event.addListener(map, "idle", () =>
    //   setTimeout(() => setUnitUpdate("update"), 1000)
    // );

    let tileset = new window.kakao.maps.Tileset(
      256,
      256,
      function (x, y, z) {
        return (
          "https://www.eum.ne.kr:9002/MapPlan/MapPlan?req=timg&timg=20220407/tile" +
          (z < 5 ? "1" : "0") +
          "/" +
          (15 - z) +
          "/" +
          (x + 0.5 * Math.pow(2, 15 - z)) +
          "_" +
          (y + 0.25 * Math.pow(2, 15 - z)) +
          ".png"
        );
      },
      [],
      false,
      0,
      15
    );

    window.kakao.maps.Tileset.add("EUM", tileset);

    pushAddress(getMapState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      setGlobalVar({ land_clicked: false });
    };
  }, []);

  useEffect(() => {
    synched_state = global_var.state;
    synched_sub_function = global_var.sub_function;
  }, [global_var.state, global_var.sub_function]);

  useEffect(() => {
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
  }, [global_var.map_type]);

  useEffect(() => {
    switch (global_var.sub_function) {
      case "road_view":
        map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
        break;
      default:
        map.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    }
  }, [global_var.sub_function]);

  useEffect(() => {
    console.log("land_clicked");
    if (global_var.land_clicked) {
      const latlng = new window.kakao.maps.LatLng(
        global_var.lat,
        global_var.lng
      );
      map.setCenter(latlng);
      onClick({ latLng: latlng });
      setGlobalVar({ land_clicked: false });
    }
  }, [global_var.land_clicked]);

  useEffect(() => {
    if (global_var.level != undefined) {
      map.setLevel(global_var.level);
    }
  }, [global_var.level]);

  useEffect(() => {
    if (global_var.lat != undefined && global_var.lng !== undefined) {
      const latlng = new window.kakao.maps.LatLng(
        global_var.lat,
        global_var.lng
      );
      map.setCenter(latlng);
    }
  }, [global_var.lat, global_var.lng]);

  // useEffect(() => {
  //   console.log("move data updated.");
  //   map.setCenter(
  //     new window.kakao.maps.LatLng(global_var.lat, global_var.lng)
  //   );
  // }, [global_var.move_toggle]);

  useEffect(() => {
    let bounds = map.getBounds();
    var min_lat = bounds.getSouthWest().getLat();
    var min_lng = bounds.getSouthWest().getLng();
    var max_lat = bounds.getNorthEast().getLat();
    var max_lng = bounds.getNorthEast().getLng();
    console.log("bounds: ", max_lat - min_lat, max_lng - min_lng);
    // if (
    //   need_update_overlay &&
    //   (checkFarMove(overlay, getMapState(), 0.002, 0.004) ||
    //     overlay.show == false)
    // ) {
    //   setTimeout(
    //     () =>
    //       getOverlayData(map).then((data) => {
    //         handleOverlay({ type: "update", data: data });
    //       }),
    //     50
    //   );
    // } else {
    //   setNeedUpdateOverlay(false);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [need_update_overlay]);

  const [address_data, setAddressData] = useState();
  const [region_code_data, setRegionCodeData] = useState();

  const getFeatureFromLandData = (land_data) => {
    const pos_list =
      land_data["NSDI:F251"]["NSDI:SHAPE"]["gml:Polygon"]["gml:exterior"][
        "gml:LinearRing"
      ]["gml:posList"];
    let internal_pos_list =
      land_data["NSDI:F251"]["NSDI:SHAPE"]["gml:Polygon"]["gml:interior"];
    if (Array.isArray(internal_pos_list)) {
      internal_pos_list = internal_pos_list.map((e) => {
        return e["gml:LinearRing"]["gml:posList"];
      });
    } else if (internal_pos_list != undefined) {
      internal_pos_list = [internal_pos_list["gml:LinearRing"]["gml:posList"]];
    }

    return { pos_list, internal_pos_list };
  };

  // const updateFeatureListAsynOld = (pnu_list) => {
  //   if (pnu_list.length == 0) {
  //     return;
  //   }
  //   axios.put(API_URI + "land_data", { id: pnu_list[0] }).then((res) => {
  //     if (res.data["NSDI:F251"]) {
  //       handlePolygons({
  //         type: "add secondary",
  //         data: [
  //           {
  //             pnu: pnu_list[0],
  //             ...getFeatureFromLandData(res.data),
  //           },
  //         ],
  //       });
  //     }
  //     updateFeatureListAsync(pnu_list.slice(1));
  //   });
  // };

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
                    ...getFeatureFromLandData(res),
                  },
                ],
              });
            }
          }
        });
      });
  };

  const onClick = (event) => {
    switch (synched_sub_function) {
      case "none":
        return onClickForNone(event);
      case "road_view":
        return onClickForRoadView(event);
      default:
        return onClickForNone(event);
    }
  };

  const onClickForRoadView = (event) => {
    const latlng = event.latLng;
    console.log(latlng.getLat(), latlng.getLng());
    setGlobalVar({
      show_iframe: true,
      iframe_url:
        "https://map.kakao.com/link/roadview/" +
        latlng.getLat() +
        "," +
        latlng.getLng(),
    });
  };

  const onClickForNone = (event) => {
    if (map.getLevel() < 6 && synched_state != "loading") {
      const latlng = event.latLng;
      console.log(latlng.getLat(), latlng.getLng());
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
      Promise.all([promise_road_addr, promise_region, promise_addr]).then(
        (res_list) => {
          const road_pnu =
            res_list[1].filter((e) => e.region_type == "B")[0].code +
            (res_list[0][0]?.address?.mountain_yn == "Y" ? "2" : "1") +
            _fillZeros(res_list[0][0]?.address?.main_address_no || "", 4) +
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
              .put(API_URI + "multiple_data", { request_list: request_list })
              .then((res_list) => {
                console.log(res_list);
                if (res_list.data[0] == "" || !res_list.data[0]["NSDI:F251"]) {
                  setGlobalVar({ state: "fail" });
                } else {
                  setGlobalData({ type: "land", data: res_list.data[0] });

                  const attach_pnu_list = _getAttachLandList(
                    res_list.data[1]?.bldg_attach_jibun_list || [],
                    road_pnu,
                    pnu
                  );
                  if (attach_pnu_list[0] != -1) {
                    setGlobalData({ type: "building", data: res_list.data[1] });
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
                          ...getFeatureFromLandData(res_list.data[0]),
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
        }
      );
    } else if (map.getLevel() >= 6) {
      setGlobalVar({ snackbar: "too_zoomed_out" });
    } else {
      setGlobalVar({ snackbar: "data_is_loading" });
    }
  };

  useEffect(() => {
    if (address_data && region_code_data) {
      const address = address_data[0]?.address?.address_name || "주소 없음";
      const road_address =
        address_data[0]?.road_address?.address_name || "도로명 주소 없음";
      // const pnu =
      //   region_code_data.filter((e) => e.region_type == "B")[0].code +
      //   (address_data[0].address.mountain_yn == "Y" ? "2" : "1") +
      //   _fillZeros(address_data[0].address.main_address_no, 4) +
      //   _fillZeros(address_data[0].address.sub_address_no, 4);
      // console.log(address_data);
      // console.log(address, road_address, pnu);

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
    pushAddress(getMapState());
    if (level <= 3) {
      setNeedUpdateOverlay(true);
    } else {
      console.log("remove all overlays");
      // handleOverlay({ type: "remove all" });
      setNeedUpdateOverlay(false);
    }
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

  // const onClick = () =>
  //   handleBldgInfo({
  //     active: true,
  //     id: -1,
  //   });

  const handleMapUpdate = () => {
    const map_state = getMapState();
    // handleBldgInfoData({
    //   type: "location_update",
    //   lat: map_state.lat,
    //   lng: map_state.lng,
    //   level: map_state.level,
    // });
  };

  // const [unit_type, _] = useUnitType();
  // const [unit_update, setUnitUpdate] = useToggleState({ update: true });
  // const [cookie_data, handleCookieData] = useCookieData();

  // const reloadInfoBubbleText = (unit_type) => {
  //   // console.log(content);
  //   Array.from(document.getElementsByClassName("info-bubble-unit-field")).map(
  //     (e) => {
  //       let price_per_area = parseFloat(
  //         e.innerHTML.replace(/,/g, "").replace(/[^0-9.]/g, "")
  //       );
  //       if (e.innerHTML.includes("만")) {
  //         price_per_area *= 10000;
  //       } else if (e.innerHTML.includes("억")) {
  //         price_per_area *= 100000000;
  //       } else if (e.innerHTML.includes("조")) {
  //         price_per_area *= 1000000000000;
  //       }
  //       const previous_unit = e.innerHTML.replace(/.*\//g, "");
  //       if (previous_unit == "평" && unit_type == "sqm") {
  //         e.innerHTML =
  //           formatData(price_per_area * 0.3025, "number") +
  //           formatUnit("원[/area]", unit_type);
  //       } else if (previous_unit == "㎡" && unit_type == "py") {
  //         e.innerHTML =
  //           formatData(price_per_area / 0.3025, "number") +
  //           formatUnit("원[/area]", unit_type);
  //       }
  //     }
  //   );
  // };

  // useEffect(() => {
  //   setPiljiList(cookie_data.data.pilji_list);
  //   if (cookie_data.data.pilji_list != undefined) {
  //     handleOverlayReloader({
  //       type: "activate",
  //       data: cookie_data.data.pilji_list.map((e) => e.id),
  //     });
  //   }
  // }, [cookie_data]);

  // useEffect(() => {
  //   // console.log(Array.from(Object.keys(info_bubbles)));
  //   // console.log(overlay.data);
  //   reloadInfoBubble(overlay.data, Array.from(Object.keys(info_bubbles)));
  // }, [unit_type]);

  const isBookMarked = (pnu, pilji_list) => {
    // console.log(pilji_list, pnu);
    if (pilji_list != undefined) {
      return pilji_list.map((e) => e.id).includes(pnu);
    } else {
      return false;
    }
  };

  // const createInfoBubble = (each) => {
  //   return (
  //     <InfoBubble
  //       key={each.id}
  //       id={each.id}
  //       handler={handlePolygon}
  //       data={{
  //         price: formatData(each.price, "number"),
  //         date: "'" + each.tr_date.slice(2, 4) + "." + each.tr_date.slice(4, 6),
  //         price_per_py:
  //           formatData(each.price_per_area, "number", "원[/area]", unit_type) +
  //           formatUnit("원[/area]", unit_type),
  //         polygon: each.polygon,
  //       }}
  //       tr_exists={each.price != -1}
  //       is_saved={isBookMarked(each.id, pilji_list)}
  //     />
  //   );
  // };

  const onMouseMove = (event) => {
    const element = document.getElementById("cursor-follower");
    if (element) {
      element.style.top = event.clientY + "px";
      element.style.left = event.clientX + "px";
    }
  };

  return (
    <div
      className={cx("wrapper")}
      onMouseUp={handleMapUpdate}
      onWheel={handleMapUpdate}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setUseCursor(true)}
      onMouseLeave={() => {
        setUseCursor(false);
      }}
    >
      <div id="map" className={cx("map")}></div>
      {/* {overlay.data_pushed
        .filter((e) => e.price != -1 || isBookMarked(e.id, pilji_list))
        .map((each) => createInfoBubble(each))}
      {info_bubble_elements.map((each) => {
        // console.log(each);
        return createInfoBubble(each);
      })} */}
      {use_cursor ? (
        <div
          id="cursor-follower"
          className={cx("cursor-follower", global_var.sub_function || "none")}
        ></div>
      ) : (
        <></>
      )}
    </div>
  );
};

BackgroundMap.defaultProps = {
  handleBldgInfo: (_) => {},
  handleAddress: (_) => {},
  is_clicked: false,
  setIsClicked: (_) => {},
};

export default BackgroundMap;
