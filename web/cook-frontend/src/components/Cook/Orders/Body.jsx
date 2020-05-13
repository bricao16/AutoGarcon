import React, { useState, useEffect, useRef } from 'react';
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
// Material UI
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {makeStyles, Button, Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

import Toolbar from "./Toolbar";
import OrderCards from "./OrderCards";
import CustomDialog from "./CustomDialog";
// Icons
import DoneIcon from '@material-ui/icons/Done';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import RestoreIcon from '@material-ui/icons/Restore';
// import $ from "jquery"; will be used in future

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  const ordersEndpointRef = useRef('');
  const markCompletedEndpoint = serverUrl + '/orders/update';
  // if on completed tab
  // const [completed, setCompleted] = useState(false);
  // Holds orders from database in object
  const [orders, setOrders] = useState({});

  const [selectedCard, setSelectedCard] = useState(0);

  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [severity, setSeverity] = useState("");

  // Holds time interval for updating orders from database
  const getOrdersInterval = useRef();

  // When ordersEndpoint prop changes, update ordersEndpoint state variable
  // useEffect(() => {
  //   setOrdersEndpoint(serverUrl + props.ordersEndpoint + restaurant_id);
  // }, [props.ordersEndpoint]);

  // When ordersEndpoint state changes, get orders from database using changed endpoint
  useEffect(() => {
    const ordersEndpoint = serverUrl + props.ordersEndpoint + restaurant_id;
    ordersEndpointRef.current = ordersEndpoint;
    getDatabaseOrders(ordersEndpoint);
  }, [props.ordersEndpoint]);


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
  // useEffect(() => {
  //   getDatabaseOrders();
  // }, []);

  // Set up things for componentDidMount() componentWillUnmount()
  // Creates method to re-pull orders from database every 10 seconds
  useEffect(() => {
    // setupKeyPresses(); <- This will be added in the future
    // updates orders every 10 seconds
    // start interval after mounting
    getOrdersInterval.current = setInterval(() => getDatabaseOrders(ordersEndpointRef.current), 1000);

    // While unmounting do this
    return () => {
      clearInterval(getOrdersInterval.current); // clear interval after unmounting
    }
  }, []);



  // Get 'in progress' orders from db
  function getDatabaseOrders(ordersEndpoint){
    // Null until calculated by effect hook
    if(ordersEndpoint !== ''){
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
        if(!order.category) {
          order.category = 'Category';
        }
        // if(order.customization) {
        //   order.customization = order.customization.split(";").filter(string => {
        //     return string.trim() !== '';
        //   });
        // }
        if(!(order.category in orders[order.order_num].items)){
          orders[order.order_num].items[order.category] = [];
        }
        // Add item to order
        orders[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name, customization: order.customization});
      });
    }
    setOrders(orders);
  }

  function orderClicked(cardId){
    changeSelectedOrder(cardId);
  }


  function changeSelectedOrder(cardId){
    // Check if cardId exists, 0 cards will result in cardId of null
    if(0 <= cardId && cardId < Object.keys(orders).length){
      setSelectedCard(cardId);
    } else {
      setSelectedCard(null);
    }
  }

  function changeOrderStatus(status){
    if(selectedCard !== null){
      const orderNum = Object.keys(orders)[selectedCard];
      const data = 'order_num=' + orderNum + '&order_status=' + status;
      axios.post(markCompletedEndpoint,
      data,
        {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        })
       .then(() => {
         getDatabaseOrders(); // grab updated orders from database
         showPopup(orderNum, status);
         changeSelectedOrder(0);
       })
       .catch(error =>{
         console.log('post request error');
         console.error(error);
       });
    }
  }

  function showPopup(orderNum, status){
    const severity = {"Completed": "success", "In Progress": "info"};
    const text = "Order #" + orderNum + " marked " + status.toLowerCase();
    setOpen(true);
    setAlertText(text);
    setSeverity(severity[status]);
  }
  function handlePopupClose(){
    setOpen(false);
  }
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
*/

  function toggleExpandOrder(){
    const newOrders = {...orders};
    const orderNum = Object.keys(newOrders)[selectedCard];
    newOrders[orderNum].expand = !newOrders[orderNum].expand;
    setOrders(newOrders);
  }


  function toolbarButtons(){
    let buttons = [];
    if(props.tab === "completed"){
      buttons.push(
        <Button key={2} variant="contained" color="primary" className={classes.button}
                onClick={()=>changeOrderStatus('In Progress')} startIcon={<RestoreIcon/>}>Restore</Button>
      );
    } else {
      buttons.push(
        <Button key={0} variant="contained" color="primary" className={classes.button}
                onClick={()=>changeOrderStatus('Complete')} startIcon={<CheckCircleOutlineIcon/>}>Completed</Button>
      );
    }
    buttons.push(
      <Button key={1} variant="contained" color="primary" className={classes.button}
              onClick={toggleExpandOrder} startIcon={<AspectRatioIcon/>}>Expand</Button>
    );
    return buttons;
  }

  return (
    <ThemeProvider theme={theme}>

      <Snackbar open={open} autoHideDuration={3000} onClose={handlePopupClose}>
        <Alert severity={severity}>
          {alertText}
        </Alert>
      </Snackbar>

      <CustomDialog orderNum={123}/>


      <div className={classes.main}>
        <div className={classes.toolbarContainer} >
          <Toolbar buttons={toolbarButtons()}/>
        </div>
        <div className={classes.separator}/>
        <div className={classes.cardsContainer} >
          <OrderCards orders={orders} handleOrderClick={orderClicked} selectedCard={selectedCard} isCompleted={props.tab === "completed"}/>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Body;