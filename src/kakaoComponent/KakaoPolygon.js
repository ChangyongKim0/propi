import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useLayoutEffect,
  forwardRef,
} from "react";
// { useEffect }
import useKakaoEvent from "../kakaoHooks/useKakaoEvent";
import styles from "./KakaoPolygon.module.scss";
import classNames from "classnames/bind";
import useKakaoMap from "../kakaoHooks/useKakaoMap";

const cx = classNames.bind(styles);

const KakaoPolygon = forwardRef(
  (
    {
      fillColor,
      fillOpacity,
      onClick,
      onCreate,
      onMousedown,
      onMousemove,
      onMouseout,
      onMouseover,
      path,
      strokeColor,
      strokeOpacity,
      strokeStyle,
      strokeWeight,
      zIndex,
    },
    ref
  ) => {
    const kakao_map = useKakaoMap("KakaoPolygon");
    const polygon_path = useMemo(() => {
      if (path.every((v) => v instanceof Array)) {
        return path.map((v) => {
          return v.map((p) => new window.kakao.maps.LatLng(p.lat, p.lng));
        });
      }
      return path.map((v) => {
        return new window.kakao.maps.LatLng(v.lat, v.lng);
      });
    }, [path]);

    const polygon = useMemo(() => {
      return new window.kakao.maps.Polygon({
        path: polygon_path,
        // fillColor,
        // fillOpacity,
        strokeColor,
        // strokeOpacity,
        // strokeStyle,
        // strokeWeight,
        // zIndex,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => polygon, [polygon]);

    useLayoutEffect(() => {
      polygon.setMap(kakao_map);
      return () => polygon.setMap(null);
    }, [kakao_map, polygon]);

    useLayoutEffect(() => {
      const onDelete = onCreate(polygon);
      return () => onDelete?.();
    }, [polygon, onCreate]);

    useLayoutEffect(() => {
      polygon.setOptions({
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeStyle,
        strokeWeight,
      });
    }, [
      polygon,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeStyle,
      strokeWeight,
    ]);

    useLayoutEffect(() => {
      polygon.setPath(polygon_path);
    }, [polygon, polygon_path]);

    useLayoutEffect(() => {
      if (zIndex) polygon.setZIndex(zIndex);
    }, [polygon, zIndex]);

    useKakaoEvent(polygon, "mouseover", onMouseover);
    useKakaoEvent(polygon, "mouseout", onMouseout);
    useKakaoEvent(polygon, "mousemove", onMousemove);
    useKakaoEvent(polygon, "mousedown", onMousedown);
    useKakaoEvent(polygon, "click", onClick);

    return <div></div>;
  }
);

KakaoPolygon.defaultProps = {
  fillColor: "#ffffff",
  fillOpacity: 0,
  onClick: () => {},
  onCreate: () => {},
  onMouseDown: () => {},
  onMousemove: () => {},
  onMouseout: () => {},
  onMouseover: () => {},
  path: [],
  strokeColor: "#ffffff",
  strokeOpacity: 1,
  strokeStyle: "solid",
  strokeWeight: 3,
  zIndex: 1,
};

export default KakaoPolygon;

// ### ValuationCompText

// - style: default / detail / total
// - use_tooltip: True / False
// - use_toggle: True / False
// - tooltip
// - title, value, unit, second_value, second_unit
// - toggle_content <=children
