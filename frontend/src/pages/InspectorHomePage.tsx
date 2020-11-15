import React, { Component } from 'react';
import { connect, DispatchProp } from "react-redux";
import { Link } from "react-router-dom";
import lodash from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
// Import Services
import { 
    dateInARFormat,
    timeFromUTCToLocal
  } from "../services/datetime";
// Import Componentes
import { Align, Table, Column } from "../components/Table";
// Import Getters
import { getAccount } from "../reducers/dashboardReducer";
import { getOrders } from "../reducers/inspectorReducer";
// Import Types
import { Account } from "../types/account";
import { Order, statusMap } from "../types/order";
// Import Routes
import { 
    INSPECTOR_START_ORDER, 
    INSPECTOR_LOADING_ORDER,
    INSPECTOR_CLOSING_ORDER,
    INSPECTOR_CHECK_ORDER,
} from "../routes";

type Props = DispatchProp<any> & {
    account: Account;
    orders: Order[];
}

class InspectorHomePage extends Component<Props> {

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
            render: (order: Order) => order.client.company
        },
        {
            key: "inspector.user.username",
            title: "Inspector",
            width: 100,
        },
        {
            key: "products",
            title: "Productos",
            align: Align.center,
            width: 300,
            render: (order: Order) => (
            <ul>
                {order.products.map(p => (
                <li key={p.id} className="tag is-light is-flex my-1">
                    {p.name}
                </li>
                )
                )}
            </ul>
            )
        },
        {
            key: "date",
            title: "Fecha",
            align: Align.center,
            width: 100,
            render: (order: Order) =>
            order.date ? dateInARFormat(order.date) : "-",
        },
        {
            key: "time",
            title: "Hora: Comienzo/Finalizado",
            align: Align.center,
            width: 100,
            render: (order: Order) =>{
                const start = timeFromUTCToLocal(order.date, order.time_start);
                const completed = timeFromUTCToLocal(order.date, order.time_complete);
                return (`${start} a ${completed}`);
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
            render: (order: Order) => {
                
                if (order.status === "pending")
                    return (
                        <button className="button is-small is-success">
                            <Link 
                                to={`${INSPECTOR_START_ORDER}/${order.id}`} 
                                className="has-text-white has-text-weight-bold"
                            >
                                Iniciar Carga
                            </Link>
                        </button>
                    )
                if (["initiating", "loading"].includes(order.status))
                    return (
                        <button 
                            className="button is-small is-warning"
                            data-tooltip="Continuar Carga"
                        >
                            <Link 
                                to={`${INSPECTOR_LOADING_ORDER}/${order.id}`} 
                                className="has-text-white has-text-weight-bold"
                            >
                                <span>Continuar Carga</span>
                            </Link>
                        </button>
                    )

                if (order.status === "closing")
                    return (
                        <button className="button is-small is-danger">
                            <Link 
                                to={`${INSPECTOR_CLOSING_ORDER}/${order.id}`} 
                                className="has-text-white has-text-weight-bold"
                            >
                                Finalizar Carga
                            </Link>
                        </button>
                    )

                if (order.status === "finish")
                    return (
                        <button className="button is-small is-info">
                            <Link 
                                to={`${INSPECTOR_CLOSING_ORDER}/${order.id}${INSPECTOR_CHECK_ORDER}`} 
                                className="has-text-white has-text-weight-bold"
                            >
                                Chequear Carga
                            </Link>
                        </button>
                    )
                if (order.status === "ready")
                    return (
                        <span className="button is-small is-success">
                            <FontAwesomeIcon icon={faCheck} />
                            <span>Listo</span>
                        </span>
                    )
                
                if (order.status === "cancel")
                    return (
                        <span className="button is-small is-danger">
                            <FontAwesomeIcon icon={faTimes} />
                            <span>Cancelado</span>
                        </span>
                    )
            },
        },
        ];

    public render() {
        const { orders } = this.props;
        return (
            <div className="mt-3">
                {lodash.isEmpty(orders)
                ?<h1 className="title">No tiene Cargas Asignadas</h1>
                :<Table columns={this.columns} data={orders} dataKey="order" />}
            </div>
        );
    }
}
const mapStateToProps = (state: any) => ({
    account: getAccount(state),
    orders: getOrders(state),
 });
 
 export default connect(mapStateToProps)(InspectorHomePage);