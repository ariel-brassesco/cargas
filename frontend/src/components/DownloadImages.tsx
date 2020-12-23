import React, { FC, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export interface ImageData {
  url: string;
  filename: string;
  folder?: string;
}

type Props = {
  images: ImageData[];
  label?: string;
  folder: string;
};

export const DownloadImages: FC<Props> = ({ images, label, folder }) => {
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    setDownloading(true);
    if (!images[0]) {
      setDownloading(false);
      return;
    }
    // Fetch the image and parse the response stream as a blob
    const imagesBlob = await Promise.all(
      images.map((image) =>
        fetch(image.url)
          .then((res) => res.blob())
          .catch((err) => console.error(err))
      )
    );

    if (!imagesBlob.filter(Boolean).length) {
      setDownloading(false);
      return;
    }
    const imagesFile = imagesBlob.map((blob, idx) =>
      !!blob ? new File([blob], images[idx].filename) : null
    );

    const zip = new JSZip();
    const zip_folder = zip.folder(folder);

    if (zip_folder) {
      /* Add the images to the folder */
      imagesFile.forEach((file, idx) => {
        if (!!file) {
          let filename = !!images[idx].folder
            ? `${images[idx].folder}/${images[idx].filename}`
            : images[idx].filename;
          zip_folder.file(filename, file);
        }
      });

      /* Generate a zip file asynchronously and trigger the download */
      await zip_folder
        .generateAsync({ type: "blob" })
        .then((content) => saveAs(content, folder));
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
