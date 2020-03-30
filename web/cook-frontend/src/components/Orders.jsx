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
      orders: [
        {table: 1, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
        {table: 2, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
        {table: 3, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
        {table: 4, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]},
        {table: 4, items: [{quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}, {quantity: 1, title: "Hamburger"}]}
      ]
    };
  }

  renderOrders() {
    // Returns every order stored in the components state as an individual Order component
    return this.state.orders.map((item, key) =>
      <Order key={key} id={key} order={item}/>
    );
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
