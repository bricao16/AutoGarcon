import React, {useEffect, useRef, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
//import clsx from 'clsx';
import axios from "axios";
import https from "https";


import Header from "./Header";
import Footer from "./Footer";
import Orders from "./Orders/Orders";
//import Menu1 from "./Menu/Menu1";
import Menu from "./Menu/Menu";
import ServiceRequests from "./Service/ServiceRequests";

const useStyles = makeStyles({
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // background: '#fafafa'
  },
  content: {
    flex: 1
  }
});


const universalCookies = new Cookies();

function Cook() {
  const theme = useTheme();
  const classes = useStyles(theme);

  const cookies = {
    token: universalCookies.get('mytoken'),
    staff: universalCookies.get('mystaff')
  };

  const verified = useRef(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});

  const [serviceData, setServiceData] = useState({});

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
    }
  }, [verificationComplete]);

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

  useEffect(() => {
    if(!loading){
      getServiceData();
    }
  }, [loading]);

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
        setServiceData(data);
      })
      .catch(error =>{
        console.error(error);
      });
  }

  function changeStatus(status, table_num){
    const url = process.env.REACT_APP_DB + '/services/update';
    const data = 'restaurant_id=' + cookies.staff.restaurant_id + '&table_num=' + table_num + '&status=' + status;
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
    <ThemeProvider theme={theme}>
      <div className={classes.main}>
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