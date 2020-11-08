import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";
import { compose } from "redux";
import { Route, Switch, withRouter, RouteComponentProps, RouteProps, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faPlus,
  faTimesCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import dayjs from "dayjs";
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
  deleteOrder
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
  getOrdersNext
} from "../reducers/dashboardReducer";
// Import Types
import { Order, statusMap } from "../types/order";
import { Client } from "../types/client";
import { Inspector } from "../types/inspector";
import { Product } from "../types/product";
// Import Routes
import { 
  ORDER_EDIT, 
  NEW_ORDER
} from "../routes";


type Props = DispatchProp<any> & RouteComponentProps & {
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
}

class DashboardOrdersPage extends Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    }
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
      render: (order: Order) => order.client.company
    },
    {
        key: "inspector",
        title: "Inspector",
        render: (order: Order) => order.inspector.user.username
      },
    {
      key: "date",
      title: "Fecha",
      align: Align.center,
      width: 200,
      render: (order: Order) =>
        order.date ? dayjs(order.date).format("DD/MM/YYYY") : "-",
    },
    {
      key: "time",
      title: "Hora: Comienzo/Finalizado",
      align: Align.center,
      width: 200,
      render: (order: Order) =>{
        const start = dayjs(order.time_start).format("HH:MM");
        const completed = dayjs(order.time_complete).format("HH:MM");
        return (`${start} A ${completed}`);
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
            <button className="button is-small is-info mr-1 has-tooltip-arrow"
                data-tooltip="Editar"
                // onClick={this.showDetail(true, order)}
                >
                <span className="icon">
                  <FontAwesomeIcon icon={faEdit} />
                </span>
            </button>
            <Confirm
                title={`Está seguro que desea eliminar la Carga #${order.id}?`}
                okLabel="Eliminar"
                onClick={this.handleDeleteOrder(order.id)}
            >
                <button className="button is-small is-danger mr-1 has-tooltip-arrow"
                data-tooltip="Eliminar"
                >
                <span className="icon">
                    <FontAwesomeIcon icon={faTrash}/>
                </span>
                </button>
            </Confirm>
            {/* <Confirm
                title="Estás?"
                okLabel="Si"
                onClick={this.handleCancelOrder(order.id)}
            >
                <button title="Rechazado" className="button is-danger">
                <span className="icon">
                    <i className="fas fa-times" />
                </span>
                </button>
            </Confirm> */}
        </div>
      ),
    },
  ];

  public componentDidMount() {
    this.props.dispatch(fetchOrders());
  }

  // private showDetail = (detail: boolean, order?: Order) => () => {
  //   this.setState({detail, order})
  // }

  private handleSaveOrder = (order: Record<string, any>) => (
    this.props.dispatch(createOrder(order))
  );

  private handleUpdateOrder = (order: Record<string, any>) => (
    this.props.dispatch(updateOrder(order.id, order))
  );

  private handleChangeStatus = (id: number, status: string) => () => {
    this.props.dispatch(updateOrder(id, { status }));
  };

  private handleDeleteOrder = (id: number) => () => {
      this.props.dispatch(deleteOrder(id));
  }

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
    const {path, url} = this.props.match;

    if (this.state.loading)
      return (
        <div className="is-flex is-justify-content-center">
          <Loader className="image is-128x128" alt="Cargando ..." />
        </div>
      );

    return (
      <div>
        <Switch>
          <Route path={path}>
            <Toolbar title="Cargas">
              <Link to={NEW_ORDER} className="button is-info">
                <span className="icon">
                    <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>Nueva Carga</span>
              </Link>
              <Pagination
                {...{ current, next, previous, pages }}
                changePage={this.handleChangePage}
              />
            </Toolbar>
            <Table columns={this.columns} data={orders} dataKey="order" />
          </Route>
          <Route >
            <EditOrder
                clients={clients}
                inspectors={inspectors}
                products={products}
                onOk={this.handleSaveOrder} 
                onCancel={() => false}/>
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

export default compose(withRouter, connect(mapStateToProps))(DashboardOrdersPage);
