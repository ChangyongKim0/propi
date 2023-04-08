import { useEffect } from "react";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";

const ThreeJs3dmLoader = ({ url, scene, onLoad, onProgress, onError }) => {
  useEffect(() => {
    const loader = new Rhino3dmLoader();
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");
    loader.load(
      url,
      (obj) => {
        scene.add?.(obj);
        onLoad(obj);
      },
      onProgress,
      onError
    );
  }, []);

  return <></>;
};

ThreeJs3dmLoader.defaultProps = {
  url: "test.3dm",
  scene: undefined,
  onLoad: () => {
    console.log("model loaded.");
  },
  onProgress: (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded.");
  },
  onError: () => {
    console.log("an error occured while loading model.");
  },
};

export default ThreeJs3dmLoader;
