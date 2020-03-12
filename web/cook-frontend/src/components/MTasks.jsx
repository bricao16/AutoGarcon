import React from "react";
//import Order from "./Order";
import Container from 'react-bootstrap/Container';
import Menu from './Menu';
import Stats from './MStats';
import Hours from './MHours';
import Header from './Header';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import {
    Switch,
    Route
  } from "react-router-dom";

class MTasks extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderMenu(){
        return this.state.menu.map((item, key) =>
            <Menu key={key} id={key} menuItem={item}/> 
        );
     
    }
    renderStats(){
        return this.state.statistics.map((item, key) =>
            <Stats key={key} id={key} statsType={item}/>
        );
    }
    renderHours(){
        return this.state.hours.map((item, key) =>
            <Hours key={key} id={key} hoursType={item}/>
        );
    }
    renderHeader(){
        return <Header/>;
    }

    render() {
        return (
            <Container>
              {this.renderHeader()}
              <div style={backgroundStyle}>
                <Container fluid>
                  <Row>
                    <Col sm={4} className="pt-3 px-3" style={navColStyle}>
                      <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                        <Nav.Link href="/manager" onClick={this.renderMenu}>Menu</Nav.Link>
                        <Nav.Link href="/hours">Hours</Nav.Link>
                        <Nav.Link href="/statistics">Statistics</Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                          Analytics
                        </Nav.Link>
                      </Nav>
                    </Col>
                    <Col className="pt-3 px-3">
                      <Container fluid>
                          <Switch>
                            <Route exact path="/manager">
                              <Menu />
                            </Route>
                            <Route path="/hours">
                              <Hours />
                            </Route>
                            <Route path="/statistics">
                              <Stats />
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

var backgroundStyle = {
  'backgroundColor': '#ffffff'
}

var sectionStyle = {
  'backgroundColor': '#ffffff',
  'height': '100%'
}

var navColStyle = {
  'maxWidth': '200px',
  'a.link':'black'
}


export default MTasks;
