import React from "react";
import Order from "./Order";
import Container from 'react-bootstrap/Container';

class Orders extends React.Component{
  /*
    This Prop is used to render the orders for the Cook page.
    The orders are an array of object containing order details.  Look at the Order component for more details on the format of an order object.

    renderOrders is a helper function which takes all the orders,
    converts them to Order objects and returns a single JSX object that
    will be exported as an Orders
    component.
  */
  constructor(props) {
    super(props);
    this.state = {
      // Each key in orders is the order number
      orders: {
        1: {table: 1, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]}
      }
    };
  }

  configureOrders(orders){
    console.log(orders);
    let ordersState = {};
    // Iterate over each order
    Object.values(orders).forEach(order => {
      console.log(order);
      // Check if that table exists
      console.log(ordersState);
      if(order.order_num in ordersState){
        // Add item to table
        ordersState[order.order_num].items.push({quantity: order.quantity, title: order.item_name})
      }else{
        // Create table and add item
        ordersState[order.order_num] = {order_num: order.order_num, table: order.table, items: [{quantity: order.quantity, title: order.item_name}]}
      }
    });
    this.setState({orders: ordersState});
    console.log(this.state);
  }

  componentDidMount() {
    fetch("http://50.19.176.137:8000/orders/123")
      .then(res => res.json())
      .then(orders => {
        this.configureOrders(orders);
      })
      .catch(e => console.log(e));
  }

  renderOrders() {
    // Returns every order stored in the components state as an individual Order component
    let orderComponents = [];
    Object.keys(this.state.orders).forEach(key => {
      orderComponents.push( <Order key={key} order={this.state.orders[key]} /> );
    });
    return orderComponents;
  }

  // Returns orders wrapped in a flexbox so each order wraps to the next line 
  // when necessary
  render() {
    return (
      <Container fluid>
        <div class="d-flex flex-wrap">
          {this.renderOrders()}
        </div>
      </Container>
    )
  };
}

export default Orders;
