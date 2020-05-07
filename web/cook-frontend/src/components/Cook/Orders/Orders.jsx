import React from "react";

import Header from './Header'
import {Redirect, Route, Switch} from "react-router-dom";

import DisplayOrders from "./DisplayOrders";

function Orders(){

  return(
    <div>
      <Header/>
      <Switch>
        <Route exact path="/cook/orders">
          <Redirect to="/cook/orders/active" />
        </Route>
        <Route exact path="/cook/orders/active">
          <DisplayOrders />
        </Route>
        <Route exact path="/cook/orders/completed">
          <DisplayOrders />
        </Route>
      </Switch>
    </div>
  )
}

export default Orders;