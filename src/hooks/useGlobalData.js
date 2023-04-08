import React, { createContext, useContext, useMemo, useReducer } from "react";
import proj4 from "proj4";

export const GlobalDataContext = createContext({
  global_data: {
    buffer: new Set(),
    my: {},
    land: {
      "NSDI:F251": {
        "NSDI:SHAPE": {
          "gml:Polygon": {
            "gml:exterior": { "gml:LinearRing": { "gml:posList": "" } },
          },
        },
      },
    },
    building: {},
    price: {},
  },
  setGlobalData: () => {},
});

const useGlobalData = () => {
  const { global_data, setGlobalData } = useContext(GlobalDataContext);
  return [global_data, setGlobalData];
};

const reduceGlobalData = (state, action) => {
  let new_state = { ...state };
  // if (action.data[action.type] == undefined) {
  //   action.data[action.type] = {};
  // }
  // Object.keys(action.data || {}).map((key) => {
  //   console.log(new_state);
  //   console.log(action);
  //   if (action.data[action.type][key] != undefined) {
  //     new_state[action.type][key] = action.data[action.type][key];
  //   }
  // });
  // console.log(new_state);
  // console.log(action);
  new_state[action.type] = action.data;
  console.log("global data updated.");
  proj4.defs([
    [
      "EPSG:4326",
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees",
    ],
    [
      "EPSG:5186",
      "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs",
    ],
  ]);
  const pos_list =
    new_state.land["NSDI:F251"]["NSDI:SHAPE"]["gml:Polygon"]["gml:exterior"][
      "gml:LinearRing"
    ]["gml:posList"].split(" ");
  // console.log(pos_list);
  // console.log(
  //   Array(pos_list.length / 2)
  //     .fill(0)
  //     .map((e, idx) =>
  //       proj4("EPSG:4326", "EPSG:5186", [
  //         Number(pos_list[2 * idx]),
  //         Number(pos_list[2 * idx + 1]),
  //       ])
  //     )
  // );
  // console.log(new_state.land?.)
  return new_state;
};

export const GlobalDataProvider = ({ children }) => {
  const [global_data, setGlobalData] = useReducer(reduceGlobalData, {});
  const value = useMemo(() => {
    return { global_data, setGlobalData };
  }, [global_data, setGlobalData]);

  return (
    <GlobalDataContext.Provider value={value}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export default useGlobalData;
