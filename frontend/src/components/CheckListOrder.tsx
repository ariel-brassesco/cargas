import React, { FC }  from "react";
import { Link } from "react-router-dom";

// Import Types
import { Order } from "../types/order";

type Props = {
    order: Order;
    backUrl: string;
    onOk?: () => void;
}

const CheckListOrder: FC<Props> = ({
    order,
    backUrl,
    onOk
}) => {
    return (
        <div>
            <div className="container">
                <p className="title">Datos Generales</p>

            </div>
            <div className="container">
                <p className="title">Inicio</p>
            </div>
            <div className="container">
                <p className="title">Filas</p>
            </div>
            <div className="container">
                <p className="title">Cierre del Contenedor</p>
            </div>
            
            <button onClick={onOk} className="button is-success">
                Aceptar
            </button>
            <Link to={backUrl} className="button is-danger">Volver</Link>
            
        </div>
    )
}

export default CheckListOrder;