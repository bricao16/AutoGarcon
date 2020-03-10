import React from "react";
import logoImage from "../assets/AutoGarconLogo.png";
import AccountDropdown from "./AccountDropdown";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    //For future when we have logged in state
    //this.props.loggedIn = true;
  }

  render () {
      return (
          <header style={headerStyle}>
              <img src={logoImage} width="auto" height="35px" alt="waiter" />
              <p style={headerTitleStyle}>Auto-Garcon</p>
              {/* this.props.loggedIn */ true && <AccountDropdown className="px-3"></AccountDropdown>}
          </header>
      );
  }
}

export default Header;

var headerTitleStyle = {
    'margin': '0',
    'marginLeft': '10px',
    'flex': '1'
}

var headerStyle = {
    backgroundColor: '#ffffff',
    display: "flex",
    fontSize: "2em",
    height: '58px',
    padding: "5px 0 5px 10px",
    alignItems: "center",
    fontWeight: "300"
};

//export { headerStyle };