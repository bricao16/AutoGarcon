import React from "react";

import Header from './Header'
import {Redirect, Route, Switch} from "react-router-dom";

function Orders(){

  return(
    <div>
      <Header/>
      <Switch>
        <Route exact path="/cook/orders">
          <Redirect to="/cook/orders/active" />
        </Route>
        <Route exact path="/cook/orders/active">
          Active
        </Route>
        <Route exact path="/cook/orders/completed">
          Completed
        </Route>
      </Switch>
    </div>
  )
}

export default Orders;