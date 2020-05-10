import React, { useState, useEffect, useRef } from 'react';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import Toolbar from "./Toolbar";
import OrderCards from "./OrderCards";
import {makeStyles, Button} from "@material-ui/core";
// import $ from "jquery"; will be used in future

const useStyles = makeStyles((theme) => ({
  main: {
    margin: theme.spacing(3)
  },
  cardsContainer: {

  },
  toolbarContainer:{

  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(3)
  },
  separator: {
    margin: theme.spacing(3, 0),
    borderBottom: "solid 2px #7e7e7e66"
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0b658a',
    }
  },
});


function Body(props){

  const classes = useStyles(theme);

  // says where react is in lifecycle, mounted or not
  // const isMounted = useRef(true);
  // For canceling server request
  // const CancelToken = axios.CancelToken;
  // const source = CancelToken.source();
  // Cookies for getting user info
  const cookies = new Cookies();
  // restaurant id obtained from logged in user's cookies
  const restaurant_id = cookies.get('mystaff').restaurant_id;
  // Switch between HTTP and HTTPS
  const serverUrl = process.env.REACT_APP_DB;
  // either /orders/ or /orders/complete/
  const [ordersEndpoint, setOrdersEndpoint] = useState(serverUrl + '/orders/' + restaurant_id);
  const markCompletedEndpoint = serverUrl + '/orders/update';
  // if on completed tab
  // const [completed, setCompleted] = useState(false);
  // Holds orders from database in object
  const [orders, setOrders] = useState({});

  const [selectedCard, setSelectedCard] = useState(null);

  // If path changes (because of switching tabs: active or complete)
  // or restaurant_id updates for some reason, the correct orders will be pulled from database
  // useEffect(() => {
  //   if(props.path === '/active'){
  //     ordersPath.current = '/orders/' + restaurant_id;
  //     setCompleted(false);
  //   } else if (props.path === '/completed'){
  //     ordersPath.current = '/orders/complete/' + restaurant_id;
  //     setCompleted(true);
  //   }
  // }, [props.path, restaurant_id]);

  // When orders database url changes, pull orders
  // Will happen when switching tabs
  useEffect(() => {
    getDatabaseOrders();
    changeSelectedOrder(0);
  }, );

  // Set up things for componentDidMount() componentWillUnmount()
  // Creates method to re-pull orders from database every 10 seconds
  // useEffect(() => {
  //   // setupKeyPresses(); <- This will be added in the future
  //   // updates orders every 10 seconds
  //   const interval = setInterval(getOrders, 10000); // start interval after mounting
  //   // While unmounting do this
  //   return () => {
  //     isMounted.current = false;
  //     clearInterval(interval); // clear interval after unmounting
  //   }
  // }, []);



  // Get 'in progress' orders from db
  function getDatabaseOrders(){
    // Null until calculated by effect hook
    axios.get(ordersEndpoint, {
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

  // Converts orders returned from database into object that can easily be turned into Order components
  function configureOrders(databaseOrders){
    let orders = {};
    if(typeof databaseOrders === 'object'){
      // Iterate over each order
      Object.values(databaseOrders).forEach(order => {
        // Check if that order_num exists
        if(!(order.order_num in orders)){
          // Create new order with empty items
          orders[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}, expand: false};
        }
        // If no category provided
        if(!order.category){
          order.category = 'Category';
        }
        if(!(order.category in orders[order.order_num].items)){
          orders[order.order_num].items[order.category] = [];
        }
        // Add item to order
        orders[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name});
      });
    }
    setOrders(orders);
  }

  function orderClicked(){

  }


  function changeSelectedOrder(cardId){
    // Check if cardId exists, 0 cards will result in cardId of null
    if(0 <= cardId && cardId < Object.keys(orders).length){
      setSelectedCard(cardId);
    }
  }
  /*
   function changeOrderStatus(status){
     if(selectedOrder !== null){
       const orderNum = Object.keys(orders)[selectedOrder];
       console.log('Changing order ' + orderNum + ' to ' + status + ', post to ' + completedOrderUrl);
       const data = 'order_num=' + orderNum + '&order_status=' + status;
       axios.post(completedOrderUrl,
         data,
         {
           httpsAgent: new https.Agent({
             rejectUnauthorized: false,
           }),
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded'
           },
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
   }
   */
  // The following features will be added in the future
  /*
  function setupKeyPresses(){
    $(document).keydown(key => {
      // Arrow keys right and left
      // for changing selected order
      if(key.which === 37 || key.which === 39){
        handleArrowKeyPress(key);
      // c - marking order complete
      } else if(key.which === 67){
        // If on active orders tab
        if(!completed){
          changeOrderStatus('Complete');
        }
      // r - restore order to status 'In Progress'
      } else if(key.which === 82){
        // If on completed orders tab
        if(completed){
          changeOrderStatus('In Progress');
        }
      // e - this will be added back later
      // } else if(key.which === 69){
      //   this.toggleExpandOrder();
      // 0 - 9 - pressing number to change selected order
      } else if(key.which >= 49 && key.which <= 57){
        handleNumberKeyPress(key);
      }
    });
  }

  function handleArrowKeyPress(key){
    // get current selected order
    let newSelectedOrder = selectedOrder;
    // console.log(newSelectedOrder);
    if (key.which === 37) {
      newSelectedOrder -= 1;
    } else if (key.which === 39) {
      newSelectedOrder += 1;
    }
    const ordersLength = Object.keys(orders).length;
    if (newSelectedOrder >= ordersLength) {
      newSelectedOrder = 0;
    } else if (newSelectedOrder < 0) {
      newSelectedOrder = ordersLength - 1;
    }
    changeSelectedOrder(newSelectedOrder);
  }

  function handleNumberKeyPress(key){
    const newSelectedOrder = key.which - 49;
    changeSelectedOrder(newSelectedOrder);
  }

  toggleExpandOrder(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let newState = this.state;
    newState.orders[orderNum].expand = !newState.orders[orderNum].expand;
    this.setState(newState);
  }
  */

  function toolbarButtons(){
    return [
      <Button key={0} variant="contained" color="primary" className={classes.button}>Completed</Button>,
      <Button key={1} variant="contained" color="primary" className={classes.button}>Expand</Button>,
    ];
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.main}>
        {/*<OrdersHeader handleStatusChangeClick={changeOrderStatus} path={props.path} />*/}
        {/*<Header handleExpandClick={this.toggleExpandOrder.bind(this)} handleCompleteClick={markOrderComplete} />*/}
        <div className={classes.toolbarContainer} >
          <Toolbar buttons={toolbarButtons()}/>
        </div>
        <div className={classes.separator}/>
        <div className={classes.cardsContainer} >
          <OrderCards orders={orders} handleOrderClick={orderClicked} selectedCard={selectedCard}/>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Body;