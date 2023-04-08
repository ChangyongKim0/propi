import { useContext } from "react";
import { DatGuiContext } from "../../datGuiComponent/DatGui";

const useDatGui = (component_name) => {
  const dat_gui = useContext(DatGuiContext);
  if (!dat_gui) {
    throw new Error(
      (component_name ? component_name + " Component" : "useMap") +
        "must exist inside DatGui Component."
    );
  }
  return dat_gui;
};

export default useDatGui;
