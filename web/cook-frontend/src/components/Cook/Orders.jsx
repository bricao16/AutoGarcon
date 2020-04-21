import React from "react";
import Order from "./Order";
// import OrderDelete from "./OrderDelete";
import Container from 'react-bootstrap/Container';
// import $ from 'jquery';
import '../../assets/orders/order.css'

/*
  This component is used to render the orders for the Cook page.
  The orders are an array of object containing order details.  Look at the Order component for more details on the format of an order object.

  renderOrders is a helper function which takes all the orders,
  converts them to Order objects and returns a single JSX object that
  will be exported as an Orders
  component.
*/

class Orders extends React.Component{

  constructor(props) {
    super(props);
    this.state = {};
  }

  // Returns an <Order /> component for each order in props.orders
  renderOrders() {
    let orderComponents = [];
    let i = 0;
    Object.values(this.props.orders).forEach(order => {
      let isSelected = false;
      if(i === this.props.selectedOrder){
        isSelected = true;
      }
      orderComponents.push(<Order key={i} cardId={i} order={order} isSelected={isSelected} handleCardClick={this.props.handleCardClick}/>);
      i++;
    });
    return orderComponents;
  }

  // Returns orders wrapped in a flexbox so each order wraps to the next line 
  // when necessary
  render() {
    return (
      <Container fluid className="p-0 d-flex flex-wrap" id="orders" style={ordersStyle}>
        {this.renderOrders()}
        {/*{this.renderConfirmDelete()}*/}
      </Container>
    )
  };
}

const ordersStyle = {
  alignItems: 'flex-start',
  fontSize: '1.1em'
};

export default Orders;
