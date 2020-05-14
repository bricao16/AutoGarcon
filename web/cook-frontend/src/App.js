import React from 'react';
import './App.css';
import Cook from "./components/Cook/Cook";
import ManagerPage from "./components/Manager/Home/Manager";
import MLogin from "./components/MLogin";
import CLogin from "./components/CLogin";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ChangePassword from "./components/ChangePassword"
import ManagerSignUp from "./components/ManagerSignUp"
import Home from "./components/Home";
import PrivacyPolicy from './components/PrivacyPolicy';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
 /*
This is the main page for AutoGarcon. It contains the routing for all the different
pages by their components. It also serves as the landing page defined in Home()
which is a header that allows for logging into cook, manager or to sign up as
well as a stock image with a circle containing a description of the product.*/

class App extends React.Component{
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
              <Route path="/forgot_password">
                <ForgotPassword/>
              </Route>
              <Route path="/change_password">
                <ChangePassword/>
              </Route>
              <Route path="/privacy_policy">
                <PrivacyPolicy/>
              </Route>
              <Route path="/statistics">
                <Manager/>
              </Route>
	      <Route path="/manager_sign_up">
                <ManagerSignUp/>
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
              <Route path = "/account"
								render={(props) => <Manager {...props} content={"AccountSettings"}/>} />
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
