import React from "react";
import LogoImage from "../../assets/AutoGarconLogo.png";
import AccountDropdown from "./AccountDropdown";
/*
  This prop is used to render the Header for the manager view. The logo of 
  the company will be rendered at the top of the page along with the name of the company.
  The person who is logged in will have their name along with a dropdown that will
  take them to their personal settings.
*/
function Header(props) {
    return (
    /*render the logo image, name of resturant and name of manager - this is being sent from
      MTasks component */
          <header style={headerStyle}>
              <img src={LogoImage} width="auto" height="35px" alt="waiter" /> {/*{logo}*/}
              <p style={headerTitleStyle}>{props.restName}</p> {/*{name}*/}
              {/* this.props.loggedIn */ true && <AccountDropdown firstName={props.firstName} lastName={props.lastName} className="px-3"></AccountDropdown>}
          </header>
      );
}
export default Header;

const headerTitleStyle = {
    'margin': '0',
    'marginLeft': '10px',
    'flex': '1',
    'fontFamily': 'Kefa'
}

const headerStyle = {
    'backgroundColor': '#ffffff',
    'display': 'flex',
    'fontSize': '2em',
    'alignItems': 'center',
    'fontWeight': '300',
    'fontFamily': 'Kefa'
};
