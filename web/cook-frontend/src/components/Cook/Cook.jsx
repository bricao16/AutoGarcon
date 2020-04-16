import React from "react";
import Orders from "./Orders"
import OrdersNavigation from "./OrdersNavigation.jsx";
import OrdersHeader from "./OrdersHeader.jsx";
import Alert from "./Alert.jsx";
import $ from "jquery";
import Button from 'react-bootstrap/Button';
import https from 'https';
import axios from 'axios';

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      orders: {},
      selectedOrder: 0,
      alertActive: false,
      alertContent: <></>,
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
      // 0 - 9
      } else if(key.which >= 49 && key.which <= 57){
        this.handleNumberKeyPress(key);
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

  handleNumberKeyPress(key){
    const number = key.which - 49;
    if(number < Object.keys(this.state.orders).length){
      this.changeSelectedOrder(number);
    }
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
    axios({
      method: 'get',
      // https://50.19.176.137:8001/orders/123
      // Dummy orders for testing: "https://my-json-server.typicode.com/palu3492/fake-rest-apis/orders"
      url: 'https://50.19.176.137:8001/orders/123',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then(res => res.data)
      .then(orders => {
        this.configureOrders(orders);
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/cook">
            <Redirect to="/cook/active" />
          </Route>
          <Route path="/cook/active">
            <div style={cookPageStyle}>
              <OrdersNavigation currentTab={this.state.currentTab} handleTabClick={this.changeCurrentTab.bind(this)}/>
              {this.renderAlert()}
              <div className="p-3">
                <OrdersHeader handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={this.markOrderComplete.bind(this)} />
                <Orders orders={this.state.orders} selectedOrder={this.state.selectedOrder} handleCardClick={this.changeSelectedOrder.bind(this)} />
              </div>
            </div>
          </Route>
          <Route path="/cook/completed">
            <div>Completed orders</div>
          </Route>
        </Switch>
      </Router>
    )
  }
}

const cookPageStyle = {
  backgroundColor: '#f1f1f1',
  width: '100vw'
};

export default Cook;