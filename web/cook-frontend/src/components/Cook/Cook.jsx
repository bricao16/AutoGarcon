import React from "react";
import Orders from "./Orders"
import OrdersMenu from "./OrdersMenu.jsx";
import OrdersHeader from "./OrdersHeader.jsx";

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {orders:{}}
  }

  configureOrders(orders){
    console.log(orders);
    let ordersState = {};
    // Iterate over each order
    Object.values(orders).forEach(order => {
      // Check if that order_num exists
      if(!(order.order_num in ordersState)){
        // Create new order with empty items
        ordersState[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}};
      }
      // Add item to order
      ordersState[order.order_num].items.push({quantity: order.quantity, title: order.item_name})
    });
    this.setState({orders: ordersState});
    console.log(ordersState);
  }

  componentDidMount() {
    // Get current orders from database
    fetch("http://50.19.176.137:8000/orders/123")
      .then(res => res.json())
      .then(orders => {
        // this.configureOrders(orders);
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <div style={cookPageStyle}>
        {/*<OrdersMenu />*/}
        <div className="p-3">
          <OrdersHeader />
          <Orders orders={this.state.orders}/>
        </div>
      </div>
    )
  }
}

const cookPageStyle = {
  backgroundColor: '#f1f1f1',
  minHeight: '100%',
  width: '100vw'
};

export default Cook;