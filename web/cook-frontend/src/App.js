import React from 'react';
import './App.css';
import Orders from "./components/Orders";
import MTasks from "./components/MTasks";
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import SignUp from "./components/SignUp";

import logoImage from "./assets/AutoGarconLogo.png";

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

/*req.open("GET", "http://50.19.176.137:8000/menu", true);
req.send();

req.onload = function(){
	//console.log(JSON.parse(req.response));
	menu = JSON.parse(req.response);
	console.log(menu);
}*/

function App() {
  return (
    <Router>
      <div style={backgroundStyle}>
        <Container>
          <Row style={{'minHeight': '90vh'}}>
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
                  <Route path="/sign_up">
                    <SignUp />
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
      <footer style={footerStyle}>
        Powered by Auto Garcon
        <img src={logoImage} width="auto" height="50vh" alt="waiter" />
      </footer>
    </Router>      
  );
}

export default App;

function Home() {
  return (
    <div>

      <div style={homeStyle}>
        <h2> Welcome to Auto Garcon 
        <img src={logoImage} width="auto" height="75vw" alt="waiter" />
         </h2>

        <br/>
        <div style={{'liststyle':'none'}}>
          <li><Link to='/login_manager'> 
            <button type="button" className="btn btn-info btn-lg">
                Manager Portal
            </button>
          </Link></li>
          <br/>
          <li><Link to='/login_cook'>
            <button type="button" className="btn btn-info btn-lg">
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
      <Orders/>
  );
}

function Manager() {
  return (
      <MTasks/>
  );
}

var backgroundStyle = {
  'backgroundColor': '#ffffff',
  'flexGrow': '1',
  'height': '100%'
}

var sectionStyle = {
  'backgroundColor': '#ffffff',
  'height': '100%'
}

var footerStyle = {
  'backgroundColor': '#ffffff',
  'paddingBottom': '5px',
  'paddingRight': '12px',
  'paddingTop': '12px',
  'textAlign': 'right',
  'fontFamily': 'Kefa'
}
var homeStyle = {
  'fontWeight': '300',
  'textAlign' : 'center',
  'listStyleType': 'none',
  'textSize': '90pt',
  'fontFamily': 'Kefa'
};