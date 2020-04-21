import React, { useState, useEffect, useRef } from 'react';
import Orders from "./Orders";
import Header from "./Header";
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';

function Body(props){

  const isMounted = useRef(true);
  // For canceling server request
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  // Cookies for getting user info
  const cookies = new Cookies();
  const restaurant_id = cookies.get("mystaff").restaurant_id;
  const [ordersPath, setGetUrl] = useState(null); // /orders/123 or /orders/complete/123
  const completedOrderUrl = process.env.REACT_APP_DB+'/orders/update'; // domain.com/orders/update
  const [completed, setCompleted] = useState(false); // if on completed tab, adds completed footer to each order
  // Switch between HTTP and HTTPS
  const serverUrl = process.env.REACT_APP_DB; // HTTPS: REACT_APP_HTTPS_DB HTTP: REACT_APP_DB

  // If path changes (because of switching tabs: active or complete)
  // or restaurant_id updates for some reason, the correct orders will be pulled from database
  useEffect(() => {
    if(props.path === '/active'){
      setGetUrl(`/orders/${restaurant_id}`);
      setCompleted(false);
    } else if (props.path === '/completed'){
      setGetUrl(`/orders/complete/${restaurant_id}`);
      setCompleted(true);
    }
  }, [props.path, restaurant_id]);

  // When orders database url changes, pull orders
  // Will happen when switching tabs
  useEffect(() => {
    getOrders();
  }, [ordersPath]);

  // Set up things for componentDidMount() componentWillUnmount()
  // Creates method to re-pull orders from database every 10 seconds
  useEffect(() => {
    // updates orders every 10 seconds
    const interval = setInterval(getOrders, 10000); // start interval after mounting
    // While unmounting do this
    return () => {
      isMounted.current = false;
      clearInterval(interval); // clear interval after unmounting
    }
  });

  // Holds orders from database in object
  const [orders, setOrders] = useState({});

  // Converts orders returned from database into object that can easily be turned into Order components
  function configureOrders(orders){
    if(typeof orders === 'object'){
      let ordersState = {};
      // Iterate over each order
      Object.values(orders).forEach(order => {
        // Check if that order_num exists
        if(!(order.order_num in ordersState)){
          // Create new order with empty items
          ordersState[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}, expand: false};
        }
        // If no category provided
        if(!order.category){
          order.category = 'Category';
        }
        if(!(order.category in ordersState[order.order_num].items)){
          ordersState[order.order_num].items[order.category] = [];
        }
        // Add item to order
        ordersState[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name});
      });
      setOrders(ordersState);
    } else {
      setOrders({})
    }
  }

  const [selectedOrder, setSelectedOrder] = useState(0);

  function changeSelectedOrder(cardId){
    // Check if cardId exists, 0 cards will result in cardId of null
    if(cardId < Object.keys(orders).length){
      setSelectedOrder(cardId);
    } else {
      cardId = null;
    }
  }

  // Get 'in progress' orders from db
  function getOrders(){
    // Null until calculated by effect hook
    if(ordersPath){
      const url = serverUrl + ordersPath;
      axios.get(url, {
        cancelToken: source.token
      })
        .then(res => res.data)
        .then(orders => {
          if(isMounted) {
            configureOrders(orders);
          } else {
            source.cancel('component unmounted');
          }
        })
        .catch(error =>{
        console.log('server request error');
        console.error(error);
      });
    }
  }

  function changeOrderStatus(status){
    const orderNum = Object.keys(orders)[selectedOrder];
    axios.post(completedOrderUrl,
      `order_num=${orderNum}&order_status=${status}`,
      {
        cancelToken: source.token
      })
      .then(() => {
        if(isMounted) {
          getOrders(); // grab orders from database
          changeSelectedOrder(0);
        } else {
          source.cancel('component unmounted');
        }
      })
      .catch(error =>{
        console.log('post request error');
        console.error(error);
      });
  }
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
  function renderOrders(){
    // Check if there are orders in orders, if not just write 'No orders'
    if(Object.keys(orders).length) {
      return <Orders orders={orders} selectedOrder={selectedOrder} handleCardClick={changeSelectedOrder}
                     completed={completed}/>;
    }
    let string = completed ? "No completed orders" : "No active orders";
    return <p>{string}</p>
  }

  return (
    <div className="p-3">
      <Header handleStatusChangeClick={changeOrderStatus} path={props.path} />
      {/*<Header handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={markOrderComplete} />*/}
      {renderOrders()}
    </div>
  )
}

export default Body;