import React, {useEffect, useRef, useState} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import clsx from 'clsx';
import axios from "axios";
import https from "https";


import Header from "./Header";
import Footer from "./Footer";
import Orders from "./Orders/Orders";
import Menu from "./Menu/Menu";

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
  // const tokenVerified = useRef(false);
  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});

  // Verify user is a manager or cook
  verifyCook(cookies.token).then(res => {
    verified.current = res;
  });

  useEffect(() => {
    if(verified){
      getRestaurantData();
    }
  }, [verified]);

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

  // Check if user is logged in
  // If they aren't then send them to log in page
  if (!verified) {
    return (
      <Redirect to="/login_cook"/>
    );
  }

  // While loading, display loading message
  if(loading){
    return(
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // After being verified and loading restaurant info is done
  // Render Cook view
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.main}>
        {/* Header with navigation and account drop down*/}
        <Header cookies={cookies} restaurantData={restaurantData}/>
        <div className={classes.content}>
          <Switch>
            {/* If navigate to /cook redirect to /cook/orders */}
            <Route exact path="/cook">
              <Redirect to="/cook/orders"/>
            </Route>
            {/* Render cook order page when on /cook/orders */}
            <Route path="/cook/orders">
              <Orders/>
            </Route>
            {/* Render cook menu page when on /cook/menu */}
            <Route exact path="/cook/menu">
              <Menu/>
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
    let response = await axios({
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
    });
    // once response has finished
    if (response.status !== 200) {
      if (response.data === "Not a manager") {
        // not a manager but valid token is okay
        verified = true;
      }
    } else {
      // user is a manager
      verified = true;
    }
  }
  return verified;
}

export default Cook;