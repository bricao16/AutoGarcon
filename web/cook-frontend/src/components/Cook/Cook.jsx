import React from "react";
import Navigation from "./Navigation";
import Alert from "./Alert";
import Footer from "./Footer";
import Body from "./Body";
import $ from "jquery";
import Button from 'react-bootstrap/Button';
import https from 'https';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      orders: {},
      selectedOrder: 0,
      alertActive: false,
      alertContent: <></>,
      currentTab: "active"
    };
    this.setupKeyPresses();
  }

  setupKeyPresses(){
    $(document).keydown(key => {
      // Arrow keys right and left
      if(key.which === 37 || key.which === 39){
        this.handleArrowKeyPress(key);
      // c
      } else if(key.which === 67){
        this.markOrderComplete();
      // e
      } else if(key.which === 69){
        this.toggleExpandOrder();
      // 0 - 9
      } else if(key.which >= 49 && key.which <= 57){
        this.handleNumberKeyPress(key);
      }
    });
  }

  handleArrowKeyPress(key){
    let newSelectedOrder = this.state.selectedOrder;
    if(key.which === 37){
      newSelectedOrder -= 1;
    } else if (key.which === 39){
      newSelectedOrder += 1;
    }
    const ordersLength = Object.keys(this.state.orders).length;
    if(newSelectedOrder >= ordersLength){
      newSelectedOrder = 0;
    } else if(newSelectedOrder < 0){
      newSelectedOrder = ordersLength-1;
    }
    this.changeSelectedOrder(newSelectedOrder);
  }

  handleNumberKeyPress(key){
    const number = key.which - 49;
    if(number < Object.keys(this.state.orders).length){
      this.changeSelectedOrder(number);
    }
  }

  changeSelectedOrder(cardId){
    let newState = this.state;
    newState.selectedOrder = cardId;
    this.setState(newState);
  }

  toggleExpandOrder(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let newState = this.state;
    newState.orders[orderNum].expand = !newState.orders[orderNum].expand;
    this.setState(newState);
  }

  markOrderComplete(){
    const index = this.state.selectedOrder;
    const orderNum = Object.keys(this.state.orders)[index];
    let state = this.state;
    state.alertActive = true;
    state.alertContent =
      <div>
        <div>Order #{orderNum} marked complete. No API yet.</div>
        <Button variant="secondary" size="sm" className="mt-3" onClick={this.deactivateAlert.bind(this)}>Okay</Button>
      </div>;
    this.setState(state);
  }

  deactivateAlert(){
    let state = this.state;
    state.alertActive = false;
    state.alertContent = <></>;
    this.setState(state);
  }

  changeCurrentTab(tab){
    let state = this.state;
    state.currentTab = tab;
    this.setState(state);
  }

  renderAlert(){
    if(this.state.alertActive){
      return <Alert alert={this.state.alertContent}/>
    }
  }

  render() {
    return (
      <div style={cookStyle} className="d-flex flex-column">
        {/*{this.renderAlert()}*/}
        <Navigation currentTab={this.state.currentTab} />
        <div style={bodyStyle}>
          <Router>
            <Switch>
              <Route exact path="/cook">
                <Redirect to="/cook/active" />
              </Route>
              <Route path="/cook/active">
                <Body />
              </Route>
              <Route path="/cook/completed">
                <Body />
              </Route>
            </Switch>
          </Router>
        </div>
        <Footer />
      </div>
    )
  }
}

const cookStyle = {
  width: '100vw'
};

const bodyStyle = {
  flex: 1,
  backgroundColor: '#f1f1f1'
};

export default Cook;