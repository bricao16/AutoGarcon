import React, {useEffect, useRef, useState} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
    flexDirection: 'column'
  },
  content: {
    flex: 1
  }
});


const universalCookies = new Cookies();

function Cook(){

  const classes = useStyles();

  const cookies = {
    token: universalCookies.get('mytoken'),
    staff: universalCookies.get('mystaff')
  };

  /*
  const [restaurantData, setRestaurantData] = useState({});

  const [logoData, setLogoData] = useState("");

  useEffect(() =>{
    getRestaurantData();
  }, []);

  useEffect(() =>{
    if(restaurantData.restaurant){
      changeLogoData();
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
        console.log(data);
        setRestaurantData(data);
      })
      .catch(error =>{
        console.error(error);
      });
  }
  */

  // Check if user is logged in
  // If they aren't then send them to log in page
  const tokenVerify = verifyCook(cookies.token);
  if(tokenVerify === false) {
    return(
      <Redirect to="/login_cook" />
    );
  }

  return (
    <div className={classes.main}>
      {/* Header with navigation and account drop down*/}
      <Header cookies={cookies} />
      <div className={classes.content}>
        <Switch>
          {/* If navigate to /cook redirect to /cook/orders */}
          <Route exact path="/cook">
            <Redirect to="/cook/orders" />
          </Route>
          {/* Render cook order page when on /cook/orders */}
          <Route path="/cook/orders">
            <Orders />
          </Route>
          {/* Render cook menu page when on /cook/menu */}
          <Route exact path="/cook/menu">
            <Menu />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  )

}
function verifyCook(token)
  {
    //verify the token is a valid token
    /*https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples is where I'm pulling this formatting from.*/
    if(token === undefined )
    {
      //if they dont even have a token return false
      return false;
    }
    axios({
      method: 'POST',
      url:  process.env.REACT_APP_DB +'/verify',
      //+'&logo='+this.state.file
      data: 'token='+token,
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
      //if not a manager
      if (response.status !== 200) { 
         
         if(response.data == "Must be authorized!")
         {
          //make sure valid token
          return false
         }
         else if(response.data = "Not a manager")
         {
          //not a manager but valid token is okay
          return true
         }
         else{return false} //anything else just return false
      }
      else {return true}  //if valid manager
    }) 
    .catch(error => {
      //databse error
      console.error("There was an error!", error);
      return false;
    });

  }

export default Cook;