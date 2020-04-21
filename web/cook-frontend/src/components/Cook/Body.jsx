import React, { useState, useEffect } from 'react';
import Orders from "./Orders";
import Header from "./Header";
import https from 'https';
import axios from 'axios';

function Body(props){

  const [getUrl, setGetUrl] = useState('/orders/123');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if(props.path === '/active'){
      setGetUrl('/orders/123');
      setCompleted(false);
    } else if (props.path === '/completed'){
      setGetUrl('/orders/complete/123');
      setCompleted(true);
    }
  }, [props.path]);

  useEffect(() => {
    updateOrders();
  }, [getUrl]);

  useEffect(() => {
    // updates orders every 10 seconds
    const interval = setInterval(updateOrders, 10000); // start interval after mounting
    return () => clearInterval(interval); // clear interval after unmounting
  }, []);

  // Get In Progress orders from database
  function updateOrders(){
    console.log('updating orders');
    serverRequest(
      'get',
      getUrl,
      '',
      configureOrders
    );
  }

  const [orders, setOrders] = useState({});

  function configureOrders(orders){
    // console.log(orders);
    let ordersState = {};
    if(orders === undefined){
      console.log('no orders');
      return;
    }
    orders = orders.data;
    // Iterate over each order
    Object.values(orders).forEach(order => {
      // console.log(order);
      // Check if that order_num exists
      if(!(order.order_num in ordersState)){
        // Create new order with empty items
        ordersState[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}, expand: false};
      }
      // If no category provided, mark as Entree
      if(!order.category){
        order.category = 'Entrees';
      }
      if(!(order.category in ordersState[order.order_num].items)){
        ordersState[order.order_num].items[order.category] = [];
      }
      // Add item to order
      ordersState[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name});
    });
    setOrders(ordersState);
  }

  const [selectedOrder, setSelectedOrder] = useState(0);

  function changeSelectedOrder(cardId){
    setSelectedOrder(cardId);
  }

  function changeOrderStatus(status){
    const orderNum = Object.keys(orders)[selectedOrder];
    serverRequest(
      'post',
      '/orders/update',
      `order_num=${orderNum}&order_status=${status}`,
      () => {
        updateOrders(); // grab orders from database
        changeSelectedOrder(0);
      }
    );
  }

  function serverRequest(method, path, data, responseCallback){
    // _isMounted = false;
    // this._isMounted = true;
    // this.axiosCancelSource = axios.CancelToken.source();
    axios({
      method: method,
      url: process.env.REACT_APP_DB + path,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
      .then((res) => {
        // if (this._isMounted) {
          // abort request if not mounted
        responseCallback(res);
      })
      .catch(error =>{
        alert('server error');
        console.error(error);
      });
  }
  /*
  componentWillUnmount () {
    this._isMounted = false;
    console.log('unmount component')
    this.axiosCancelSource.cancel('Component unmounted.')
  }
  */
  /*
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

  toggleExpandOrder(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let newState = this.state;
    newState.orders[orderNum].expand = !newState.orders[orderNum].expand;
    this.setState(newState);
  }
  */

  return (
    <div className="p-3">
      <Header handleStatusChangeClick={changeOrderStatus} path={props.path} />
      {/*<Header handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={markOrderComplete} />*/}
      <Orders orders={orders} selectedOrder={selectedOrder} handleCardClick={changeSelectedOrder} completed={completed}/>
    </div>
  )
}

export default Body;