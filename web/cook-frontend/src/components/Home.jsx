import React, { Component } from 'react';
import MLoginComp from './MLogin';
import CLoginComp from './CLogin';
import {
  BrowserRouter as Router,
  Link,
  Route // for later
} from 'react-router-dom'

class Home extends Component {
  render() {
    return (

      <Router>
        <div style={homeStyle}>
        <h2> Login in: </h2>
          <ul style={{'list-style':'none'}}>
            <li><Link to='/login_manager'> 
              <button type="button" style = {buttonStyle}>
                  Manager
              </button>
            </Link></li>
            <li><Link to='/login_cook'>
              <button type="button" style = {buttonStyle}>
                  Cook
              </button>
            </Link></li>
          </ul>

          <hr />

          <Route path='/login_manager' component={MLogin} />
          <Route path='/login_cook' component={CLogin} />
        </div>
      </Router>
    )
  }
}
function MLogin () {
  return (
    <MLoginComp/>
  )
}

function CLogin () {
  return (
    <CLoginComp/>
  )
}

export default Home;
var homeStyle = {
  'height' : '100vh',
  'width' : '80vw',
  'text-align' : 'center',
  'list-style': 'none',
  'background-color': '#ffffff'
};
var buttonStyle = {
  'width': '30vw',
  'background-color': '#0b658a',
  'height' : '7vh',
  'color': '#a8a7a'
}