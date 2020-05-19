import React, {useEffect, useRef, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import axios from "axios";
import https from "https";

import Header from "./Header";
import Footer from "./Footer";
import Orders from "./Orders/Orders";
import ServiceRequests from "./Service/ServiceRequests";
import useDeepCompareEffect from "use-deep-compare-effect";
import MuiAlert from "@material-ui/lab/Alert";
import {Snackbar} from "@material-ui/core";

const useStyles = makeStyles({
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // background: '#fafafa'
  },
  content: {
    flex: 1
  }
});

const universalCookies = new Cookies();

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Cook() {

  const theme = useRef();
  const classes = useStyles();

  const cookies = {
    token: universalCookies.get('mytoken'),
    staff: universalCookies.get('mystaff')
  };

  const verified = useRef(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});

  const [serviceData, setServiceData] = useState({});
  const [updatedServiceData, setUpdatedServiceData] = useState({});
  const getServiceDataInterval = useRef();

  const [showNotification, setShowNotification] = useState(false);
  const vertical = 'bottom', horizontal = 'left';

  // Verify user is a manager or cook
  useEffect(() => {
    verifyCook(cookies.token).then(res => {
      verified.current = res;
      setVerificationComplete(true);
    });
  }, []);

  useEffect(() => {
    if(verified.current){
      getRestaurantData();
      getServiceData();
    }
  }, [verificationComplete]);


  useEffect(() => {
    if(restaurantData.restaurant) {
      setupTheme();
    }
  }, [restaurantData]);

  function getRestaurantData(){
    const url = process.env.REACT_APP_DB + '/restaurant/' + cookies.staff.restaurant_id;
    axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      })
    })
      .then(res => res.data)
      .then(data => {
        setRestaurantData(data);
        setLoading(false);
      })
      .catch(error =>{
        console.error(error);
      });
  }

  function setupTheme(){
    const data = restaurantData.restaurant;
    theme.current = createMuiTheme({
      palette: {
        primary: {
          main: data.primary_color
        },
        secondary: {
          main: data.secondary_color
        },
        text: {
          primary: data.font_color
        }
          /*
            tertiary_color: "#f6d55c"
          */

      },
      typography: {
        fontFamily: data.font,
      }
    });
  }

  useEffect(() => {
    // updates orders every 10 seconds
    // start interval after mounting
    getServiceDataInterval.current = setInterval(getServiceData, 5000);
    // While unmounting do this
    return () => {
      clearInterval(getServiceDataInterval.current); // clear interval after unmounting
    }
  }, []);

  function requestsCount(data){
    let count = 0;
    Object.values(data).forEach(value => {
      if(value.status !== 'Good'){
        count ++;
      }
    });
    return count;
  }

  useDeepCompareEffect(() => {
    if(updatedServiceData !== serviceData){
      if(Object.keys(serviceData).length > 0 && requestsCount(updatedServiceData) > requestsCount(serviceData)){
        setShowNotification(true);
      }
      setServiceData(updatedServiceData);
    }
  }, [updatedServiceData]);

  function getServiceData(){
    const url = process.env.REACT_APP_DB + '/services/' + cookies.staff.restaurant_id;
    axios.get(url, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + cookies.token
      },
    })
      .then(res => res.data)
      .then(data => {
        setUpdatedServiceData(data);
      })
      .catch(error =>{
        console.error(error);
      });
  }

  function changeStatus(status, table_num){
    const url = process.env.REACT_APP_DB + '/services/update';
    const data = 'restaurant_id=' + cookies.staff.restaurant_id + '&table_num=' + table_num + '&status=' + status;
    console.log(url);
    console.log(data);
    console.log('Bearer ' + cookies.token);
    axios.post(url,
      data,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + cookies.token
        },
      })
      .then((r) => {
        if(r.status === 200){
          getServiceData();
        }
      })
      .catch(error =>{
        console.log('post request error');
        console.error(error);
      });
  }

  function handlePopupClose(){
    setShowNotification(false);
  }

  // Check if user is logged in
  // If they aren't then send them to log in page
  if (verificationComplete && !verified.current) {
    return (
      <Redirect to="/login_cook"/>
    );
  }

  // While loading, display loading message
  if(loading){
    return(
      <div className="d-flex flex-column justify-content-center" style={{"height": "100vh", "width": "100vw"}}>
        <div className="d-flex justify-content-center" style={{"width": "100vw"}}>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // After being verified and loading restaurant info is done
  // Render Cook view
  return (
    <ThemeProvider theme={theme.current}>

      <Snackbar open={showNotification} autoHideDuration={60000} onClose={handlePopupClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert severity={'error'}>
          New customer service request
        </Alert>
      </Snackbar>

      <div className={classes.main} style={{fontFamily: restaurantData.restaurant.font}}>
        {/* Header with navigation and account drop down*/}
        <div className={classes.content}>
          <Switch>
            {/* If navigate to /cook redirect to /cook/orders */}
            <Route exact path="/cook">
              <Redirect to="/cook/orders"/>
            </Route>
            {/* Render cook order page when on /cook/orders */}
            <Route path="/cook/orders">
              <Header cookies={cookies} restaurantData={restaurantData} tab={0} serviceData={serviceData}/>
              <Orders/>
            </Route>
            {/* Render cook menu page when on /cook/menu */}
            {/*<Route exact path="/cook/menu">*/}
            {/*  <Header cookies={cookies} restaurantData={restaurantData} tab={1} serviceData={serviceData}/>*/}
            {/*  <Menu menu={restaurantData.menu} primary={restaurantData.restaurant.primary_color}*/}
            {/*        secondary={restaurantData.restaurant.secondary_color}*/}
            {/*        tertiary={restaurantData.restaurant.tertiary_color}*/}
            {/*        font={restaurantData.restaurant.font}*/}
            {/*        font_color={restaurantData.restaurant.font_color} />*/}
            {/*</Route>*/}
            <Route exact path="/cook/service">
              <Header cookies={cookies} restaurantData={restaurantData} tab={1} serviceData={serviceData}/>
              <ServiceRequests cookies={cookies} serviceData={serviceData} changeStatus={changeStatus}/>
            </Route>
          </Switch>
        </div>
        <Footer/>
      </div>
    </ThemeProvider>
  )

}

async function verifyCook(token) {
  let verified = false;
  // verify the token is a valid token
  if (token !== undefined) {
    await axios({
      method: 'POST',
      url: process.env.REACT_APP_DB + '/verify',
      //+'&logo='+this.state.file
      data: 'token=' + token,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
    .then(async response => {
      await response;
      verified = true;
    })
    .catch(error => {
      // Database has manager spelled wrong
      // Cooks don't need to be managers
      if (error.response.data === "Not a manger" || error.response.data === "Not a manager") {
        verified = true;
      }
    });
  }
  return verified;
}

export default Cook;