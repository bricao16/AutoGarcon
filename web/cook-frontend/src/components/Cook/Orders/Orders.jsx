import React from "react";

import Header from './Header'
import {Redirect, Route, Switch} from "react-router-dom";

// import ActiveOrders from "./ActiveOrders";
// import CompletedOrders from "./CompletedOrders";
import Body from "./Body";

function Orders(){

  const activeOrdersEndpoint = "/orders/";
  const completedOrdersEndpoint = "/orders/complete/";

  return(
    <div>
      <Header/>
      <Switch>
        <Route exact path="/cook/orders">
          <Redirect to="/cook/orders/active" />
        </Route>
        <Route exact path="/cook/orders/active">
          {/*<ActiveOrders />*/}
          <Body ordersEndpoint={activeOrdersEndpoint}/>
        </Route>
        <Route exact path="/cook/orders/completed">
          {/*<CompletedOrders />*/}
          <Body ordersEndpoint={completedOrdersEndpoint}/>
        </Route>
      </Switch>
    </div>
  )
}

export default Orders;