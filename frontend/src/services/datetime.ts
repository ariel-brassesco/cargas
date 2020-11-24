import dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
//Extend dayjs to UTC Plugin
dayjs.extend(utc.default);

export function dateInUSFormat(date: string | undefined) {
  return dayjs(date).format("YYYY-MM-DD");
}

export function dateInARFormat(date: string | undefined) {
  return dayjs(date).format("DD-MM-YYYY");
}

export function timeFromUTCToLocal(
  date: string | undefined,
  time: string | undefined
) {
  if (!time) return dayjs().format("HH:MM");
  const day = dayjs.utc(date).format("YYYY-MM-DD");
  const utc_time = dayjs.utc(`${day} ${time ?? ""}`).format();
  return dayjs(utc_time).format("HH:MM");
}

export function timeFromLocalToUTC(
  date: string | undefined,
  time: string | undefined
) {
  if (!time) return dayjs.utc().format("HH:MM");
  const day = dayjs(date).format("YYYY-MM-DD");
  const local_time = dayjs(`${day} ${time ?? ""}`).format();
  return dayjs.utc(local_time).format("HH:MM");
}

export function dateToISOString(date: string) {
  return dayjs.utc(date).toISOString();
}
