import React from 'react';
import './App.css';
import Cook from "./components/Cook/Cook";
import ManagerPage from "./components/Manager/Manager";
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import SignUp from "./components/SignUp";
// import logoImage from "./assets/AutoGarconLogo.png";
// import circle from "./assets/circleLanding.png";
import {BrowserRouter as Router, Switch, Link, Route} from "react-router-dom"; 
// import Background from './assets/background.jpg'
import Home from "./components/Home"

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
      </main>
    </Router>      
  );
}

export default App;

function Manager() {
  return (
      <ManagerPage/>
  );
}

const mainStyle = {
  minHeight: '100vh'
};