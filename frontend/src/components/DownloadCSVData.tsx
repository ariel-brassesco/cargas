import React, { FC } from "react";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export interface HeaderCSV {
  label: string;
  key: string;
}

type Props = {
  headers?: HeaderCSV[];
  data: Record<string, any>[];
  separator?: string;
  filename: string;
  target?: string;
  label?: string;
  className?: string;
};

export const DownloadCSV: FC<Props> = ({
  headers,
  data,
  separator = ";",
  filename,
  target = "_blank",
  label = "Descargar",
  className = "ml-2 button is-info",
}) => {
  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={filename}
      separator={separator}
      className={className}
      target={target}
    >
      <FontAwesomeIcon icon={faDownload} />
      <span className="ml-2">{label}</span>
    </CSVLink>
  );
};
