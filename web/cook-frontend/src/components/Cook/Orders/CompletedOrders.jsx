import React from "react";
import DisplayOrders from "./DisplayOrders";
import Toolbar from "./Toolbar";

function CompletedOrders(){

  const serverUrl = process.env.REACT_APP_DB;
  // const path = serverUrl + '/orders/' + restaurant_id;
  const path = serverUrl + '/orders/complete/' + '124';



  return (
    <div>
      <p>Completed Orders</p>
      <Toolbar />
      <DisplayOrders type="completed" path={path} />
    </div>
  );
}

export default CompletedOrders;
