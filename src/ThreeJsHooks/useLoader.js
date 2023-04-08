import { useReducer, useState, useEffect } from "react";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

export const useLoader = () => {
  const [loader, setLoader] = useState();

  useEffect(() => {
    const loader = new Rhino();
  });
};
