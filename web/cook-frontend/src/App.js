import React from 'react';
import './App.css';
import Cook from "./components/Cook/Cook";
import ManagerPage from "./components/Manager/Home/Manager";
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import SignUp from "./components/SignUp";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from "./components/Home";
import PrivacyPolicy from './components/PrivacyPolicy';

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
        <Router>
          <main style={mainStyle} className="d-flex">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/cook">
                <Cook />
              </Route>
              <Route path="/manager"
                  render={() => (<Manager />)}
                >
                </Route>
              <Route path="/sign_up">
                <SignUp />
              </Route>
              <Route path="/login_manager"
                render={() => (<MLogin />)}
              >
              </Route>
              <Route path="/login_cook">
                <CLogin/>
              </Route>
              <Route path="/privacy_policy">
                <PrivacyPolicy/>
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
							<Route path = "/QRCode"
								render={(props) => <Manager {...props} content={"QRCode"}/>} />
            </Switch>
          </main>
        </Router>
      );
    }
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