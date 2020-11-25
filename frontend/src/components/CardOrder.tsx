import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleDown,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
// Import Services
import { dateInARFormat, timeFromUTCToLocal } from "../services/datetime";
// Import Types
import { Order, statusMap } from "../types/order";
// Import Routes
import {
  INSPECTOR_START_ORDER,
  INSPECTOR_LOADING_ORDER,
  INSPECTOR_CLOSING_ORDER,
  INSPECTOR_CHECK_ORDER,
} from "../routes";

type Props = {
  order: Order;
};

export const CardOrder: FC<Props> = ({ order }) => {
  const [show, setDisplay] = useState(false);

  const handleDisplay = () => setDisplay(!show);

  const start = timeFromUTCToLocal(order.date, order.time_start);
  const completed = timeFromUTCToLocal(order.date, order.time_complete);

  return (
    <div className="card my-3">
      <header className="card-header has-background-grey-light">
        <p className="card-header-title">Carga #{order.id}</p>
        <span
          className="card-header-icon"
          aria-label="more options"
          onClick={handleDisplay}
        >
          <span className="icon">
            {show ? (
              <FontAwesomeIcon icon={faAngleDown} />
            ) : (
              <FontAwesomeIcon icon={faAngleRight} />
            )}
          </span>
        </span>
      </header>
      <div className={`card-content ${!show ? "is-hidden" : null}`}>
        <div className="content">
          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Cliente:</span>
            <span>{order.client.company}</span>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Productos:</span>
            <ul>
              {order.products.map((p) => (
                <li key={p.id} className="tag is-black is-flex my-1">
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Booking:</span>
            <span>{order.booking ?? "-"}</span>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Peso Bruto (kg):</span>
            <span>{order.gross_weight ?? "-"}</span>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Fecha:</span>
            <span>{order.date ? dateInARFormat(order.date) : "-"}</span>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Hora:</span>
            <span>{`${start} a ${completed}`}</span>
          </div>

          <div className="is-flex is-justify-content-space-between">
            <span className="has-text-weight-bold">Estado:</span>
            <span>{statusMap[order.status]}</span>
          </div>
        </div>
      </div>
      <footer className="card-footer is-flex-direction-column">
        <OrderStatus order={order} />
      </footer>
    </div>
  );
};

interface ButtonProps {
  order: Order;
}

function OrderStatus({ order }: ButtonProps) {
  if (order.status === "pending")
    return (
      <Link
        to={`${INSPECTOR_START_ORDER}/${order.id}`}
        className={`button is-success is-radiusless 
                    has-text-white has-text-weight-bold`}
      >
        <span>INICIAR CARGA</span>
      </Link>
    );

  if (["initiating", "loading"].includes(order.status))
    return (
      <Link
        to={`${INSPECTOR_LOADING_ORDER}/${order.id}`}
        className={`button is-warning is-radiusless 
                has-text-white has-text-weight-bold`}
      >
        <span>CONTINUAR CARGA</span>
      </Link>
    );

  if (order.status === "closing")
    return (
      <Link
        to={`${INSPECTOR_CLOSING_ORDER}/${order.id}`}
        className={`button is-danger is-radiusless 
                has-text-white has-text-weight-bold`}
      >
        FINALIZAR CARGA
      </Link>
    );

  if (order.status === "finish")
    return (
      <Link
        to={`${INSPECTOR_CLOSING_ORDER}/${order.id}${INSPECTOR_CHECK_ORDER}`}
        className={`button is-info is-radiusless 
                    has-text-white has-text-weight-bold`}
      >
        CHEQUEAR CARGA
      </Link>
    );
  if (order.status === "ready")
    return (
      <span className="button is-success is-radiusless">
        <FontAwesomeIcon icon={faCheck} />
        <span>LISTO</span>
      </span>
    );

  if (order.status === "cancel")
    return (
      <span className="button is-danger is-radiusless">
        <FontAwesomeIcon icon={faTimes} />
        <span>CANCELADO</span>
      </span>
    );
  return null;
}
