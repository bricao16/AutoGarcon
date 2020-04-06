import React from "react";
import Order from "./Order";
// import OrderDelete from "./OrderDelete";
import Container from 'react-bootstrap/Container';
// import $ from 'jquery';
import '../../assets/order.css'

class Orders extends React.Component{
  /*
    This component is used to render the orders for the Cook page.
    The orders are an array of object containing order details.  Look at the Order component for more details on the format of an order object.

    renderOrders is a helper function which takes all the orders,
    converts them to Order objects and returns a single JSX object that
    will be exported as an Orders
    component.
  */
  constructor(props) {
    super(props);
    this.state = {
      // confirmDelete: {
      //   show: false,
      //   cardId: 0
      // }
    };
  }




  /*


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
    state.orders[key].confirmDelete = show;
    state.confirmDelete.show = show;
    state.confirmDelete.cardId = id;

    this.setState(state);
  }

  renderConfirmDelete(){
    if(this.state.confirmDelete.show){
      return <OrderDelete cardId={this.state.confirmDelete.cardId}/>
    }
  }
  */



  // Returns an <Order /> component for each order in props.orders
  renderOrders() {
    let orderComponents = [];
    let i = 0;
    Object.values(this.props.orders).forEach(order => {
      let isSelected = false;
      if(i === this.props.selectedOrder){
        isSelected = true;
      }
      orderComponents.push(<Order key={i} cardId={i} order={order} selectedOrder={isSelected} handleCardClick={this.props.handleCardClick}/>);
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
  alignItems: 'flex-start'
};

export default Orders;
