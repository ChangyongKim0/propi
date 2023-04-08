import proj4 from "proj4";

export const _default = (options, default_json) => {
  options = options || {};
  for (let prop in default_json) {
    options[prop] =
      typeof options[prop] !== "undefined" ? options[prop] : default_json[prop];
  }
  return options;
};

export const _getBoundingBox = (x, y) => {
  return {
    left: Math.min(...x),
    right: Math.max(...x),
    top: Math.min(...y),
    bottom: Math.max(...y),
  };
};

export const _center = (x, y) => {
  let bb = _getBoundingBox(x, y);
  return { x: (bb.left + bb.right) / 2, y: (bb.top + bb.bottom) / 2 };
};

export const _centroid = (x, y) => {
  return { x: _avg(x), y: _avg(y) };
};

export const _sum = (list) => list.reduce((a, b) => a + b, 0);
export const _avg = (list) => _sum(list) / list.length || 0;

export const _fillZeros = (data, length) => {
  if (data.length < length) {
    return _fillZeros("0" + data, length);
  }
  return data;
};

export const _stringfy = (data) => {
  if (!data) {
    return "";
  }
  if (typeof data == typeof { abc: "abc" }) {
    return "";
  }
  if (typeof data != typeof "abc") {
    try {
      return data.toString();
    } catch {
      return "";
    }
  }
  return data;
};

export const _transformScroll = (event) => {
  if (!event.deltaY) {
    return;
  }
  event.currentTarget.scrollLeft += 0.5 * event.deltaY + 0.5 * event.deltaX;
  event.preventDefault();
};

export const _addTransformScrollEvent = (id) => {
  let listener = document
    .getElementById(id)
    .addEventListener("wheel", _transformScroll);
  return () => {
    document.getElementById(id).removeEventListener("wheel", listener);
  };
};

export const _ifValidString = (
  data,
  successMapper = () => true,
  err_text = false,
  disallow_zero = false
) => {
  if (typeof data == typeof "11" && data != "") {
    if (disallow_zero && data == "0") {
      return err_text;
    }
    return successMapper(data);
  }
  return err_text;
};

export const _isValidString = (data, err_text, disallow_zero = false) => {
  return _ifValidString(data, (data) => data, err_text, disallow_zero);
};

export const _formatThousandSeperator = (data) => {
  const seperated_number = data.toString().split(".");
  seperated_number[0] = seperated_number[0].replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  return seperated_number.join(".");
};

export const _getEumTile = (x, y, z) => {
  let div = document.createElement("div");
  let img = document.createElement("img");
  div.style.backgroundColor = "#ffffff";
  const kakao_coord = new window.kakao.maps.Coords(
    -75000 + x * Math.pow(2, z) * 80,
    -150000 + y * Math.pow(2, z) * 80
  ).toLatLng();
  const kakao_coord_sw = new window.kakao.maps.Coords(
    -75000 + (x - 1) * Math.pow(2, z) * 80,
    -150000 + (y - 1) * Math.pow(2, z) * 80
  ).toLatLng();
  const getEumCoord = (kakao_coord) => {
    return proj4(
      "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
      "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs",
      [kakao_coord.getLng(), kakao_coord.getLat()]
    );
  };
  const eum_coord = getEumCoord(kakao_coord);
  const eum_coord_sw = getEumCoord(kakao_coord_sw);
  const new_x = (eum_coord[0] - 90000) / 32 / Math.pow(2, z);
  const new_y = (eum_coord[1] - 1100000) / 32 / Math.pow(2, z);
  const new_x_sw = (eum_coord_sw[0] - 90000) / 32 / Math.pow(2, z);
  const new_y_sw = (eum_coord_sw[1] - 1100000) / 32 / Math.pow(2, z);
  const degree_to_rotate =
    (Math.atan2(new_y - new_y_sw, new_x - new_x_sw) * 180) / Math.PI - 45;
  img.src =
    "https://www.eum.ne.kr:9002/MapPlan/MapPlan?req=timg&timg=20220711/tile" +
    (z < 5 ? "1" : "0") +
    "/" +
    (15 - z) +
    "/" +
    (Math.round(new_x) - 1) +
    "_" +
    (Math.round(new_y) - 1) +
    ".png";
  img.style.height = "100%";
  img.style.position = "absolute";
  img.style.right = 100 * (1 + new_x - Math.round(new_x)) + "%";
  img.style.top = 100 * (1 + new_y - Math.round(new_y)) + "%";
  img.style.zIndex = "1";
  img.style.transformOrigin = "100% 0";
  img.style.rotate = degree_to_rotate + "deg";
  div.appendChild(img);
  div.style.overflow = "visible";
  return div;
};

export const _getFeatureFromLandData = (land_data) => {
  const pos_list =
    land_data["NSDI:F251"]["NSDI:SHAPE"]["gml:Polygon"]["gml:exterior"][
      "gml:LinearRing"
    ]["gml:posList"];
  let internal_pos_list =
    land_data["NSDI:F251"]["NSDI:SHAPE"]["gml:Polygon"]["gml:interior"];
  if (Array.isArray(internal_pos_list)) {
    internal_pos_list = internal_pos_list.map((e) => {
      return e["gml:LinearRing"]["gml:posList"];
    });
  } else if (internal_pos_list != undefined) {
    internal_pos_list = [internal_pos_list["gml:LinearRing"]["gml:posList"]];
  }

  return { pos_list, internal_pos_list };
};

export const _offsetMapPosition = (map, latlng, offset_x, offset_y) => {
  if (!map) {
    return;
  }
  const mapProjection = map.getProjection();
  const position = mapProjection
    .pointFromCoords(latlng)
    .toString()
    .replace(/[\(\)]/g, "")
    .split(", ");
  const new_position = new window.kakao.maps.Point(
    Number(position[0]) + offset_x,
    Number(position[1]) + offset_y
  );
  return mapProjection.coordsFromPoint(new_position);
};
