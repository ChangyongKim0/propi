import { GUI } from "dat.gui";
import React, { createContext, useEffect, useRef, useState } from "react";
// import classNames from "classnames/bind";
// import "../util/reset.css";
// import styles from "./ThreeJsPage.module.scss";

// const cx = classNames.bind(styles);
export const DatGuiContext = createContext();

const DatGui = ({ onChange, children }) => {
  const [gui_state, setGuiState] = useState({ gui: new GUI(), onChange });
  return (
    <DatGuiContext.Provider value={gui_state}>
      {children}
    </DatGuiContext.Provider>
  );
};

DatGui.defaultProps = {
  onChange: ({ state, path }) => {
    console.log("the state of " + path + " is changed to " + state + ".");
  },
  children: undefined,
};

export default DatGui;
