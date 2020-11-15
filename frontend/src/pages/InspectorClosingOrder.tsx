import React, { FC } from 'react';
import { 
  Redirect, 
  Route, 
  Switch, 
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import { useDispatch } from "react-redux";

// Import Components
import FormCloseOrder from "../components/FormCloseOrder";
import CheckListOrder from "../components/CheckListOrder";
// import Actions
import { closeOrder, updateStatusOrder } from "../actions/inspectorActions";
//Import Types
import { Order } from "../types/order";
// Import Routes
import { PROFILE_INSPECTOR, INSPECTOR_CHECK_ORDER } from "../routes";


type Props = RouteComponentProps & {
  order: Order;
}

const InspectorClosingOrder: FC<Props>= ({
  order,
  match
}) => {
  const dispatch = useDispatch();
  const { url } = match;

  const  handleCloseOrder = (data: FormData) => closeOrder(data)(dispatch);

  const handleFinishOrder = (status: string) => dispatch(updateStatusOrder(order.id, status));
  
  
  // If the Order has not status initiating or loading
  // redirect to inspector profile
  const allowStatus = ["closing", "finish"]
  if (!allowStatus.includes(order.status)) return <Redirect to={PROFILE_INSPECTOR}/>
  
  return (
    <div className="mt-2">
      <Switch>
        <Route path={url + INSPECTOR_CHECK_ORDER}>
          <CheckListOrder
            order={order} 
            backUrl={PROFILE_INSPECTOR} 
            onOk={() => handleFinishOrder("ready")}
          />
        </Route>

        <Route path={url}>
          <FormCloseOrder 
            order={order} 
            backUrl={PROFILE_INSPECTOR} 
            okUrl={url + INSPECTOR_CHECK_ORDER}
            onOk={handleCloseOrder}/>
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(InspectorClosingOrder);
