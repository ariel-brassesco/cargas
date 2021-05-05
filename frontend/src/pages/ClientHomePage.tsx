import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import lodash from "lodash";
// Import Componentes
import { ClientOrder } from "../components/ClientOrder";
import { SearchBar } from "../components/SearchBar";

// Import Getters
import { getOrders } from "../reducers/clientReducer";
// Import Types
import { Order } from "../types/order";

const ClientHomePage: FC = () => {
  const [search, setSearch] = useState("");
  const orders: Order[] = useSelector((state: any) => getOrders(state));
  return (
    <div className="mt-3">
      {lodash.isEmpty(orders) ? (
        <h1 className="title has-text-centered">No hay Cargas para Mostrar</h1>
      ) : (
        <>
          <SearchBar value={search} onSearch={setSearch} />
          {orders
            .filter((o: Order) =>
              o.order.toLowerCase().includes(search.toLowerCase())
            )
            .map((o: Order, idx: number) => (
              <ClientOrder key={idx} order={o} />
            ))}
        </>
      )}
    </div>
  );
};

export default ClientHomePage;
