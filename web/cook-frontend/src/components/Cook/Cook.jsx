import React from "react";
import Orders from "./Orders"
import OrdersMenu from "./OrdersMenu.jsx";
import OrdersHeader from "./OrdersHeader.jsx";
import Alert from "./Alert.jsx";
import $ from "jquery";
import Button from 'react-bootstrap/Button';

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      orders: {},
      selectedOrder: 0,
      alertActive: false,
      alertContent: <div></div>,
      currentTab: 0
    };
    this.setupKeyPresses();
  }

  setupKeyPresses(){
    $(document).keydown(key => {
      // Arrow keys right and left
      if(key.which === 37 || key.which === 39){
        this.handleArrowKeyPress(key);
      // c
      } else if(key.which === 67){
        this.markOrderComplete();
      // e
      } else if(key.which === 69){
        this.toggleExpandOrder();
      }
    });
  }

  handleArrowKeyPress(key){
    let newSelectedOrder = this.state.selectedOrder;
    if(key.which === 37){
      newSelectedOrder -= 1;
    } else if (key.which === 39){
      newSelectedOrder += 1;
    }
    const ordersLength = Object.keys(this.state.orders).length;
    if(newSelectedOrder >= ordersLength){
      newSelectedOrder = 0;
    } else if(newSelectedOrder < 0){
      newSelectedOrder = ordersLength-1;
    }
    this.changeSelectedOrder(newSelectedOrder);
  }

  changeSelectedOrder(cardId){
    let newState = this.state;
    newState.selectedOrder = cardId;
    this.setState(newState);
  }

  toggleExpandOrder(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let newState = this.state;
    newState.orders[orderNum].expand = !newState.orders[orderNum].expand;
    this.setState(newState);
  }

  markOrderComplete(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let state = this.state;
    state.alertActive = true;
    state.alertContent =
      <div>
        <div>Order #{orderNum} marked complete. No API yet.</div>
        <Button variant="secondary" size="sm" className="mt-3" onClick={this.deactivateAlert.bind(this)}>Okay</Button>
      </div>;
    this.setState(state);
  }

  deactivateAlert(){
    let state = this.state;
    state.alertActive = false;
    state.alertContent = <div></div>;
    this.setState(state);
  }

  changeCurrentTab(tab){
    let state = this.state;
    state.currentTab = tab;
    this.setState(state);
  }

  renderAlert(){
    if(this.state.alertActive){
      return <Alert alert={this.state.alertContent}/>
    }
  }

  configureOrders(orders){
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
      if(!(order.category in ordersState[order.order_num].items)){
        ordersState[order.order_num].items[order.category] = [];
      }
      // Add item to order
      ordersState[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name});
    });
    let newState = this.state;
    newState.orders = ordersState;
    this.setState(newState);
  }

  componentDidMount() {
    // Get current orders from database
    // http://50.19.176.137:8000/orders/123
    fetch("https://my-json-server.typicode.com/palu3492/fake-rest-apis/orders")
      .then(res => res.json())
      .then(orders => {
        this.configureOrders(orders);
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div style={cookPageStyle}>
        <OrdersMenu currentTab={this.state.currentTab} handleTabClick={this.changeCurrentTab.bind(this)}/>
        {this.renderAlert()}
        <div className="p-3">
          <OrdersHeader handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={this.markOrderComplete.bind(this)} />
          <Orders orders={this.state.orders} selectedOrder={this.state.selectedOrder} handleCardClick={this.changeSelectedOrder.bind(this)} />
        </div>
      </div>
    )
  }
}

const cookPageStyle = {
  backgroundColor: '#f1f1f1',
  width: '100vw'
};

export default Cook;