import React, { FC, useEffect } from 'react';
import { 
  Redirect, 
  Route, 
  Switch, 
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { Formik, Field, Form } from "formik";
// import * as Yup from "yup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faUndo
} from '@fortawesome/free-solid-svg-icons';

// Import Components
import FormNewRow from "../components/FormNewRow";
import FormNewTemperature from "../components/FormNewTemperature";
import FormNewWeight from "../components/FormNewWeight";
import { GoToButton } from "../components/Common";
import { Table, Column, Align } from "../components/Table";
import { Confirm } from "../components/Confirm";
// import Actions
import {
  fetchRows,
  fetchTemps,
  fetchWeights,
  updateStatusOrder,
  newRow,
  newTemperature,
  newWeight
} from "../actions/inspectorActions";
//Import Types
import { Order } from "../types/order";
import { Row } from "../types/row";
// Import Routes
import { 
  PROFILE_INSPECTOR,
  INSPECTOR_CLOSING_ORDER,
  INSPECTOR_NEW_LINE,
  INSPECTOR_TEMPERATURE_CONTROL,
  INSPECTOR_WEIGHT_CONTROL,
  // INSPECTOR_ORGANOLEPTIC_CONTROL
} from "../routes";
// Import Getters
import { getRows } from "../reducers/inspectorReducer";


type Props = RouteComponentProps & {
  order: Order;
}

const InspectorLoadingOrder: FC<Props>= ({
  order,
  match,
  history
}) => {
  const dispatch = useDispatch();
  const rows: Row[] = useSelector((state: any) => getRows(state));
  const { url } = match;

  const columns: Column[] = [
    {
      key: "number",
      title: "#",
      align: Align.right,
      width: 50,
    },
    {
      key: "product.name",
      title: "Producto",
      align: Align.center,
      width: 300,
    },
    {
      key: "size",
      title: "Tamaño",
      align: Align.center,
      width: 100,
    },
    {
      key: "quantity",
      title: "Cantidad",
      align: Align.center,
      width: 150,
    },
  ];
  
  useEffect(()=> {
    dispatch(fetchRows(order.id));
    dispatch(fetchTemps(order.id));
    dispatch(fetchWeights(order.id));
  }, [order, dispatch]);

  const  handleNewRow = (data: FormData) => {
    if (rows.length < 1) dispatch(updateStatusOrder(order.id, "loading"));
    return newRow(data)(dispatch);
  }

  const  handleNewTemperature = (data: FormData) => newTemperature(data)(dispatch);

  const  handleNewWeight = (data: FormData) => newWeight(data)(dispatch);

  const handleFinishLoading = async (status: string) => {
    await dispatch(updateStatusOrder(order.id, status));
    history.push(`${INSPECTOR_CLOSING_ORDER}/${order.id}`);
  }
  
  
  // If the Order has not status initiating or loading
  // redirect to inspector profile
  const allowStatus = ["initiating", "loading"]
  if (!allowStatus.includes(order.status)) return <Redirect to={PROFILE_INSPECTOR}/>
  
  return (
    <div>
      <Switch>
        <Route path={url + INSPECTOR_NEW_LINE}>
          <FormNewRow order={order} backUrl={url} onOk={handleNewRow}/>
        </Route>

        <Route path={url + INSPECTOR_TEMPERATURE_CONTROL}>
          <FormNewTemperature order={order} backUrl={url} onOk={handleNewTemperature}/>
        </Route>

        <Route path={url + INSPECTOR_WEIGHT_CONTROL}>
          <FormNewWeight order={order} backUrl={url} onOk={handleNewWeight}/>
        </Route>

        <Route path={url}>
          <GoToButton
            path={url + INSPECTOR_NEW_LINE} 
            className="button is-success is-fullwidth m-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span>Fila</span>
          </GoToButton>
          <GoToButton 
            path={url + INSPECTOR_TEMPERATURE_CONTROL} 
            className="button is-success is-fullwidth m-2" 
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Temperatura</span>
          </GoToButton>
          <GoToButton 
            path={url + INSPECTOR_WEIGHT_CONTROL} 
            className="button is-success is-fullwidth m-2" 
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Pesos</span>
          </GoToButton>
          <GoToButton 
            path={PROFILE_INSPECTOR} 
            className="button is-warning is-fullwidth m-2" 
          >
            <FontAwesomeIcon icon={faUndo} />
            <span>Volver</span>
          </GoToButton>

          <Confirm
            title={`Está seguro que quiere finalizar la carga?`}
            okLabel="Sí"
            onClick={() => handleFinishLoading("closing")}
          >
            <span className="button is-danger is-fullwidth m-2">
              Finalizar Carga  
            </span>
          </Confirm>

          <Table columns={columns} data={rows} dataKey="rows" />

        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(InspectorLoadingOrder);
