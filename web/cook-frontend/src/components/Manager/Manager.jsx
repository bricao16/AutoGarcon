import React from "react";
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import Stats from './Stats';
import StoreInfo from './StoreInfo';
import MHeader from './Header';
import Link from '@material-ui/core/Link';
import { NavLink } from 'react-router-dom'
import Customize from './Customize';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import https from 'https';
import axios from 'axios';
import {
    Switch,
    Route
  } from "react-router-dom";
  
/* This is the main component for the manager
view. This component creates the nav bar with routes to
the managers different views (menu, stats, hours...)
The header is pulled from the database to render the 
resturant logo and name. The stats page is the landing
page */


class Manager extends React.Component{
    constructor(props) {
      super(props);
      console.log(this.props);
      this.state = {
        error: null,
        isLoaded: false,
        restaurantJSON: [],
        restaurantInfo:[],
        token: null,
        staff: null 
      };
    }

    /* Used for connecting to Resturant in database */
    componentDidMount() {

    axios({
      method: 'get',
      url: 'https://50.19.176.137:8001/restaurant/123',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false,
      }),
    })
      .then(res => {
        var finalJson = {
          'menu': res.data[1].menu,
          'restaurant': res.data[0].restaurant
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
    
    render() {
      /*if(this.state.staff ==null)
      {
        this.setState({ token: this.props.token});
        this.setState({ staff: this.props.staff});
      }*/
      const { error, isLoaded, restaurantJSON, restaurantInfo, staff, token } = this.state;
      console.log(staff);
      if (error) {
        return <div>Error: {error.message}</div>;
      } 

      else if (!isLoaded) {
        return (
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        )
      }

      else {
        //map the menu json to an array
        Object.keys(this.state.restaurantJSON).forEach(function(key) {
          restaurantInfo.push([key ,restaurantJSON[key]]);
        });
      }
      
      return (
          <Container>
            <MHeader/> {/*image={this.state.resturantInfo.logo} restName ={this.state.resturantInfo.name} managerName={this.state.resturantInfo.managerName}/>*/}
            <div style={backgroundStyle}>
              <Container fluid>
                <Row>
                  <Col sm={4} className="pt-3 px-3" style={navColStyle}>
                    <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                      <NavLink tag={Link} to="/manager">Statistics</NavLink>
                      <NavLink tag={Link} to="/menu" >Menu</NavLink>
                      <NavLink tag={Link} to="/hours">General</NavLink>
                      <NavLink tag={Link} to="/customize">Customize</NavLink>
                    </Nav>
                  </Col>
                  <Col className="pt-3 px-3">
                    <Container fluid>
                        <Switch>
                          <Route exact path="/manager">
                            <Stats/>
                          </Route>
                          <Route path="/menu">
                            <Menu menu = {restaurantInfo[0][1]}/>
                          </Route>
                          <Route path="/hours">
                            <StoreInfo info = {restaurantInfo[1][1]} />
                          </Route>
                          <Route path="/customize">
                            <Customize info = {restaurantInfo[1][1]}/>
                          </Route>
                        </Switch>
                    </Container>
                  </Col>
                </Row>
              </Container> 
            </div>
          </Container>
        );
      }
    }

const backgroundStyle = {
  'backgroundColor': '#ffffff'
}

const sectionStyle = {
  'backgroundColor': '#ffffff'
}

const navColStyle = {
  'maxWidth': '100px',
  'a.link':'black',
  'fontFamily': 'Kefa'
}


export default Manager;
