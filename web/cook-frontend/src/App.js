import React from 'react';
import './App.css';
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
      {/*<Header/>*/}
      <div style={backgroundStyle}>
        <Container fluid>
          <Row>
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
                  <Route path="/statistics">
                    <MTasks/>
                  </Route>
                  <Route path="/menu" 
                        render={(props) => <MTasks {...props} content={"menu"}/>} />
           
                  <Route path="/hours" 
                  render={(props) => <MTasks {...props} content={"hours"}/>} />
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
        <div style={{'list-style':'none'}}>
          <li><Link to='/login_manager'> 
            <button type="button" class="btn btn-info btn-lg">
                Manager Portal
            </button>
          </Link></li>
          <br/>
          <li><Link to='/login_cook'>
            <button type="button" class="btn btn-info btn-lg">
                Cook Portal
            </button>
          </Link></li>
        </div>

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