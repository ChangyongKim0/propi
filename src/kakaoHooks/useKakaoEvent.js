import { useEffect } from "react";
const useKakaoEvent = (target, type, callback, wrap_target = false) => {
  useEffect(() => {
    if (!target || !callback) return;

    const wrapCallback = wrap_target
      ? (...arg) => {
          if (arg === undefined) return callback(target);
          else return callback(target, ...arg);
        }
      : callback;

    window.kakao.maps.event.addListener(target, type, wrapCallback);

    return () => {
      window.kakao.maps.event.removeListener(target, type, wrapCallback);
    };
  }, [target, type, callback]);
};

export default useKakaoEvent;
