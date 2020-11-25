import { Component, FC, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// Import Components
import { Image } from "./Common";
import { ModalTrigger } from "./ModalTrigger";
import { EditOrderInitModal } from "./modals/EditComponent";
// Import Icons
import { CheckCircleIcon, TimesCircleIcon } from "./Icons";
// Import Getters
import { getRows } from "../reducers/inspectorReducer";
// Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
import {
  updateOrderInspector,
  updateInitOrderInspector,
  updateFinalOrderInspector,
} from "../actions/inspectorActions";
// Import Routes
import { INSPECTOR_CHECK_ROWS } from "../routes";

interface CheckerProps {
  condition: boolean;
  value: string | number;
  labelOk: string;
  labelWrong: string;
  type: string;
  name: string;
  onChange?: (data: any) => void;
}

interface CheckerLinkProps {
  condition: boolean;
  value: string | number;
  labelOk: string;
  labelWrong: string;
  goUrl: string;
}

interface ContainerProps {
  order: Order;
  onOk: (param: boolean) => void;
}

interface CheckListProps {
  order: Order;
  rows: Row[];
  backUrl: string;
  onOk?: () => void;
}

interface CheckListState {
  containerCheck: boolean;
  rowsCheck: boolean;
  closeCheck: boolean;
  check: boolean;
}

const CheckerModal: FC<CheckerProps> = ({
  condition,
  value,
  labelOk,
  labelWrong,
  type = "text",
  name,
  onChange,
}) =>
  condition ? (
    <>
      <div>
        <CheckCircleIcon />
        <span>{labelOk}</span>
      </div>
      {type === "file" ? (
        <Image className="image is-64x64" src={value} />
      ) : (
        <span>{value}</span>
      )}
    </>
  ) : (
    <>
      <div>
        <TimesCircleIcon />
        <span>{labelOk}</span>
        {onChange && (
          <ModalTrigger
            button={
              <span className="is-size-7 is-block has-text-danger is-clickable">
                {labelWrong}
              </span>
            }
            modal={
              <EditOrderInitModal
                label={labelOk}
                value={value}
                name={name}
                type={type}
                onOk={onChange}
              />
            }
          />
        )}
      </div>
      <span>{value}</span>
    </>
  );

const CheckerLink: FC<CheckerLinkProps> = ({
  condition,
  value,
  labelOk,
  labelWrong,
  goUrl,
}) =>
  condition ? (
    <>
      <div>
        <CheckCircleIcon />
        <span>{labelOk}</span>
      </div>
      <span>{value}</span>
    </>
  ) : (
    <>
      <div>
        <TimesCircleIcon />
        <span>{labelOk}</span>
        <Link to={goUrl} className="is-block is-size-7 has-text-danger">
          {labelWrong}
        </Link>
      </div>
      <span>{value}</span>
    </>
  );

const ContainerResume: FC<ContainerProps> = ({ order, onOk }) => {
  const { container } = order;
  const { id, empty, matricula, ventilation } = order.initial[0];
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const check = [container, empty, matricula].every((v) => Boolean(v));
    if (check !== valid) {
      setValid(check);
      onOk(check);
    }
  }, [container, empty, matricula, onOk, valid, setValid]);

  const handleUpdateMat = (data: any) => {
    dispatch(updateOrderInspector(order.id, data));
  };

  const handleUpdateInitOrder = (data: any) => {
    dispatch(updateInitOrderInspector(id, data));
  };

  return (
    <div>
      <p className="title is-size-5 has-text-weight-bold">Contenedor:</p>
      <ul className="mx-2">
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(container)}
            value={container ?? ""}
            labelOk={"Matrícula:"}
            labelWrong={"Matrícula del contenedor requerida."}
            type="text"
            name="container"
            onChange={handleUpdateMat}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(empty)}
            value={empty ?? ""}
            labelOk={"Contenedor vacío:"}
            labelWrong={"Foto del contenedor requerida."}
            type="file"
            name="empty"
            onChange={handleUpdateInitOrder}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(matricula)}
            value={matricula ?? ""}
            labelOk={"Foto Matrícula:"}
            labelWrong={"Foto de la matrícula requerida."}
            type="file"
            name="matricula"
            onChange={handleUpdateInitOrder}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(ventilation)}
            value={ventilation ?? ""}
            labelOk="Foto Ventilación"
            labelWrong="No hay Foto de la ventilación (optional)."
            type="file"
            name="ventilation"
            onChange={handleUpdateInitOrder}
          />
        </li>
      </ul>
    </div>
  );
};

