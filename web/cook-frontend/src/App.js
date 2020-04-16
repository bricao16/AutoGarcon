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
// from free license at https://www.pexels.com/photo/clear-wine-glass-on-table-67468/
import Background from './assets/background.jpg'

 /*
This is the main page for AutoGarcon. It contains the routing for all the different 
pages by their components. It also serves as the landing page defined in Home() 
which is a header that allows for logging into cook, manager or to sign up as 
well as a stock image with a circle containing a description of the product.*/

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
          <Route path="/manager" component = {Manager}>
            
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
          {/* nav bar with logo/ name/ and cook/manager log in and sign in*/}
          <nav className="navbar navbarInverse bg-light">
            <div className="container-fluid">
              <div className="navbar-header">
                <img src={logoImage} height="80vw"  alt="Auto Garcon Logo" style = {{'background': 'transparent', 'paddingRight': '29vw'}} /> 
                <p className="navbar-brand" style ={{'fontSize': '3em','color':'#102644'}} >Auto Garcon</p>
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
          {/* semi transparent circle with description and sign up button*/}
          <div style={circleStyle}>
            <div className="container">
              <img src={circle} height="600vw"  alt="Blue Circle" className="img-responsive" style = {{'background': 'transparent', 'opacity': '0.7'}} /> 
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