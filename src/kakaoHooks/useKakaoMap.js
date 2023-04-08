import { createContext, useContext } from "react";

export const KakaoMapContext = createContext();

const useKakaoMap = (component_name) => {
  const kakao_map = useContext(KakaoMapContext);
  if (!kakao_map) {
    throw new Error(
      (component_name ? component_name + " Component" : "useMap") +
        "must exist inside Map Component."
    );
  }
  return kakao_map;
};

export const KakaoMapProvider = ({ children, value }) => {
  return (
    <KakaoMapContext.Provider value={value}>
      {children}
    </KakaoMapContext.Provider>
  );
};

export default useKakaoMap;
