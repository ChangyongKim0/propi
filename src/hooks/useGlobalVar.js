import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import useCookieData from "./useCookieData";

export const GlobalVarContext = createContext({
  global_var: {},
  setGlobalVar: () => {},
});

const useGlobalVar = () => {
  const { global_var, setGlobalVar } = useContext(GlobalVarContext);
  return [global_var, setGlobalVar];
};

const reduceGlobalVar = (state, action) => {
  let new_state = { ...state };
  Object.keys(action).map((key) => {
    // console.log(new_state);
    // console.log(action);
    new_state[key] = action[key];
  });
  return new_state;
};

export const GlobalVarProvider = ({ children }) => {
  const [cookie_data, handleCookieData] = useCookieData();
  const [global_var, setGlobalVar] = useReducer(reduceGlobalVar, {
    cookie_list: ["unit_type", "map_type", "pnu", "lat", "lng", "level"],
    unit_type: "py",
    map_type: "normal",
    pnu: "1168010100108080005",
    lat: 37.497928,
    lng: 127.027583,
    level: 3,
  });
  const value = useMemo(() => {
    let cookie_data_to_update = {};
    global_var.cookie_list.map((key) => {
      if (global_var[key] != cookie_data.data[key]) {
        console.log(key + " in global variable refeshed.");
        cookie_data_to_update[key] = global_var[key];
      }
    });
    handleCookieData({ type: "patch", data: cookie_data_to_update });
    return { global_var, setGlobalVar };
  }, [global_var, setGlobalVar]);

  useEffect(() => {
    let global_var_to_update = {};
    global_var.cookie_list.map((key) => {
      if (global_var[key] != cookie_data.data[key]) {
        global_var_to_update[key] = cookie_data.data[key];
      }
    });
    setGlobalVar(global_var_to_update);
  }, [cookie_data.data]);

  return (
    <GlobalVarContext.Provider value={value}>
      {children}
    </GlobalVarContext.Provider>
  );
};

export default useGlobalVar;
