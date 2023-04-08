import { GUI } from "dat.gui";
import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useDatGui from "../component/datGuiHooks/useDatGui";
// import classNames from "classnames/bind";
// import "../util/reset.css";
// import styles from "./ThreeJsPage.module.scss";

// const cx = classNames.bind(styles);

const DatString = ({ path, placeholder }) => {
  const gui_state = useDatGui();
  const data = useRef(
    Object.defineProperty({}, path, { value: placeholder, writable: true })
  );
  useLayoutEffect(() => {
    const controller = gui_state.gui
      .add(data.current, path)
      .onChange((state) => {
        gui_state.onChange({ path, state });
      });
    return () => {
      controller.remove();
    };
  }, [path, placeholder, gui_state]);

  return <></>;
};

DatString.defaultProps = {
  path: "test",
  min: 0,
  max: 1,
  step: 0.01,
  placeholder: 0.2,
};

export default DatString;
