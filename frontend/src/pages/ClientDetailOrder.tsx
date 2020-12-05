import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

// Import Types
import { Order } from "../types/order";
// Import Routes
import { PROFILE_CLIENT } from "../routes";

type Props = {
  order: Order;
};
const ClientOrderDetail: React.FC<Props> = ({ order }) => (
  <div>
    <Link to={PROFILE_CLIENT} className="button is-warning">
      <FontAwesomeIcon icon={faUndo} />
      <span className="mx-1">Volver</span>
    </Link>

    <p>{order.id}</p>
  </div>
);

export default ClientOrderDetail;
