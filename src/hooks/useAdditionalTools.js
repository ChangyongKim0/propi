import { useReducer, useState, useEffect } from "react";
import { _formatThousandSeperator } from "../util/alias";
import {
  renderToStaticMarkup,
  renderToStaticNodeStream,
} from "react-dom/server";
import Icon from "../atoms/Icon";
import useGlobalVar from "./useGlobalVar";

const formatLengthData = (data) => {
  return Math.round(data) >= 1000
    ? _formatThousandSeperator((Math.round(data / 100) / 10).toFixed(1)) + "km"
    : _formatThousandSeperator(Math.round(data)) + "m";
};

const formatAreaData = (data, unit_type) => {
  if (unit_type == "py") {
    return Math.round(data * 0.3025) >= 1000000
      ? _formatThousandSeperator(
          Math.round((data * 0.3025) / 10000).toFixed(0)
        ) + "만 평"
      : _formatThousandSeperator((Math.round(data * 3.025) / 10).toFixed(1)) +
          "평";
  }
  return Math.round(data) >= 1000000
    ? _formatThousandSeperator((Math.round(data / 10000) / 100).toFixed(2)) +
        "km²"
    : _formatThousandSeperator(Math.round(data)) + "m²";
};

const getOverlayElement = {
  Point: () => (
    <div
      className="measure-distance-point"
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "8px",
        border: "3px solid #d32f2f",
        backgroundColor: "#ffffff",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    ></div>
  ),
  Length: (acc_length, length) => (
    <div
      className="measure-distance-overlay prevent-map-click"
      style={{
        display: "inline-flex",
        fontSize: "12px",
        fontWeight: "900",
        color: "#d32f2f",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transform: "translate(-50%, calc(-100% - 12px))",
      }}
    >
      <span
        className="measure-distance-overlay-content measure-distance-overlay-acc-title"
        style={{
          fontWeight: "700",
          color: "#808080",
          fontSize: "8px",
          lineHeight: "12px",
        }}
      >
        누적{"\u00A0"}
      </span>
      <span className="measure-distance-overlay-content measure-distance-overlay-acc-length">
        {formatLengthData(acc_length)}
      </span>
      <span
        className="measure-distance-overlay-content measure-distance-overlay-title"
        style={{
          fontWeight: "700",
          color: "#808080",
          fontSize: "8px",
          lineHeight: "12px",
          display: "none",
        }}
      >
        상대{"\u00A0"}
      </span>
      <span
        className="measure-distance-overlay-content measure-distance-overlay-length"
        style={{ display: "none" }}
      >
        {formatLengthData(length)}
      </span>
    </div>
  ),
  RealtimeLength: (acc_length, length) => (
    <div
      className="measure-distance-realtime-overlay"
      style={{
        display: "flex",
        position: "absolute",
        gap: "4px",
        flexDirection: "column",
        fontSize: "12px",
        fontWeight: "900",
        color: "#d32f2f",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transform: "translate(12px, 15px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "8px",
            lineHeight: "12px",
          }}
        >
          전체 거리{"\u00A0"}
        </span>
        <span>{formatLengthData(acc_length)}</span>
      </div>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "8px",
            lineHeight: "12px",
          }}
        >
          상대 거리{"\u00A0"}
        </span>
        <span>{formatLengthData(length)}</span>
      </div>
      <div
        style={{
          fontWeight: "700",
          color: "#333333",
          fontSize: "8px",
          textAlign: "right",
          width: "100%",
        }}
      >
        지정완료 : 우클릭
      </div>
    </div>
  ),
  TotalLength: (total_length, onClick) => (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        fontSize: "14px",
        fontWeight: "900",
        color: "#d32f2f",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transform: "translate(9px, 9px)",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontWeight: "700",
          color: "#808080",
          fontSize: "12px",
          lineHeight: "14px",
        }}
      >
        전체 거리{"\u00A0"}
      </span>
      <span>{formatLengthData(total_length)}</span>
      <div
        className="prevent-map-click"
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          width: "16px",
          height: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
        onClick={(event) => {
          onClick?.CloseOverlay?.();
        }}
      >
        <Icon size={1} type="close" />
      </div>
    </div>
  ),
  CloseAll: (onClick) => {
    return (
      <div
        className="prevent-map-click"
        style={{
          position: "absolute",
          bottom: "5px",
          left: "5px",
          width: "16px",
          height: "16px",
          borderRadius: "8px",
          backgroundColor: "#d32f2f",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
        onClick={(event) => {
          onClick?.();
        }}
      >
        <Icon size={1} type="close" color="white" />
      </div>
    );
  },
  RealtimeArea: (area) => (
    <div
      className="measure-distance-realtime-overlay"
      style={{
        display: "flex",
        position: "absolute",
        gap: "4px",
        flexDirection: "column",
        fontSize: "12px",
        fontWeight: "900",
        color: "#d32f2f",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transform: "translate(12px, 15px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "8px",
            lineHeight: "12px",
          }}
        >
          면적{"\u00A0"}
        </span>
        <span>{formatAreaData(area)}</span>
      </div>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "8px",
            lineHeight: "12px",
          }}
        >
          {"\u00A0"}
        </span>
        <span>{formatAreaData(area, "py")}</span>
      </div>
      <div
        style={{
          fontWeight: "700",
          color: "#333333",
          fontSize: "8px",
          textAlign: "right",
          width: "100%",
        }}
      >
        지정완료 : 우클릭
      </div>
    </div>
  ),
  TotalArea: (area, onClick) => (
    <div
      style={{
        display: "flex",
        position: "absolute",
        gap: "4px",
        flexDirection: "column",
        fontSize: "14px",
        fontWeight: "900",
        color: "#d32f2f",
        padding: "4px",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        transform: "translate(9px, 9px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "12px",
            lineHeight: "14px",
          }}
        >
          면적{"\u00A0"}
        </span>
        <span>{formatAreaData(area)}</span>
      </div>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            color: "#808080",
            fontSize: "12px",
            lineHeight: "14px",
          }}
        >
          {"\u00A0"}
        </span>
        <span>{formatAreaData(area, "py")}</span>
      </div>
      <div
        className="prevent-map-click"
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          width: "16px",
          height: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
        onClick={(event) => {
          onClick?.CloseOverlay?.();
        }}
      >
        <Icon size={1} type="close" />
      </div>
    </div>
  ),
};

