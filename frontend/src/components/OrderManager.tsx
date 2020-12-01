import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  // faUndo,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// Import Components
import { ImagePicker } from "../components/ImagePicker";
import { EditRowModal } from "../components/modals/EditComponent";
import { Table, Column, Align } from "../components/Table";
import { ModalTrigger } from "../components/ModalTrigger";
import { Confirm } from "../components/Confirm";
// Import Actions
import {
  fetchRows,
  //   fetchTemps,
  //   fetchWeights,
  fetchImagesControl,
  newRow,
  updateRow,
  deleteRow,
  changeImageControlDisplay,
  changeRowImageDisplay,
} from "../actions/dashboardActions";
// Import Getters
import {
  getRows,
  //   getTemps,
  //   getWeights,
  getImages,
} from "../reducers/dashboardReducer";
// Import Types
import { Order, InitOrder, FinalOrder } from "../types/order";
import { ImageControl, controlMap } from "../types/images";
import { Row } from "../types/row";

interface GDProps {
  title: string;
}

interface IDProps {
  title: string;
  initial?: InitOrder;
}

interface CDProps {
  title: string;
  final?: FinalOrder;
}

interface RProps {
  title: string;
  order: Order;
  rows: Row[];
  newRow: (data: FormData) => void;
  updateRow: (id: number) => any;
  deleteRow: (row: Row) => any;
  picker: (id: number, pick: boolean) => void;
}

interface CProps {
  title: string;
  control: string;
  images: ImageControl[];
  picker: (id: number, pick: boolean) => void;
}

type Props = {
  order: Order;
};

const GeneralData: FC<GDProps & Props> = ({ title, order }) => {
  return (
    <div>
      <p className="title is-size-3">{title}</p>
      <p>Cliente: {order.client.company}</p>
      <p>Inspector: {order.inspector.user.username}</p>
      <p>Booking: {order.booking}</p>
      <p>Estado: {order.status}</p>
    </div>
  );
};

const InitialData: FC<IDProps> = ({ title, initial }) =>
  !initial ? null : (
    <>
      <p className="title is-size-3">{title}</p>
      <div className="is-flex is-flex-wrap-wrap">
        {initial.empty ? (
          <div>
            <p>Contenedor Vacío</p>
            <ImagePicker
              src={initial.empty}
              alt="Contenedor Vacío"
              selected={true}
              className="mx-3"
            />
          </div>
        ) : null}
        {initial.matricula ? (
          <div>
            <p>Matrícula Contenedor</p>
            <ImagePicker
              src={initial.matricula}
              alt="Matrícula del Contenedor"
              selected={true}
              className="mx-3"
            />
          </div>
        ) : null}
        {initial.ventilation ? (
          <div>
            <p>Ventilación del Contenedor</p>
            <ImagePicker
              src={initial.ventilation}
              alt="Ventilación del Contenedor"
              selected={true}
              className="mx-3"
            />
          </div>
        ) : null}
      </div>
    </>
  );

const CloseData: FC<CDProps> = ({ title, final }) =>
  !final ? null : (
    <>
      <p className="title is-size-3">{title}</p>
      <div className="is-flex is-flex-wrap-wrap">
        {final.full && (
          <div>
            <p>Contenedor Lleno</p>
            <ImagePicker
              src={final.full}
              alt="Contenedor LLeno"
              selected={true}
              className="mx-3"
            />
          </div>
        )}
        {final.semi_close && (
          <div>
            <p>Contenedor Semi Cerrado</p>
            <ImagePicker
              src={final.semi_close}
              alt="Contenedor Semi Cerrado"
              selected={true}
              className="mx-3"
            />
          </div>
        )}
        {final.close && (
          <div>
            <p>Contenedor Cerrado</p>
            <ImagePicker
              src={final.close}
              alt="Contenedor Cerrado"
              selected={true}
              className="mx-3"
            />
          </div>
        )}
        {final.precinto && (
          <div>
            <p>Precinto AFIP</p>
            <ImagePicker
              src={final.precinto}
              alt="Precinto AFIP"
              selected={true}
              className="mx-3"
            />
          </div>
        )}
      </div>
    </>
  );

const RowsData: FC<RProps> = ({
  title,
  order,
  rows,
  newRow,
  updateRow,
  deleteRow,
  picker,
}) => {
  const [show, setShow] = useState(false);

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

      <p>
        <span>Número de Filas:</span>
        <span>{maxRow}</span>
      </p>
      <p>
        <span>Cajas Totales:</span>
        <span>{order.boxes}</span>
      </p>

      {order.products.map((p) => (
        <p key={p.id}>
          <span>{`N° Cajas de ${p.name}:`}</span>
          <span>{numBox[p.id]}</span>
        </p>
      ))}
      {show ? (
        <button className="button is-light" onClick={() => setShow(false)}>
          Ocultar
        </button>
      ) : (
        <button className="button is-light" onClick={() => setShow(true)}>
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
      <div className="is-flex is-flex-wrap-wrap">
        {rows &&
          rows.map(
            (r: Row, idx: number) =>
              r.image && (
                <div key={idx} className="m-3">
                  <p>{`Fila ${r.number}`}</p>
                  <ImagePicker
                    key={r.id}
                    src={r.image}
                    alt={`Imagen Fila ${r.number}`}
                    selected={r.display}
                    onSelect={() => picker(r.id, !r.display)}
                  />
                </div>
              )
          )}
      </div>
    </>
  );
};

const ControlData: FC<CProps> = ({ title, control, images, picker }) =>
  !images.length ? null : (
    <>
      <p className="title is-size-4">{title}</p>
      <div className="is-flex is-flex-wrap-wrap">
        {images.map(
          (i: ImageControl) =>
            i.control === control && (
              <ImagePicker
                key={i.id}
                src={i.image}
                alt={title}
                selected={i.display}
                className="m-3"
                onSelect={() => picker(i.id, !i.display)}
              />
            )
        )}
      </div>
    </>
  );

const OrderManager: React.FC<Props> = ({ order }) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector((state: any) => getRows(state));
  const images = useSelector((state: any) => getImages(state));

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchImagesControl(order.id));
  }, [dispatch, order]);

  const handleSelectImageControl = (id: number, display: boolean) => {
    dispatch(changeImageControlDisplay(id, display));
  };

  const handleSelectRowImage = (id: number, display: boolean) => {
    dispatch(changeRowImageDisplay(id, display));
  };

  const handleNewRow = (data: FormData) => dispatch(newRow(data));
  const handleUpdateRow = (id: number) => (data: FormData) =>
    dispatch(updateRow(id, data));
  const handleDeleteRow = (row: Row) => () => dispatch(deleteRow(row.id));

  return (
    <div>
      <GeneralData title="Datos Generales" order={order} />

      <InitialData title="Contenedor Inicial" initial={order.initial[0]} />

      <RowsData
        title="Filas"
        order={order}
        rows={rows}
        newRow={handleNewRow}
        updateRow={handleUpdateRow}
        deleteRow={handleDeleteRow}
        picker={handleSelectRowImage}
      />

      {Object.entries(controlMap).map((v) => (
        <ControlData
          key={v[0]}
          title={v[1]}
          control={v[0]}
          images={images}
          picker={handleSelectImageControl}
        />
      ))}

      <CloseData title="Contenedor Cierre" final={order.final[0]} />
    </div>
  );
};

export default OrderManager;
