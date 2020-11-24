import React, { FC, useEffect } from "react";
import {
  Redirect,
  Route,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUndo } from "@fortawesome/free-solid-svg-icons";

// Import Components
import FormNewRow from "../components/FormNewRow";
import FormNewTemperature from "../components/FormNewTemperature";
import FormNewWeight from "../components/FormNewWeight";
import FormNewMeasure from "../components/FormNewMeasure";
import { GoToButton } from "../components/Common";
import { Table, Column, Align } from "../components/Table";
import { Confirm } from "../components/Confirm";
// import Actions
import {
  fetchRows,
  fetchTemps,
  fetchWeights,
  fetchMeasures,
  updateOrderInspector,
  newRow,
  newTemperature,
  newWeight,
  newMeasure,
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
  INSPECTOR_MEASURE_CONTROL,
} from "../routes";
// Import Getters
import { getRows } from "../reducers/inspectorReducer";

type Props = RouteComponentProps & {
  order: Order;
};

const InspectorLoadingOrder: FC<Props> = ({ order, match, history }) => {
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

  useEffect(() => {
    dispatch(fetchRows(order.id));
    dispatch(fetchTemps(order.id));
    dispatch(fetchWeights(order.id));
    dispatch(fetchMeasures(order.id));
  }, [order, dispatch]);

  const handleNewRow = (data: FormData) => {
    if (rows.length < 1)
      dispatch(updateOrderInspector(order.id, { status: "loading" }));
    return newRow(data)(dispatch);
  };

  const handleNewTemperature = (data: FormData) =>
    newTemperature(data)(dispatch);

  const handleNewWeight = (data: FormData) => newWeight(data)(dispatch);

  const handleNewMeasure = (data: FormData) => newMeasure(data)(dispatch);

  const handleFinishLoading = async (status: string) => {
    await dispatch(updateOrderInspector(order.id, { status }));
    history.push(`${INSPECTOR_CLOSING_ORDER}/${order.id}`);
  };

  // If the Order has not status initiating or loading
  // redirect to inspector profile
  const allowStatus = ["initiating", "loading"];
  if (!allowStatus.includes(order.status))
    return <Redirect to={PROFILE_INSPECTOR} />;

  return (
    <div className="m-2 is-flex is-flex-direction-column">
      <Switch>
        <Route path={url + INSPECTOR_NEW_LINE}>
          <FormNewRow
            order={order}
            okUrl={url}
            backUrl={url}
            onOk={handleNewRow}
          />
        </Route>

        <Route path={url + INSPECTOR_TEMPERATURE_CONTROL}>
          <FormNewTemperature
            order={order}
            okUrl={url}
            backUrl={url}
            onOk={handleNewTemperature}
          />
        </Route>

        <Route path={url + INSPECTOR_WEIGHT_CONTROL}>
          <FormNewWeight
            order={order}
            okUrl={url}
            backUrl={url}
            onOk={handleNewWeight}
          />
        </Route>

        <Route path={url + INSPECTOR_MEASURE_CONTROL}>
          <FormNewMeasure
            order={order}
            okUrl={url}
            backUrl={url}
            onOk={handleNewMeasure}
          />
        </Route>

        <Route path={url}>
          <GoToButton
            path={url + INSPECTOR_NEW_LINE}
            className="button is-success is-fullwidth my-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="is-uppercase">Fila</span>
          </GoToButton>
          <GoToButton
            path={url + INSPECTOR_TEMPERATURE_CONTROL}
            className="button is-success is-fullwidth my-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="is-uppercase">Temperatura</span>
          </GoToButton>
          <GoToButton
            path={url + INSPECTOR_WEIGHT_CONTROL}
            className="button is-success is-fullwidth my-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="is-uppercase">Pesos</span>
          </GoToButton>
          <GoToButton
            path={url + INSPECTOR_MEASURE_CONTROL}
            className="button is-success is-fullwidth my-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="is-uppercase">Organoléptica</span>
          </GoToButton>
          <GoToButton
            path={PROFILE_INSPECTOR}
            className="button is-warning is-fullwidth my-2"
          >
            <span className="icon">
              <FontAwesomeIcon icon={faUndo} />
            </span>
            <span className="is-uppercase">Volver</span>
          </GoToButton>

          <Confirm
            title={`Está seguro que quiere finalizar la carga?`}
            okLabel="Sí"
            onClick={() => handleFinishLoading("closing")}
          >
            <span className="button is-danger is-fullwidth is-uppercase mb-4">
              Finalizar Carga
            </span>
          </Confirm>

          <Table columns={columns} data={rows} />
        </Route>
      </Switch>
    </div>
  );
};

export default withRouter(InspectorLoadingOrder);
