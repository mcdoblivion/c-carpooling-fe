import {
  STANDARD_DATE_FORMAT_INVERSE,
  STANDARD_DATE_REGEX,
  STANDARD_DATE_TIME_FORMAT_VIEW,
  STANDARD_DATE_TIME_REGEX,
  STANDARD_DATE_TIME_REGEX_WITHOUT_TIMEZONE,
  STANDARD_TIME_FORMAT,
  STANDARD_TIME_REGEX,
} from "config/consts";
import moment, { Moment } from "moment";

export function formatDate(
  date: Moment,
  dateFormat: string = STANDARD_DATE_FORMAT_INVERSE
) {
  if (date) {
    if (typeof date === "object" && "format" in date) {
      return date.format(dateFormat);
    }
  }
  return moment(date).format(dateFormat);
}

export function formatTime(
  time: Moment,
  timeFormat: string = STANDARD_TIME_FORMAT
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(timeFormat);
  }
  return moment(time).format(timeFormat);
}

export function formatDateTime(
  time: Moment,
  dateTimeFormat: string = STANDARD_DATE_TIME_FORMAT_VIEW
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(dateTimeFormat);
  }
  return moment(time).format(dateTimeFormat);
}

export function isDateValue(date?: string) {
  return date?.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
}

export function isTimeValue(time?: string) {
  return time?.match(/[0-9]{2}:[0-9]{2}/);
}

export function isDateTimeValue(time?: string) {
  return (
    time?.match(STANDARD_DATE_TIME_REGEX_WITHOUT_TIMEZONE) ||
    time?.match(STANDARD_DATE_TIME_REGEX) ||
    time?.match(STANDARD_DATE_REGEX) ||
    time?.match(STANDARD_TIME_REGEX)
  );
}

export function timeAgo(time: string) {
  time = time.slice(0, -1);
  const pastTime = moment(time);
  const currentTime = moment();
  const seconds = moment.duration(currentTime.diff(pastTime)).asSeconds();

  let time_formats = [
    [60, "giây trước", 1], // 60
    [120, "1 phút trước", "1 phút tới"], // 60*2
    [3600, " phút trước", 60], // 60*60, 60
    [7200, "1 giờ trước", "1 giờ tới"], // 60*60*2
    [86400, "giờ trước", 3600], // 60*60*24, 60*60
    [172800, "ngày hôm qua", "ngày mai"], // 60*60*24*2
    [604800, "ngày trước", 86400], // 60*60*24*7, 60*60*24
    [1209600, "tuần trước", "tuần sau"], // 60*60*24*7*4*2
    [2419200, "tuần trước", "tuần sau"], // 60*60*24*7*4, 60*60*24*7
    [4838400, "tháng trước", "tháng sau"], // 60*60*24*7*4*2
    [29030400, "tháng trước", "tháng sau"], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "năm trước", "năm sau"], // 60*60*24*7*4*12*2
    [2903040000, "năm trước", "năm sau"], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "thế kỉ trước", "thế kỉ sau"], // 60*60*24*7*4*12*100*2
    [58060800000, "thế kỉ trước", "thế kỉ sau"], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  let token = "",
    list_choice = 1;

  if (seconds === 0) {
    return "Vừa xong";
  }
  if (seconds < 0) {
    return "Vừa xong";
  }
  let i = 0,
    format;
  // eslint-disable-next-line no-cond-assign
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return null;
}
