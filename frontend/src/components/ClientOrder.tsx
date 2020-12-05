import React from "react";
import { Link } from "react-router-dom";
// Import Components
import { LabelData, LotData } from "./OrderManager";
// Import Services
import { dateInARFormat, timeFromUTCToLocal } from "../services/datetime";
// Import Types
import { Order, statusMap } from "../types/order";
// // Import Routes
import { CLIENT_ORDER_DETAIL } from "../routes";

type Props = {
  order: Order;
};

export const ClientOrder: React.FC<Props> = ({ order }) => {
  const date = dateInARFormat(order.date);
  const start = timeFromUTCToLocal(order.date, order.time_start);
  const completed = timeFromUTCToLocal(order.date, order.time_complete);

  return (
    <div className="card my-3">
      <header className="card-header has-background-grey-light">
        <p className="card-header-title">Carga #{order.id}</p>
        <span className="card-header-icon" aria-label="more options">
          <Link
            className="button is-success"
            to={`${CLIENT_ORDER_DETAIL}/${order.id}`}
          >
            Ver Detalle
          </Link>
        </span>
      </header>

      <div className="card-content">
        <div className="content is-flex is-flex-wrap-wrap is-justify-content-space-between">
          <div className="is-flex is-flex-direction-column is-justify-content-flex-start my-1">
            <LabelData label="Estado:" value={statusMap[order.status]} />
            <LabelData
              label="Fecha/Hora:"
              value={order.date ? `${date} -- ${start} a ${completed}` : "-"}
            />
            <LabelData label="Cliente:" value={order.client.company} />
            <LabelData label="Origen:" value={order.origin ?? "-"} />
            <LabelData label="Destino:" value={order.discharge ?? "-"} />
          </div>

          <div className="is-flex is-flex-direction-column is-justify-content-flex-start my-1">
            <LabelData label="Vessel Name:" value={order.vessel_name ?? "-"} />
            <LabelData label="Booking:" value={order.booking ?? "-"} />
            <LabelData label="Matrícula:" value={order.container ?? "-"} />
            <LabelData label="Precinto:" value={order.seal ?? "-"} />
            <LotData label="Lotes:" value={order.lot ?? ""} />
          </div>

          <div className="is-flex is-flex-direction-column is-justify-content-flex-start my-1">
            <div className="is-flex is-align-items-start">
              <span className="has-text-weight-bold mx-5">Productos:</span>
              <div>
                {order.products.map((p) => (
                  <span key={p.id} className="tag is-black is-flex mb-1">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
            <LabelData
              label="Peso Bruto (kg):"
              value={order.gross_weight ?? "-"}
            />
            <LabelData
              label="Peso Neto (kg):"
              value={order.net_weight ?? "-"}
            />
            <LabelData label="Cajas Totales:" value={order.boxes ?? "-"} />
          </div>
        </div>
      </div>
    </div>
  );
};
