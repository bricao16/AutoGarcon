import React from "react";
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import Stats from './Stats';
import StoreInfo from './StoreInfo';
import MHeader from './Header';
import CookView from './CookView';
import Customize from './Customize';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import logoImage from "../../assets/AutoGarconLogo.png";
import https from 'https';
import axios from 'axios';
import {
    Switch,
    Route
  } from "react-router-dom";
import Cookies from 'universal-cookie';
import MLogin from '../MLogin';
import CookieConsent from "react-cookie-consent";
  
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

    /*fetch(process.env.REACT_APP_DB + "/restaurant/"+ this.state.staff.restaurant_id)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            restaurantJSON: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    } */

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
      return (
            //if cookies havent been accepted yet ask them
          <Container>
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
            <div>
            {/*load the header passing the resturant/staff name*/}
            <MHeader restName ={restaurantInfo[1][1].name} firstName={staff.first_name} lastName={staff.last_name}/> {/*image={this.state.resturantInfo.logo} restName ={this.state.resturantInfo.name} managerName={this.state.resturantInfo.managerName}/>*/}
            <div style={backgroundStyle}>
              {/*navigation bar*/}
              <Container fluid>
                <Row>
                  <Col sm={4} className="pt-3 px-3" style={navColStyle}>
                    <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                      <Nav.Link style={sectionStyle} href="/manager">Statistics</Nav.Link>
                      <Nav.Link style={sectionStyle} href="/menu" >Menu</Nav.Link>
                      <Nav.Link style={sectionStyle} href="/general">General</Nav.Link>
                      <Nav.Link style={sectionStyle} href="/customize">Customize</Nav.Link>
                      <Nav.Link style={sectionStyle} href="/cookview">Cooks</Nav.Link>
                    </Nav>
                  </Col>
                {/*what data should be sent to each link*/}
                  <Col className="pt-3 px-3">
                    <Container fluid>
                        <Switch>
                          <Route exact path="/manager">
                            <Stats/>
                          </Route>
                          <Route path="/menu">
                            <Menu menu = {restaurantInfo[0][1]}/>
                          </Route>
                          <Route path="/general">
                            <StoreInfo info = {restaurantInfo[1][1]} />
                          </Route>
                          <Route path="/customize">
                            <Customize info = {restaurantInfo[1][1]}/>
                          </Route>
                          <Route path="/cookview">
                            <CookView/>
                          </Route>
                        </Switch>
                    </Container>
                  </Col>
                </Row>
              </Container> 
            </div>
            <footer style={footerStyle}>
              Powered by AutoGarcon
              <img src={logoImage} width="auto" height="50vh" alt="waiter" />
            </footer> 
          </div>
        </Container> 
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
var footerStyle = {
  'backgroundColor': '#ffffff',
  'paddingBottom': '5px',
  'paddingRight': '12px',
  'paddingTop': '12px',
  'textAlign': 'right',
  'fontFamily': 'Kefa',
  height: '67px'
};


export default Manager;
