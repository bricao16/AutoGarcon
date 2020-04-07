import React from "react";
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import Stats from './MStats';
import StoreInfo from './StoreInfo';
import MHeader from './MHeader';
import Customize from './MCustomize';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
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
class MTasks extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        restaurantJSON: [],
        restaurantInfo:[]
      };
    }
    /* Used for connecting to Resturant in database */
    componentDidMount() {
    fetch("http://50.19.176.137:8000/restaurant/123")
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
    }
    render() {
      const { error, isLoaded, restaurantJSON, restaurantInfo } = this.state;
      
      if (error) {
        return <div>Error: {error.message}</div>;
      } 

      else if (!isLoaded) {
        return <div>Loading...</div>;
      }

      else {
        //map the menu json to an array
        Object.keys(this.state.restaurantJSON).forEach(function(key) {
          restaurantInfo.push([key ,restaurantJSON[key]]);
        });} 
      return (
          <Container>
            <MHeader/> {/*image={this.state.resturantInfo.logo} restName ={this.state.resturantInfo.name} managerName={this.state.resturantInfo.managerName}/>*/}
            <div style={backgroundStyle}>
              <Container fluid>
                <Row>
                  <Col sm={4} className="pt-3 px-3" style={navColStyle}>
                    <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                      <Nav.Link href="/manager">Statistics</Nav.Link>
                      <Nav.Link href="/menu" >Menu</Nav.Link>
                      <Nav.Link href="/hours">General</Nav.Link>
                      <Nav.Link href="/customize">Customize</Nav.Link>

                    </Nav>
                  </Col>
                  <Col className="pt-3 px-3">
                    <Container fluid>
                        <Switch>
                          <Route exact path="/manager">
                            <Stats/>
                          </Route>
                          <Route path="/menu">
                            <Menu menu = {restaurantInfo[1][1]}/>
                          </Route>
                          <Route path="/hours">
                            <StoreInfo info = {restaurantInfo[0][1]} />
                          </Route>
                          <Route path="/customize">
                            <Customize info = {restaurantInfo[0][1]}/>
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


export default MTasks;
