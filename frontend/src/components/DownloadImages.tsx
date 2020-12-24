import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { http, apiRoutes } from "../services/http";

export interface ImageData {
  url: string;
  filename: string;
  folder?: string;
}

type Props = {
  filename: string;
  order: string | number;
  label?: string;
};

export const DownloadImages: FC<Props> = ({ filename, order, label }) => {
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    setDownloading(true);
    try {
      const file = await http.get(
        `${apiRoutes.download_images}?order=${order}`,
        { responseType: "arraybuffer" }
      );
      toast.success("Descarga Exitosa!!");
      const name =
        filename.split(".").pop() !== "zip" ? `${filename}.zip` : filename;

      saveAs(new File([file], filename), name);
    } catch (error) {
      toast.error("Algo salió mal. Inténtalo de nuevo.");
    }

    setDownloading(false);
  };

  return (
    <button
      className={`button is-info ${downloading ? "is-loading" : ""}`}
      onClick={download}
    >
      <FontAwesomeIcon icon={faDownload} />
      <span className="ml-2">{!!label ? label : "Descargar"}</span>
    </button>
  );
};
