import React from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Container} from 'react-bootstrap';

import OrderCard from "./OrderCard";

import '../../assets/orders/order.css'


/*
  This component is used to render the orders for the Cook page.
  It is passed in an array of orders and renders each one by iterating over them.
  Each order contains an order id, table number, time order placed, time since order placed, and all the items in the order.
  Each order is rendered as an Order component.

  renderOrders is a helper function which takes all the orders,
  converts them to Order objects and returns a single JSX object that
  will be exported as an Orders
  component.
*/

const useStyles = makeStyles((theme) => ({
  main: {
    alignItems: 'flex-start',
    fontSize: '1.1em'
  }
}));

function OrdersContainer(){

  const theme = useTheme();
  const classes = useStyles(theme);
  
  // Returns an <Order /> component for each order in props.orders
  function renderOrders() {
    let orderComponents = [];
    let i = 0;
    Object.values(this.props.orders).forEach(order => {
      let isSelected = false;
      if(i === this.props.selectedOrder){
        isSelected = true;
      }
      orderComponents.push(<OrderCard key={i} cardId={i} order={order} isSelected={isSelected} handleCardClick={this.props.handleCardClick} isCompleted={this.props.completed} />);
      i++;
    });
    return orderComponents;
  }

  return (
    <Container fluid className="p-0 d-flex flex-wrap" id="orders" style={classes.main}>
      {/*{this.renderOrders()}*/}
      {/* {this.renderConfirmDelete()} */}
    </Container>
  );
}

export default OrdersContainer;
