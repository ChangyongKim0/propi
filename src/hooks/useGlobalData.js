import React, { createContext, useContext, useMemo, useReducer } from "react";

export const GlobalDataContext = createContext({
  global_data: { buffer: new Set(), my: {}, land: {}, building: {}, price: {} },
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
  console.log(new_state);
  console.log(action);
  new_state[action.type] = action.data;
  console.log("global data updated.");
  console.log(new_state);
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
