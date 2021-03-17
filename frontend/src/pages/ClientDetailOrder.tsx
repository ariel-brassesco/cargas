import React, { FC, useEffect, useCallback, useState } from "react";
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
import { LabelData } from "../components/OrderManager";
// Import Actions
import {
  fetchRows,
  fetchImages,
  fetchTemps,
  fetchWeights,
  fetchMeasures,
} from "../actions/clientActions";
// Import Getters
import {
  getRows,
  getTemps,
  getWeights,
  getMeasures,
} from "../reducers/clientReducer";
// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
import { ImageControl } from "../types/images";
import { Temperature } from "../types/temp";
import { Weight } from "../types/weight";
import { Measure } from "../types/measure";
// Import Routes
import { PROFILE_CLIENT } from "../routes";

interface RProps {
  title: string;
  order: Order;
  rows: Row[];
}

interface CProps {
  title: string;
  order: Order;
  data: (Temperature & Weight & Measure)[];
}

const RowsData: FC<RProps> = ({ title, order, rows }) => {
  const [show, setShow] = useState(false);
  const openDetail = useCallback(() => setShow(true), [setShow]);
  const closeDetail = useCallback(() => setShow(false), [setShow]);

  const columns: Column[] = [
    {
      key: "number",
      title: "Fila",
      align: Align.center,
      width: 50,
    },
    {
      key: "product.name",
      title: "Producto",
      align: Align.center,
      width: 300,
    },
    {
      key: "quantity",
      title: "Cantidad",
      align: Align.center,
      width: 50,
    },
  ];
  const rows_headers = [
    { label: "Fila", key: "number" },
    { label: "Producto", key: "name" },
    { label: "Cantidad", key: "quantity" },
  ];

  const maxRow = rows.reduce(
    (a: number, c: Row) => (a > c.number ? a : c.number),
    0
  );
  const numBox = rows.reduce((a: any, c: Row) => {
    const name = String(c.product.id);

    return a.hasOwnProperty(name)
      ? { ...a, [name]: a[name] + c.quantity }
      : { ...a, [name]: c.quantity };
  }, {});

  return (
    <div className="box my-3">
      <div className="is-flex is-flex-wrap-wrap">
        <p className="has-text-weight-bold is-size-5 mt-2">{title}</p>
        {!!rows.length ? (
          <DownloadCSV
            className="button is-info m-2"
            headers={rows_headers}
            data={rows
              .sort((a, b) =>
                a.number - b.number === 0 ? a.id - b.id : a.number - b.number
              )
              .map(({ number, quantity, product }) => ({
                number,
                quantity,
                name: product.name,
              }))}
            filename={`${order.order || order.id}_Rows.csv`}
            label="Descargar Filas"
          />
        ) : null}
      </div>
      <LabelData label="Número de Filas:" value={maxRow} />

      {order.products.map((p) => (
        <LabelData
          key={p.id}
          label={`N° Cajas de ${p.name}:`}
          value={numBox[p.id]}
        />
      ))}

      {!!rows.length ? (
        <Table
          columns={columns}
          data={rows}
          className="table is-narrow is-bordered is-hoverable"
        />
      ) : null}

      {show ? (
        <button className="button is-primary" onClick={closeDetail}>
          Ocultar
        </button>
      ) : (
        <button className="button is-primary" onClick={openDetail}>
          Ver Fotos
        </button>
      )}

      {show ? (
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
          {rows
            .sort((a, b) =>
              a.number - b.number === 0 ? a.id - b.id : a.number - b.number
            )
            .map((r: Row) =>
              !!r.image ? (
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
      ) : null}
    </div>
  );
};

const WeightData: FC<CProps> = ({ title, order, data }) => {
  const [show, setShow] = useState(false);
  const openDetail = useCallback(() => setShow(true), [setShow]);
  const closeDetail = useCallback(() => setShow(false), [setShow]);

  const weight_headers = [
    { label: "Paquete (kg)", key: "package" },
    { label: "Carton (kg)", key: "carton" },
    { label: "Paquete Primario (kg)", key: "primary_package" },
    { label: "Producto (kg)", key: "product" },
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
    <div className="box my-3">
      <div className="is-flex is-flex-wrap-wrap">
        <p className="has-text-weight-bold is-size-5 mt-2">{title}</p>
        {!!data.length ? (
          <DownloadCSV
            className="button is-info m-2"
            headers={weight_headers}
            data={data.map((w) => ({
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
      {!!data.length ? null : <p>No hay datos disponibles</p>}
      <div className="is-flex is-flex-direction-column is-align-items-flex-start mt-2">
        {!!data.length ? (
          <>
            <Table
              className="table is-narrow is-bordered is-hoverable"
              columns={weight_cols}
              data={data}
            />
            {show ? (
              <button className="button is-primary" onClick={closeDetail}>
                Ocultar
              </button>
            ) : (
              <button className="button is-primary" onClick={openDetail}>
                Ver Fotos
              </button>
            )}
            {show &&
              data.map((w) => (
                <div
                  key={`weigths-${w.id}`}
                  className="is-flex is-flex-wrap-wrap is-align-items-center"
                >
                  {w.images
                    .filter((i) => i.display)
                    .map((i: ImageControl) => (
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
                    ))}
                </div>
              ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

const TempData: FC<CProps> = ({ title, order, data }) => {
  const [show, setShow] = useState(false);
  const openDetail = useCallback(() => setShow(true), [setShow]);
  const closeDetail = useCallback(() => setShow(false), [setShow]);

  const temp_headers = [
    { label: "Fila", key: "row" },
    { label: "Temperatura (°C)", key: "temp" },
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

  return (
    <div className="box my-3">
      <div className="is-flex is-flex-wrap-wrap">
        <p className="has-text-weight-bold is-size-5 mt-2">{title}</p>
        {!!data.length ? (
          <DownloadCSV
            className="button is-info m-2"
            headers={temp_headers}
            data={data
              .sort((a, b) =>
                a.row - b.row === 0 ? a.id - b.id : a.row - b.row
              )
              .map((w) => ({
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
      {!!data.length ? null : <p>No hay datos disponibles</p>}
      <div className="is-flex is-flex-direction-column is-align-items-flex-start mt-2">
        {!!data.length ? (
          <>
            <Table
              className="table is-narrow is-bordered is-hoverable"
              columns={temp_cols}
              data={data}
            />
            {show ? (
              <button className="button is-primary" onClick={closeDetail}>
                Ocultar
              </button>
            ) : (
              <button className="button is-primary" onClick={openDetail}>
                Ver Fotos
              </button>
            )}

            {show &&
              data
                .sort((a, b) =>
                  a.row - b.row === 0 ? a.id - b.id : a.row - b.row
                )
                .map((t) => (
                  <div
                    key={`temps-${t.id}`}
                    className="is-flex is-flex-wrap-wrap is-align-items-center"
                  >
                    {t.images
                      .filter((i) => i.display)
                      .map((i: ImageControl) => (
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
                      ))}
                  </div>
                ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

const MeasureData: FC<CProps> = ({ title, data }) => {
  return (
    <div className="box my-3">
      <p className="title is-size-5">{title}</p>
      {!!data.length ? null : <p>No hay datos disponibles</p>}
      {data.map((m) => (
        <div key={`measure-${m.id}`} className="mb-4">
          {!!m.images.filter((i) => i.display).length ? (
            <LabelData label="Comentario:" value={m.comment} />
          ) : null}
          <div className="is-flex is-flex-wrap-wrap is-align-items-center">
            {m.images
              .filter((i) => i.display)
              .map((i: ImageControl) => (
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
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

type Props = {
  order: Order;
};

const ClientOrderDetail: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector(getRows);
  const temps = useSelector(getTemps);
  const weights = useSelector(getWeights);
  const measures = useSelector(getMeasures);

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchImages(order.id));
    dispatch(fetchTemps(order.id));
    dispatch(fetchWeights(order.id));
    dispatch(fetchMeasures(order.id));
  }, [order, dispatch]);

  const initial = !!order.initial
    ? pick(order.initial[0], ["empty", "matricula", "ventilation"])
    : {};
  const final = !!order.final
    ? pick(order.final[0], ["full", "close", "semi_close", "precinto"])
    : {};

  return (
    <div className="m-2">
      <div className="box">
        <div className="is-flex is-flex-wrap-wrap-reverse">
          {order.order ? (
            <p className="has-text-weight-bold is-size-4">
              Número de Carga: {order.order}
            </p>
          ) : null}
          <div className="is-flex-grow-1" />
          <DownloadImages
            label="Descargar Imágenes"
            order={order.id}
            filename={order.order || `Carga_${order.id}`}
          />
          <Link to={PROFILE_CLIENT} className="button is-warning mx-2">
            <FontAwesomeIcon icon={faUndo} />
            <span className="mx-1">Volver</span>
          </Link>
        </div>
      </div>
      <div className="box">
        <p className="has-text-weight-bold is-size-4">Fotos Contenedor</p>
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
        </div>
        <div className="is-flex is-flex-wrap-wrap is-align-items-center">
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
      </div>
      <RowsData title="Filas" rows={rows} order={order} />
      <WeightData title="Pesos Producto" order={order} data={weights} />
      <TempData title="Temperatura Producto" order={order} data={temps} />
      <MeasureData title="Fotos Producto" data={measures} order={order} />
    </div>
  );
};

export default ClientOrderDetail;
