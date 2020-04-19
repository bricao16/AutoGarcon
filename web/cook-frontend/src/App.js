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
// from free license at https://www.pexels.com/photo/clear-wine-glass-on-table-67468/
// import Background from './assets/background.jpg'
import { CookiesProvider, withCookies } from 'react-cookie';
// import Background from './assets/background.jpg'
import Home from "./components/Home"

 /*
This is the main page for AutoGarcon. It contains the routing for all the different
pages by their components. It also serves as the landing page defined in Home()
which is a header that allows for logging into cook, manager or to sign up as
well as a stock image with a circle containing a description of the product.*/

class App extends React.Component{
    constructor(props) {
      super(props);

      this.state = {
      };
    }
  render(){
    return (
      <CookiesProvider>
        <Router>
          <main style={mainStyle} className="d-flex">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/cook">
                <Cook />
              </Route>
              <Route
                  path="/manager"
                  render={() => (<Manager cookies={this.props.cookies}/>)}
                >

              </Route>
              <Route path="/sign_up">
                <SignUp />
              </Route>
             <Route
                  path="/login_manager"
                  render={() => (<MLogin cookies={this.props.cookies}/>)}
                >
              </Route>
              <Route path="/login_cook">
                <CLogin/>
              </Route>
              <Route path="/statistics">
                <Manager/>
              </Route>
              <Route path="/menu"
                render={(props) => <Manager {...props} content={"menu"}/>} />
              <Route path="/general"
                render={(props) => <Manager {...props} content={"general"}/>} />
              <Route path="/customize"
                render={(props) => <Manager {...props} content={"customize"}/>} />
              <Route path="/cookview"
                render={(props) => <Manager {...props} content={"cookview"}/>} />
            </Switch>
          </main>
        </Router>
      </CookiesProvider>
      );
    }
  }

export default withCookies(App);

function Manager() {
  return (
      <ManagerPage/>
  );
}

const mainStyle = {
  minHeight: '100vh'
};