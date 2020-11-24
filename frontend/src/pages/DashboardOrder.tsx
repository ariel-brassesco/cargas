import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { Route, Switch, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
// Import Services
import { dateInARFormat, timeFromUTCToLocal } from "../services/datetime";
// Import Components
import { Align, Table, Column } from "../components/Table";
import { Confirm } from "../components/Confirm";
import { Toolbar } from "../components/Toolbar";
import { EditOrder } from "../components/EditOrder";
import { Pagination } from "../components/Pagination";
import { Loader } from "../components/Common";
// Import Actions
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../actions/dashboardActions";
// Import Getters
import {
  getClients,
  getInspectors,
  getOrders,
  getProducts,
  getOrdersPages,
  getOrdersCurrent,
  getOrdersPrevious,
  getOrdersNext,
} from "../reducers/dashboardReducer";
// Import Types
import { Order, statusMap } from "../types/order";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Product } from "../types/product";
// Import Routes
import { ORDER_EDIT, NEW_ORDER, DASHBOARD_ORDERS } from "../routes";

type Props = DispatchProp<any> & {
  orders: Order[];
  clients: Client[];
  inspectors: Inspector[];
  products: Product[];
  pages: number;
  current: number;
  next: number | null;
  previous: number | null;
};

type State = {
  loading: boolean;
};

class DashboardOrdersPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  private columns: Column[] = [
    {
      key: "id",
      title: "#",
      align: Align.right,
      width: 50,
    },
    {
      key: "client",
      title: "Cliente",
      width: 100,
      render: (order: Order) => order.client.company,
    },
    {
      key: "inspector",
      title: "Inspector",
      width: 100,
      render: (order: Order) =>
        `${order.inspector.user.first_name} 
        ${order.inspector.user.last_name}`,
    },
    {
      key: "products",
      title: "Productos",
      align: Align.center,
      width: 250,
      render: (order: Order) => (
        <ul>
          {order.products.map((p) => (
            <li key={p.id} className="tag is-black is-flex my-1">
              {p.name}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "date",
      title: "Fecha",
      align: Align.center,
      width: 100,
      render: (order: Order) => (order.date ? dateInARFormat(order.date) : "-"),
    },
    {
      key: "time",
      title: "Hora: Comienzo/Finalizado",
      align: Align.center,
      width: 100,
      render: (order: Order) => {
        const start = timeFromUTCToLocal(order.date, order.time_start);
        const completed = timeFromUTCToLocal(order.date, order.time_complete);
        return `${start} A ${completed}`;
      },
    },
    {
      key: "status",
      title: "Estado",
      align: Align.center,
      width: 150,
      render: (order: Order) =>
        !!order.status && (statusMap[order.status] ?? ""),
    },
    {
      key: "actions",
      title: "Acciones",
      align: Align.center,
      width: 120,
      render: (order: Order) => (
        <div>
          <button
            className="button is-small is-info mr-1 has-tooltip-arrow"
            data-tooltip="Editar"
          >
            <Link
              to={`${ORDER_EDIT}/${order.id}`}
              className="icon is-info has-text-white"
            >
              <FontAwesomeIcon icon={faEdit} />
            </Link>
          </button>

          <Confirm
            title={`Está seguro que desea eliminar la Carga #${order.id}?`}
            okLabel="Eliminar"
            onClick={this.handleDeleteOrder(order.id)}
          >
            <button
              className="button is-small is-danger mr-1 has-tooltip-arrow"
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

  private handleSaveOrder = (order: Record<string, any>) =>
    this.props.dispatch(createOrder(order));

  private handleUpdateOrder = (order: Order) => (data: Record<string, any>) =>
    this.props.dispatch(updateOrder(order.id, data));

  // private handleChangeStatus = (id: number, status: string) => () => {
  //   this.props.dispatch(updateOrder(id, { status }));
  // };

  private handleDeleteOrder = (id: number) => () => {
    this.props.dispatch(deleteOrder(id));
  };

  private handleChangePage = async (page: number) => {
    if (page !== this.props.current) {
      this.setState({ loading: true });
      await this.props.dispatch(fetchOrders(page));
      this.setState({ loading: false });
    }
  };

  public render() {
    const { clients, inspectors, products } = this.props;
    const { orders, current, next, previous, pages } = this.props;

    if (this.state.loading)
      return (
        <div className="is-flex is-justify-content-center">
          <Loader className="image is-128x128" alt="Cargando ..." />
        </div>
      );

    return (
      <div>
        <Switch>
          <Route
            path={NEW_ORDER}
            render={({ history }) => (
              <EditOrder
                clients={clients}
                inspectors={inspectors.filter((i) => i.user.is_active)}
                products={products}
                onOk={this.handleSaveOrder}
                onCancel={() => history.push(DASHBOARD_ORDERS)}
              />
            )}
          />

          <Route
            path={`${ORDER_EDIT}/:order`}
            render={({ history, match }) => {
              const order = orders.find(
                (o) => String(o.id) === match.params.order
              );
              if (!order) return null;
              return (
                <>
                  <EditOrder
                    order={order}
                    clients={clients}
                    inspectors={inspectors.filter((i) => i.user.is_active)}
                    products={products}
                    onOk={this.handleUpdateOrder(order)}
                    onCancel={() => history.push(DASHBOARD_ORDERS)}
                  />
                </>
              );
            }}
          />

          <Route path={DASHBOARD_ORDERS}>
            <Toolbar title="Cargas">
              <Link to={NEW_ORDER} className="button is-info">
                <span className="icon">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Nueva Carga</span>
              </Link>
            </Toolbar>
            <Table columns={this.columns} data={orders} />
            <Pagination
              {...{ current, next, previous, pages }}
              changePage={this.handleChangePage}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  orders: getOrders(state),
  clients: getClients(state),
  inspectors: getInspectors(state),
  products: getProducts(state),
  pages: getOrdersPages(state),
  current: getOrdersCurrent(state),
  next: getOrdersNext(state),
  previous: getOrdersPrevious(state),
});

export default connect(mapStateToProps)(DashboardOrdersPage);
