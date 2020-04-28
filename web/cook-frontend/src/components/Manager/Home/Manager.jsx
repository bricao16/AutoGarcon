import React from "react";
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import logoImage from "../../../assets/AutoGarconLogo.png";
import https from 'https';
import axios from 'axios';
import {
    Switch,
    Route
  } from "react-router-dom";
import Cookies from 'universal-cookie';
import MLogin from '../../MLogin';
import CookieConsent from "react-cookie-consent";
import NavItems from './NavItems';
  
/* This is the main component for the manager
view. This component creates the nav bar with routes to
the managers different views (menu, stats, hours...)
The header is pulled from the database to render the 
resturant logo and name. The stats page is the landing
page */

const cookies = new Cookies();

class Manager extends React.Component{

    constructor(props) {
      super(props);
      
      this.state = {
        error: null,
        isLoaded: false,
        restaurantJSON: [],
        restaurantInfo:[],
        token: cookies.get('mytoken'),
        staff: cookies.get('mystaff'),
        categories: []
      };
    }


/* Used for connecting to Resturant in database */
    componentDidMount() {
      //if user doesnt have access
      if(this.state.staff === undefined || this.state.token === undefined  || this.state.staff.position !== "manager")
      {
        return(
            <Container>
                <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                      <Nav.Link href="/login_manager"> Session expired please log back in </Nav.Link>
                </Nav>
                <Switch>
                  <Route exact path="/login_manager">
                    <MLogin/>
                  </Route>
                </Switch>
            </Container>
        );
      }
      axios({
        method: 'get',
        url: process.env.REACT_APP_DB + '/restaurant/' + this.state.staff.restaurant_id,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        httpsAgent: new https.Agent({  
          rejectUnauthorized: false,
        }),
      })
        .then(res => {
          var finalJson = {
            'menu': res.data.menu,
            'restaurant': res.data.restaurant
            // Https endpoint parsing:
            //'menu': res.data[1].menu,
            //'restaurant': res.data[0].restaurant
          }
          return finalJson;
        })
        .then((result) => {
          /* Insert every category into the categories cookie store */
          Object.keys(result.menu).forEach(item => {
            if (!this.state.categories.includes(result.menu[item].category)) {
              this.state.categories.push(result.menu[item].category)
            }
          })
          cookies.set('categories', this.state.categories)

          this.setState({
            isLoaded: true,
            restaurantJSON: result
          });
          })
        .catch((error) => {
          this.setState({
            isLoaded: true,
            error
          });
        })
    }
    //convert blob to base 64
    arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
    }
    // From http://stackoverflow.com/questions/14967647/ (continues on next line)
    // encode-decode-image-with-base64-breaks-image (2013-04-21)
    fixBinary (bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }
    render() 
    {
      //if user doesnt have access take them to login
      if(this.state.staff === undefined || this.state.token === undefined  || this.state.staff.position !== "manager")
      {
        return(
            <Container>
                <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                      <Nav.Link href="/login_manager"> Session expired please log back in </Nav.Link>
                </Nav>
                <Switch>
                  <Route exact path="/login_manager">
                    <MLogin/>
                  </Route>
                </Switch>
            </Container>
        );
      }
      const { error, isLoaded, restaurantJSON, restaurantInfo,staff } = this.state;
      //if error from database 
      if (error) {
        console.log(error)
        return <div>Error: {error.message}</div>;
      } 
      //spinner while loading
      else if (!isLoaded) {
        return (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )
      }
      //on sucessful pull from databse
      else {
        //map the menu json to an array
        Object.keys(this.state.restaurantJSON).forEach(function(key) {
          restaurantInfo.push([key ,restaurantJSON[key]]);
        });} 
        const imageData = this.arrayBufferToBase64(this.state.restaurantJSON.restaurant.logo.data);
        var binary = this.fixBinary(atob(imageData));
        const blob = new Blob([binary], {type : 'image/png'});
        const blobUrl =URL.createObjectURL(blob);
        var img = new Image();
        img.src = blobUrl;
        //document.body.appendChild(img);
        console.log(blobUrl);
      return (

        <React.Fragment>
          //if cookies havent been accepted yet ask them
          
            {cookies.get('cookieAccept') === undefined ? 
                  <CookieConsent
                  debug={true}
                   enableDeclineButton
                    flipButtons
                    onAccept={() => {return cookies.set('cookieAccept',true)}}
                    onDecline={() => {  cookies.remove('mytoken');
                                        cookies.remove('mystaff');
                                        cookies.remove('cookieAccept');
                                        console.log(cookies.get('mystaff'));
                                       }}
                    >
                    This website uses cookies to enhance the user experience.
                  </CookieConsent>
            :
            <p></p>
            }
          
            <NavItems restaurantInfo = {restaurantInfo} restName ={restaurantInfo[1][1].name} firstName={staff.first_name} lastName={staff.last_name} imageBlob = {blobUrl}/>
        

                   
             </React.Fragment>
              

      );
    }
  }

const backgroundStyle = {
  'backgroundColor': '#ffffff'
}

const sectionStyle = {
  'backgroundColor': '#ffffff',
  'color':'#102644'
}

const navColStyle = {
  'maxWidth': '100px',
  'a.link':'black',
  'fontFamily': 'Kefa'
}


export default Manager;