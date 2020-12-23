import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { pick } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

// Impoer Components
import { Image } from "../components/Common";
import { ModalTrigger } from "../components/ModalTrigger";
import { ModalImage } from "../components/ModalImage";
import { Align, Table, Column } from "../components/Table";
import { DownloadImages } from "../components/DownloadImages";
import { DownloadCSV } from "../components/DownloadCSVData";
// Import Actions
import {
  fetchRows,
  fetchImages,
  fetchTemps,
  fetchWeights,
} from "../actions/clientActions";
// Import Getters
import {
  getRows,
  getImages,
  getTemps,
  getWeights,
} from "../reducers/clientReducer";
// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
import { ImageControl } from "../types/images";
// Import Routes
import { PROFILE_CLIENT } from "../routes";
// Import Utils
import {
  getImageDataFromInitial,
  getImageDataFromFinal,
  getImageDataFromRows,
  getImageDataFromControl,
} from "../services/utils";

type Props = {
  order: Order;
};
const ClientOrderDetail: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector(getRows);
  const images = useSelector(getImages);
  const temps = useSelector(getTemps);
  const weights = useSelector(getWeights);

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchImages(order.id));
    dispatch(fetchTemps(order.id));
    dispatch(fetchWeights(order.id));
  }, [order, dispatch]);

  const initial = !!order.initial
    ? pick(order.initial[0], ["empty", "matricula", "ventilation"])
    : {};
  const final = !!order.final
    ? pick(order.final[0], ["full", "close", "semi_close", "precinto"])
    : {};

  const imgDownload = () => [
    ...getImageDataFromInitial(order.initial[0]),
    ...getImageDataFromFinal(order.final[0]),
    ...getImageDataFromRows(rows),
    ...getImageDataFromControl(images),
  ];

  const temp_headers = [
    { label: "Fila", key: "row" },
    { label: "Temperatura (°C)", key: "temp" },
  ];
  const weight_headers = [
    { label: "Paquete (kg)", key: "package" },
    { label: "Carton (kg)", key: "carton" },
    { label: "Paquete Primario (kg)", key: "primary_package" },
    { label: "Producto (kg)", key: "product" },
  ];
  const temp_cols: Column[] = [
    {
      key: "row",
      title: "Fila",
      align: Align.center,
    },
    {
      key: "temp",
      title: "Temp. (°C)",
      align: Align.center,
    },
  ];
  const weight_cols: Column[] = [
    {
      key: "package",
      title: "Paquete (kg)",
      align: Align.center,
    },
    {
      key: "carton",
      title: "Cartón (kg)",
      align: Align.center,
    },
    {
      key: "product",
      title: "Producto (kg)",
      align: Align.center,
    },
    {
      key: "primary_package",
      title: "Paquete Primario (kg)",
      align: Align.center,
    },
  ];
  return (
    <div className="m-2">
      <div className="is-flex is-flex-wrap-wrap-reverse">
        {order.order ? (
          <p className="has-text-weight-bold is-size-4">
            Número de Carga: {order.order}
          </p>
        ) : null}
        <div className="is-flex-grow-1" />
        <DownloadImages
          label="Descargar Imágenes"
          folder={order.order || `Carga_${order.id}`}
          images={imgDownload()}
        />
        <Link to={PROFILE_CLIENT} className="button is-warning mx-2">
          <FontAwesomeIcon icon={faUndo} />
          <span className="mx-1">Volver</span>
        </Link>
      </div>
      <p className="has-text-weight-bold is-size-5">Fotos Contenedor</p>
      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {Object.entries(initial).map((i) =>
          i[1] ? (
            <ModalTrigger
              key={i[0]}
              button={
                <Image
                  className="image is-w-128 is-clickable m-2 m-2"
                  src={i[1]}
                  alt={i[0]}
                />
              }
              modal={
                <ModalImage>
                  <Image className="image is-w-90p" src={i[1]} alt={i[0]} />
                </ModalImage>
              }
            />
          ) : null
        )}
        {Object.entries(final).map((i) =>
          i[1] ? (
            <ModalTrigger
              key={i[0]}
              button={
                <Image
                  className="image is-w-128 is-clickable m-2"
                  src={i[1]}
                  alt={i[0]}
                />
              }
              modal={
                <ModalImage>
                  <Image className="image is-w-90p" src={i[1]} alt={i[0]} />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>

      {rows.length ? (
        <p className="has-text-weight-bold is-size-5">Fotos Filas</p>
      ) : null}
      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {rows.map((r: Row) =>
          r.image ? (
            <ModalTrigger
              key={r.id}
              button={
                <Image
                  className="image is-w-128 is-clickable m-2"
                  src={r.image}
                  alt={`Fila #${r.number}`}
                />
              }
              modal={
                <ModalImage>
                  <Image
                    className="image is-w-90p"
                    src={r.image}
                    alt={`Fila #${r.number}`}
                  />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>

      {images.length ? (
        <p className="has-text-weight-bold is-size-5">Fotos Producto</p>
      ) : null}

      <div className="is-flex is-flex-wrap-wrap is-align-items-center">
        {images.map((i: ImageControl) =>
          i.image ? (
            <ModalTrigger
              key={i.id}
              button={
                <Image
                  className="image is-w-128 is-clickable m-2"
                  src={i.image}
                  alt={i.control}
                />
              }
              modal={
                <ModalImage>
                  <Image
                    className="image is-w-90p"
                    src={i.image}
                    alt={i.control}
                  />
                </ModalImage>
              }
            />
          ) : null
        )}
      </div>
      {!!weights.length || !!temps.length ? (
        <>
          <div className="is-flex is-flex-wrap-wrap">
            <p className="has-text-weight-bold is-size-5 mt-2">
              Datos Producto
            </p>
            {temps.length ? (
              <DownloadCSV
                className="button is-info m-2"
                headers={temp_headers}
                data={temps.map(({ row, temp }) => ({ row, temp }))}
                filename={`${order.order || order.id}_Temperatura.csv`}
                label="Descargar Temperaturas"
              />
            ) : null}
            {weights.length ? (
              <DownloadCSV
                className="button is-info m-2"
                headers={weight_headers}
                data={weights.map((w) => ({
                  package: w.package,
                  carton: w.carton,
                  primary_package: w.primary_package,
                  product: w.product,
                }))}
                filename={`${order.order || order.id}_Pesos.csv`}
                label="Descargar Pesos"
              />
            ) : null}
          </div>
          <div className="is-flex is-justify-content-start is-flex-wrap-wrap mt-2">
            {temps.length ? (
              <Table
                className="table is-narrow is-bordered is-hoverable mr-4"
                columns={temp_cols}
                data={temps}
              />
            ) : null}
            {weights.length ? (
              <Table
                className="table is-narrow is-bordered is-hoverable"
                columns={weight_cols}
                data={weights}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ClientOrderDetail;
