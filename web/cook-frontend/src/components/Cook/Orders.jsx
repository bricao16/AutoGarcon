import React from "react";
import Order from "./Order";
// import OrderDelete from "./OrderDelete";
import Container from 'react-bootstrap/Container';
// import $ from 'jquery';

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
      items: [
        {quantity: 1, title: "Stuffed Ziti Fritta", type: "Appetizers"},
        {quantity: 1, title: "Grilled Chicken", type: "Entrees"},
        {quantity: 1, title: "Hamburger", type: "Entrees"},
        {quantity: 1, title: "Spaghetti", type: "Entrees"},
      ]
    };
  }
  /*
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




  renderOrders() {
    // let i = {quantity: 1, title: "Stuffed Ziti Fritta", type: "Appetizers"};
    // let itemsByType = {
    //
    // };
    // this.state.items.forEach(item => {
    //   if(!(item.type in itemsByType)){
    //     itemsByType[item.type] = [];
    //   }
    //   itemsByType[item.type].push({quantity: item.quantity, title: item.title});
    // });
    // console.log(itemsByType);
    // Returns every order stored in the components state as an individual Order component
    let orderComponents = [];
    // let boxNumber = 1;
    // Object.keys(this.state.orders).forEach((key, index) => {
    //   // orderComponents.push( <Order key={index} boxNumber={boxNumber} order={this.state.orders[key]} /> );
    //   boxNumber++;
    // });
    let orders = [
      {
        order_num: 128971,
        table: 1,
        items: {
          Appetizers: [
            {
              quantity: 1,
              title: "Stuffed Ziti Fritta"
            }
          ],
          Entrees: [
            {
              quantity: 1,
              title: "Grilled Chicken"
            },
            {
              quantity: 2,
              title: "Hamburger"
            }
          ],
          Drinks: [
            {
              quantity: 1,
              title: "Coke"
            }
          ]
        }
       }
    ];
    for(let i = 0; i<12; i++){
      orderComponents.push(<Order key={i} cardId={i} order={orders[0]} />);
    }
    return orderComponents;
  }

  // Returns orders wrapped in a flexbox so each order wraps to the next line 
  // when necessary
  render() {
    return (
      <Container fluid className="p-3 d-flex flex-wrap">
        {this.renderOrders()}
        {/*{this.renderConfirmDelete()}*/}
      </Container>
    )
  };
}



export default Orders;
