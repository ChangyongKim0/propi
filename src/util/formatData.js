export const formatUnit = (unit, unit_type) => {
  switch (unit_type) {
    case "py":
      return unit
        .replace(/\[area\]/g, "평")
        .replace(/\[\/area\]/g, "/평")
        .replace(/\[parea\]/g, "전용평")
        .replace(/\[\/parea\]/g, "/전용평");
    case "sqm":
      return unit
        .replace(/\[area\]/g, "㎡")
        .replace(/\[\/area\]/g, "/㎡")
        .replace(/\[parea\]/g, "전용㎡")
        .replace(/\[\/parea\]/g, "/전용㎡");
    default:
      return unit;
  }
};

// type : string / number / number_detail / number_list / rate / rate_over / rate_list / foor_range / floor
export const formatData = (
  data_old,
  type,
  unit = "",
  unit_type = "none",
  err_text = "에러"
) => {
  let data = _adaptUnitType(data_old, unit, unit_type);
  if (data_old === "" || data_old === "-") {
    return data_old;
  }
  if (
    (type.includes("number") || type.includes("rate")) &&
    !type.includes("list")
  ) {
    if (!isFinite(data) || isNaN(data)) {
      return err_text;
    }
  }
  switch (type) {
    case "string":
      return data;
    case "number":
      return _formatThousandSeperator(
        _formatDecimalPoint(
          _formatTenThousandShrinker(parseFloat(data.toExponential(2))),
          2
        )
      );
    case "number_detail":
      return _formatThousandSeperator(_formatDecimalPoint(data, 0));
    case "number_detail_1":
      return _formatThousandSeperator(_formatDecimalPoint(data, 1));
    case "number_list":
      return data
        .map((e, idx) => formatData(e, "number", unit, unit_type))
        .join(" / ");
    case "rate":
      return _formatThousandSeperator(_formatDecimalPoint(data * 100));
    case "rate_over":
      return _formatThousandSeperator(_formatDecimalPoint(data * 100));
    case "rate_list":
      return data
        .map((e, idx) => formatData(e, "rate", unit, unit_type))
        .join(" / ");
    case "floor_range":
      return data
        .map((e) => {
          if (e <= 0) {
            return "B" + (1 - e).toString();
          } else {
            return e.toString() + "F";
          }
        })
        .join("-");
    case "floor":
      if (typeof data == typeof 1 || data == 0) {
        if (data < 1) {
          return "B" + (1 - data);
        }
      } else {
        return data;
      }
    default:
      return data;
  }
};

const _adaptUnitType = (data, unit, unit_type) => {
  if (Array.isArray(data)) {
    return data.map((e) => _adaptUnitType(e));
  }
  if (typeof data == typeof {}) {
    return "-";
  }
  switch (unit_type) {
    case "sqm":
      return data;
    case "py":
      if (unit.includes("[area]") || unit.includes("[parea]")) {
        return data * 0.3025;
      } else if (unit.includes("[/area]") || unit.includes("[/parea]")) {
        return data / 0.3025;
      } else {
        return data;
      }
    default:
      return data;
  }
};

const _formatThousandSeperator = (data) => {
  const seperated_number = data.toString().split(".");
  seperated_number[0] = seperated_number[0].replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  return seperated_number.join(".");
};

const _formatTenThousandShrinker = (number) => {
  const integer_part = parseInt(number).toString().replace(/-/g, "");
  switch (parseInt((integer_part.length - 1) / 4).toString()) {
    case "0":
      return number.toString();
    case "1":
      return (number / 10000).toString() + "만";
    case "2":
      return (number / 100000000).toString() + "억";
    case "3":
      return (number / 1000000000000).toString() + "조";
    case "4":
      return (number / 10000000000000000).toString() + "경";
    default:
      return number.toString();
  }
};

const _formatDecimalPoint = (data, position = 1) => {
  const num_data = data.toString().match(/[-0-9.]+/g)[0];
  const replacor = String(Number(num_data).toFixed(position));
  return data.toString().replace(/[-0-9.]+/g, replacor);
};
