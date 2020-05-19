import React, { useState, useEffect, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect'
import https from 'https';
import axios from 'axios';
import Cookies from 'universal-cookie';
// Material UI
import {createMuiTheme, ThemeProvider, useTheme} from "@material-ui/core/styles";
import {makeStyles, Button, Snackbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

import Toolbar from "./Toolbar";
import OrderCards from "./OrderCards";
import CustomDialog from "./CustomDialog";
// Icons
//import DoneIcon from '@material-ui/icons/Done';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import RestoreIcon from '@material-ui/icons/Restore';
import {forEach} from "react-bootstrap/cjs/ElementChildren";
// import $ from "jquery"; will be used in future

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  main: {
    margin: theme.spacing(3)
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

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       main: '#fff111',
//     }
//   },
// });

const universalCookies = new Cookies();

function Body(props){
  const theme = useTheme();
  const classes = useStyles(theme);

  // Cookies for getting user info
  const cookies = {
    token: universalCookies.get('mytoken'),
    staff: universalCookies.get('mystaff'),
  };
  // restaurant id obtained from logged in user's cookies
  const restaurant_id = universalCookies.get('mystaff').restaurant_id;
  // Switch between HTTP and HTTPS
  const serverUrl = process.env.REACT_APP_DB;
  // either /orders/ or /orders/complete/
  const ordersEndpointRef = useRef('');
  const markCompletedEndpoint = serverUrl + '/orders/update';
  // if on completed tab
  // const [completed, setCompleted] = useState(false);
  // Holds orders from database in object
  const [orders, setOrders] = useState({});
  const [updatedOrders, setUpdatedOrders] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  const [selectedCard, setSelectedCard] = useState(0);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const dialogCallback = useRef(()=>{});

  // Holds time interval for updating orders from database
  const getOrdersInterval = useRef();

  const completedTab = useRef(false);


  // When ordersEndpoint props changes, get orders from database using changed endpoint
  useEffect(() => {
    completedTab.current = props.tab === 'completed';

    const ordersEndpoint = serverUrl + props.ordersEndpoint + restaurant_id;
    ordersEndpointRef.current = ordersEndpoint;
    getDatabaseOrders();
  }, [props.ordersEndpoint]);

  // Set up things for componentDidMount() componentWillUnmount()
  // Creates method to re-pull orders from database every 10 seconds
  useEffect(() => {
    // updates orders every 10 seconds
    // start interval after mounting
    getOrdersInterval.current = setInterval(() => getDatabaseOrders(), 10000);

    // While unmounting do this
    return () => {
      clearInterval(getOrdersInterval.current); // clear interval after unmounting
    }
  }, []);



  // Get 'in progress' orders from db
  function getDatabaseOrders(){
    // Null until calculated by effect hook
    if(ordersEndpointRef.current !== ''){
      axios.get(ordersEndpointRef.current, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + cookies.token
        },
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
    let newOrders = {};
    if(typeof databaseOrders === 'object'){
      // Iterate over each order
      Object.values(databaseOrders).forEach(order => {
        // Check if that order_num exists
        if(!(order.order_num in newOrders)){
          // Create new order with empty items
          newOrders[order.order_num] = {order_num: order.order_num, table: order.table, order_date: order.order_date, items: {}};
        }
        // If no category provided
        if(!order.category) {
          order.category = 'Category';
        }
        if(order.customization) {
          order.customization = order.customization.split(";").filter(string => {
            return string.trim() !== '';
          });
        }
        if(!(order.category in newOrders[order.order_num].items)){
          newOrders[order.order_num].items[order.category] = [];
        }
        // Add item to order
        if(order.customization){
          let i;
          for(i = 0; i < order.customization.length; i++){
            newOrders[order.order_num].items[order.category].push({quantity: 1, title: order.item_name, customization: order.customization[i]});
          }
          if(order.quantity - i > 0){
            newOrders[order.order_num].items[order.category].push({quantity: order.quantity - i, title: order.item_name});
          }
        } else {
          newOrders[order.order_num].items[order.category].push({quantity: order.quantity, title: order.item_name, customization: order.customization});
        }
      });
    }
    setUpdatedOrders(newOrders);
  }

  useDeepCompareEffect(() => {
    if(updatedOrders !== orders){
      setOrders({});
      setOrders(updatedOrders);
      changeSelectedOrder(0);
    }
  }, [updatedOrders]);

  function orderClicked(cardId){
    changeSelectedOrder(cardId);
  }

  function changeSelectedOrder(cardId){
    // Check if cardId exists, 0 cards will result in cardId of null
    if(0 <= cardId && cardId < Object.keys(orders).length){
      setSelectedCard(cardId);
    } else {
      setSelectedCard(0);
    }
  }

  function getOrderNum(){
    if(Object.keys(orders).length > 0) {
      return Object.keys(orders)[selectedCard];
    }
    return null;
  }

  function changeOrderStatus(status){
    const orderNum = getOrderNum();
    if(orderNum !== null){
      const newExpandedOrders = {...expandedOrders};
      newExpandedOrders[orderNum] = false;
      setExpandedOrders(newExpandedOrders);
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
       .then((r) => {
         if(r.status === 200){
           getDatabaseOrders(); // grab updated orders from database
           showNotificationNow(orderNum, status);
         }
       })
       .catch(error =>{
         console.log('post request error');
         console.error(error);
       });
    }
  }

  function restoreOrder(){
    if(Object.keys(orders).length > 0){
      setShowDialog(true);
      dialogCallback.current = (confirm) => {
        setShowDialog(false);
        if(confirm === true) {
          changeOrderStatus('In Progress');
        }
      };
    }
  }

  function showNotificationNow(orderNum, status){
    const severity = {"Complete": "success", "In Progress": "info"};
    setNotificationSeverity(severity[status]);
    const text = "Order #" + orderNum + " marked " + status.toLowerCase();
    setNotificationText(text);
    setShowNotification(true);
  }
  function handlePopupClose(){
    setShowNotification(false);
  }

  function toggleExpandOrder(){
    const newExpandedOrders = {...expandedOrders};
    const orderNumber = getOrderNum();
    if(orderNumber){
      if(newExpandedOrders[orderNumber]){
        newExpandedOrders[orderNumber] = false;
      } else {
        newExpandedOrders[orderNumber] = true;
      }
      setExpandedOrders(newExpandedOrders);
      console.log(newExpandedOrders);
    }
  }

  function toolbarButtons(){
    let buttons = [];
    if(completedTab.current){
      buttons.push(
        <Button key={2} variant="contained" color="primary" className={classes.button}
                onClick={restoreOrder} startIcon={<RestoreIcon/>}>Restore</Button>
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
    <div>

      <Snackbar open={showNotification} autoHideDuration={3000} onClose={handlePopupClose}>
        <Alert severity={notificationSeverity}>
          {notificationText}
        </Alert>
      </Snackbar>

      <CustomDialog orderNum={getOrderNum()} openDialog={showDialog} callback={dialogCallback.current}/>


      <div className={classes.main}>
        <div className={classes.toolbarContainer} >
          <Toolbar buttons={toolbarButtons()}/>
        </div>
        <div className={classes.separator}/>
        <div>
          <OrderCards orders={orders} handleOrderClick={orderClicked} expandedOrders={expandedOrders} selectedCard={selectedCard} isCompleted={completedTab.current}/>
        </div>
      </div>

    </div>
  )
}

export default Body;