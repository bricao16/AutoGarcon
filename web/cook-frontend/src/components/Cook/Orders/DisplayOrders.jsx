import React, {useRef, useState} from "react";
import Cookies from 'universal-cookie';
import {makeStyles, Container} from '@material-ui/core'
import {useTheme} from "@material-ui/core/styles";

import Orders from "./Orders";

const useStyles = makeStyles(theme => ({
  main: {
    padding: theme.spacing(3,3)
  }
}));

function DisplayOrders(){

  const theme = useTheme();
  const classes = useStyles(theme);

  const cookies = new Cookies();
  const restaurant_id = cookies.get('mystaff').restaurant_id;
  const serverUrl = process.env.REACT_APP_DB;
  const ordersPath = useRef(null);
  const completedOrderUrl = serverUrl + '/orders/update';
  const [completed, setCompleted] = useState(false);
  const [orders, setOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    if(Object.keys(orders).length) {
      return <Orders orders={orders} selectedOrder={selectedOrder} handleCardClick={changeSelectedOrder} completed={completed}/>;
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