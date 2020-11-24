import React, { FC } from "react";
import { useSelector } from "react-redux";
import lodash from "lodash";
// Import Componentes
import { CardOrder } from "../components/CardOrder";
// Import Getters
import { getOrders } from "../reducers/inspectorReducer";
// Import Types
import { Order } from "../types/order";

const InspectorHomePage: FC = () => {
  const orders: Order[] = useSelector((state: any) => getOrders(state));
  return (
    <div className="mt-3">
      {lodash.isEmpty(orders) ? (
        <h1 className="title has-text-centered">No tienes Cargas Asignadas</h1>
      ) : (
        orders.map((o: Order, idx: number) => <CardOrder key={idx} order={o} />)
      )}
    </div>
  );
};

export default InspectorHomePage;