export const useMeasureDistance = (map, sub_function, event_listener) => {
  const [is_clicked, setIsClicked] = useState(false);
  const [use_acc_length, setUseAccLength] = useState(true);
  const [map_change, setMapChange] = useReducer((state, _) => state + 1, 0);
  const [global_var, setGlobalVar] = useGlobalVar();
  const [prevent_map_click, setPreventMapClick] = useState(false);
  const [overlay_loaded, setOverlayLoaded] = useState(false);

  const reduceSetElementStackParams = (state, action) => {
    if (action.type == "reset") {
      return false;
    }
    if (state.type == "create multiple" && action.type == "create multiple") {
      const merged_data = [...state.data, ...action.data];
      const new_data = merged_data.filter(
        (e, idx) => merged_data.findIndex((e2) => e2.id == e.id) == idx
      );
      const merged_data_to_delete = [
        ...state.data_to_delete,
        ...action.data_to_delete,
      ];
      const new_data_to_delete = merged_data_to_delete.filter(
        (e, idx) =>
          merged_data_to_delete.findIndex((e2) => e2.id == e.id) == idx
      );
      return {
        type: "create multiple",
        data: new_data,
        data_to_delete: new_data_to_delete,
      };
    }
    return action;
  };

  const [set_element_stack_params, setSetElementStackParams] = useReducer(
    reduceSetElementStackParams,
    false
  );

  useEffect(() => {
    setGlobalVar({ prevent_map_click: prevent_map_click });
  }, [prevent_map_click]);

  useEffect(() => {
    if (set_element_stack_params != false) {
      global_var.setElementStack({ ...set_element_stack_params });
      setSetElementStackParams({ type: "reset" });
    }
  }, [set_element_stack_params]);

  const onClickOverlay = (event) => {
    event_listener?.onClick?.(event);
  };
  const onMouseEnterOverlay = (event) => {
    setPreventMapClick(true);
    event_listener?.onMouseEnter?.(event);
  };
  const onMouseLeaveOverlay = (event) => {
    setPreventMapClick(false);
    event_listener?.onMouseLeave?.(event);
  };

  const setAndPushElementStack = ({
    id,
    element_type,
    element,
    push_list,
    pos,
    z_index,
  }) => {
    setSetElementStackParams({
      type: "create",
      id: id,
      element_type: element_type,
      element: element,
      callback: () => {
        push_list.push({
          id: id,
          element_type: element_type,
          element: new window.kakao.maps.CustomOverlay({
            map: map,
            position: pos,
            content: global_var.getElementStackByIdAndElementType(
              id,
              element_type
            ),
            xAnchor: 0,
            yAnchor: 0,
            zIndex: z_index,
          }),
        });
        setOverlayLoaded(true);
      },
    });
  };

  const setAndPushMultipleElementStacks = (
    multiple_data,
    multiple_data_to_delete
  ) => {
    setSetElementStackParams({
      type: "create multiple",
      data: multiple_data.map((e) => {
        return {
          id: e.id,
          element_type: e.element_type,
          element: e.element,
          callback: () => {
            e.push_list.push({
              id: e.id,
              element_type: e.element_type,
              element: new window.kakao.maps.CustomOverlay({
                map: map,
                position: e.pos,
                content: global_var.getElementStackByIdAndElementType(
                  e.id,
                  e.element_type
                ),
                xAnchor: 0,
                yAnchor: 0,
                zIndex: e.z_index,
              }),
            });
            setOverlayLoaded(true);
          },
        };
      }),
      data_to_delete: [multiple_data_to_delete],
    });
    multiple_data_to_delete.map((e) => {
      e.element.setMap(null);
    });
    onMouseLeaveOverlay(new Event("mouseleave"));
  };

  const unsetAndDeleteElementStack = ({ id, element_type, element }) => {
    element.setMap(null);
    // setSetElementStackParams({ type: "delete", id, element_type });
    onMouseLeaveOverlay(new Event("mouseleave"));
  };

  const [clicked_lines, setClickedLines] = useReducer((state, action) => {
    const overlay_list_to_set = [];
    const overlay_list_to_unset = [];
    let new_state = state;
    switch (action.type) {
      case "create":
        const id = Date.now();
        state.push({
          id: id,
          data:
            action.sub_function == "measure_distance"
              ? new window.kakao.maps.Polyline({
                  map: map,
                  path: [action.pos],
                  strokeWeight: 3,
                  strokeColor: "#d32f2f",
                  strokeOpacity: 0.8,
                  strokeStyle: "solid",
                  zIndex: 1,
                })
              : new window.kakao.maps.Polygon({
                  map: map,
                  path: [action.pos],
                  strokeWeight: 3,
                  strokeColor: "#d32f2f",
                  strokeOpacity: 0.8,
                  strokeStyle: "solid",
                  zIndex: 1,
                  fillColor: "#d32f2f",
                  fillOpacity: 0.3,
                }),
          acc_length_list: [],
          length_list: [],
          point_list: [],
          overlay_list: [],
          length: 0,
          acc_length: 0,
          sub_function: sub_function,
        });
        if (sub_function == "measure_distance") {
          overlay_list_to_set.push({
            id: "point-" + id.toString() + "0",
            element_type: "point-" + id.toString(),
            element: getOverlayElement.Point(),
            push_list: state[state.length - 1].point_list,
            pos: action.pos,
            z_index: 2,
          });
        }
        new_state = [...state];
        break;
      case "update":
        new_state = state.map((e, idx) => {
          if (idx < state.length - 1) {
            return e;
          }
          const path = e.data.getPath();
          path.push(action.pos);
          e.data.setPath(path);
          const acc_length = e.data.getLength();
          const length =
            e.length_list.length > 0 ? acc_length - e.acc_length : acc_length;
          e.acc_length_list.push(acc_length);
          e.length_list.push(length);
          e.length = length;
          e.acc_length = acc_length;
          if (e.sub_function == "measure_distance") {
            overlay_list_to_set.push(
              {
                id: "point-" + e.id.toString() + e.point_list.length,
                element_type: "point-" + e.id.toString(),
                element: getOverlayElement.Point(),
                push_list: e.point_list,
                pos: action.pos,
                z_index: 2,
              },
              {
                id: "length-" + e.id.toString() + e.overlay_list.length,
                element_type: "length-" + e.id.toString(),
                element: getOverlayElement.Length(acc_length, length),
                push_list: e.overlay_list,
                pos: action.pos,
                z_index: 3,
              }
            );
          }
          return e;
        });
        break;
      case "update final":
        new_state = state
          .map((e, idx) => {
            if (idx < state.length - 1) {
              return e;
            }
            console.log(e.data.getPath());
            if (
              e.data.getPath().length <
              (e.sub_function == "measure_distance" ? 2 : 4)
            ) {
              overlay_list_to_unset.push(...e.point_list);
              e.data.setMap(null);
              return null;
            }

            if (e.sub_function == "measure_distance") {
              overlay_list_to_unset.push(
                e.overlay_list[e.overlay_list.length - 1]
              );
            } else if (e.sub_function == "measure_area") {
              e.data.setPath([
                ...e.data.getPath().slice(0, e.data.getPath().length - 1),
              ]);
            }
            e.overlay_list = e.overlay_list.slice(0, e.overlay_list.length - 1);
            overlay_list_to_set.push(
              {
                id: e.id.toString() + e.overlay_list.length,
                element_type:
                  (e.sub_function == "measure_distance"
                    ? "total-length-"
                    : "total-area-") + e.id.toString(),
                element:
                  e.sub_function == "measure_distance"
                    ? getOverlayElement.TotalLength(e.acc_length, {
                        CloseOverlay: () => {
                          setClickedLines({ type: "delete overlay", id: e.id });
                        },
                      })
                    : getOverlayElement.TotalArea(e.data.getArea(), {
                        CloseOverlay: () => {
                          setClickedLines({ type: "delete overlay", id: e.id });
                        },
                      }),
                push_list: e.overlay_list,
                pos: e.data.getPath()[e.data.getPath().length - 1],
                z_index: 3,
              },
              {
                id: e.id.toString() + e.point_list.length,
                element_type: "close-point-" + e.id.toString(),
                element: getOverlayElement.CloseAll(() => {
                  setClickedLines({ type: "delete", id: e.id });
                }),
                push_list: e.point_list,
                pos: e.data.getPath()[e.data.getPath().length - 1],
                z_index: 3,
              }
            );
            return e;
          })
          .filter((e) => e != null);
        break;
      case "delete":
        new_state = state
          .map((e) => {
            if (e.id == action.id) {
              e.data.setMap(null);
              overlay_list_to_unset.push(...e.point_list);
              overlay_list_to_unset.push(...e.overlay_list);
              return null;
            }
            return e;
          })
          .filter((e) => e != null);
        break;
      case "delete overlay":
        new_state = state.map((e) => {
          if (e.id == action.id) {
            overlay_list_to_unset.push(...e.overlay_list);
            e.overlay_list = [];
          }
          return e;
        });
        break;
      case "delete all":
        state.map((e) => {
          e.data.setMap(null);
        });
        new_state = [];
        break;
      case "default":
        break;
    }
    setAndPushMultipleElementStacks(overlay_list_to_set, overlay_list_to_unset);
    return new_state;
  }, []);
  const [moved_line, setMovedLine] = useReducer((state, action) => {
    const overlay_list_to_set = [];
    switch (action.type) {
      case "create":
        const overlay = [];
        const id = Date.now();
        setAndPushMultipleElementStacks(
          [
            {
              id,
              element_type:
                sub_function == "measure_distance"
                  ? "realtime-length-"
                  : "realtime-area-",
              element:
                sub_function == "measure_distance"
                  ? getOverlayElement.RealtimeLength(0, 0)
                  : getOverlayElement.RealtimeArea(0),
              push_list: overlay,
              pos: action.pos,
              z_index: 4,
            },
          ],
          []
        );
        return [
          {
            data: new window.kakao.maps.Polyline({
              map: map,
              path: [action.pos],
              strokeWeight: 3,
              strokeColor: "#d32f2f",
              strokeOpacity: 0.3,
              strokeStyle: "solid",
              zIndex: 1,
            }),
            length: 0,
            acc_length: 0,
            overlay: overlay,
            id,
            sub_function,
          },
        ];
      case "update move":
        if (state.length == 0) {
          return state;
        }
        const path = state[0].data.getPath();
        state[0].data.setPath([path[0], action.pos]);
        const length = state[0].data.getLength();
        state[0].length = length;
        state[0].acc_length =
          clicked_lines[clicked_lines.length - 1].acc_length + length;
        const clicked_line = clicked_lines[clicked_lines.length - 1].data;
        if (sub_function == "measure_distance") {
        } else if (sub_function == "measure_area") {
          clicked_line.setPath([
            ...clicked_line
              .getPath()
              .slice(0, Math.max(clicked_line.getPath().length - 1, 1)),
            action.pos,
          ]);
        }
        setSetElementStackParams({
          type: "update",
          id: state[0].id,
          element_type:
            sub_function == "measure_distance"
              ? "realtime-length-"
              : "realtime-area-",
          element:
            sub_function == "measure_distance"
              ? getOverlayElement.RealtimeLength(
                  state[0].acc_length,
                  state[0].length
                )
              : getOverlayElement.RealtimeArea(clicked_line.getArea()),
        });
        state[0].overlay[0]?.element.setPosition(action.pos);
        return [...state];
      case "update click":
        if (state.length == 0) {
          return state;
        }
        state[0].data.setPath([action.pos]);
        return [...state];
      case "delete":
        if (state.length == 0) {
          return state;
        }
        state[0].data.setMap(null);
        if (state[0].overlay[0] != undefined) {
          unsetAndDeleteElementStack(state[0].overlay[0]);
        }
        return [];
      case "default":
        return state;
    }
  }, []);

  const [clicked_lines_params, setClickedLinesParams] = useState(false);

  useEffect(() => {
    if (clicked_lines_params != false) {
      setClickedLines({ ...clicked_lines_params });
    }
  }, [clicked_lines_params]);

  const onMouseMove = (event) => {
    setMovedLine({ type: "update move", pos: event.latLng, sub_function });
  };
  const onRightClick = () => {
    setMovedLine({ type: "delete", sub_function });
    setClickedLinesParams({ type: "update final", sub_function });
    window.kakao.maps.event.removeListener(map, "mousemove", onMouseMove);
    window.kakao.maps.event.removeListener(map, "rightclick", onRightClick);
    setIsClicked(false);
  };

  useEffect(() => {
    let onClick = () => {};
    if (
      map != undefined &&
      (sub_function == "measure_distance" || sub_function == "measure_area")
    ) {
      if (is_clicked) {
        onClick = (event) => {
          setClickedLinesParams({
            type: "update",
            pos: event.latLng,
            sub_function,
          });
          setMovedLine({
            type: "update click",
            pos: event.latLng,
            sub_function,
          });
        };
      } else if (!global_var.prevent_map_click) {
        onClick = (event) => {
          setClickedLinesParams({
            type: "create",
            pos: event.latLng,
            sub_function,
          });
          setMovedLine({ type: "create", pos: event.latLng, sub_function });
          window.kakao.maps.event.addListener(map, "mousemove", onMouseMove);
          window.kakao.maps.event.removeListener(
            map,
            "rightclick",
            onRightClick
          );
          window.kakao.maps.event.addListener(map, "rightclick", onRightClick);
          setIsClicked(true);
        };
      }
      window.kakao.maps.event.addListener(map, "click", onClick);
      return () => {
        window.kakao.maps.event.removeListener(map, "click", onClick);
      };
    } else if (map != undefined) {
      window.kakao.maps.event.removeListener(map, "click", onClick);
    }
  }, [is_clicked, map, sub_function, global_var.prevent_map_click]);

  useEffect(() => {
    if (map != undefined) {
      window.kakao.maps.event.trigger(map, "rightclick");
    }
  }, [sub_function]);

  useEffect(() => {
    if (map != undefined) {
      window.kakao.maps.event.addListener(map, "bounds_changed", setMapChange);
    }
    return () => {
      if (map != undefined) {
        window.kakao.maps.event.removeListener(
          map,
          "bounds_changed",
          setMapChange
        );
      }
    };
  }, [map]);

  useEffect(() => {
    const onClickDistanceOverlay = () => setUseAccLength(!use_acc_length);
    Array.from(document.getElementsByClassName("prevent-map-click")).map(
      (e) => {
        e.style.cursor = is_clicked ? "none" : "pointer";
        e.style.pointerEvents = is_clicked ? "none" : "auto";
        if (!is_clicked) {
          e.addEventListener("click", onClickOverlay);
          e.addEventListener("mouseenter", onMouseEnterOverlay);
          e.addEventListener("mouseleave", onMouseLeaveOverlay);
        }
      }
    );
    Array.from(document.getElementsByClassName("measure-distance-overlay")).map(
      (e) => {
        if (!is_clicked) {
          e.addEventListener("click", onClickDistanceOverlay);
        }
      }
    );
    Array.from(
      document.getElementsByClassName("measure-distance-overlay-content")
    ).map((e) => {
      if (Array.from(e.classList).join("-").includes("-acc-")) {
        e.style.display = use_acc_length ? "inherit" : "none";
      } else {
        e.style.display = use_acc_length ? "none" : "inherit";
      }
    });
    if (overlay_loaded) {
      setOverlayLoaded(false);
    }
    return () => {
      Array.from(document.getElementsByClassName("prevent-map-click")).map(
        (e) => {
          if (!is_clicked) {
            e.removeEventListener("click", onClickOverlay);
            e.removeEventListener("mouseenter", onMouseEnterOverlay);
            e.removeEventListener("mouseleave", onMouseLeaveOverlay);
          }
        }
      );
      Array.from(
        document.getElementsByClassName("measure-distance-overlay")
      ).map((e) => {
        if (!is_clicked) {
          e.removeEventListener("click", onClickDistanceOverlay);
        }
      });
    };
  }, [
    clicked_lines,
    moved_line,
    use_acc_length,
    is_clicked,
    map_change,
    overlay_loaded,
  ]);
};
