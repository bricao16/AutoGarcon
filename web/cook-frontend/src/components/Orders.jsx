import React from "react";
import Order from "./Order";
import OrderDelete from "./OrderDelete";
import Container from 'react-bootstrap/Container';
import $ from 'jquery';

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
        1: {order_num: 1, table: 1, confirmDelete: false, items: [{quantity: 1, title: "Grilled Chicken"}, {quantity: 1, title: "Hamburger"}, {quantity: 2, title: "Coke"}]}
      },
      confirmDelete: {
        show: false,
        cardId: 0
      }
    };
    this.setupClearOrder();
  }

  setupClearOrder(){
    $(document).keypress(this.clearOrder.bind(this));
  }

  clearOrder(e){
    // If confirm delete is showing
    if(this.state.confirmDelete.show){
      // If Yes
      let cardId = this.state.confirmDelete.cardId;
      if(e.key.toLowerCase() === 'y'){
        // Hide confirm delete dialog
        this.changeConfirmDelete(false, cardId);

        let ordersArray = Object.entries(this.state.orders);
        ordersArray.splice(cardId-1, 1);
        let ordersState = Object.fromEntries(ordersArray);
        this.setState({orders: ordersState});
      } else if(e.key.toLowerCase() === 'n'){
        this.changeConfirmDelete(false, cardId);
      }
    } else {
      // Confirm delete dialog is not showing
      let cardId = e.keyCode - 48;
      if(cardId > 0 && cardId <= 9 && cardId <= Object.keys(this.state.orders).length) {
        this.changeConfirmDelete(true, cardId);
      }
    }
  }

  changeConfirmDelete(show, id){
    let state = this.state;
    let key = Object.keys(state.orders)[id-1];
    if(show){
      state.orders[key].confirmDelete = true;
    } else {
      state.orders[key].confirmDelete = false;
    }
    state.confirmDelete.show = show;
    state.confirmDelete.cardId = id;

    this.setState(state);
  }

  renderConfirmDelete(){
    if(this.state.confirmDelete.show){
      return <OrderDelete cardId={this.state.confirmDelete.cardId}/>
    }
  }

  configureOrders(orders){
    console.log(orders);
    let ordersState = {};
    // Iterate over each order
    Object.values(orders).forEach(order => {
      // Check if that order_num exists
      if(order.order_num in ordersState){
        // Add to order using order_num
        ordersState[order.order_num].items.push({quantity: order.quantity, title: order.item_name})
      }else{
        // Create new order object
        ordersState[order.order_num] = {order_num: order.order_num, table: order.table, items: [{quantity: order.quantity, title: order.item_name}]}
      }
    });
    this.setState({orders: ordersState});
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
    let boxNumber = 1;
    Object.keys(this.state.orders).forEach((key, index) => {
      orderComponents.push( <Order key={index} boxNumber={boxNumber} order={this.state.orders[key]} /> );
      boxNumber++;
    });
    return orderComponents;
  }

  // Returns orders wrapped in a flexbox so each order wraps to the next line 
  // when necessary
  render() {
    return (
      <Container fluid style={{minHeight: '85vh', backgroundColor: '#f1f1f1'}}>
        <div className="d-flex flex-wrap">
          {this.renderOrders()}
        </div>
        {this.renderConfirmDelete()}
      </Container>
    )
  };
}

export default Orders;
