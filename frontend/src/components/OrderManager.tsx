import React, { FC, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUndo,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// Import Components
import { ImagePicker } from "../components/ImagePicker";
import {
  EditRowModal,
  EditTemperatureModal,
  EditWeightModal,
  EditMeasureModal,
  EditLabel,
  EditLot,
} from "../components/modals/EditComponent";
import { Table, Column, Align } from "../components/Table";
import { ModalTrigger } from "../components/ModalTrigger";
import { Confirm } from "../components/Confirm";
// Import Actions
import {
  fetchRows,
  fetchTemps,
  fetchWeights,
  fetchMeasures,
  newRow,
  updateRow,
  deleteRow,
  updateOrder,
  createTemp,
  updateTemp,
  deleteTemp,
  createWeight,
  updateWeight,
  deleteWeight,
  createMeasure,
  updateMeasure,
  deleteMeasure,
  changeImageControlDisplay,
  changeRowImageDisplay,
} from "../actions/dashboardActions";
// Import Getters
import {
  getOrder,
  getRows,
  getTemps,
  getWeights,
  getMeasures,
} from "../reducers/dashboardReducer";
// Import Types
import { Order, InitOrder, FinalOrder, statusMap } from "../types/order";
import { ImageControl } from "../types/images";
import { Row } from "../types/row";
import { Temperature } from "../types/temp";
import { Weight } from "../types/weight";
import { Measure } from "../types/measure";
// Import Services
import { dateInARFormat, timeFromUTCToLocal } from "../services/datetime";
// Import Routes
import { DASHBOARD_ORDERS } from "../routes";

interface GDProps {
  title: string;
  order: Order;
  handleEdit: (name: string) => (data: number | string) => void;
}

interface IDProps {
  title: string;
  initial?: InitOrder;
  container?: string;
  handleEdit: (name: string) => (data: number | string) => void;
}

interface CDProps {
  title: string;
  order: Order;
  final?: FinalOrder;
  handleEdit: (name: string) => (data: number | string) => void;
}

interface RProps {
  title: string;
  order: Order;
  rows: Row[];
  updateBoxes: (data: number) => void;
  newRow: (data: FormData) => void;
  updateRow: (id: number) => any;
  deleteRow: (row: Row) => any;
  picker: (id: number, pick: boolean) => void;
}

interface CProps {
  title: string;
  order: Order;
  data: (Temperature & Weight & Measure)[];
  newData: (data: FormData) => void;
  updateData: (id: number) => any;
  deleteData: (data: Temperature & Weight & Measure) => any;
  picker: (id: number, pick: boolean) => void;
}
interface LDProps {
  label: string;
  value: string | number;
  className?: string;
  edit?: (data: any) => void;
}

interface LotProps {
  label: string;
  value: string;
  className?: string;
  edit?: (data: any) => void;
}

type Props = {
  order_id: number;
};

export const LabelData: FC<LDProps> = ({ label, value, edit, className }) =>
  typeof edit === "function" ? (
    <ModalTrigger
      button={
        <p className={className}>
          <span className="has-text-weight-bold mx-5">{label}</span>
          <span className="has-text-link is-clickable">{value}</span>
        </p>
      }
      modal={<EditLabel label={label} value={value} onOk={edit} />}
    />
  ) : (
    <p className={className}>
      <span className="has-text-weight-bold mx-5">{label}</span>
      <span>{value}</span>
    </p>
  );

export const LotData: FC<LotProps> = ({ label, value, edit, className }) =>
  typeof edit === "function" ? (
    <div className={className}>
      <span className="has-text-weight-bold mx-5">{label}</span>

      {value.split(",").map((v, idx) => (
        <ModalTrigger
          key={idx}
          button={
            <span className="tag is-light is-clickable mx-1">{v || "-"}</span>
          }
          modal={<EditLot label={label} value={value} onOk={edit} />}
        />
      ))}
    </div>
  ) : (
    <div className={className}>
      <span className="has-text-weight-bold mx-5">{label}</span>
      {value.split(",").map((v, idx) => (
        <span key={idx} className="tag is-light mx-1">
          {v || "-"}
        </span>
      ))}
    </div>
  );

const GeneralData: FC<GDProps> = ({ title, order, handleEdit }) => (
  <div>
    <p className="title is-size-3">{title}</p>
    <div className="is-flex">
      <div className="is-flex is-flex-direction-column is-align-content-flex-start">
        <LabelData label="Cliente:" value={order.client.company} />
        <LabelData label="Inspector:" value={order.inspector.user.username} />
        <LabelData
          label="Fecha/Hora:"
          value={`
              ${dateInARFormat(order.date)} - 
              ${timeFromUTCToLocal(order.date, order.time_start)}`}
        />
        <LabelData label="Estado:" value={statusMap[order.status]} />
      </div>
      <div className="is-flex is-flex-direction-column is-align-content-flex-start">
        <LabelData
          label="Origen:"
          value={order.origin}
          edit={handleEdit("origin")}
        />
        <LabelData
          label="Descarga:"
          value={order.discharge}
          edit={handleEdit("discharge")}
        />
        <LabelData
          label="Booking:"
          value={order.booking}
          edit={handleEdit("booking")}
        />
        <LabelData
          label="Vessel Name:"
          value={order.vessel_name}
          edit={handleEdit("vessel_name")}
        />
        <LabelData
          label="Planta:"
          value={order.plant ?? ""}
          edit={handleEdit("plant")}
        />
      </div>
    </div>
  </div>
);

const InitialData: FC<IDProps> = ({ title, initial, container, handleEdit }) =>
  !initial ? null : (
    <>
      <p className="title is-size-3">{title}</p>
      <LabelData
        label="Matrícula:"
        value={container ?? ""}
        edit={handleEdit("container")}
      />
      <div className="is-flex is-flex-wrap-wrap mt-2 is-justify-content-flex-start">
        {initial.empty ? (
          <div className="is-flex is-flex-direction-column is-align-items-center mx-2">
            <ImagePicker
              src={initial.empty}
              alt="Contenedor Vacío"
              selected={true}
            />
            <p className="has-text-weight-bold">Contenedor Vacío</p>
          </div>
        ) : null}
        {initial.matricula ? (
          <div className="is-flex is-flex-direction-column is-align-items-center mx-2">
            <ImagePicker
              src={initial.matricula}
              alt="Matrícula del Contenedor"
              selected={true}
            />
            <p className="has-text-weight-bold">Matrícula Contenedor</p>
          </div>
        ) : null}
        {initial.ventilation ? (
          <div className="is-flex is-flex-direction-column is-align-items-center mx-2">
            <ImagePicker
              src={initial.ventilation}
              alt="Ventilación del Contenedor"
              selected={true}
            />
            <p className="has-text-weight-bold">Ventilación del Contenedor</p>
          </div>
        ) : null}
      </div>
    </>
  );

const CloseData: FC<CDProps> = ({ title, final, order, handleEdit }) =>
  !final ? null : (
    <>
      <p className="title is-size-3">{title}</p>
      <LabelData
        label="Precinto AFIP:"
        value={order.seal ?? "-"}
        edit={handleEdit("seal")}
      />
      <LotData
        className="is-flex"
        label="Lotes:"
        value={order.lot ?? ""}
        edit={handleEdit("lot")}
      />
      <LabelData
        label="Peso Bruto (kg):"
        value={order.gross_weight ?? 0}
        edit={handleEdit("gross_weight")}
      />
      <LabelData
        label="Peso Neto (kg):"
        value={order.net_weight ?? 0}
        edit={handleEdit("net_weight")}
      />
      <div className="is-flex is-flex-wrap-wrap">
        {final.full && (
          <div className="has-text-centered mx-2">
            <ImagePicker
              src={final.full}
              alt="Contenedor LLeno"
              selected={true}
              className="mx-3"
            />
            <p className="has-text-weight-bold">Contenedor Lleno</p>
          </div>
        )}
        {final.semi_close && (
          <div className="has-text-centered mx-2">
            <ImagePicker
              src={final.semi_close}
              alt="Contenedor Semi Cerrado"
              selected={true}
              className="mx-3"
            />
            <p className="has-text-weight-bold">Contenedor Semi Cerrado</p>
          </div>
        )}
        {final.close && (
          <div className="has-text-centered mx-2">
            <ImagePicker
              src={final.close}
              alt="Contenedor Cerrado"
              selected={true}
              className="mx-3"
            />
            <p className="has-text-weight-bold">Contenedor Cerrado</p>
          </div>
        )}
        {final.precinto && (
          <div className="has-text-centered mx-2">
            <ImagePicker
              src={final.precinto}
              alt="Precinto AFIP"
              selected={true}
              className="mx-3"
            />
            <p className="has-text-weight-bold">Precinto AFIP</p>
          </div>
        )}
      </div>
    </>
  );

const RowsData: FC<RProps> = ({
  title,
  order,
  rows,
  updateBoxes,
  newRow,
  updateRow,
  deleteRow,
  picker,
}) => {
  const [show, setShow] = useState(false);
  const openDetail = useCallback(() => setShow(true), [setShow]);
  const closeDetail = useCallback(() => setShow(false), [setShow]);

  const columns: Column[] = [
    {
      key: "number",
      title: "#",
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
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 150,
      render: (row: Row) => (
        <div>
          <ModalTrigger
            button={
              <button
                className="button is-info is-small mr-2 has-tooltip-arrow"
                data-tooltip="Editar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </button>
            }
            modal={
              <EditRowModal row={row} order={order} onOk={updateRow(row.id)} />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar la Fila ${row.number}?`}
            okLabel="Eliminar"
            onClick={deleteRow(row)}
          >
            <button
              className="button is-danger is-small has-tooltip-arrow"
              data-tooltip="Eliminar"
            >
              <span className="icon">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </Confirm>
        </div>
      ),
    },
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

  return !rows.length ? null : (
    <>
      <p className="title is-size-3">{title}</p>
      <LabelData label="Número de Filas:" value={maxRow} />
      <LabelData
        label="Cajas Totales:"
        value={order.boxes ?? 0}
        edit={updateBoxes}
      />

      {order.products.map((p) => (
        <LabelData
          key={p.id}
          label={`N° Cajas de ${p.name}:`}
          value={numBox[p.id]}
        />
      ))}
      {show ? (
        <button className="button is-primary" onClick={closeDetail}>
          Ocultar
        </button>
      ) : (
        <button className="button is-primary" onClick={openDetail}>
          Ver Detalle
        </button>
      )}

      {show ? (
        <>
          <ModalTrigger
            button={
              <button className="button is-info mx-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Agregar Fila</span>
              </button>
            }
            modal={<EditRowModal order={order} onOk={newRow} />}
          />
          <Table columns={columns} data={rows} />{" "}
        </>
      ) : null}
      <div className="is-flex is-flex-wrap-wrap mt-2">
        {rows &&
          rows.map(
            (r: Row, idx: number) =>
              r.image && (
                <div key={idx} className="has-text-centered mx-2">
                  <ImagePicker
                    key={r.id}
                    src={r.image}
                    alt={`Imagen Fila ${r.number}`}
                    selected={r.display}
                    onSelect={() => picker(r.id, !r.display)}
                  />
                  <p className="has-text-weight-bold">{`Fila ${r.number}`}</p>
                </div>
              )
          )}
      </div>
    </>
  );
};

const TempData: FC<CProps> = ({
  title,
  order,
  data,
  newData,
  updateData,
  deleteData,
  picker,
}) => {
  const [show, setShow] = useState(false);
  const openDetail = useCallback(() => setShow(true), [setShow]);
  const closeDetail = useCallback(() => setShow(false), [setShow]);

  const columns: Column[] = [
    {
      key: "row",
      title: "Fila",
      align: Align.center,
      width: 50,
    },
    {
      key: "temp",
      title: "Temperatura",
      align: Align.center,
      width: 50,
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 150,
      render: (t) => (
        <div>
          <ModalTrigger
            button={
              <button
                className="button is-info is-small mr-2 has-tooltip-arrow"
                data-tooltip="Editar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
              </button>
            }
            modal={
              <EditTemperatureModal
                data={t}
                order={order}
                onOk={updateData(t.id)}
              />
            }
          />

          <Confirm
            title={`Está seguro que desea eliminar el registro de Temperatura?`}
            okLabel="Eliminar"
            onClick={deleteData(t)}
          >
            <button
              className="button is-danger is-small has-tooltip-arrow"
              data-tooltip="Eliminar"
            >
              <span className="icon">
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </button>
          </Confirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <p className="title is-size-5">{title}</p>

      {show ? (
        <button className="button is-primary" onClick={closeDetail}>
          Ocultar
        </button>
      ) : (
        <button className="button is-primary" onClick={openDetail}>
          Ver Detalle
        </button>
      )}

      {show ? (
        <>
          <ModalTrigger
            button={
              <button className="button is-info mx-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Agregar Temperatura</span>
              </button>
            }
            modal={<EditTemperatureModal order={order} onOk={newData} />}
          />
          <Table
            columns={columns}
            data={data}
            className="table is-narrow is-bordered is-hoverable mt-2"
          />
        </>
      ) : null}

      {data.map((t) =>
        !t.images.length ? (
          <div key={`temp-${t.id}`} className="mb-4">
            <LabelData label="Fila:" value={t.row} />
            <div className="is-flex is-flex-wrap-wrap">
              {t.images.map((i: ImageControl) => (
                <div
                  key={i.id}
                  className="is-flex is-flex-direction-column is-align-items-center mx-2"
                >
                  <ImagePicker
                    src={i.image}
                    alt={title}
                    selected={i.display}
                    onSelect={() => picker(i.id, !i.display)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
    </>
  );
};

const WeightData: FC<CProps> = ({
  title,
  order,
  data,
  newData,
  updateData,
  deleteData,
  picker,
}) => {
  return (
    <>
      <p className="title is-size-5">{title}</p>
      <ModalTrigger
        button={
          <button className="button is-info mx-6">
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Agregar Peso</span>
          </button>
        }
        modal={<EditWeightModal order={order} onOk={newData} />}
      />

      {data.map((w) => (
        <div key={`weight-${w.id}`} className="mb-4">
          <div>
            <ModalTrigger
              button={
                <button
                  className="button is-info is-small mr-2 has-tooltip-arrow"
                  data-tooltip="Editar"
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </button>
              }
              modal={
                <EditWeightModal
                  data={w}
                  order={order}
                  onOk={updateData(w.id)}
                />
              }
            />

            <Confirm
              title={`Está seguro que desea eliminar el registro de Peso?`}
              okLabel="Eliminar"
              onClick={deleteData(w)}
            >
              <button
                className="button is-danger is-small has-tooltip-arrow"
                data-tooltip="Eliminar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </button>
            </Confirm>
          </div>

          <LabelData label="Peso Package(kg):" value={w.package} />
          <LabelData label="Peso Carton(kg):" value={w.carton} />
          <LabelData
            label="Peso Primary Package(kg):"
            value={w.primary_package}
          />
          <LabelData label="Peso Producto(kg):" value={w.product} />
          <div className="is-flex is-flex-wrap-wrap">
            {w.images.map((i: ImageControl) => (
              <div
                key={i.id}
                className="is-flex is-flex-direction-column is-align-items-center mx-2"
              >
                <ImagePicker
                  src={i.image}
                  alt={title}
                  selected={i.display}
                  onSelect={() => picker(i.id, !i.display)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const MeasureData: FC<CProps> = ({
  title,
  order,
  data,
  newData,
  updateData,
  deleteData,
  picker,
}) => {
  return (
    <>
      <p className="title is-size-5">{title}</p>
      <ModalTrigger
        button={
          <button className="button is-info mx-6">
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Agregar Medición</span>
          </button>
        }
        modal={<EditMeasureModal order={order} onOk={newData} />}
      />

      {data.map((m) => (
        <div key={`measure-${m.id}`} className="mb-4">
          <div>
            <ModalTrigger
              button={
                <button
                  className="button is-info is-small mr-2 has-tooltip-arrow"
                  data-tooltip="Editar"
                >
                  <span className="icon">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                </button>
              }
              modal={
                <EditMeasureModal
                  data={m}
                  order={order}
                  onOk={updateData(m.id)}
                />
              }
            />

            <Confirm
              title={`Está seguro que desea eliminar el registro Organoléptico?`}
              okLabel="Eliminar"
              onClick={deleteData(m)}
            >
              <button
                className="button is-danger is-small has-tooltip-arrow"
                data-tooltip="Eliminar"
              >
                <span className="icon">
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </button>
            </Confirm>
          </div>

          <LabelData label="Comentario:" value={m.comment} />
          <div className="is-flex is-flex-wrap-wrap">
            {m.images.map((i: ImageControl) => (
              <div
                key={i.id}
                className="is-flex is-flex-direction-column is-align-items-center mx-2"
              >
                <ImagePicker
                  src={i.image}
                  alt={title}
                  selected={i.display}
                  onSelect={() => picker(i.id, !i.display)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const OrderManager: React.FC<Props> = ({ order_id }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector((state: any) => getRows(state));
  const order = useSelector((state: any) => getOrder(order_id)(state));
  const temps = useSelector((state: any) => getTemps(state));
  const weights = useSelector((state: any) => getWeights(state));
  const measures = useSelector((state: any) => getMeasures(state));

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchTemps(order.id));
    dispatch(fetchWeights(order.id));
    dispatch(fetchMeasures(order.id));
  }, [dispatch, order]);

  const handleSelectImageControl = (id: number, display: boolean) => {
    dispatch(changeImageControlDisplay(id, display));
  };

  // Handle Temp Actions
  const handleNewTemp = (data: FormData) => dispatch(createTemp(data));
  const handleUpdateTemp = (id: number) => (data: FormData) =>
    dispatch(updateTemp(id, data));
  const handleDeleteTemp = (t: Temperature) => () => dispatch(deleteTemp(t.id));

  // Handle Weights Actions
  const handleNewWeight = (data: FormData) => dispatch(createWeight(data));
  const handleUpdateWeight = (id: number) => (data: FormData) =>
    dispatch(updateWeight(id, data));
  const handleDeleteWeight = (t: Temperature) => () =>
    dispatch(deleteWeight(t.id));

  // Handle Weights Actions
  const handleNewMeasure = (data: FormData) => dispatch(createMeasure(data));
  const handleUpdateMeasure = (id: number) => (data: FormData) =>
    dispatch(updateMeasure(id, data));
  const handleDeleteMeasure = (t: Temperature) => () =>
    dispatch(deleteMeasure(t.id));

  // Handle Row Actions
  const handleNewRow = (data: FormData) => dispatch(newRow(data));
  const handleUpdateRow = (id: number) => (data: FormData) =>
    dispatch(updateRow(id, data));
  const handleDeleteRow = (row: Row) => () => dispatch(deleteRow(row.id));
  const handleSelectRowImage = (id: number, display: boolean) => {
    dispatch(changeRowImageDisplay(id, display));
  };

  const handleEditOrder = (name: string) => (data: string | number) =>
    dispatch(updateOrder(order.id, { [name]: data }));

  return (
    <div>
      <Link to={DASHBOARD_ORDERS} className="button is-danger">
        <FontAwesomeIcon icon={faUndo} />
        <span className="ml-1">Volver</span>
      </Link>

      <GeneralData
        title="Datos Generales"
        order={order}
        handleEdit={handleEditOrder}
      />

      <InitialData
        title="Contenedor Inicial"
        initial={order.initial[0]}
        container={order.container}
        handleEdit={handleEditOrder}
      />

      <RowsData
        title="Filas"
        order={order}
        rows={rows}
        updateBoxes={handleEditOrder("boxes")}
        newRow={handleNewRow}
        updateRow={handleUpdateRow}
        deleteRow={handleDeleteRow}
        picker={handleSelectRowImage}
      />

      <TempData
        title="Temperatura"
        order={order}
        data={temps}
        newData={handleNewTemp}
        updateData={handleUpdateTemp}
        deleteData={handleDeleteTemp}
        picker={handleSelectImageControl}
      />

      <WeightData
        title="Pesos"
        order={order}
        data={weights}
        newData={handleNewWeight}
        updateData={handleUpdateWeight}
        deleteData={handleDeleteWeight}
        picker={handleSelectImageControl}
      />

      <MeasureData
        title="Organolépticos"
        order={order}
        data={measures}
        newData={handleNewMeasure}
        updateData={handleUpdateMeasure}
        deleteData={handleDeleteMeasure}
        picker={handleSelectImageControl}
      />

      <CloseData
        title="Contenedor Cierre"
        final={order.final[0]}
        order={order}
        handleEdit={handleEditOrder}
      />
    </div>
  );
};

export default OrderManager;
