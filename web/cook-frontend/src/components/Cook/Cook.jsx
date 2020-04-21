import React from "react";
import Navigation from "./Navigation";
import Alert from "./Alert";
import Footer from "./Footer";
import Body from "./Body";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Switch, Route, Redirect } from "react-router-dom";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Cook extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      orders: {},
      selectedOrder: 0,
      // alertActive: false,
      // alertContent: <></>,
      currentTab: "active",
      token: cookies.get('mytoken'),
      staff: cookies.get('mystaff')
    };
  }

  /*
  deactivateAlert(){
    let state = this.state;
    state.alertActive = false;
    state.alertContent = <></>;
    this.setState(state);
  }

  renderAlert(){
    if(this.state.alertActive){
      return <Alert alert={this.state.alertContent}/>
    }
  }
  */

  render() {
    // if user doesnt have access
    if(this.state.staff === undefined || this.state.token === undefined) {
      return(
        <Container>
          <Nav.Link href="/login_cook"> Session expired please log back in </Nav.Link>
        </Container>
      );
    }
    return (
      <div style={cookStyle} className="d-flex flex-column">
        {/* {this.renderAlert()} Might add this back*/}
        <Navigation currentTab={this.state.currentTab} />
        <div style={bodyStyle}>
          <Switch>
            <Route exact path="/cook">
              <Redirect to="/cook/active" />
            </Route>
            <Route exact path="/cook/active" render={(props) => <Body {...props} path="/active" />} />
            <Route exact path="/cook/completed" render={(props) => <Body {...props} path="/completed" />} />
          </Switch>
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