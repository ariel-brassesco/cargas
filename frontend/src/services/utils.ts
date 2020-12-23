import { InitOrder, FinalOrder } from "../types/order";
import { Row } from "../types/row";
import { ImageControl } from "../types/images";
import { ImageData } from "../components/DownloadImages";

export function getImageDataFromInitial(initial: InitOrder) {
  const keys = ["empty", "matricula", "ventilation"];
  const data: ImageData[] = [];
  keys.forEach((k) => {
    if (!!initial[k]) {
      data.push({
        url: initial[k],
        filename: `${k}.jpeg`,
        folder: "contenedor",
      });
    }
  });
  return data;
}

export function getImageDataFromFinal(final: FinalOrder) {
  const keys = ["full", "semi_close", "close", "precinto"];
  const data: ImageData[] = [];
  keys.forEach((k) => {
    if (!!final[k]) {
      data.push({
        url: final[k],
        filename: `${k}.jpeg`,
        folder: "contenedor",
      });
    }
  });
  return data;
}

export function getImageDataFromRows(rows: Row[]): ImageData[] {
  const data: ImageData[] = [];
  rows.forEach((row) => {
    if (!!row.image) {
      data.push({
        url: row.image,
        filename: `image_product_${row.product.id}.jpeg`,
        folder: `filas/${row.number}`,
      });
    }
  });
  return data;
}

export function getImageDataFromControl(controls: ImageControl[]) {
  const data: ImageData[] = [];
  controls.forEach((control) => {
    if (!!control.image) {
      data.push({
        url: control.image,
        filename: `image_${control.control}_${control.id}.jpeg`,
        folder: `producto/${control.control}/${control.number}`,
      });
    }
  });
  return data;
}
