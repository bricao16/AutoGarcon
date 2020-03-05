import React from 'react';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import Header from "./components/Header"
import Orders from "./components/Orders"
import MTasks from "./components/MTasks"
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    BrowserRouter as Router,
    Switch,
    Link,
    Route
  } from "react-router-dom";
  
var req  = new XMLHttpRequest();

var menu;

req.open("GET", "http://50.19.176.137:8000/menu", true);
req.send();

req.onload = function(){
	//console.log(JSON.parse(req.response));
	menu = JSON.parse(req.response);
	console.log(menu);
}

function App() {
  return (
    <Router>
      <Header/>
      <div style={backgroundStyle}>
        <Container>
          <Row style={{'min-height': '85vh'}}>
            <Col sm={4} className="pt-3 px-3" style={navColStyle}>
              <Nav defaultActiveKey="/" className="flex-column rounded" style={sectionStyle}>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/cook">Cook</Nav.Link>
                <Nav.Link href="/manager">Manager</Nav.Link>
                <Nav.Link eventKey="disabled" disabled>
                  Analytics
                </Nav.Link>
              </Nav>
            </Col>

            <Col className="pt-3 px-3">
              <div className="rounded" style={sectionStyle}>
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route path="/cook">
                    <Cook />
                  </Route>
                  <Route path="/manager">
                    <Manager />
                  </Route>
                  <Route path="/login_manager">
                    <MLogin/>
                  </Route>
                  <Route path="/login_cook">
                    <CLogin/>
                  </Route>
                </Switch>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <footer style={footerStyle}>Powered by Auto Garcon</footer>
    </Router>      
  );
}

export default App;

function Home() {
  return (
    <div>

      <div style={homeStyle}>
        <h2> Welcome to Auto-Garcon </h2>
        <br/>
        <ul style={{'list-style':'none'}}>
          <li><Link to='/login_manager'> 
            <button type="button"  style = {buttonStyle}>
                Manager Portal
            </button>
          </Link></li>
          <br/>
          <li><Link to='/login_cook'>
            <button type="button" style = {buttonStyle}>
                Cook Portal
            </button>
          </Link></li>
        </ul>

      </div>

    </div>
  );
}

function Cook() {
  return (
    <div>
      <Orders/>
    </div>
  );
}

function Manager() {
  return (
    <div>
      <MTasks/>
    </div>
  );
}

var backgroundStyle = {
  'background-color': '#f1f1f1',
  'flex-grow': '1',
  'height': '100%'
}

var sectionStyle = {
  'background-color': '#ffffff',
  'height': '100%'
}

var navColStyle = {
  'max-width': '200px'
}

var footerStyle = {
  'background-color': '#f1f1f1',
  'padding-bottom': '5px',
  'padding-right': '12px',
  'padding-top': '12px',
  'text-align': 'right'
}
var homeStyle = {
  'fontWeight': '300',
  'text-align' : 'center',
  'list-style': 'none',
  'text-size': '50pt'
};
var buttonStyle = {
  'width': '30vw',
  'fontWeight': 'bold',
  'fontSize': '150%',
  'border': 'solid 3px',
  'color': '#a8a7a',
  'background-color': 'rgba(11, 101, 138,.75)',
  'border-color' : 'rgba(11, 101, 138)',
  'height' : '7vh'
}