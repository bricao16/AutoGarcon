import React, { useState, useEffect } from 'react';
import Orders from "./Orders";



import Header from "./Header";
import Alert from "./Alert";
import Footer from "./Footer";
import $ from "jquery";
import Button from 'react-bootstrap/Button';
import https from 'https';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function Body(props){

  const [orders, setOrders] = useState({});

  function configureOrders(orders){
    // console.log(orders);
    let ordersState = {};
    // Iterate over each order
    Object.values(orders).forEach(order => {
      // console.log(order);
      // Check if that order_num exists
      if(!(order.order_num in ordersState)){
        // Create new order with empty items
        ordersState[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}, expand: false};
      }
      // If no category provided, mark as Entree
      if(!order.category){
        order.category = 'Entrees';
      }
      if(!(order.category in ordersState[order.order_num].items)){
        ordersState[order.order_num].items[order.category] = [];
      }
      // Add item to order
      ordersState[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name});
    });
    setOrders(ordersState);
  }

  useEffect(() => {
    // Get active orders from database
    axios({
      method: 'get',
      // https://50.19.176.137:8001/orders/123
      // http://50.19.176.137:8000/orders/123
      // Dummy orders for testing: "https://my-json-server.typicode.com/palu3492/fake-rest-apis/orders"
      url: 'https://my-json-server.typicode.com/palu3492/fake-rest-apis/orders',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then(res => res.data)
      .then(orders => {
        configureOrders(orders);
      })
      .catch(e => console.log(e));
  });

  return (
    <div className="p-3">
      <Header />
      {/*<Header handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={this.markOrderComplete.bind(this)} />*/}
      <Orders orders={orders} />
      {/*<Orders orders={orders} selectedOrder={this.state.selectedOrder} handleCardClick={this.changeSelectedOrder.bind(this)} />*/}
    </div>
  )
}

export default Body;