const ContainerCloseResume: FC<ContainerProps> = ({ order, onOk }) => {
  const { gross_weight, net_weight } = order;
  const { id, full, semi_close, close, precinto } = order.final[0];
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const check = [full, gross_weight, net_weight].every((v) => Boolean(v));
    if (check !== valid) {
      setValid(check);
      onOk(check);
    }
  }, [full, gross_weight, net_weight, onOk, valid, setValid]);

  const handleUpdateWeight = (data: any) => {
    dispatch(updateOrderInspector(order.id, data));
  };

  const handleUpdateFinalOrder = (data: any) => {
    dispatch(updateFinalOrderInspector(id, data));
  };

  return (
    <div className="my-4">
      <p className="title is-size-5 has-text-weight-bold">
        Cierre del Contenedor:
      </p>
      <ul className="mx-2">
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(gross_weight)}
            value={gross_weight ?? 0}
            labelOk={"Peso Bruto (kg):"}
            labelWrong={"El Peso Bruto debe ser mayor a cero."}
            type="number"
            name="gross_weight"
            onChange={handleUpdateWeight}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(net_weight)}
            value={net_weight ?? 0}
            labelOk={"Peso Neto (kg):"}
            labelWrong={"El Peso Neto debe ser mayor a cero."}
            type="number"
            name="net_weight"
            onChange={handleUpdateWeight}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(full)}
            value={full ?? ""}
            labelOk={"Contenedor LLeno:"}
            labelWrong={"Foto del contenedor lleno requerida."}
            type="file"
            name="full"
            onChange={handleUpdateFinalOrder}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(semi_close)}
            value={semi_close ?? ""}
            labelOk="Foto Semi Cerrado:"
            labelWrong="No hay Foto Contenedor Semi Cerrado (optional)."
            type="file"
            name="semi_close"
            onChange={handleUpdateFinalOrder}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(close)}
            value={close ?? ""}
            labelOk="Foto Cerrado:"
            labelWrong="No hay Foto Contenedor Cerrado (optional)."
            type="file"
            name="close"
            onChange={handleUpdateFinalOrder}
          />
        </li>
        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={Boolean(precinto)}
            value={precinto ?? ""}
            labelOk="Foto Precinto AFIP:"
            labelWrong="No hay Foto Precinto AFIP (optional)."
            type="file"
            name="precinto"
            onChange={handleUpdateFinalOrder}
          />
        </li>
      </ul>
    </div>
  );
};

const RowsResume: FC<ContainerProps & { rows: Row[] }> = ({
  order,
  onOk,
  rows,
}) => {
  const { boxes, id } = order;
  const [valid, setValid] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const check = Boolean(boxes);
    if (check !== valid) {
      setValid(check);
      onOk(check);
    }
  }, [boxes, onOk, valid, setValid]);

  const handleUpdateBoxes = (data: any) => {
    dispatch(updateOrderInspector(order.id, data));
  };

  const checkRows =
    order.boxes === rows.reduce((a: number, c: Row) => a + c.quantity, 0);
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
    <div>
      <p className="title is-size-5 has-text-weight-bold">Filas:</p>
      <ul className="mx-2">
        <li className="is-flex is-justify-content-space-between">
          <CheckerLink
            condition={maxRow > 0}
            value={maxRow}
            labelOk={"N° Filas:"}
            labelWrong={"El número de filas tiene que ser mayor a cero."}
            goUrl={`${INSPECTOR_CHECK_ROWS}/${id}`}
          />
        </li>

        <li className="is-flex is-justify-content-space-between">
          <CheckerModal
            condition={checkRows}
            value={order.boxes ?? 0}
            labelOk={"N° Cajas Totales:"}
            labelWrong={
              "El número de cajas no coincide con el cargado en las filas."
            }
            type="number"
            name="boxes"
            onChange={handleUpdateBoxes}
          />
        </li>

        {order.products.map((p) => (
          <li key={p.id} className="is-flex is-justify-content-space-between">
            <CheckerLink
              condition={numBox[p.id] > 0}
              value={numBox[p.id]}
              labelOk={`N° Cajas de ${p.name}:`}
              labelWrong={`El número de cajas de ${p.name} es cero.`}
              goUrl={`${INSPECTOR_CHECK_ROWS}/${id}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

class CheckListOrder extends Component<CheckListProps, CheckListState> {
  static defaultProps = {
    rows: [],
  };

  public state: CheckListState = {
    check: false,
    containerCheck: false,
    rowsCheck: false,
    closeCheck: false,
  };

  private handleContainerChecks = (check: boolean) => {
    this.setState({ containerCheck: check });
  };

  private handleCloseChecks = (check: boolean) => {
    this.setState({ closeCheck: check });
  };

  private handleRowsChecks = (check: boolean) => {
    this.setState({ rowsCheck: check });
  };

  public componentDidUpdate() {
    const { containerCheck, rowsCheck, closeCheck } = this.state;
    const check = containerCheck && rowsCheck && closeCheck;
    if (check !== this.state.check) this.setState({ check });
  }

  public componentDidMount() {
    const { containerCheck, rowsCheck, closeCheck } = this.state;
    this.setState({ check: containerCheck && rowsCheck && closeCheck });
  }

  public render() {
    const { check } = this.state;
    const { order, rows, backUrl, onOk } = this.props;

    return (
      <div>
        <ContainerResume order={order} onOk={this.handleContainerChecks} />

        <RowsResume order={order} rows={rows} onOk={this.handleRowsChecks} />

        <ContainerCloseResume order={order} onOk={this.handleCloseChecks} />

        <div className="buttons is-justify-content-space-evenly">
          <button
            disabled={!check}
            onClick={onOk}
            className="button is-success is-large"
          >
            Aceptar
          </button>
          <Link to={backUrl} className="button is-danger is-large">
            Volver
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  rows: getRows(state),
});

export default connect(mapStateToProps, null)(CheckListOrder);
