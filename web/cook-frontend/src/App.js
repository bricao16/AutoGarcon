import React from 'react';
import './App.css';
import Nav from 'react-bootstrap/Nav';
import Header from "./components/Header"
import Orders from "./components/Orders"
import MTasks from "./components/MTasks"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

function App() {
 return (
    <Router>
      <Header/>
      <div style={backgroundStyle}>
        <Container fluid>
          <Row>
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
                </Switch>
                <footer style={footerStyle}>Powered By Auto Garcon</footer>
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </Router>      
  );
}

export default App;

function Home() {
  return (
    <div>
      <h2>Home Page</h2>
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
  'background-color': '#f1f1f1'
}

var sectionStyle = {
  'background-color': '#ffffff',
  'height': '100%'
}

var navColStyle = {
  'max-width': '200px'
}

var footerStyle = {
  'padding-bottom': '5px',
  'padding-right': '12px',
  'text-align': 'right'
}