import React from 'react';
import './App.css';
import Header from "./components/Header"
import Orders from "./components/Orders"
import MHeader from "./components/MHeader"
import MTasks from "./components/MTasks"
import Button from 'react-bootstrap/Button'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

function App() {
 return (
    <Router>
      <div>
            <Header/>

            <Link to="/">
            <Button variant="link">Home</Button>
                
            </Link>
       
            <Link to="/cook"> 
            <Button variant="link">Cooks</Button>
            </Link>
 
            <Link to="/manager"> 
            <Button variant="link">Manager</Button>
            </Link>

       
        <hr />

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