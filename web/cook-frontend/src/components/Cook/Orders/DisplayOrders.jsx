import React, {useEffect, useRef, useState} from "react";
import Cookies from 'universal-cookie';
import {makeStyles, Container} from '@material-ui/core'
import {useTheme} from "@material-ui/core/styles";

// import Orders from "./Orders";
import axios from "axios";
import https from "https";
import Order from "./Order";

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    padding: theme.spacing(3,3)
  }
}));

function DisplayOrders(){

  const theme = useTheme();
  const classes = useStyles(theme);

  const cookies = new Cookies();
  const restaurant_id = cookies.get('mystaff').restaurant_id;
  const serverUrl = process.env.REACT_APP_DB;

  const completedOrderUrl = serverUrl + '/orders/update';

  const [ordersPath, setOrdersPath] = useState('/orders/'+restaurant_id);
  const [orders, setOrders] = useState({});

  const [completed, setCompleted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getDatabaseOrders();
  }, []);

  // Get 'in progress' orders from db
  function getDatabaseOrders(){
    // Null until calculated by effect hook
    console.log(ordersPath);
    if(ordersPath){
      const url = serverUrl + ordersPath;
      console.log('Fetching ' + url);
      axios.get(url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        })
      })
        .then(res => res.data)
        .then(orders => {
          configureOrders(orders);
        })
        .catch(error =>{
          console.log('server request error');
          console.error(error);
        });
    }
  }

  // Converts orders returned from database into object that can easily be turned into Order components
  function configureOrders(ordersFromDatabase){
    if(typeof ordersFromDatabase === 'object'){
      let ordersState = {};
      // Iterate over each order
      Object.values(ordersFromDatabase).forEach(order => {
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
      // save orders in orders state
      setOrders(ordersState);
    } else {
      // set orders state to empty because return from database was empty or invalid
      setOrders({})
    }
  }

  function changeSelectedOrder(cardId){
    // Check if cardId exists, 0 cards will result in cardId of null
    if(cardId >=0 && cardId < Object.keys(orders).length){
      setSelectedOrder(cardId);
    } else {
      cardId = null;
    }
  }

  function renderOrders(){
    // Check if there are orders in orders, if not just write 'No orders'
    let orderComponents = [];
    if(Object.keys(orders).length) {
      let i = 0;
      Object.values(orders).forEach(order => {
        orderComponents.push(<Order key={i} cardId={i} order={order} />);
        i++;
      });
      return orderComponents;
    }
    let string = completed ? "No completed orders" : "No active orders";
    return <p>{string}</p>
  }

  return(
    <Container maxWidth={false} className={classes.main}>
      { renderOrders() }
    </Container>
  )
}

export default DisplayOrders;