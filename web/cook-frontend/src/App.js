import React from 'react';
import './App.css';
import Cook from "./components/Cook/Cook.jsx";
import ManagerPage from "./components/Manager/Manager.jsx";
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import SignUp from "./components/SignUp";
import logoImage from "./assets/AutoGarconLogo.png";
import circle from "./assets/circleLanding.png";
import {BrowserRouter as Router, Switch, Link, Route} from "react-router-dom"; 
import Background from './assets/background.jpg'

 /*
var req  = new XMLHttpRequest();

var menu;

req.open("GET", "http://50.19.176.137:8000/menu", true);
req.send();

req.onload = function(){
	//console.log(JSON.parse(req.response));
	menu = JSON.parse(req.response);
	console.log(menu);
}*/

function App() {
  return (
    <Router>
      <main style={mainStyle} className="d-flex">
        {/*<div className="px-4">*/}
        {/*  <Row style={{'minHeight': '90vh'}}>*/}
        {/*    <Col className="pt-3 px-3">*/}
        {/*      <div className="rounded" style={sectionStyle}>*/}
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
            <Manager/>
          </Route>
          <Route path="/menu"
            render={(props) => <Manager {...props} content={"menu"}/>} />
          <Route path="/hours"
            render={(props) => <Manager {...props} content={"hours"}/>} />
          <Route path="/customize"
            render={(props) => <Manager {...props} content={"customize"}/>} />
        </Switch>
        {/*    </div>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        {/*</div>
          <footer style={footerStyle}>
              Powered by Auto Garcon
              <img src={logoImage} width="auto" height="50vh" alt="waiter" />
            </footer>*/}
      </main>
    </Router>      
  );
}

export default App;

function Home() {
  return (
      <React.Fragment >

        <div style={homeStyle}>
          <nav className="navbar navbarInverse bg-light">
            <div className="container-fluid">
              <div className="navbar-header">
                <img src={logoImage} height="80vw"  alt="waiter" style = {{'background': 'transparent', 'paddingRight': '29vw'}} /> 
                <a className="navbar-brand " style ={{'fontSize': '3em','color':'#102644'}} href="#">Auto Garcon</a>
                
              </div>
              <ul className="nav ">
                <li ><Link to='/login_manager'> 
                  <button type="button" className="btn  btn-md">
                              Login Manager
                    </button>
                  </Link></li>
                  <li ><Link to='/login_cook'> 
                  <button type="button" className="btn  btn-md">
                              Login Cook
                    </button>
                  </Link></li>
                  <li><Link to='/sign_up'> 
                      <button type="button" className="btn btn-md ">
                          Sign up
                      </button>
                  </Link></li>
              </ul>
            </div>
          </nav>
              <div style={circleStyle}>
                <div className="container">
                      <img src={circle} height="600vw"  alt="waiter" className="img-responsive" style = {{'background': 'transparent', 'opacity': '0.7'}} /> 
                      <div className="carousel-caption">
                        <i><h4 style = {{'marginTop':'-300px', 'width': '50vw', 'paddingLeft': '20vw'}}> Enhance your resturant experience with Auto Garcon </h4></i>
                        <br/>
                        <li><Link to='/sign_up'> 
                        <button type="button" className="btn btn-secondary btn-lg ">
                            Sign Up
                        </button>
                        </Link></li>
                  </div>
              </div>
              </div>
          </div>
        </React.Fragment>


  );
}

function Manager() {
  return (
      <ManagerPage/>
  );
}

var mainStyle = {
  minHeight: 'calc(100vh - 67px)'
};

var circleStyle = {
'liststyle':'none'
}

var homeStyle = {
  backgroundImage:`url(${Background})`,
  'backgroundPosition': 'center',
  'backgroundRepeat': 'no-repeat',
  'backgroundSize': 'cover',
  'height': '100vh', 
  'width': '100vw',
  'margin': 0,
  'fontWeight': '300',
  'textAlign' : 'center',
  'listStyleType': 'none',
  'textSize': '90pt',
  'fontFamily': 'Kefa'
};