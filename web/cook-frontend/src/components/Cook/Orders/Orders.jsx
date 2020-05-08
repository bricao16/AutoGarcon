import React from "react";

import Header from './Header'
import {Redirect, Route, Switch} from "react-router-dom";

import ActiveOrders from "./ActiveOrders";
import CompletedOrders from "./CompletedOrders";

function Orders(){

  return(
    <div>
      <Header/>
      <Switch>
        <Route exact path="/cook/orders">
          <Redirect to="/cook/orders/active" />
        </Route>
        <Route exact path="/cook/orders/active">
          <ActiveOrders />
        </Route>
        <Route exact path="/cook/orders/completed">
          <CompletedOrders />
        </Route>
      </Switch>
    </div>
  )
}

export default Orders;